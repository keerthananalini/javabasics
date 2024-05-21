/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { OpKind } from '../enums';
/**
 * Create a `StatementOp`.
 */
export function createStatementOp(statement) {
    return {
        kind: OpKind.Statement,
        statement,
        ...NEW_OP,
    };
}
/**
 * Create a `VariableOp`.
 */
export function createVariableOp(xref, variable, initializer, flags) {
    return {
        kind: OpKind.Variable,
        xref,
        variable,
        initializer,
        flags,
        ...NEW_OP,
    };
}
/**
 * Static structure shared by all operations.
 *
 * Used as a convenience via the spread operator (`...NEW_OP`) when creating new operations, and
 * ensures the fields are always in the same order.
 */
export const NEW_OP = {
    debugListId: null,
    prev: null,
    next: null,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL3RlbXBsYXRlL3BpcGVsaW5lL2lyL3NyYy9vcHMvc2hhcmVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUdILE9BQU8sRUFBQyxNQUFNLEVBQWdCLE1BQU0sVUFBVSxDQUFDO0FBNEIvQzs7R0FFRztBQUNILE1BQU0sVUFBVSxpQkFBaUIsQ0FBc0IsU0FBc0I7SUFDM0UsT0FBTztRQUNMLElBQUksRUFBRSxNQUFNLENBQUMsU0FBUztRQUN0QixTQUFTO1FBQ1QsR0FBRyxNQUFNO0tBQ1YsQ0FBQztBQUNKLENBQUM7QUE0QkQ7O0dBRUc7QUFDSCxNQUFNLFVBQVUsZ0JBQWdCLENBQzVCLElBQVksRUFBRSxRQUEwQixFQUFFLFdBQXlCLEVBQ25FLEtBQW9CO0lBQ3RCLE9BQU87UUFDTCxJQUFJLEVBQUUsTUFBTSxDQUFDLFFBQVE7UUFDckIsSUFBSTtRQUNKLFFBQVE7UUFDUixXQUFXO1FBQ1gsS0FBSztRQUNMLEdBQUcsTUFBTTtLQUNWLENBQUM7QUFDSixDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxNQUFNLENBQUMsTUFBTSxNQUFNLEdBQStDO0lBQ2hFLFdBQVcsRUFBRSxJQUFJO0lBQ2pCLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7Q0FDWCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCAqIGFzIG8gZnJvbSAnLi4vLi4vLi4vLi4vLi4vb3V0cHV0L291dHB1dF9hc3QnO1xuaW1wb3J0IHtPcEtpbmQsIFZhcmlhYmxlRmxhZ3N9IGZyb20gJy4uL2VudW1zJztcbmltcG9ydCB7T3AsIFhyZWZJZH0gZnJvbSAnLi4vb3BlcmF0aW9ucyc7XG5pbXBvcnQge1NlbWFudGljVmFyaWFibGV9IGZyb20gJy4uL3ZhcmlhYmxlJztcblxuLyoqXG4gKiBBIHNwZWNpYWwgYE9wYCB3aGljaCBpcyB1c2VkIGludGVybmFsbHkgaW4gdGhlIGBPcExpc3RgIGxpbmtlZCBsaXN0IHRvIHJlcHJlc2VudCB0aGUgaGVhZCBhbmRcbiAqIHRhaWwgbm9kZXMgb2YgdGhlIGxpc3QuXG4gKlxuICogYExpc3RFbmRPcGAgaXMgY3JlYXRlZCBpbnRlcm5hbGx5IGluIHRoZSBgT3BMaXN0YCBhbmQgc2hvdWxkIG5vdCBiZSBpbnN0YW50aWF0ZWQgZGlyZWN0bHkuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTGlzdEVuZE9wPE9wVCBleHRlbmRzIE9wPE9wVD4+IGV4dGVuZHMgT3A8T3BUPiB7XG4gIGtpbmQ6IE9wS2luZC5MaXN0RW5kO1xufVxuXG4vKipcbiAqIEFuIGBPcGAgd2hpY2ggZGlyZWN0bHkgd3JhcHMgYW4gb3V0cHV0IGBTdGF0ZW1lbnRgLlxuICpcbiAqIE9mdGVuIGBTdGF0ZW1lbnRPcGBzIGFyZSB0aGUgZmluYWwgcmVzdWx0IG9mIElSIHByb2Nlc3NpbmcuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU3RhdGVtZW50T3A8T3BUIGV4dGVuZHMgT3A8T3BUPj4gZXh0ZW5kcyBPcDxPcFQ+IHtcbiAga2luZDogT3BLaW5kLlN0YXRlbWVudDtcblxuICAvKipcbiAgICogVGhlIG91dHB1dCBzdGF0ZW1lbnQuXG4gICAqL1xuICBzdGF0ZW1lbnQ6IG8uU3RhdGVtZW50O1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIGBTdGF0ZW1lbnRPcGAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTdGF0ZW1lbnRPcDxPcFQgZXh0ZW5kcyBPcDxPcFQ+PihzdGF0ZW1lbnQ6IG8uU3RhdGVtZW50KTogU3RhdGVtZW50T3A8T3BUPiB7XG4gIHJldHVybiB7XG4gICAga2luZDogT3BLaW5kLlN0YXRlbWVudCxcbiAgICBzdGF0ZW1lbnQsXG4gICAgLi4uTkVXX09QLFxuICB9O1xufVxuXG4vKipcbiAqIE9wZXJhdGlvbiB3aGljaCBkZWNsYXJlcyBhbmQgaW5pdGlhbGl6ZXMgYSBgU2VtYW50aWNWYXJpYWJsZWAsIHRoYXQgaXMgdmFsaWQgZWl0aGVyIGluIGNyZWF0ZSBvclxuICogdXBkYXRlIElSLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFZhcmlhYmxlT3A8T3BUIGV4dGVuZHMgT3A8T3BUPj4gZXh0ZW5kcyBPcDxPcFQ+IHtcbiAga2luZDogT3BLaW5kLlZhcmlhYmxlO1xuXG4gIC8qKlxuICAgKiBgWHJlZklkYCB3aGljaCBpZGVudGlmaWVzIHRoaXMgc3BlY2lmaWMgdmFyaWFibGUsIGFuZCBpcyB1c2VkIHRvIHJlZmVyZW5jZSB0aGlzIHZhcmlhYmxlIGZyb21cbiAgICogb3RoZXIgcGFydHMgb2YgdGhlIElSLlxuICAgKi9cbiAgeHJlZjogWHJlZklkO1xuXG4gIC8qKlxuICAgKiBUaGUgYFNlbWFudGljVmFyaWFibGVgIHdoaWNoIGRlc2NyaWJlcyB0aGUgbWVhbmluZyBiZWhpbmQgdGhpcyB2YXJpYWJsZS5cbiAgICovXG4gIHZhcmlhYmxlOiBTZW1hbnRpY1ZhcmlhYmxlO1xuXG4gIC8qKlxuICAgKiBFeHByZXNzaW9uIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhlIHZhcmlhYmxlLlxuICAgKi9cbiAgaW5pdGlhbGl6ZXI6IG8uRXhwcmVzc2lvbjtcblxuICBmbGFnczogVmFyaWFibGVGbGFncztcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBgVmFyaWFibGVPcGAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVWYXJpYWJsZU9wPE9wVCBleHRlbmRzIE9wPE9wVD4+KFxuICAgIHhyZWY6IFhyZWZJZCwgdmFyaWFibGU6IFNlbWFudGljVmFyaWFibGUsIGluaXRpYWxpemVyOiBvLkV4cHJlc3Npb24sXG4gICAgZmxhZ3M6IFZhcmlhYmxlRmxhZ3MpOiBWYXJpYWJsZU9wPE9wVD4ge1xuICByZXR1cm4ge1xuICAgIGtpbmQ6IE9wS2luZC5WYXJpYWJsZSxcbiAgICB4cmVmLFxuICAgIHZhcmlhYmxlLFxuICAgIGluaXRpYWxpemVyLFxuICAgIGZsYWdzLFxuICAgIC4uLk5FV19PUCxcbiAgfTtcbn1cblxuLyoqXG4gKiBTdGF0aWMgc3RydWN0dXJlIHNoYXJlZCBieSBhbGwgb3BlcmF0aW9ucy5cbiAqXG4gKiBVc2VkIGFzIGEgY29udmVuaWVuY2UgdmlhIHRoZSBzcHJlYWQgb3BlcmF0b3IgKGAuLi5ORVdfT1BgKSB3aGVuIGNyZWF0aW5nIG5ldyBvcGVyYXRpb25zLCBhbmRcbiAqIGVuc3VyZXMgdGhlIGZpZWxkcyBhcmUgYWx3YXlzIGluIHRoZSBzYW1lIG9yZGVyLlxuICovXG5leHBvcnQgY29uc3QgTkVXX09QOiBQaWNrPE9wPGFueT4sICdkZWJ1Z0xpc3RJZCd8J3ByZXYnfCduZXh0Jz4gPSB7XG4gIGRlYnVnTGlzdElkOiBudWxsLFxuICBwcmV2OiBudWxsLFxuICBuZXh0OiBudWxsLFxufTtcbiJdfQ==