/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export { ɵIMAGE_CONFIG as IMAGE_CONFIG } from '@angular/core';
// These exports represent the set of symbols exposed as a public API.
export { provideCloudflareLoader } from './image_loaders/cloudflare_loader';
export { provideCloudinaryLoader } from './image_loaders/cloudinary_loader';
export { IMAGE_LOADER } from './image_loaders/image_loader';
export { provideImageKitLoader } from './image_loaders/imagekit_loader';
export { provideImgixLoader } from './image_loaders/imgix_loader';
export { provideNetlifyLoader } from './image_loaders/netlify_loader';
export { NgOptimizedImage } from './ng_optimized_image';
export { PRECONNECT_CHECK_BLOCKLIST } from './preconnect_link_checker';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vc3JjL2RpcmVjdGl2ZXMvbmdfb3B0aW1pemVkX2ltYWdlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxhQUFhLElBQUksWUFBWSxFQUE4QixNQUFNLGVBQWUsQ0FBQztBQUN6RixzRUFBc0U7QUFDdEUsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sbUNBQW1DLENBQUM7QUFDMUUsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sbUNBQW1DLENBQUM7QUFDMUUsT0FBTyxFQUFDLFlBQVksRUFBaUMsTUFBTSw4QkFBOEIsQ0FBQztBQUMxRixPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxpQ0FBaUMsQ0FBQztBQUN0RSxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSw4QkFBOEIsQ0FBQztBQUNoRSxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNwRSxPQUFPLEVBQXlCLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDOUUsT0FBTyxFQUFDLDBCQUEwQixFQUFDLE1BQU0sMkJBQTJCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuZXhwb3J0IHvJtUlNQUdFX0NPTkZJRyBhcyBJTUFHRV9DT05GSUcsIMm1SW1hZ2VDb25maWcgYXMgSW1hZ2VDb25maWd9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuLy8gVGhlc2UgZXhwb3J0cyByZXByZXNlbnQgdGhlIHNldCBvZiBzeW1ib2xzIGV4cG9zZWQgYXMgYSBwdWJsaWMgQVBJLlxuZXhwb3J0IHtwcm92aWRlQ2xvdWRmbGFyZUxvYWRlcn0gZnJvbSAnLi9pbWFnZV9sb2FkZXJzL2Nsb3VkZmxhcmVfbG9hZGVyJztcbmV4cG9ydCB7cHJvdmlkZUNsb3VkaW5hcnlMb2FkZXJ9IGZyb20gJy4vaW1hZ2VfbG9hZGVycy9jbG91ZGluYXJ5X2xvYWRlcic7XG5leHBvcnQge0lNQUdFX0xPQURFUiwgSW1hZ2VMb2FkZXIsIEltYWdlTG9hZGVyQ29uZmlnfSBmcm9tICcuL2ltYWdlX2xvYWRlcnMvaW1hZ2VfbG9hZGVyJztcbmV4cG9ydCB7cHJvdmlkZUltYWdlS2l0TG9hZGVyfSBmcm9tICcuL2ltYWdlX2xvYWRlcnMvaW1hZ2VraXRfbG9hZGVyJztcbmV4cG9ydCB7cHJvdmlkZUltZ2l4TG9hZGVyfSBmcm9tICcuL2ltYWdlX2xvYWRlcnMvaW1naXhfbG9hZGVyJztcbmV4cG9ydCB7cHJvdmlkZU5ldGxpZnlMb2FkZXJ9IGZyb20gJy4vaW1hZ2VfbG9hZGVycy9uZXRsaWZ5X2xvYWRlcic7XG5leHBvcnQge0ltYWdlUGxhY2Vob2xkZXJDb25maWcsIE5nT3B0aW1pemVkSW1hZ2V9IGZyb20gJy4vbmdfb3B0aW1pemVkX2ltYWdlJztcbmV4cG9ydCB7UFJFQ09OTkVDVF9DSEVDS19CTE9DS0xJU1R9IGZyb20gJy4vcHJlY29ubmVjdF9saW5rX2NoZWNrZXInO1xuIl19