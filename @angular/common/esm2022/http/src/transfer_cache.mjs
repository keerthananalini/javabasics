/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { APP_BOOTSTRAP_LISTENER, ApplicationRef, inject, InjectionToken, makeStateKey, TransferState, ɵformatRuntimeError as formatRuntimeError, ɵperformanceMarkFeature as performanceMarkFeature, ɵtruncateMiddle as truncateMiddle, ɵwhenStable as whenStable, PLATFORM_ID, } from '@angular/core';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpHeaders } from './headers';
import { HTTP_ROOT_INTERCEPTOR_FNS } from './interceptor';
import { HttpResponse } from './response';
import { isPlatformServer } from '@angular/common';
/**
 * Keys within cached response data structure.
 */
export const BODY = 'b';
export const HEADERS = 'h';
export const STATUS = 's';
export const STATUS_TEXT = 'st';
export const URL = 'u';
export const RESPONSE_TYPE = 'rt';
const CACHE_OPTIONS = new InjectionToken(ngDevMode ? 'HTTP_TRANSFER_STATE_CACHE_OPTIONS' : '');
/**
 * A list of allowed HTTP methods to cache.
 */
const ALLOWED_METHODS = ['GET', 'HEAD'];
export function transferCacheInterceptorFn(req, next) {
    const { isCacheActive, ...globalOptions } = inject(CACHE_OPTIONS);
    const { transferCache: requestOptions, method: requestMethod } = req;
    // In the following situations we do not want to cache the request
    if (!isCacheActive ||
        // POST requests are allowed either globally or at request level
        (requestMethod === 'POST' && !globalOptions.includePostRequests && !requestOptions) ||
        (requestMethod !== 'POST' && !ALLOWED_METHODS.includes(requestMethod)) ||
        requestOptions === false || //
        globalOptions.filter?.(req) === false) {
        return next(req);
    }
    const transferState = inject(TransferState);
    const storeKey = makeCacheKey(req);
    const response = transferState.get(storeKey, null);
    let headersToInclude = globalOptions.includeHeaders;
    if (typeof requestOptions === 'object' && requestOptions.includeHeaders) {
        // Request-specific config takes precedence over the global config.
        headersToInclude = requestOptions.includeHeaders;
    }
    if (response) {
        const { [BODY]: undecodedBody, [RESPONSE_TYPE]: responseType, [HEADERS]: httpHeaders, [STATUS]: status, [STATUS_TEXT]: statusText, [URL]: url, } = response;
        // Request found in cache. Respond using it.
        let body = undecodedBody;
        switch (responseType) {
            case 'arraybuffer':
                body = new TextEncoder().encode(undecodedBody).buffer;
                break;
            case 'blob':
                body = new Blob([undecodedBody]);
                break;
        }
        // We want to warn users accessing a header provided from the cache
        // That HttpTransferCache alters the headers
        // The warning will be logged a single time by HttpHeaders instance
        let headers = new HttpHeaders(httpHeaders);
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            // Append extra logic in dev mode to produce a warning when a header
            // that was not transferred to the client is accessed in the code via `get`
            // and `has` calls.
            headers = appendMissingHeadersDetection(req.url, headers, headersToInclude ?? []);
        }
        return of(new HttpResponse({
            body,
            headers,
            status,
            statusText,
            url,
        }));
    }
    const isServer = isPlatformServer(inject(PLATFORM_ID));
    // Request not found in cache. Make the request and cache it if on the server.
    return next(req).pipe(tap((event) => {
        if (event instanceof HttpResponse && isServer) {
            transferState.set(storeKey, {
                [BODY]: event.body,
                [HEADERS]: getFilteredHeaders(event.headers, headersToInclude),
                [STATUS]: event.status,
                [STATUS_TEXT]: event.statusText,
                [URL]: event.url || '',
                [RESPONSE_TYPE]: req.responseType,
            });
        }
    }));
}
function getFilteredHeaders(headers, includeHeaders) {
    if (!includeHeaders) {
        return {};
    }
    const headersMap = {};
    for (const key of includeHeaders) {
        const values = headers.getAll(key);
        if (values !== null) {
            headersMap[key] = values;
        }
    }
    return headersMap;
}
function sortAndConcatParams(params) {
    return [...params.keys()]
        .sort()
        .map((k) => `${k}=${params.getAll(k)}`)
        .join('&');
}
function makeCacheKey(request) {
    // make the params encoded same as a url so it's easy to identify
    const { params, method, responseType, url } = request;
    const encodedParams = sortAndConcatParams(params);
    let serializedBody = request.serializeBody();
    if (serializedBody instanceof URLSearchParams) {
        serializedBody = sortAndConcatParams(serializedBody);
    }
    else if (typeof serializedBody !== 'string') {
        serializedBody = '';
    }
    const key = [method, responseType, url, serializedBody, encodedParams].join('|');
    const hash = generateHash(key);
    return makeStateKey(hash);
}
/**
 * A method that returns a hash representation of a string using a variant of DJB2 hash
 * algorithm.
 *
 * This is the same hashing logic that is used to generate component ids.
 */
