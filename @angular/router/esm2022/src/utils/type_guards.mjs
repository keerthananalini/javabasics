/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { EmptyError } from 'rxjs';
/**
 * Simple function check, but generic so type inference will flow. Example:
 *
 * function product(a: number, b: number) {
 *   return a * b;
 * }
 *
 * if (isFunction<product>(fn)) {
 *   return fn(1, 2);
 * } else {
 *   throw "Must provide the `product` function";
 * }
 */
export function isFunction(v) {
    return typeof v === 'function';
}
export function isBoolean(v) {
    return typeof v === 'boolean';
}
export function isCanLoad(guard) {
    return guard && isFunction(guard.canLoad);
}
export function isCanActivate(guard) {
    return guard && isFunction(guard.canActivate);
}
export function isCanActivateChild(guard) {
    return guard && isFunction(guard.canActivateChild);
}
export function isCanDeactivate(guard) {
    return guard && isFunction(guard.canDeactivate);
}
export function isCanMatch(guard) {
    return guard && isFunction(guard.canMatch);
}
export function isEmptyError(e) {
    return e instanceof EmptyError || e?.name === 'EmptyError';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZV9ndWFyZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9yb3V0ZXIvc3JjL3V0aWxzL3R5cGVfZ3VhcmRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFVaEM7Ozs7Ozs7Ozs7OztHQVlHO0FBQ0gsTUFBTSxVQUFVLFVBQVUsQ0FBSSxDQUFNO0lBQ2xDLE9BQU8sT0FBTyxDQUFDLEtBQUssVUFBVSxDQUFDO0FBQ2pDLENBQUM7QUFFRCxNQUFNLFVBQVUsU0FBUyxDQUFDLENBQU07SUFDOUIsT0FBTyxPQUFPLENBQUMsS0FBSyxTQUFTLENBQUM7QUFDaEMsQ0FBQztBQUVELE1BQU0sVUFBVSxTQUFTLENBQUMsS0FBVTtJQUNsQyxPQUFPLEtBQUssSUFBSSxVQUFVLENBQVksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3ZELENBQUM7QUFFRCxNQUFNLFVBQVUsYUFBYSxDQUFDLEtBQVU7SUFDdEMsT0FBTyxLQUFLLElBQUksVUFBVSxDQUFnQixLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDL0QsQ0FBQztBQUVELE1BQU0sVUFBVSxrQkFBa0IsQ0FBQyxLQUFVO0lBQzNDLE9BQU8sS0FBSyxJQUFJLFVBQVUsQ0FBcUIsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDekUsQ0FBQztBQUVELE1BQU0sVUFBVSxlQUFlLENBQUksS0FBVTtJQUMzQyxPQUFPLEtBQUssSUFBSSxVQUFVLENBQXFCLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUN0RSxDQUFDO0FBQ0QsTUFBTSxVQUFVLFVBQVUsQ0FBQyxLQUFVO0lBQ25DLE9BQU8sS0FBSyxJQUFJLFVBQVUsQ0FBYSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDekQsQ0FBQztBQUVELE1BQU0sVUFBVSxZQUFZLENBQUMsQ0FBUTtJQUNuQyxPQUFPLENBQUMsWUFBWSxVQUFVLElBQUksQ0FBQyxFQUFFLElBQUksS0FBSyxZQUFZLENBQUM7QUFDN0QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0VtcHR5RXJyb3J9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQge0NhbkFjdGl2YXRlQ2hpbGRGbiwgQ2FuQWN0aXZhdGVGbiwgQ2FuRGVhY3RpdmF0ZUZuLCBDYW5Mb2FkRm4sIENhbk1hdGNoRm59IGZyb20gJy4uL21vZGVscyc7XG5pbXBvcnQge1xuICBOQVZJR0FUSU9OX0NBTkNFTElOR19FUlJPUixcbiAgTmF2aWdhdGlvbkNhbmNlbGluZ0Vycm9yLFxuICBSZWRpcmVjdGluZ05hdmlnYXRpb25DYW5jZWxpbmdFcnJvcixcbn0gZnJvbSAnLi4vbmF2aWdhdGlvbl9jYW5jZWxpbmdfZXJyb3InO1xuaW1wb3J0IHtpc1VybFRyZWV9IGZyb20gJy4uL3VybF90cmVlJztcblxuLyoqXG4gKiBTaW1wbGUgZnVuY3Rpb24gY2hlY2ssIGJ1dCBnZW5lcmljIHNvIHR5cGUgaW5mZXJlbmNlIHdpbGwgZmxvdy4gRXhhbXBsZTpcbiAqXG4gKiBmdW5jdGlvbiBwcm9kdWN0KGE6IG51bWJlciwgYjogbnVtYmVyKSB7XG4gKiAgIHJldHVybiBhICogYjtcbiAqIH1cbiAqXG4gKiBpZiAoaXNGdW5jdGlvbjxwcm9kdWN0PihmbikpIHtcbiAqICAgcmV0dXJuIGZuKDEsIDIpO1xuICogfSBlbHNlIHtcbiAqICAgdGhyb3cgXCJNdXN0IHByb3ZpZGUgdGhlIGBwcm9kdWN0YCBmdW5jdGlvblwiO1xuICogfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNGdW5jdGlvbjxUPih2OiBhbnkpOiB2IGlzIFQge1xuICByZXR1cm4gdHlwZW9mIHYgPT09ICdmdW5jdGlvbic7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Jvb2xlYW4odjogYW55KTogdiBpcyBib29sZWFuIHtcbiAgcmV0dXJuIHR5cGVvZiB2ID09PSAnYm9vbGVhbic7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NhbkxvYWQoZ3VhcmQ6IGFueSk6IGd1YXJkIGlzIHtjYW5Mb2FkOiBDYW5Mb2FkRm59IHtcbiAgcmV0dXJuIGd1YXJkICYmIGlzRnVuY3Rpb248Q2FuTG9hZEZuPihndWFyZC5jYW5Mb2FkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQ2FuQWN0aXZhdGUoZ3VhcmQ6IGFueSk6IGd1YXJkIGlzIHtjYW5BY3RpdmF0ZTogQ2FuQWN0aXZhdGVGbn0ge1xuICByZXR1cm4gZ3VhcmQgJiYgaXNGdW5jdGlvbjxDYW5BY3RpdmF0ZUZuPihndWFyZC5jYW5BY3RpdmF0ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NhbkFjdGl2YXRlQ2hpbGQoZ3VhcmQ6IGFueSk6IGd1YXJkIGlzIHtjYW5BY3RpdmF0ZUNoaWxkOiBDYW5BY3RpdmF0ZUNoaWxkRm59IHtcbiAgcmV0dXJuIGd1YXJkICYmIGlzRnVuY3Rpb248Q2FuQWN0aXZhdGVDaGlsZEZuPihndWFyZC5jYW5BY3RpdmF0ZUNoaWxkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQ2FuRGVhY3RpdmF0ZTxUPihndWFyZDogYW55KTogZ3VhcmQgaXMge2NhbkRlYWN0aXZhdGU6IENhbkRlYWN0aXZhdGVGbjxUPn0ge1xuICByZXR1cm4gZ3VhcmQgJiYgaXNGdW5jdGlvbjxDYW5EZWFjdGl2YXRlRm48VD4+KGd1YXJkLmNhbkRlYWN0aXZhdGUpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzQ2FuTWF0Y2goZ3VhcmQ6IGFueSk6IGd1YXJkIGlzIHtjYW5NYXRjaDogQ2FuTWF0Y2hGbn0ge1xuICByZXR1cm4gZ3VhcmQgJiYgaXNGdW5jdGlvbjxDYW5NYXRjaEZuPihndWFyZC5jYW5NYXRjaCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0VtcHR5RXJyb3IoZTogRXJyb3IpOiBlIGlzIEVtcHR5RXJyb3Ige1xuICByZXR1cm4gZSBpbnN0YW5jZW9mIEVtcHR5RXJyb3IgfHwgZT8ubmFtZSA9PT0gJ0VtcHR5RXJyb3InO1xufVxuIl19