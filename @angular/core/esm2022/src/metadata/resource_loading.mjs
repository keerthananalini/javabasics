/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Used to resolve resource URLs on `@Component` when used with JIT compilation.
 *
 * Example:
 * ```
 * @Component({
 *   selector: 'my-comp',
 *   templateUrl: 'my-comp.html', // This requires asynchronous resolution
 * })
 * class MyComponent{
 * }
 *
 * // Calling `renderComponent` will fail because `renderComponent` is a synchronous process
 * // and `MyComponent`'s `@Component.templateUrl` needs to be resolved asynchronously.
 *
 * // Calling `resolveComponentResources()` will resolve `@Component.templateUrl` into
 * // `@Component.template`, which allows `renderComponent` to proceed in a synchronous manner.
 *
 * // Use browser's `fetch()` function as the default resource resolution strategy.
 * resolveComponentResources(fetch).then(() => {
 *   // After resolution all URLs have been converted into `template` strings.
 *   renderComponent(MyComponent);
 * });
 *
 * ```
 *
 * NOTE: In AOT the resolution happens during compilation, and so there should be no need
 * to call this method outside JIT mode.
 *
 * @param resourceResolver a function which is responsible for returning a `Promise` to the
 * contents of the resolved URL. Browser's `fetch()` method is a good default implementation.
 */