function generateHash(value) {
    let hash = 0;
    for (const char of value) {
        hash = (Math.imul(31, hash) + char.charCodeAt(0)) << 0;
    }
    // Force positive number hash.
    // 2147483647 = equivalent of Integer.MAX_VALUE.
    hash += 2147483647 + 1;
    return hash.toString();
}
/**
 * Returns the DI providers needed to enable HTTP transfer cache.
 *
 * By default, when using server rendering, requests are performed twice: once on the server and
 * other one on the browser.
 *
 * When these providers are added, requests performed on the server are cached and reused during the
 * bootstrapping of the application in the browser thus avoiding duplicate requests and reducing
 * load time.
 *
 */
export function withHttpTransferCache(cacheOptions) {
    return [
        {
            provide: CACHE_OPTIONS,
            useFactory: () => {
                performanceMarkFeature('NgHttpTransferCache');
                return { isCacheActive: true, ...cacheOptions };
            },
        },
        {
            provide: HTTP_ROOT_INTERCEPTOR_FNS,
            useValue: transferCacheInterceptorFn,
            multi: true,
            deps: [TransferState, CACHE_OPTIONS],
        },
        {
            provide: APP_BOOTSTRAP_LISTENER,
            multi: true,
            useFactory: () => {
                const appRef = inject(ApplicationRef);
                const cacheState = inject(CACHE_OPTIONS);
                return () => {
                    whenStable(appRef).then(() => {
                        cacheState.isCacheActive = false;
                    });
                };
            },
        },
    ];
}
/**
 * This function will add a proxy to an HttpHeader to intercept calls to get/has
 * and log a warning if the header entry requested has been removed
 */
