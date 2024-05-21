/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NavigationCancellationCode } from './events';
import { isUrlTree } from './url_tree';
export const NAVIGATION_CANCELING_ERROR = 'ngNavigationCancelingError';
export function redirectingNavigationError(urlSerializer, redirect) {
    const { redirectTo, navigationBehaviorOptions } = isUrlTree(redirect)
        ? { redirectTo: redirect, navigationBehaviorOptions: undefined }
        : redirect;
    const error = navigationCancelingError(ngDevMode && `Redirecting to "${urlSerializer.serialize(redirectTo)}"`, NavigationCancellationCode.Redirect);
    error.url = redirectTo;
    error.navigationBehaviorOptions = navigationBehaviorOptions;
    return error;
}
export function navigationCancelingError(message, code) {
    const error = new Error(`NavigationCancelingError: ${message || ''}`);
    error[NAVIGATION_CANCELING_ERROR] = true;
    error.cancellationCode = code;
    return error;
}
export function isRedirectingNavigationCancelingError(error) {
    return (isNavigationCancelingError(error) &&
        isUrlTree(error.url));
}
export function isNavigationCancelingError(error) {
    return !!error && error[NAVIGATION_CANCELING_ERROR];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2aWdhdGlvbl9jYW5jZWxpbmdfZXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9yb3V0ZXIvc3JjL25hdmlnYXRpb25fY2FuY2VsaW5nX2Vycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUVwRCxPQUFPLEVBQUMsU0FBUyxFQUF5QixNQUFNLFlBQVksQ0FBQztBQUU3RCxNQUFNLENBQUMsTUFBTSwwQkFBMEIsR0FBRyw0QkFBNEIsQ0FBQztBQVl2RSxNQUFNLFVBQVUsMEJBQTBCLENBQ3hDLGFBQTRCLEVBQzVCLFFBQWlCO0lBRWpCLE1BQU0sRUFBQyxVQUFVLEVBQUUseUJBQXlCLEVBQUMsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDO1FBQ2pFLENBQUMsQ0FBQyxFQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUseUJBQXlCLEVBQUUsU0FBUyxFQUFDO1FBQzlELENBQUMsQ0FBQyxRQUFRLENBQUM7SUFDYixNQUFNLEtBQUssR0FBRyx3QkFBd0IsQ0FDcEMsU0FBUyxJQUFJLG1CQUFtQixhQUFhLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQ3RFLDBCQUEwQixDQUFDLFFBQVEsQ0FDRyxDQUFDO0lBQ3pDLEtBQUssQ0FBQyxHQUFHLEdBQUcsVUFBVSxDQUFDO0lBQ3ZCLEtBQUssQ0FBQyx5QkFBeUIsR0FBRyx5QkFBeUIsQ0FBQztJQUM1RCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUFFRCxNQUFNLFVBQVUsd0JBQXdCLENBQ3RDLE9BQThCLEVBQzlCLElBQWdDO0lBRWhDLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLDZCQUE2QixPQUFPLElBQUksRUFBRSxFQUFFLENBQTZCLENBQUM7SUFDbEcsS0FBSyxDQUFDLDBCQUEwQixDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ3pDLEtBQUssQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7SUFDOUIsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBRUQsTUFBTSxVQUFVLHFDQUFxQyxDQUNuRCxLQUFvRDtJQUVwRCxPQUFPLENBQ0wsMEJBQTBCLENBQUMsS0FBSyxDQUFDO1FBQ2pDLFNBQVMsQ0FBRSxLQUE2QyxDQUFDLEdBQUcsQ0FBQyxDQUM5RCxDQUFDO0FBQ0osQ0FBQztBQUVELE1BQU0sVUFBVSwwQkFBMEIsQ0FBQyxLQUFjO0lBQ3ZELE9BQU8sQ0FBQyxDQUFDLEtBQUssSUFBSyxLQUFrQyxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFDcEYsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge05hdmlnYXRpb25DYW5jZWxsYXRpb25Db2RlfSBmcm9tICcuL2V2ZW50cyc7XG5pbXBvcnQge05hdmlnYXRpb25CZWhhdmlvck9wdGlvbnN9IGZyb20gJy4vbW9kZWxzJztcbmltcG9ydCB7aXNVcmxUcmVlLCBVcmxTZXJpYWxpemVyLCBVcmxUcmVlfSBmcm9tICcuL3VybF90cmVlJztcblxuZXhwb3J0IGNvbnN0IE5BVklHQVRJT05fQ0FOQ0VMSU5HX0VSUk9SID0gJ25nTmF2aWdhdGlvbkNhbmNlbGluZ0Vycm9yJztcblxuZXhwb3J0IHR5cGUgTmF2aWdhdGlvbkNhbmNlbGluZ0Vycm9yID0gRXJyb3IgJiB7XG4gIFtOQVZJR0FUSU9OX0NBTkNFTElOR19FUlJPUl06IHRydWU7XG4gIGNhbmNlbGxhdGlvbkNvZGU6IE5hdmlnYXRpb25DYW5jZWxsYXRpb25Db2RlO1xufTtcbmV4cG9ydCB0eXBlIFJlZGlyZWN0aW5nTmF2aWdhdGlvbkNhbmNlbGluZ0Vycm9yID0gTmF2aWdhdGlvbkNhbmNlbGluZ0Vycm9yICYge1xuICB1cmw6IFVybFRyZWU7XG4gIG5hdmlnYXRpb25CZWhhdmlvck9wdGlvbnM/OiBOYXZpZ2F0aW9uQmVoYXZpb3JPcHRpb25zO1xuICBjYW5jZWxsYXRpb25Db2RlOiBOYXZpZ2F0aW9uQ2FuY2VsbGF0aW9uQ29kZS5SZWRpcmVjdDtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiByZWRpcmVjdGluZ05hdmlnYXRpb25FcnJvcihcbiAgdXJsU2VyaWFsaXplcjogVXJsU2VyaWFsaXplcixcbiAgcmVkaXJlY3Q6IFVybFRyZWUsXG4pOiBSZWRpcmVjdGluZ05hdmlnYXRpb25DYW5jZWxpbmdFcnJvciB7XG4gIGNvbnN0IHtyZWRpcmVjdFRvLCBuYXZpZ2F0aW9uQmVoYXZpb3JPcHRpb25zfSA9IGlzVXJsVHJlZShyZWRpcmVjdClcbiAgICA/IHtyZWRpcmVjdFRvOiByZWRpcmVjdCwgbmF2aWdhdGlvbkJlaGF2aW9yT3B0aW9uczogdW5kZWZpbmVkfVxuICAgIDogcmVkaXJlY3Q7XG4gIGNvbnN0IGVycm9yID0gbmF2aWdhdGlvbkNhbmNlbGluZ0Vycm9yKFxuICAgIG5nRGV2TW9kZSAmJiBgUmVkaXJlY3RpbmcgdG8gXCIke3VybFNlcmlhbGl6ZXIuc2VyaWFsaXplKHJlZGlyZWN0VG8pfVwiYCxcbiAgICBOYXZpZ2F0aW9uQ2FuY2VsbGF0aW9uQ29kZS5SZWRpcmVjdCxcbiAgKSBhcyBSZWRpcmVjdGluZ05hdmlnYXRpb25DYW5jZWxpbmdFcnJvcjtcbiAgZXJyb3IudXJsID0gcmVkaXJlY3RUbztcbiAgZXJyb3IubmF2aWdhdGlvbkJlaGF2aW9yT3B0aW9ucyA9IG5hdmlnYXRpb25CZWhhdmlvck9wdGlvbnM7XG4gIHJldHVybiBlcnJvcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5hdmlnYXRpb25DYW5jZWxpbmdFcnJvcihcbiAgbWVzc2FnZTogc3RyaW5nIHwgbnVsbCB8IGZhbHNlLFxuICBjb2RlOiBOYXZpZ2F0aW9uQ2FuY2VsbGF0aW9uQ29kZSxcbikge1xuICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcihgTmF2aWdhdGlvbkNhbmNlbGluZ0Vycm9yOiAke21lc3NhZ2UgfHwgJyd9YCkgYXMgTmF2aWdhdGlvbkNhbmNlbGluZ0Vycm9yO1xuICBlcnJvcltOQVZJR0FUSU9OX0NBTkNFTElOR19FUlJPUl0gPSB0cnVlO1xuICBlcnJvci5jYW5jZWxsYXRpb25Db2RlID0gY29kZTtcbiAgcmV0dXJuIGVycm9yO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNSZWRpcmVjdGluZ05hdmlnYXRpb25DYW5jZWxpbmdFcnJvcihcbiAgZXJyb3I6IHVua25vd24gfCBSZWRpcmVjdGluZ05hdmlnYXRpb25DYW5jZWxpbmdFcnJvcixcbik6IGVycm9yIGlzIFJlZGlyZWN0aW5nTmF2aWdhdGlvbkNhbmNlbGluZ0Vycm9yIHtcbiAgcmV0dXJuIChcbiAgICBpc05hdmlnYXRpb25DYW5jZWxpbmdFcnJvcihlcnJvcikgJiZcbiAgICBpc1VybFRyZWUoKGVycm9yIGFzIFJlZGlyZWN0aW5nTmF2aWdhdGlvbkNhbmNlbGluZ0Vycm9yKS51cmwpXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc05hdmlnYXRpb25DYW5jZWxpbmdFcnJvcihlcnJvcjogdW5rbm93bik6IGVycm9yIGlzIE5hdmlnYXRpb25DYW5jZWxpbmdFcnJvciB7XG4gIHJldHVybiAhIWVycm9yICYmIChlcnJvciBhcyBOYXZpZ2F0aW9uQ2FuY2VsaW5nRXJyb3IpW05BVklHQVRJT05fQ0FOQ0VMSU5HX0VSUk9SXTtcbn1cbiJdfQ==