export function resolveComponentResources(resourceResolver) {
    // Store all promises which are fetching the resources.
    const componentResolved = [];
    // Cache so that we don't fetch the same resource more than once.
    const urlMap = new Map();
    function cachedResourceResolve(url) {
        let promise = urlMap.get(url);
        if (!promise) {
            const resp = resourceResolver(url);
            urlMap.set(url, promise = resp.then(unwrapResponse));
        }
        return promise;
    }
    componentResourceResolutionQueue.forEach((component, type) => {
        const promises = [];
        if (component.templateUrl) {
            promises.push(cachedResourceResolve(component.templateUrl).then((template) => {
                component.template = template;
            }));
        }
        const styles = typeof component.styles === 'string' ? [component.styles] : (component.styles || []);
        component.styles = styles;
        if (component.styleUrl && component.styleUrls?.length) {
            throw new Error('@Component cannot define both `styleUrl` and `styleUrls`. ' +
                'Use `styleUrl` if the component has one stylesheet, or `styleUrls` if it has multiple');
        }
        else if (component.styleUrls?.length) {
            const styleOffset = component.styles.length;
            const styleUrls = component.styleUrls;
            component.styleUrls.forEach((styleUrl, index) => {
                styles.push(''); // pre-allocate array.
                promises.push(cachedResourceResolve(styleUrl).then((style) => {
                    styles[styleOffset + index] = style;
                    styleUrls.splice(styleUrls.indexOf(styleUrl), 1);
                    if (styleUrls.length == 0) {
                        component.styleUrls = undefined;
                    }
                }));
            });
        }
        else if (component.styleUrl) {
            promises.push(cachedResourceResolve(component.styleUrl).then((style) => {
                styles.push(style);
                component.styleUrl = undefined;
            }));
        }
        const fullyResolved = Promise.all(promises).then(() => componentDefResolved(type));
        componentResolved.push(fullyResolved);
    });
    clearResolutionOfComponentResourcesQueue();
    return Promise.all(componentResolved).then(() => undefined);
}
let componentResourceResolutionQueue = new Map();
// Track when existing ɵcmp for a Type is waiting on resources.
const componentDefPendingResolution = new Set();
export function maybeQueueResolutionOfComponentResources(type, metadata) {
    if (componentNeedsResolution(metadata)) {
        componentResourceResolutionQueue.set(type, metadata);
        componentDefPendingResolution.add(type);
    }
}
export function isComponentDefPendingResolution(type) {
    return componentDefPendingResolution.has(type);
}
export function componentNeedsResolution(component) {
    return !!((component.templateUrl && !component.hasOwnProperty('template')) ||
        (component.styleUrls && component.styleUrls.length) || component.styleUrl);
}
export function clearResolutionOfComponentResourcesQueue() {
    const old = componentResourceResolutionQueue;
    componentResourceResolutionQueue = new Map();
    return old;
}
export function restoreComponentResolutionQueue(queue) {
    componentDefPendingResolution.clear();
    queue.forEach((_, type) => componentDefPendingResolution.add(type));
    componentResourceResolutionQueue = queue;
}
export function isComponentResourceResolutionQueueEmpty() {
    return componentResourceResolutionQueue.size === 0;
}
function unwrapResponse(response) {
    return typeof response == 'string' ? response : response.text();
}
function componentDefResolved(type) {
    componentDefPendingResolution.delete(type);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2VfbG9hZGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL21ldGFkYXRhL3Jlc291cmNlX2xvYWRpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBT0g7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0ErQkc7QUFDSCxNQUFNLFVBQVUseUJBQXlCLENBQ3JDLGdCQUE4RTtJQUNoRix1REFBdUQ7SUFDdkQsTUFBTSxpQkFBaUIsR0FBb0IsRUFBRSxDQUFDO0lBRTlDLGlFQUFpRTtJQUNqRSxNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsRUFBMkIsQ0FBQztJQUNsRCxTQUFTLHFCQUFxQixDQUFDLEdBQVc7UUFDeEMsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDYixNQUFNLElBQUksR0FBRyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNuQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELENBQUM7UUFDRCxPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDO0lBRUQsZ0NBQWdDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBb0IsRUFBRSxJQUFlLEVBQUUsRUFBRTtRQUNqRixNQUFNLFFBQVEsR0FBb0IsRUFBRSxDQUFDO1FBQ3JDLElBQUksU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQzFCLFFBQVEsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO2dCQUMzRSxTQUFTLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztZQUNoQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ04sQ0FBQztRQUNELE1BQU0sTUFBTSxHQUNSLE9BQU8sU0FBUyxDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLENBQUM7UUFDekYsU0FBUyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFFMUIsSUFBSSxTQUFTLENBQUMsUUFBUSxJQUFJLFNBQVMsQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLENBQUM7WUFDdEQsTUFBTSxJQUFJLEtBQUssQ0FDWCw0REFBNEQ7Z0JBQzVELHVGQUF1RixDQUFDLENBQUM7UUFDL0YsQ0FBQzthQUFNLElBQUksU0FBUyxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsQ0FBQztZQUN2QyxNQUFNLFdBQVcsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUM1QyxNQUFNLFNBQVMsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDO1lBQ3RDLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxFQUFFO2dCQUM5QyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUUsc0JBQXNCO2dCQUN4QyxRQUFRLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO29CQUMzRCxNQUFNLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQztvQkFDcEMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUNqRCxJQUFJLFNBQVMsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFLENBQUM7d0JBQzFCLFNBQVMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO29CQUNsQyxDQUFDO2dCQUNILENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDTixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7YUFBTSxJQUFJLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUM5QixRQUFRLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtnQkFDckUsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDbkIsU0FBUyxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7WUFDakMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNOLENBQUM7UUFFRCxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ25GLGlCQUFpQixDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUN4QyxDQUFDLENBQUMsQ0FBQztJQUNILHdDQUF3QyxFQUFFLENBQUM7SUFDM0MsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzlELENBQUM7QUFFRCxJQUFJLGdDQUFnQyxHQUFHLElBQUksR0FBRyxFQUF3QixDQUFDO0FBRXZFLCtEQUErRDtBQUMvRCxNQUFNLDZCQUE2QixHQUFHLElBQUksR0FBRyxFQUFhLENBQUM7QUFFM0QsTUFBTSxVQUFVLHdDQUF3QyxDQUFDLElBQWUsRUFBRSxRQUFtQjtJQUMzRixJQUFJLHdCQUF3QixDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7UUFDdkMsZ0NBQWdDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNyRCw2QkFBNkIsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUMsQ0FBQztBQUNILENBQUM7QUFFRCxNQUFNLFVBQVUsK0JBQStCLENBQUMsSUFBZTtJQUM3RCxPQUFPLDZCQUE2QixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqRCxDQUFDO0FBRUQsTUFBTSxVQUFVLHdCQUF3QixDQUFDLFNBQW9CO0lBQzNELE9BQU8sQ0FBQyxDQUFDLENBQ0wsQ0FBQyxTQUFTLENBQUMsV0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNoRSxDQUFDLFNBQVMsQ0FBQyxTQUFTLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDakYsQ0FBQztBQUNELE1BQU0sVUFBVSx3Q0FBd0M7SUFDdEQsTUFBTSxHQUFHLEdBQUcsZ0NBQWdDLENBQUM7SUFDN0MsZ0NBQWdDLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUM3QyxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFFRCxNQUFNLFVBQVUsK0JBQStCLENBQUMsS0FBZ0M7SUFDOUUsNkJBQTZCLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDdEMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLDZCQUE2QixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3BFLGdDQUFnQyxHQUFHLEtBQUssQ0FBQztBQUMzQyxDQUFDO0FBRUQsTUFBTSxVQUFVLHVDQUF1QztJQUNyRCxPQUFPLGdDQUFnQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUM7QUFDckQsQ0FBQztBQUVELFNBQVMsY0FBYyxDQUFDLFFBQTBDO0lBQ2hFLE9BQU8sT0FBTyxRQUFRLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNsRSxDQUFDO0FBRUQsU0FBUyxvQkFBb0IsQ0FBQyxJQUFlO0lBQzNDLDZCQUE2QixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM3QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7VHlwZX0gZnJvbSAnLi4vaW50ZXJmYWNlL3R5cGUnO1xuXG5pbXBvcnQge0NvbXBvbmVudH0gZnJvbSAnLi9kaXJlY3RpdmVzJztcblxuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSByZXNvdXJjZSBVUkxzIG9uIGBAQ29tcG9uZW50YCB3aGVuIHVzZWQgd2l0aCBKSVQgY29tcGlsYXRpb24uXG4gKlxuICogRXhhbXBsZTpcbiAqIGBgYFxuICogQENvbXBvbmVudCh7XG4gKiAgIHNlbGVjdG9yOiAnbXktY29tcCcsXG4gKiAgIHRlbXBsYXRlVXJsOiAnbXktY29tcC5odG1sJywgLy8gVGhpcyByZXF1aXJlcyBhc3luY2hyb25vdXMgcmVzb2x1dGlvblxuICogfSlcbiAqIGNsYXNzIE15Q29tcG9uZW50e1xuICogfVxuICpcbiAqIC8vIENhbGxpbmcgYHJlbmRlckNvbXBvbmVudGAgd2lsbCBmYWlsIGJlY2F1c2UgYHJlbmRlckNvbXBvbmVudGAgaXMgYSBzeW5jaHJvbm91cyBwcm9jZXNzXG4gKiAvLyBhbmQgYE15Q29tcG9uZW50YCdzIGBAQ29tcG9uZW50LnRlbXBsYXRlVXJsYCBuZWVkcyB0byBiZSByZXNvbHZlZCBhc3luY2hyb25vdXNseS5cbiAqXG4gKiAvLyBDYWxsaW5nIGByZXNvbHZlQ29tcG9uZW50UmVzb3VyY2VzKClgIHdpbGwgcmVzb2x2ZSBgQENvbXBvbmVudC50ZW1wbGF0ZVVybGAgaW50b1xuICogLy8gYEBDb21wb25lbnQudGVtcGxhdGVgLCB3aGljaCBhbGxvd3MgYHJlbmRlckNvbXBvbmVudGAgdG8gcHJvY2VlZCBpbiBhIHN5bmNocm9ub3VzIG1hbm5lci5cbiAqXG4gKiAvLyBVc2UgYnJvd3NlcidzIGBmZXRjaCgpYCBmdW5jdGlvbiBhcyB0aGUgZGVmYXVsdCByZXNvdXJjZSByZXNvbHV0aW9uIHN0cmF0ZWd5LlxuICogcmVzb2x2ZUNvbXBvbmVudFJlc291cmNlcyhmZXRjaCkudGhlbigoKSA9PiB7XG4gKiAgIC8vIEFmdGVyIHJlc29sdXRpb24gYWxsIFVSTHMgaGF2ZSBiZWVuIGNvbnZlcnRlZCBpbnRvIGB0ZW1wbGF0ZWAgc3RyaW5ncy5cbiAqICAgcmVuZGVyQ29tcG9uZW50KE15Q29tcG9uZW50KTtcbiAqIH0pO1xuICpcbiAqIGBgYFxuICpcbiAqIE5PVEU6IEluIEFPVCB0aGUgcmVzb2x1dGlvbiBoYXBwZW5zIGR1cmluZyBjb21waWxhdGlvbiwgYW5kIHNvIHRoZXJlIHNob3VsZCBiZSBubyBuZWVkXG4gKiB0byBjYWxsIHRoaXMgbWV0aG9kIG91dHNpZGUgSklUIG1vZGUuXG4gKlxuICogQHBhcmFtIHJlc291cmNlUmVzb2x2ZXIgYSBmdW5jdGlvbiB3aGljaCBpcyByZXNwb25zaWJsZSBmb3IgcmV0dXJuaW5nIGEgYFByb21pc2VgIHRvIHRoZVxuICogY29udGVudHMgb2YgdGhlIHJlc29sdmVkIFVSTC4gQnJvd3NlcidzIGBmZXRjaCgpYCBtZXRob2QgaXMgYSBnb29kIGRlZmF1bHQgaW1wbGVtZW50YXRpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlQ29tcG9uZW50UmVzb3VyY2VzKFxuICAgIHJlc291cmNlUmVzb2x2ZXI6ICh1cmw6IHN0cmluZykgPT4gKFByb21pc2U8c3RyaW5nfHt0ZXh0KCk6IFByb21pc2U8c3RyaW5nPn0+KSk6IFByb21pc2U8dm9pZD4ge1xuICAvLyBTdG9yZSBhbGwgcHJvbWlzZXMgd2hpY2ggYXJlIGZldGNoaW5nIHRoZSByZXNvdXJjZXMuXG4gIGNvbnN0IGNvbXBvbmVudFJlc29sdmVkOiBQcm9taXNlPHZvaWQ+W10gPSBbXTtcblxuICAvLyBDYWNoZSBzbyB0aGF0IHdlIGRvbid0IGZldGNoIHRoZSBzYW1lIHJlc291cmNlIG1vcmUgdGhhbiBvbmNlLlxuICBjb25zdCB1cmxNYXAgPSBuZXcgTWFwPHN0cmluZywgUHJvbWlzZTxzdHJpbmc+PigpO1xuICBmdW5jdGlvbiBjYWNoZWRSZXNvdXJjZVJlc29sdmUodXJsOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGxldCBwcm9taXNlID0gdXJsTWFwLmdldCh1cmwpO1xuICAgIGlmICghcHJvbWlzZSkge1xuICAgICAgY29uc3QgcmVzcCA9IHJlc291cmNlUmVzb2x2ZXIodXJsKTtcbiAgICAgIHVybE1hcC5zZXQodXJsLCBwcm9taXNlID0gcmVzcC50aGVuKHVud3JhcFJlc3BvbnNlKSk7XG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgY29tcG9uZW50UmVzb3VyY2VSZXNvbHV0aW9uUXVldWUuZm9yRWFjaCgoY29tcG9uZW50OiBDb21wb25lbnQsIHR5cGU6IFR5cGU8YW55PikgPT4ge1xuICAgIGNvbnN0IHByb21pc2VzOiBQcm9taXNlPHZvaWQ+W10gPSBbXTtcbiAgICBpZiAoY29tcG9uZW50LnRlbXBsYXRlVXJsKSB7XG4gICAgICBwcm9taXNlcy5wdXNoKGNhY2hlZFJlc291cmNlUmVzb2x2ZShjb21wb25lbnQudGVtcGxhdGVVcmwpLnRoZW4oKHRlbXBsYXRlKSA9PiB7XG4gICAgICAgIGNvbXBvbmVudC50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICAgICAgfSkpO1xuICAgIH1cbiAgICBjb25zdCBzdHlsZXMgPVxuICAgICAgICB0eXBlb2YgY29tcG9uZW50LnN0eWxlcyA9PT0gJ3N0cmluZycgPyBbY29tcG9uZW50LnN0eWxlc10gOiAoY29tcG9uZW50LnN0eWxlcyB8fCBbXSk7XG4gICAgY29tcG9uZW50LnN0eWxlcyA9IHN0eWxlcztcblxuICAgIGlmIChjb21wb25lbnQuc3R5bGVVcmwgJiYgY29tcG9uZW50LnN0eWxlVXJscz8ubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ0BDb21wb25lbnQgY2Fubm90IGRlZmluZSBib3RoIGBzdHlsZVVybGAgYW5kIGBzdHlsZVVybHNgLiAnICtcbiAgICAgICAgICAnVXNlIGBzdHlsZVVybGAgaWYgdGhlIGNvbXBvbmVudCBoYXMgb25lIHN0eWxlc2hlZXQsIG9yIGBzdHlsZVVybHNgIGlmIGl0IGhhcyBtdWx0aXBsZScpO1xuICAgIH0gZWxzZSBpZiAoY29tcG9uZW50LnN0eWxlVXJscz8ubGVuZ3RoKSB7XG4gICAgICBjb25zdCBzdHlsZU9mZnNldCA9IGNvbXBvbmVudC5zdHlsZXMubGVuZ3RoO1xuICAgICAgY29uc3Qgc3R5bGVVcmxzID0gY29tcG9uZW50LnN0eWxlVXJscztcbiAgICAgIGNvbXBvbmVudC5zdHlsZVVybHMuZm9yRWFjaCgoc3R5bGVVcmwsIGluZGV4KSA9PiB7XG4gICAgICAgIHN0eWxlcy5wdXNoKCcnKTsgIC8vIHByZS1hbGxvY2F0ZSBhcnJheS5cbiAgICAgICAgcHJvbWlzZXMucHVzaChjYWNoZWRSZXNvdXJjZVJlc29sdmUoc3R5bGVVcmwpLnRoZW4oKHN0eWxlKSA9PiB7XG4gICAgICAgICAgc3R5bGVzW3N0eWxlT2Zmc2V0ICsgaW5kZXhdID0gc3R5bGU7XG4gICAgICAgICAgc3R5bGVVcmxzLnNwbGljZShzdHlsZVVybHMuaW5kZXhPZihzdHlsZVVybCksIDEpO1xuICAgICAgICAgIGlmIChzdHlsZVVybHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIGNvbXBvbmVudC5zdHlsZVVybHMgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGNvbXBvbmVudC5zdHlsZVVybCkge1xuICAgICAgcHJvbWlzZXMucHVzaChjYWNoZWRSZXNvdXJjZVJlc29sdmUoY29tcG9uZW50LnN0eWxlVXJsKS50aGVuKChzdHlsZSkgPT4ge1xuICAgICAgICBzdHlsZXMucHVzaChzdHlsZSk7XG4gICAgICAgIGNvbXBvbmVudC5zdHlsZVVybCA9IHVuZGVmaW5lZDtcbiAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBjb25zdCBmdWxseVJlc29sdmVkID0gUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oKCkgPT4gY29tcG9uZW50RGVmUmVzb2x2ZWQodHlwZSkpO1xuICAgIGNvbXBvbmVudFJlc29sdmVkLnB1c2goZnVsbHlSZXNvbHZlZCk7XG4gIH0pO1xuICBjbGVhclJlc29sdXRpb25PZkNvbXBvbmVudFJlc291cmNlc1F1ZXVlKCk7XG4gIHJldHVybiBQcm9taXNlLmFsbChjb21wb25lbnRSZXNvbHZlZCkudGhlbigoKSA9PiB1bmRlZmluZWQpO1xufVxuXG5sZXQgY29tcG9uZW50UmVzb3VyY2VSZXNvbHV0aW9uUXVldWUgPSBuZXcgTWFwPFR5cGU8YW55PiwgQ29tcG9uZW50PigpO1xuXG4vLyBUcmFjayB3aGVuIGV4aXN0aW5nIMm1Y21wIGZvciBhIFR5cGUgaXMgd2FpdGluZyBvbiByZXNvdXJjZXMuXG5jb25zdCBjb21wb25lbnREZWZQZW5kaW5nUmVzb2x1dGlvbiA9IG5ldyBTZXQ8VHlwZTxhbnk+PigpO1xuXG5leHBvcnQgZnVuY3Rpb24gbWF5YmVRdWV1ZVJlc29sdXRpb25PZkNvbXBvbmVudFJlc291cmNlcyh0eXBlOiBUeXBlPGFueT4sIG1ldGFkYXRhOiBDb21wb25lbnQpIHtcbiAgaWYgKGNvbXBvbmVudE5lZWRzUmVzb2x1dGlvbihtZXRhZGF0YSkpIHtcbiAgICBjb21wb25lbnRSZXNvdXJjZVJlc29sdXRpb25RdWV1ZS5zZXQodHlwZSwgbWV0YWRhdGEpO1xuICAgIGNvbXBvbmVudERlZlBlbmRpbmdSZXNvbHV0aW9uLmFkZCh0eXBlKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNDb21wb25lbnREZWZQZW5kaW5nUmVzb2x1dGlvbih0eXBlOiBUeXBlPGFueT4pOiBib29sZWFuIHtcbiAgcmV0dXJuIGNvbXBvbmVudERlZlBlbmRpbmdSZXNvbHV0aW9uLmhhcyh0eXBlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBvbmVudE5lZWRzUmVzb2x1dGlvbihjb21wb25lbnQ6IENvbXBvbmVudCk6IGJvb2xlYW4ge1xuICByZXR1cm4gISEoXG4gICAgICAoY29tcG9uZW50LnRlbXBsYXRlVXJsICYmICFjb21wb25lbnQuaGFzT3duUHJvcGVydHkoJ3RlbXBsYXRlJykpIHx8XG4gICAgICAoY29tcG9uZW50LnN0eWxlVXJscyAmJiBjb21wb25lbnQuc3R5bGVVcmxzLmxlbmd0aCkgfHwgY29tcG9uZW50LnN0eWxlVXJsKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjbGVhclJlc29sdXRpb25PZkNvbXBvbmVudFJlc291cmNlc1F1ZXVlKCk6IE1hcDxUeXBlPGFueT4sIENvbXBvbmVudD4ge1xuICBjb25zdCBvbGQgPSBjb21wb25lbnRSZXNvdXJjZVJlc29sdXRpb25RdWV1ZTtcbiAgY29tcG9uZW50UmVzb3VyY2VSZXNvbHV0aW9uUXVldWUgPSBuZXcgTWFwKCk7XG4gIHJldHVybiBvbGQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXN0b3JlQ29tcG9uZW50UmVzb2x1dGlvblF1ZXVlKHF1ZXVlOiBNYXA8VHlwZTxhbnk+LCBDb21wb25lbnQ+KTogdm9pZCB7XG4gIGNvbXBvbmVudERlZlBlbmRpbmdSZXNvbHV0aW9uLmNsZWFyKCk7XG4gIHF1ZXVlLmZvckVhY2goKF8sIHR5cGUpID0+IGNvbXBvbmVudERlZlBlbmRpbmdSZXNvbHV0aW9uLmFkZCh0eXBlKSk7XG4gIGNvbXBvbmVudFJlc291cmNlUmVzb2x1dGlvblF1ZXVlID0gcXVldWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvbXBvbmVudFJlc291cmNlUmVzb2x1dGlvblF1ZXVlRW1wdHkoKSB7XG4gIHJldHVybiBjb21wb25lbnRSZXNvdXJjZVJlc29sdXRpb25RdWV1ZS5zaXplID09PSAwO1xufVxuXG5mdW5jdGlvbiB1bndyYXBSZXNwb25zZShyZXNwb25zZTogc3RyaW5nfHt0ZXh0KCk6IFByb21pc2U8c3RyaW5nPn0pOiBzdHJpbmd8UHJvbWlzZTxzdHJpbmc+IHtcbiAgcmV0dXJuIHR5cGVvZiByZXNwb25zZSA9PSAnc3RyaW5nJyA/IHJlc3BvbnNlIDogcmVzcG9uc2UudGV4dCgpO1xufVxuXG5mdW5jdGlvbiBjb21wb25lbnREZWZSZXNvbHZlZCh0eXBlOiBUeXBlPGFueT4pOiB2b2lkIHtcbiAgY29tcG9uZW50RGVmUGVuZGluZ1Jlc29sdXRpb24uZGVsZXRlKHR5cGUpO1xufVxuIl19