function appendMissingHeadersDetection(url, headers, headersToInclude) {
    const warningProduced = new Set();
    return new Proxy(headers, {
        get(target, prop) {
            const value = Reflect.get(target, prop);
            const methods = new Set(['get', 'has', 'getAll']);
            if (typeof value !== 'function' || !methods.has(prop)) {
                return value;
            }
            return (headerName) => {
                // We log when the key has been removed and a warning hasn't been produced for the header
                const key = (prop + ':' + headerName).toLowerCase(); // e.g. `get:cache-control`
                if (!headersToInclude.includes(headerName) && !warningProduced.has(key)) {
                    warningProduced.add(key);
                    const truncatedUrl = truncateMiddle(url);
                    // TODO: create Error guide for this warning
                    console.warn(formatRuntimeError(2802 /* RuntimeErrorCode.HEADERS_ALTERED_BY_TRANSFER_CACHE */, `Angular detected that the \`${headerName}\` header is accessed, but the value of the header ` +
                        `was not transferred from the server to the client by the HttpTransferCache. ` +
                        `To include the value of the \`${headerName}\` header for the \`${truncatedUrl}\` request, ` +
                        `use the \`includeHeaders\` list. The \`includeHeaders\` can be defined either ` +
                        `on a request level by adding the \`transferCache\` parameter, or on an application ` +
                        `level by adding the \`httpCacheTransfer.includeHeaders\` argument to the ` +
                        `\`provideClientHydration()\` call. `));
                }
                // invoking the original method
                return value.apply(target, [headerName]);
            };
        },
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmZXJfY2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vaHR0cC9zcmMvdHJhbnNmZXJfY2FjaGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLHNCQUFzQixFQUN0QixjQUFjLEVBQ2QsTUFBTSxFQUNOLGNBQWMsRUFDZCxZQUFZLEVBR1osYUFBYSxFQUNiLG1CQUFtQixJQUFJLGtCQUFrQixFQUN6Qyx1QkFBdUIsSUFBSSxzQkFBc0IsRUFDakQsZUFBZSxJQUFJLGNBQWMsRUFDakMsV0FBVyxJQUFJLFVBQVUsRUFDekIsV0FBVyxHQUNaLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBYSxFQUFFLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDcEMsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBR25DLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDdEMsT0FBTyxFQUFDLHlCQUF5QixFQUFnQixNQUFNLGVBQWUsQ0FBQztBQUV2RSxPQUFPLEVBQVksWUFBWSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBRW5ELE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBcUJqRDs7R0FFRztBQUVILE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRyxHQUFHLENBQUM7QUFDeEIsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQztBQUMzQixNQUFNLENBQUMsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDO0FBQzFCLE1BQU0sQ0FBQyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFDaEMsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUN2QixNQUFNLENBQUMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDO0FBcUJsQyxNQUFNLGFBQWEsR0FB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LENBQUM7b0JBRXpDLDRDQUE0QztvQkFDNUMsT0FBTyxDQUFDLElBQUksQ0FDVixrQkFBa0IsZ0VBRWhCLCtCQUErQixVQUFVLHFEQUFxRDt3QkFDNUYsOEVBQThFO3dCQUM5RSxpQ0FBaUMsVUFBVSx1QkFBdUIsWUFBWSxjQUFjO3dCQUM1RixnRkFBZ0Y7d0JBQ2hGLHFGQUFxRjt3QkFDckYsMkVBQTJFO3dCQUMzRSxxQ0FBcUMsQ0FDeEMsQ0FDRixDQUFDO2dCQUNKLENBQUM7Z0JBRUQsK0JBQStCO2dCQUMvQixPQUFRLEtBQWtCLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDekQsQ0FBQyxDQUFDO1FBQ0osQ0FBQztLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQVBQX0JPT1RTVFJBUF9MSVNURU5FUixcbiAgQXBwbGljYXRpb25SZWYsXG4gIGluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIG1ha2VTdGF0ZUtleSxcbiAgUHJvdmlkZXIsXG4gIFN0YXRlS2V5LFxuICBUcmFuc2ZlclN0YXRlLFxuICDJtWZvcm1hdFJ1bnRpbWVFcnJvciBhcyBmb3JtYXRSdW50aW1lRXJyb3IsXG4gIMm1cGVyZm9ybWFuY2VNYXJrRmVhdHVyZSBhcyBwZXJmb3JtYW5jZU1hcmtGZWF0dXJlLFxuICDJtXRydW5jYXRlTWlkZGxlIGFzIHRydW5jYXRlTWlkZGxlLFxuICDJtXdoZW5TdGFibGUgYXMgd2hlblN0YWJsZSxcbiAgUExBVEZPUk1fSUQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBvZn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3RhcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge1J1bnRpbWVFcnJvckNvZGV9IGZyb20gJy4vZXJyb3JzJztcbmltcG9ydCB7SHR0cEhlYWRlcnN9IGZyb20gJy4vaGVhZGVycyc7XG5pbXBvcnQge0hUVFBfUk9PVF9JTlRFUkNFUFRPUl9GTlMsIEh0dHBIYW5kbGVyRm59IGZyb20gJy4vaW50ZXJjZXB0b3InO1xuaW1wb3J0IHtIdHRwUmVxdWVzdH0gZnJvbSAnLi9yZXF1ZXN0JztcbmltcG9ydCB7SHR0cEV2ZW50LCBIdHRwUmVzcG9uc2V9IGZyb20gJy4vcmVzcG9uc2UnO1xuaW1wb3J0IHtIdHRwUGFyYW1zfSBmcm9tICcuL3BhcmFtcyc7XG5pbXBvcnQge2lzUGxhdGZvcm1TZXJ2ZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbi8qKlxuICogT3B0aW9ucyB0byBjb25maWd1cmUgaG93IFRyYW5zZmVyQ2FjaGUgc2hvdWxkIGJlIHVzZWQgdG8gY2FjaGUgcmVxdWVzdHMgbWFkZSB2aWEgSHR0cENsaWVudC5cbiAqXG4gKiBAcGFyYW0gaW5jbHVkZUhlYWRlcnMgU3BlY2lmaWVzIHdoaWNoIGhlYWRlcnMgc2hvdWxkIGJlIGluY2x1ZGVkIGludG8gY2FjaGVkIHJlc3BvbnNlcy4gTm9cbiAqICAgICBoZWFkZXJzIGFyZSBpbmNsdWRlZCBieSBkZWZhdWx0LlxuICogQHBhcmFtIGZpbHRlciBBIGZ1bmN0aW9uIHRoYXQgcmVjZWl2ZXMgYSByZXF1ZXN0IGFzIGFuIGFyZ3VtZW50IGFuZCByZXR1cm5zIGEgYm9vbGVhbiB0byBpbmRpY2F0ZVxuICogICAgIHdoZXRoZXIgYSByZXF1ZXN0IHNob3VsZCBiZSBpbmNsdWRlZCBpbnRvIHRoZSBjYWNoZS5cbiAqIEBwYXJhbSBpbmNsdWRlUG9zdFJlcXVlc3RzIEVuYWJsZXMgY2FjaGluZyBmb3IgUE9TVCByZXF1ZXN0cy4gQnkgZGVmYXVsdCwgb25seSBHRVQgYW5kIEhFQURcbiAqICAgICByZXF1ZXN0cyBhcmUgY2FjaGVkLiBUaGlzIG9wdGlvbiBjYW4gYmUgZW5hYmxlZCBpZiBQT1NUIHJlcXVlc3RzIGFyZSB1c2VkIHRvIHJldHJpZXZlIGRhdGFcbiAqICAgICAoZm9yIGV4YW1wbGUgdXNpbmcgR3JhcGhRTCkuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgdHlwZSBIdHRwVHJhbnNmZXJDYWNoZU9wdGlvbnMgPSB7XG4gIGluY2x1ZGVIZWFkZXJzPzogc3RyaW5nW107XG4gIGZpbHRlcj86IChyZXE6IEh0dHBSZXF1ZXN0PHVua25vd24+KSA9PiBib29sZWFuO1xuICBpbmNsdWRlUG9zdFJlcXVlc3RzPzogYm9vbGVhbjtcbn07XG5cbi8qKlxuICogS2V5cyB3aXRoaW4gY2FjaGVkIHJlc3BvbnNlIGRhdGEgc3RydWN0dXJlLlxuICovXG5cbmV4cG9ydCBjb25zdCBCT0RZID0gJ2InO1xuZXhwb3J0IGNvbnN0IEhFQURFUlMgPSAnaCc7XG5leHBvcnQgY29uc3QgU1RBVFVTID0gJ3MnO1xuZXhwb3J0IGNvbnN0IFNUQVRVU19URVhUID0gJ3N0JztcbmV4cG9ydCBjb25zdCBVUkwgPSAndSc7XG5leHBvcnQgY29uc3QgUkVTUE9OU0VfVFlQRSA9ICdydCc7XG5cbmludGVyZmFjZSBUcmFuc2Zlckh0dHBSZXNwb25zZSB7XG4gIC8qKiBib2R5ICovXG4gIFtCT0RZXTogYW55O1xuICAvKiogaGVhZGVycyAqL1xuICBbSEVBREVSU106IFJlY29yZDxzdHJpbmcsIHN0cmluZ1tdPjtcbiAgLyoqIHN0YXR1cyAqL1xuICBbU1RBVFVTXT86IG51bWJlcjtcbiAgLyoqIHN0YXR1c1RleHQgKi9cbiAgW1NUQVRVU19URVhUXT86IHN0cmluZztcbiAgLyoqIHVybCAqL1xuICBbVVJMXT86IHN0cmluZztcbiAgLyoqIHJlc3BvbnNlVHlwZSAqL1xuICBbUkVTUE9OU0VfVFlQRV0/OiBIdHRwUmVxdWVzdDx1bmtub3duPlsncmVzcG9uc2VUeXBlJ107XG59XG5cbmludGVyZmFjZSBDYWNoZU9wdGlvbnMgZXh0ZW5kcyBIdHRwVHJhbnNmZXJDYWNoZU9wdGlvbnMge1xuICBpc0NhY2hlQWN0aXZlOiBib29sZWFuO1xufVxuXG5jb25zdCBDQUNIRV9PUFRJT05TID0gbmV3IEluamVjdGlvblRva2VuPENhY2hlT3B0aW9ucz4oXG4gIG5nRGV2TW9kZSA/ICdIVFRQX1RSQU5TRkVSX1NUQVRFX0NBQ0hFX09QVElPTlMnIDogJycsXG4pO1xuXG4vKipcbiAqIEEgbGlzdCBvZiBhbGxvd2VkIEhUVFAgbWV0aG9kcyB0byBjYWNoZS5cbiAqL1xuY29uc3QgQUxMT1dFRF9NRVRIT0RTID0gWydHRVQnLCAnSEVBRCddO1xuXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNmZXJDYWNoZUludGVyY2VwdG9yRm4oXG4gIHJlcTogSHR0cFJlcXVlc3Q8dW5rbm93bj4sXG4gIG5leHQ6IEh0dHBIYW5kbGVyRm4sXG4pOiBPYnNlcnZhYmxlPEh0dHBFdmVudDx1bmtub3duPj4ge1xuICBjb25zdCB7aXNDYWNoZUFjdGl2ZSwgLi4uZ2xvYmFsT3B0aW9uc30gPSBpbmplY3QoQ0FDSEVfT1BUSU9OUyk7XG4gIGNvbnN0IHt0cmFuc2ZlckNhY2hlOiByZXF1ZXN0T3B0aW9ucywgbWV0aG9kOiByZXF1ZXN0TWV0aG9kfSA9IHJlcTtcblxuICAvLyBJbiB0aGUgZm9sbG93aW5nIHNpdHVhdGlvbnMgd2UgZG8gbm90IHdhbnQgdG8gY2FjaGUgdGhlIHJlcXVlc3RcbiAgaWYgKFxuICAgICFpc0NhY2hlQWN0aXZlIHx8XG4gICAgLy8gUE9TVCByZXF1ZXN0cyBhcmUgYWxsb3dlZCBlaXRoZXIgZ2xvYmFsbHkgb3IgYXQgcmVxdWVzdCBsZXZlbFxuICAgIChyZXF1ZXN0TWV0aG9kID09PSAnUE9TVCcgJiYgIWdsb2JhbE9wdGlvbnMuaW5jbHVkZVBvc3RSZXF1ZXN0cyAmJiAhcmVxdWVzdE9wdGlvbnMpIHx8XG4gICAgKHJlcXVlc3RNZXRob2QgIT09ICdQT1NUJyAmJiAhQUxMT1dFRF9NRVRIT0RTLmluY2x1ZGVzKHJlcXVlc3RNZXRob2QpKSB8fFxuICAgIHJlcXVlc3RPcHRpb25zID09PSBmYWxzZSB8fCAvL1xuICAgIGdsb2JhbE9wdGlvbnMuZmlsdGVyPy4ocmVxKSA9PT0gZmFsc2VcbiAgKSB7XG4gICAgcmV0dXJuIG5leHQocmVxKTtcbiAgfVxuXG4gIGNvbnN0IHRyYW5zZmVyU3RhdGUgPSBpbmplY3QoVHJhbnNmZXJTdGF0ZSk7XG4gIGNvbnN0IHN0b3JlS2V5ID0gbWFrZUNhY2hlS2V5KHJlcSk7XG4gIGNvbnN0IHJlc3BvbnNlID0gdHJhbnNmZXJTdGF0ZS5nZXQoc3RvcmVLZXksIG51bGwpO1xuXG4gIGxldCBoZWFkZXJzVG9JbmNsdWRlID0gZ2xvYmFsT3B0aW9ucy5pbmNsdWRlSGVhZGVycztcbiAgaWYgKHR5cGVvZiByZXF1ZXN0T3B0aW9ucyA9PT0gJ29iamVjdCcgJiYgcmVxdWVzdE9wdGlvbnMuaW5jbHVkZUhlYWRlcnMpIHtcbiAgICAvLyBSZXF1ZXN0LXNwZWNpZmljIGNvbmZpZyB0YWtlcyBwcmVjZWRlbmNlIG92ZXIgdGhlIGdsb2JhbCBjb25maWcuXG4gICAgaGVhZGVyc1RvSW5jbHVkZSA9IHJlcXVlc3RPcHRpb25zLmluY2x1ZGVIZWFkZXJzO1xuICB9XG5cbiAgaWYgKHJlc3BvbnNlKSB7XG4gICAgY29uc3Qge1xuICAgICAgW0JPRFldOiB1bmRlY29kZWRCb2R5LFxuICAgICAgW1JFU1BPTlNFX1RZUEVdOiByZXNwb25zZVR5cGUsXG4gICAgICBbSEVBREVSU106IGh0dHBIZWFkZXJzLFxuICAgICAgW1NUQVRVU106IHN0YXR1cyxcbiAgICAgIFtTVEFUVVNfVEVYVF06IHN0YXR1c1RleHQsXG4gICAgICBbVVJMXTogdXJsLFxuICAgIH0gPSByZXNwb25zZTtcbiAgICAvLyBSZXF1ZXN0IGZvdW5kIGluIGNhY2hlLiBSZXNwb25kIHVzaW5nIGl0LlxuICAgIGxldCBib2R5OiBBcnJheUJ1ZmZlciB8IEJsb2IgfCBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlY29kZWRCb2R5O1xuXG4gICAgc3dpdGNoIChyZXNwb25zZVR5cGUpIHtcbiAgICAgIGNhc2UgJ2FycmF5YnVmZmVyJzpcbiAgICAgICAgYm9keSA9IG5ldyBUZXh0RW5jb2RlcigpLmVuY29kZSh1bmRlY29kZWRCb2R5KS5idWZmZXI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYmxvYic6XG4gICAgICAgIGJvZHkgPSBuZXcgQmxvYihbdW5kZWNvZGVkQm9keV0pO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBXZSB3YW50IHRvIHdhcm4gdXNlcnMgYWNjZXNzaW5nIGEgaGVhZGVyIHByb3ZpZGVkIGZyb20gdGhlIGNhY2hlXG4gICAgLy8gVGhhdCBIdHRwVHJhbnNmZXJDYWNoZSBhbHRlcnMgdGhlIGhlYWRlcnNcbiAgICAvLyBUaGUgd2FybmluZyB3aWxsIGJlIGxvZ2dlZCBhIHNpbmdsZSB0aW1lIGJ5IEh0dHBIZWFkZXJzIGluc3RhbmNlXG4gICAgbGV0IGhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoaHR0cEhlYWRlcnMpO1xuICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgIC8vIEFwcGVuZCBleHRyYSBsb2dpYyBpbiBkZXYgbW9kZSB0byBwcm9kdWNlIGEgd2FybmluZyB3aGVuIGEgaGVhZGVyXG4gICAgICAvLyB0aGF0IHdhcyBub3QgdHJhbnNmZXJyZWQgdG8gdGhlIGNsaWVudCBpcyBhY2Nlc3NlZCBpbiB0aGUgY29kZSB2aWEgYGdldGBcbiAgICAgIC8vIGFuZCBgaGFzYCBjYWxscy5cbiAgICAgIGhlYWRlcnMgPSBhcHBlbmRNaXNzaW5nSGVhZGVyc0RldGVjdGlvbihyZXEudXJsLCBoZWFkZXJzLCBoZWFkZXJzVG9JbmNsdWRlID8/IFtdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb2YoXG4gICAgICBuZXcgSHR0cFJlc3BvbnNlKHtcbiAgICAgICAgYm9keSxcbiAgICAgICAgaGVhZGVycyxcbiAgICAgICAgc3RhdHVzLFxuICAgICAgICBzdGF0dXNUZXh0LFxuICAgICAgICB1cmwsXG4gICAgICB9KSxcbiAgICApO1xuICB9XG5cbiAgY29uc3QgaXNTZXJ2ZXIgPSBpc1BsYXRmb3JtU2VydmVyKGluamVjdChQTEFURk9STV9JRCkpO1xuXG4gIC8vIFJlcXVlc3Qgbm90IGZvdW5kIGluIGNhY2hlLiBNYWtlIHRoZSByZXF1ZXN0IGFuZCBjYWNoZSBpdCBpZiBvbiB0aGUgc2VydmVyLlxuICByZXR1cm4gbmV4dChyZXEpLnBpcGUoXG4gICAgdGFwKChldmVudDogSHR0cEV2ZW50PHVua25vd24+KSA9PiB7XG4gICAgICBpZiAoZXZlbnQgaW5zdGFuY2VvZiBIdHRwUmVzcG9uc2UgJiYgaXNTZXJ2ZXIpIHtcbiAgICAgICAgdHJhbnNmZXJTdGF0ZS5zZXQ8VHJhbnNmZXJIdHRwUmVzcG9uc2U+KHN0b3JlS2V5LCB7XG4gICAgICAgICAgW0JPRFldOiBldmVudC5ib2R5LFxuICAgICAgICAgIFtIRUFERVJTXTogZ2V0RmlsdGVyZWRIZWFkZXJzKGV2ZW50LmhlYWRlcnMsIGhlYWRlcnNUb0luY2x1ZGUpLFxuICAgICAgICAgIFtTVEFUVVNdOiBldmVudC5zdGF0dXMsXG4gICAgICAgICAgW1NUQVRVU19URVhUXTogZXZlbnQuc3RhdHVzVGV4dCxcbiAgICAgICAgICBbVVJMXTogZXZlbnQudXJsIHx8ICcnLFxuICAgICAgICAgIFtSRVNQT05TRV9UWVBFXTogcmVxLnJlc3BvbnNlVHlwZSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSksXG4gICk7XG59XG5cbmZ1bmN0aW9uIGdldEZpbHRlcmVkSGVhZGVycyhcbiAgaGVhZGVyczogSHR0cEhlYWRlcnMsXG4gIGluY2x1ZGVIZWFkZXJzOiBzdHJpbmdbXSB8IHVuZGVmaW5lZCxcbik6IFJlY29yZDxzdHJpbmcsIHN0cmluZ1tdPiB7XG4gIGlmICghaW5jbHVkZUhlYWRlcnMpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICBjb25zdCBoZWFkZXJzTWFwOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmdbXT4gPSB7fTtcbiAgZm9yIChjb25zdCBrZXkgb2YgaW5jbHVkZUhlYWRlcnMpIHtcbiAgICBjb25zdCB2YWx1ZXMgPSBoZWFkZXJzLmdldEFsbChrZXkpO1xuICAgIGlmICh2YWx1ZXMgIT09IG51bGwpIHtcbiAgICAgIGhlYWRlcnNNYXBba2V5XSA9IHZhbHVlcztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gaGVhZGVyc01hcDtcbn1cblxuZnVuY3Rpb24gc29ydEFuZENvbmNhdFBhcmFtcyhwYXJhbXM6IEh0dHBQYXJhbXMgfCBVUkxTZWFyY2hQYXJhbXMpOiBzdHJpbmcge1xuICByZXR1cm4gWy4uLnBhcmFtcy5rZXlzKCldXG4gICAgLnNvcnQoKVxuICAgIC5tYXAoKGspID0+IGAke2t9PSR7cGFyYW1zLmdldEFsbChrKX1gKVxuICAgIC5qb2luKCcmJyk7XG59XG5cbmZ1bmN0aW9uIG1ha2VDYWNoZUtleShyZXF1ZXN0OiBIdHRwUmVxdWVzdDxhbnk+KTogU3RhdGVLZXk8VHJhbnNmZXJIdHRwUmVzcG9uc2U+IHtcbiAgLy8gbWFrZSB0aGUgcGFyYW1zIGVuY29kZWQgc2FtZSBhcyBhIHVybCBzbyBpdCdzIGVhc3kgdG8gaWRlbnRpZnlcbiAgY29uc3Qge3BhcmFtcywgbWV0aG9kLCByZXNwb25zZVR5cGUsIHVybH0gPSByZXF1ZXN0O1xuICBjb25zdCBlbmNvZGVkUGFyYW1zID0gc29ydEFuZENvbmNhdFBhcmFtcyhwYXJhbXMpO1xuXG4gIGxldCBzZXJpYWxpemVkQm9keSA9IHJlcXVlc3Quc2VyaWFsaXplQm9keSgpO1xuICBpZiAoc2VyaWFsaXplZEJvZHkgaW5zdGFuY2VvZiBVUkxTZWFyY2hQYXJhbXMpIHtcbiAgICBzZXJpYWxpemVkQm9keSA9IHNvcnRBbmRDb25jYXRQYXJhbXMoc2VyaWFsaXplZEJvZHkpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBzZXJpYWxpemVkQm9keSAhPT0gJ3N0cmluZycpIHtcbiAgICBzZXJpYWxpemVkQm9keSA9ICcnO1xuICB9XG5cbiAgY29uc3Qga2V5ID0gW21ldGhvZCwgcmVzcG9uc2VUeXBlLCB1cmwsIHNlcmlhbGl6ZWRCb2R5LCBlbmNvZGVkUGFyYW1zXS5qb2luKCd8Jyk7XG4gIGNvbnN0IGhhc2ggPSBnZW5lcmF0ZUhhc2goa2V5KTtcblxuICByZXR1cm4gbWFrZVN0YXRlS2V5KGhhc2gpO1xufVxuXG4vKipcbiAqIEEgbWV0aG9kIHRoYXQgcmV0dXJucyBhIGhhc2ggcmVwcmVzZW50YXRpb24gb2YgYSBzdHJpbmcgdXNpbmcgYSB2YXJpYW50IG9mIERKQjIgaGFzaFxuICogYWxnb3JpdGhtLlxuICpcbiAqIFRoaXMgaXMgdGhlIHNhbWUgaGFzaGluZyBsb2dpYyB0aGF0IGlzIHVzZWQgdG8gZ2VuZXJhdGUgY29tcG9uZW50IGlkcy5cbiAqL1xuZnVuY3Rpb24gZ2VuZXJhdGVIYXNoKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICBsZXQgaGFzaCA9IDA7XG5cbiAgZm9yIChjb25zdCBjaGFyIG9mIHZhbHVlKSB7XG4gICAgaGFzaCA9IChNYXRoLmltdWwoMzEsIGhhc2gpICsgY2hhci5jaGFyQ29kZUF0KDApKSA8PCAwO1xuICB9XG5cbiAgLy8gRm9yY2UgcG9zaXRpdmUgbnVtYmVyIGhhc2guXG4gIC8vIDIxNDc0ODM2NDcgPSBlcXVpdmFsZW50IG9mIEludGVnZXIuTUFYX1ZBTFVFLlxuICBoYXNoICs9IDIxNDc0ODM2NDcgKyAxO1xuXG4gIHJldHVybiBoYXNoLnRvU3RyaW5nKCk7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgREkgcHJvdmlkZXJzIG5lZWRlZCB0byBlbmFibGUgSFRUUCB0cmFuc2ZlciBjYWNoZS5cbiAqXG4gKiBCeSBkZWZhdWx0LCB3aGVuIHVzaW5nIHNlcnZlciByZW5kZXJpbmcsIHJlcXVlc3RzIGFyZSBwZXJmb3JtZWQgdHdpY2U6IG9uY2Ugb24gdGhlIHNlcnZlciBhbmRcbiAqIG90aGVyIG9uZSBvbiB0aGUgYnJvd3Nlci5cbiAqXG4gKiBXaGVuIHRoZXNlIHByb3ZpZGVycyBhcmUgYWRkZWQsIHJlcXVlc3RzIHBlcmZvcm1lZCBvbiB0aGUgc2VydmVyIGFyZSBjYWNoZWQgYW5kIHJldXNlZCBkdXJpbmcgdGhlXG4gKiBib290c3RyYXBwaW5nIG9mIHRoZSBhcHBsaWNhdGlvbiBpbiB0aGUgYnJvd3NlciB0aHVzIGF2b2lkaW5nIGR1cGxpY2F0ZSByZXF1ZXN0cyBhbmQgcmVkdWNpbmdcbiAqIGxvYWQgdGltZS5cbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3aXRoSHR0cFRyYW5zZmVyQ2FjaGUoY2FjaGVPcHRpb25zOiBIdHRwVHJhbnNmZXJDYWNoZU9wdGlvbnMpOiBQcm92aWRlcltdIHtcbiAgcmV0dXJuIFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBDQUNIRV9PUFRJT05TLFxuICAgICAgdXNlRmFjdG9yeTogKCk6IENhY2hlT3B0aW9ucyA9PiB7XG4gICAgICAgIHBlcmZvcm1hbmNlTWFya0ZlYXR1cmUoJ05nSHR0cFRyYW5zZmVyQ2FjaGUnKTtcbiAgICAgICAgcmV0dXJuIHtpc0NhY2hlQWN0aXZlOiB0cnVlLCAuLi5jYWNoZU9wdGlvbnN9O1xuICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IEhUVFBfUk9PVF9JTlRFUkNFUFRPUl9GTlMsXG4gICAgICB1c2VWYWx1ZTogdHJhbnNmZXJDYWNoZUludGVyY2VwdG9yRm4sXG4gICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgIGRlcHM6IFtUcmFuc2ZlclN0YXRlLCBDQUNIRV9PUFRJT05TXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IEFQUF9CT09UU1RSQVBfTElTVEVORVIsXG4gICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgIHVzZUZhY3Rvcnk6ICgpID0+IHtcbiAgICAgICAgY29uc3QgYXBwUmVmID0gaW5qZWN0KEFwcGxpY2F0aW9uUmVmKTtcbiAgICAgICAgY29uc3QgY2FjaGVTdGF0ZSA9IGluamVjdChDQUNIRV9PUFRJT05TKTtcblxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgIHdoZW5TdGFibGUoYXBwUmVmKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGNhY2hlU3RhdGUuaXNDYWNoZUFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgfSxcbiAgICB9LFxuICBdO1xufVxuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gd2lsbCBhZGQgYSBwcm94eSB0byBhbiBIdHRwSGVhZGVyIHRvIGludGVyY2VwdCBjYWxscyB0byBnZXQvaGFzXG4gKiBhbmQgbG9nIGEgd2FybmluZyBpZiB0aGUgaGVhZGVyIGVudHJ5IHJlcXVlc3RlZCBoYXMgYmVlbiByZW1vdmVkXG4gKi9cbmZ1bmN0aW9uIGFwcGVuZE1pc3NpbmdIZWFkZXJzRGV0ZWN0aW9uKFxuICB1cmw6IHN0cmluZyxcbiAgaGVhZGVyczogSHR0cEhlYWRlcnMsXG4gIGhlYWRlcnNUb0luY2x1ZGU6IHN0cmluZ1tdLFxuKTogSHR0cEhlYWRlcnMge1xuICBjb25zdCB3YXJuaW5nUHJvZHVjZWQgPSBuZXcgU2V0KCk7XG4gIHJldHVybiBuZXcgUHJveHk8SHR0cEhlYWRlcnM+KGhlYWRlcnMsIHtcbiAgICBnZXQodGFyZ2V0OiBIdHRwSGVhZGVycywgcHJvcDoga2V5b2YgSHR0cEhlYWRlcnMpOiB1bmtub3duIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gUmVmbGVjdC5nZXQodGFyZ2V0LCBwcm9wKTtcbiAgICAgIGNvbnN0IG1ldGhvZHM6IFNldDxrZXlvZiBIdHRwSGVhZGVycz4gPSBuZXcgU2V0KFsnZ2V0JywgJ2hhcycsICdnZXRBbGwnXSk7XG5cbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdmdW5jdGlvbicgfHwgIW1ldGhvZHMuaGFzKHByb3ApKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIChoZWFkZXJOYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgLy8gV2UgbG9nIHdoZW4gdGhlIGtleSBoYXMgYmVlbiByZW1vdmVkIGFuZCBhIHdhcm5pbmcgaGFzbid0IGJlZW4gcHJvZHVjZWQgZm9yIHRoZSBoZWFkZXJcbiAgICAgICAgY29uc3Qga2V5ID0gKHByb3AgKyAnOicgKyBoZWFkZXJOYW1lKS50b0xvd2VyQ2FzZSgpOyAvLyBlLmcuIGBnZXQ6Y2FjaGUtY29udHJvbGBcbiAgICAgICAgaWYgKCFoZWFkZXJzVG9JbmNsdWRlLmluY2x1ZGVzKGhlYWRlck5hbWUpICYmICF3YXJuaW5nUHJvZHVjZWQuaGFzKGtleSkpIHtcbiAgICAgICAgICB3YXJuaW5nUHJvZHVjZWQuYWRkKGtleSk7XG4gICAgICAgICAgY29uc3QgdHJ1bmNhdGVkVXJsID0gdHJ1bmNhdGVNaWRkbGUodXJsKTtcblxuICAgICAgICAgIC8vIFRPRE86IGNyZWF0ZSBFcnJvciBndWlkZSBmb3IgdGhpcyB3YXJuaW5nXG4gICAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgZm9ybWF0UnVudGltZUVycm9yKFxuICAgICAgICAgICAgICBSdW50aW1lRXJyb3JDb2RlLkhFQURFUlNfQUxURVJFRF9CWV9UUkFOU0ZFUl9DQUNIRSxcbiAgICAgICAgICAgICAgYEFuZ3VsYXIgZGV0ZWN0ZWQgdGhhdCB0aGUgXFxgJHtoZWFkZXJOYW1lfVxcYCBoZWFkZXIgaXMgYWNjZXNzZWQsIGJ1dCB0aGUgdmFsdWUgb2YgdGhlIGhlYWRlciBgICtcbiAgICAgICAgICAgICAgICBgd2FzIG5vdCB0cmFuc2ZlcnJlZCBmcm9tIHRoZSBzZXJ2ZXIgdG8gdGhlIGNsaWVudCBieSB0aGUgSHR0cFRyYW5zZmVyQ2FjaGUuIGAgK1xuICAgICAgICAgICAgICAgIGBUbyBpbmNsdWRlIHRoZSB2YWx1ZSBvZiB0aGUgXFxgJHtoZWFkZXJOYW1lfVxcYCBoZWFkZXIgZm9yIHRoZSBcXGAke3RydW5jYXRlZFVybH1cXGAgcmVxdWVzdCwgYCArXG4gICAgICAgICAgICAgICAgYHVzZSB0aGUgXFxgaW5jbHVkZUhlYWRlcnNcXGAgbGlzdC4gVGhlIFxcYGluY2x1ZGVIZWFkZXJzXFxgIGNhbiBiZSBkZWZpbmVkIGVpdGhlciBgICtcbiAgICAgICAgICAgICAgICBgb24gYSByZXF1ZXN0IGxldmVsIGJ5IGFkZGluZyB0aGUgXFxgdHJhbnNmZXJDYWNoZVxcYCBwYXJhbWV0ZXIsIG9yIG9uIGFuIGFwcGxpY2F0aW9uIGAgK1xuICAgICAgICAgICAgICAgIGBsZXZlbCBieSBhZGRpbmcgdGhlIFxcYGh0dHBDYWNoZVRyYW5zZmVyLmluY2x1ZGVIZWFkZXJzXFxgIGFyZ3VtZW50IHRvIHRoZSBgICtcbiAgICAgICAgICAgICAgICBgXFxgcHJvdmlkZUNsaWVudEh5ZHJhdGlvbigpXFxgIGNhbGwuIGAsXG4gICAgICAgICAgICApLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpbnZva2luZyB0aGUgb3JpZ2luYWwgbWV0aG9kXG4gICAgICAgIHJldHVybiAodmFsdWUgYXMgRnVuY3Rpb24pLmFwcGx5KHRhcmdldCwgW2hlYWRlck5hbWVdKTtcbiAgICAgIH07XG4gICAgfSxcbiAgfSk7XG59XG4iXX0=