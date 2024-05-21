/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Decorates the directive definition with support for input transform functions.
 *
 * If the directive uses inheritance, the feature should be included before the
 * `InheritDefinitionFeature` to ensure that the `inputTransforms` field is populated.
 *
 * @codeGenApi
 */
export function ɵɵInputTransformsFeature(definition) {
    const inputs = definition.inputConfig;
    const inputTransforms = {};
    for (const minifiedKey in inputs) {
        if (inputs.hasOwnProperty(minifiedKey)) {
            // Note: the private names are used for the keys, rather than the public ones, because public
            // names can be re-aliased in host directives which would invalidate the lookup.
            const value = inputs[minifiedKey];
            if (Array.isArray(value) && value[3]) {
                inputTransforms[minifiedKey] = value[3];
            }
        }
    }
    definition.inputTransforms = inputTransforms;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXRfdHJhbnNmb3Jtc19mZWF0dXJlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvcmVuZGVyMy9mZWF0dXJlcy9pbnB1dF90cmFuc2Zvcm1zX2ZlYXR1cmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBS0g7Ozs7Ozs7R0FPRztBQUNILE1BQU0sVUFBVSx3QkFBd0IsQ0FBSSxVQUEyQjtJQUNyRSxNQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDO0lBQ3RDLE1BQU0sZUFBZSxHQUEyQyxFQUFFLENBQUM7SUFFbkUsS0FBSyxNQUFNLFdBQVcsSUFBSSxNQUFNLEVBQUUsQ0FBQztRQUNqQyxJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQztZQUN2Qyw2RkFBNkY7WUFDN0YsZ0ZBQWdGO1lBQ2hGLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNsQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7Z0JBQ3JDLGVBQWUsQ0FBQyxXQUFXLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUMsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBRUEsVUFBMEQsQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDO0FBQ2hHLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtNdXRhYmxlfSBmcm9tICcuLi8uLi9pbnRlcmZhY2UvdHlwZSc7XG5pbXBvcnQge0RpcmVjdGl2ZURlZiwgSW5wdXRUcmFuc2Zvcm1GdW5jdGlvbn0gZnJvbSAnLi4vaW50ZXJmYWNlcy9kZWZpbml0aW9uJztcblxuLyoqXG4gKiBEZWNvcmF0ZXMgdGhlIGRpcmVjdGl2ZSBkZWZpbml0aW9uIHdpdGggc3VwcG9ydCBmb3IgaW5wdXQgdHJhbnNmb3JtIGZ1bmN0aW9ucy5cbiAqXG4gKiBJZiB0aGUgZGlyZWN0aXZlIHVzZXMgaW5oZXJpdGFuY2UsIHRoZSBmZWF0dXJlIHNob3VsZCBiZSBpbmNsdWRlZCBiZWZvcmUgdGhlXG4gKiBgSW5oZXJpdERlZmluaXRpb25GZWF0dXJlYCB0byBlbnN1cmUgdGhhdCB0aGUgYGlucHV0VHJhbnNmb3Jtc2AgZmllbGQgaXMgcG9wdWxhdGVkLlxuICpcbiAqIEBjb2RlR2VuQXBpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiDJtcm1SW5wdXRUcmFuc2Zvcm1zRmVhdHVyZTxUPihkZWZpbml0aW9uOiBEaXJlY3RpdmVEZWY8VD4pOiB2b2lkIHtcbiAgY29uc3QgaW5wdXRzID0gZGVmaW5pdGlvbi5pbnB1dENvbmZpZztcbiAgY29uc3QgaW5wdXRUcmFuc2Zvcm1zOiBSZWNvcmQ8c3RyaW5nLCBJbnB1dFRyYW5zZm9ybUZ1bmN0aW9uPiA9IHt9O1xuXG4gIGZvciAoY29uc3QgbWluaWZpZWRLZXkgaW4gaW5wdXRzKSB7XG4gICAgaWYgKGlucHV0cy5oYXNPd25Qcm9wZXJ0eShtaW5pZmllZEtleSkpIHtcbiAgICAgIC8vIE5vdGU6IHRoZSBwcml2YXRlIG5hbWVzIGFyZSB1c2VkIGZvciB0aGUga2V5cywgcmF0aGVyIHRoYW4gdGhlIHB1YmxpYyBvbmVzLCBiZWNhdXNlIHB1YmxpY1xuICAgICAgLy8gbmFtZXMgY2FuIGJlIHJlLWFsaWFzZWQgaW4gaG9zdCBkaXJlY3RpdmVzIHdoaWNoIHdvdWxkIGludmFsaWRhdGUgdGhlIGxvb2t1cC5cbiAgICAgIGNvbnN0IHZhbHVlID0gaW5wdXRzW21pbmlmaWVkS2V5XTtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSAmJiB2YWx1ZVszXSkge1xuICAgICAgICBpbnB1dFRyYW5zZm9ybXNbbWluaWZpZWRLZXldID0gdmFsdWVbM107XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgKGRlZmluaXRpb24gYXMgTXV0YWJsZTxEaXJlY3RpdmVEZWY8VD4sICdpbnB1dFRyYW5zZm9ybXMnPikuaW5wdXRUcmFuc2Zvcm1zID0gaW5wdXRUcmFuc2Zvcm1zO1xufVxuIl19