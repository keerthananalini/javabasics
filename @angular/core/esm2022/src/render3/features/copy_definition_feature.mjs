/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { isComponentDef } from '../interfaces/type_checks';
import { getSuperType } from './inherit_definition_feature';
/**
 * Fields which exist on either directive or component definitions, and need to be copied from
 * parent to child classes by the `ɵɵCopyDefinitionFeature`.
 */
const COPY_DIRECTIVE_FIELDS = [
    // The child class should use the providers of its parent.
    'providersResolver',
    // Not listed here are any fields which are handled by the `ɵɵInheritDefinitionFeature`, such
    // as inputs, outputs, and host binding functions.
];
/**
 * Fields which exist only on component definitions, and need to be copied from parent to child
 * classes by the `ɵɵCopyDefinitionFeature`.
 *
 * The type here allows any field of `ComponentDef` which is not also a property of `DirectiveDef`,
 * since those should go in `COPY_DIRECTIVE_FIELDS` above.
 */
const COPY_COMPONENT_FIELDS = [
    // The child class should use the template function of its parent, including all template
    // semantics.
    'template',
    'decls',
    'consts',
    'vars',
    'onPush',
    'ngContentSelectors',
    // The child class should use the CSS styles of its parent, including all styling semantics.
    'styles',
    'encapsulation',
    // The child class should be checked by the runtime in the same way as its parent.
    'schemas',
];
/**
 * Copies the fields not handled by the `ɵɵInheritDefinitionFeature` from the supertype of a
 * definition.
 *
 * This exists primarily to support ngcc migration of an existing View Engine pattern, where an
 * entire decorator is inherited from a parent to a child class. When ngcc detects this case, it
 * generates a skeleton definition on the child class, and applies this feature.
 *
 * The `ɵɵCopyDefinitionFeature` then copies any needed fields from the parent class' definition,
 * including things like the component template function.
 *
 * @param definition The definition of a child class which inherits from a parent class with its
 * own definition.
 *
 * @codeGenApi
 */
export function ɵɵCopyDefinitionFeature(definition) {
    let superType = getSuperType(definition.type);
    let superDef = undefined;
    if (isComponentDef(definition)) {
        // Don't use getComponentDef/getDirectiveDef. This logic relies on inheritance.
        superDef = superType.ɵcmp;
    }
    else {
        // Don't use getComponentDef/getDirectiveDef. This logic relies on inheritance.
        superDef = superType.ɵdir;
    }
    // Needed because `definition` fields are readonly.
    const defAny = definition;
    // Copy over any fields that apply to either directives or components.
    for (const field of COPY_DIRECTIVE_FIELDS) {
        defAny[field] = superDef[field];
    }
    if (isComponentDef(superDef)) {
        // Copy over any component-specific fields.
        for (const field of COPY_COMPONENT_FIELDS) {
            defAny[field] = superDef[field];
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29weV9kZWZpbml0aW9uX2ZlYXR1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9yZW5kZXIzL2ZlYXR1cmVzL2NvcHlfZGVmaW5pdGlvbl9mZWF0dXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUdILE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUV6RCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFFMUQ7OztHQUdHO0FBQ0gsTUFBTSxxQkFBcUIsR0FBb0M7SUFDN0QsMERBQTBEO0lBQzFELG1CQUFtQjtJQUVuQiw2RkFBNkY7SUFDN0Ysa0RBQWtEO0NBQ25ELENBQUM7QUFFRjs7Ozs7O0dBTUc7QUFDSCxNQUFNLHFCQUFxQixHQUF3RTtJQUNqRyx5RkFBeUY7SUFDekYsYUFBYTtJQUNiLFVBQVU7SUFDVixPQUFPO0lBQ1AsUUFBUTtJQUNSLE1BQU07SUFDTixRQUFRO0lBQ1Isb0JBQW9CO0lBRXBCLDRGQUE0RjtJQUM1RixRQUFRO0lBQ1IsZUFBZTtJQUVmLGtGQUFrRjtJQUNsRixTQUFTO0NBQ1YsQ0FBQztBQUVGOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNILE1BQU0sVUFBVSx1QkFBdUIsQ0FBQyxVQUErQztJQUNyRixJQUFJLFNBQVMsR0FBRyxZQUFZLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBRSxDQUFDO0lBRS9DLElBQUksUUFBUSxHQUFrRCxTQUFTLENBQUM7SUFDeEUsSUFBSSxjQUFjLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztRQUMvQiwrRUFBK0U7UUFDL0UsUUFBUSxHQUFHLFNBQVMsQ0FBQyxJQUFLLENBQUM7SUFDN0IsQ0FBQztTQUFNLENBQUM7UUFDTiwrRUFBK0U7UUFDL0UsUUFBUSxHQUFHLFNBQVMsQ0FBQyxJQUFLLENBQUM7SUFDN0IsQ0FBQztJQUVELG1EQUFtRDtJQUNuRCxNQUFNLE1BQU0sR0FBSSxVQUFrQixDQUFDO0lBRW5DLHNFQUFzRTtJQUN0RSxLQUFLLE1BQU0sS0FBSyxJQUFJLHFCQUFxQixFQUFFLENBQUM7UUFDMUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQsSUFBSSxjQUFjLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztRQUM3QiwyQ0FBMkM7UUFDM0MsS0FBSyxNQUFNLEtBQUssSUFBSSxxQkFBcUIsRUFBRSxDQUFDO1lBQzFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEMsQ0FBQztJQUNILENBQUM7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50RGVmLCBEaXJlY3RpdmVEZWZ9IGZyb20gJy4uL2ludGVyZmFjZXMvZGVmaW5pdGlvbic7XG5pbXBvcnQge2lzQ29tcG9uZW50RGVmfSBmcm9tICcuLi9pbnRlcmZhY2VzL3R5cGVfY2hlY2tzJztcblxuaW1wb3J0IHtnZXRTdXBlclR5cGV9IGZyb20gJy4vaW5oZXJpdF9kZWZpbml0aW9uX2ZlYXR1cmUnO1xuXG4vKipcbiAqIEZpZWxkcyB3aGljaCBleGlzdCBvbiBlaXRoZXIgZGlyZWN0aXZlIG9yIGNvbXBvbmVudCBkZWZpbml0aW9ucywgYW5kIG5lZWQgdG8gYmUgY29waWVkIGZyb21cbiAqIHBhcmVudCB0byBjaGlsZCBjbGFzc2VzIGJ5IHRoZSBgybXJtUNvcHlEZWZpbml0aW9uRmVhdHVyZWAuXG4gKi9cbmNvbnN0IENPUFlfRElSRUNUSVZFX0ZJRUxEUzogKGtleW9mIERpcmVjdGl2ZURlZjx1bmtub3duPilbXSA9IFtcbiAgLy8gVGhlIGNoaWxkIGNsYXNzIHNob3VsZCB1c2UgdGhlIHByb3ZpZGVycyBvZiBpdHMgcGFyZW50LlxuICAncHJvdmlkZXJzUmVzb2x2ZXInLFxuXG4gIC8vIE5vdCBsaXN0ZWQgaGVyZSBhcmUgYW55IGZpZWxkcyB3aGljaCBhcmUgaGFuZGxlZCBieSB0aGUgYMm1ybVJbmhlcml0RGVmaW5pdGlvbkZlYXR1cmVgLCBzdWNoXG4gIC8vIGFzIGlucHV0cywgb3V0cHV0cywgYW5kIGhvc3QgYmluZGluZyBmdW5jdGlvbnMuXG5dO1xuXG4vKipcbiAqIEZpZWxkcyB3aGljaCBleGlzdCBvbmx5IG9uIGNvbXBvbmVudCBkZWZpbml0aW9ucywgYW5kIG5lZWQgdG8gYmUgY29waWVkIGZyb20gcGFyZW50IHRvIGNoaWxkXG4gKiBjbGFzc2VzIGJ5IHRoZSBgybXJtUNvcHlEZWZpbml0aW9uRmVhdHVyZWAuXG4gKlxuICogVGhlIHR5cGUgaGVyZSBhbGxvd3MgYW55IGZpZWxkIG9mIGBDb21wb25lbnREZWZgIHdoaWNoIGlzIG5vdCBhbHNvIGEgcHJvcGVydHkgb2YgYERpcmVjdGl2ZURlZmAsXG4gKiBzaW5jZSB0aG9zZSBzaG91bGQgZ28gaW4gYENPUFlfRElSRUNUSVZFX0ZJRUxEU2AgYWJvdmUuXG4gKi9cbmNvbnN0IENPUFlfQ09NUE9ORU5UX0ZJRUxEUzogRXhjbHVkZTxrZXlvZiBDb21wb25lbnREZWY8dW5rbm93bj4sIGtleW9mIERpcmVjdGl2ZURlZjx1bmtub3duPj5bXSA9IFtcbiAgLy8gVGhlIGNoaWxkIGNsYXNzIHNob3VsZCB1c2UgdGhlIHRlbXBsYXRlIGZ1bmN0aW9uIG9mIGl0cyBwYXJlbnQsIGluY2x1ZGluZyBhbGwgdGVtcGxhdGVcbiAgLy8gc2VtYW50aWNzLlxuICAndGVtcGxhdGUnLFxuICAnZGVjbHMnLFxuICAnY29uc3RzJyxcbiAgJ3ZhcnMnLFxuICAnb25QdXNoJyxcbiAgJ25nQ29udGVudFNlbGVjdG9ycycsXG5cbiAgLy8gVGhlIGNoaWxkIGNsYXNzIHNob3VsZCB1c2UgdGhlIENTUyBzdHlsZXMgb2YgaXRzIHBhcmVudCwgaW5jbHVkaW5nIGFsbCBzdHlsaW5nIHNlbWFudGljcy5cbiAgJ3N0eWxlcycsXG4gICdlbmNhcHN1bGF0aW9uJyxcblxuICAvLyBUaGUgY2hpbGQgY2xhc3Mgc2hvdWxkIGJlIGNoZWNrZWQgYnkgdGhlIHJ1bnRpbWUgaW4gdGhlIHNhbWUgd2F5IGFzIGl0cyBwYXJlbnQuXG4gICdzY2hlbWFzJyxcbl07XG5cbi8qKlxuICogQ29waWVzIHRoZSBmaWVsZHMgbm90IGhhbmRsZWQgYnkgdGhlIGDJtcm1SW5oZXJpdERlZmluaXRpb25GZWF0dXJlYCBmcm9tIHRoZSBzdXBlcnR5cGUgb2YgYVxuICogZGVmaW5pdGlvbi5cbiAqXG4gKiBUaGlzIGV4aXN0cyBwcmltYXJpbHkgdG8gc3VwcG9ydCBuZ2NjIG1pZ3JhdGlvbiBvZiBhbiBleGlzdGluZyBWaWV3IEVuZ2luZSBwYXR0ZXJuLCB3aGVyZSBhblxuICogZW50aXJlIGRlY29yYXRvciBpcyBpbmhlcml0ZWQgZnJvbSBhIHBhcmVudCB0byBhIGNoaWxkIGNsYXNzLiBXaGVuIG5nY2MgZGV0ZWN0cyB0aGlzIGNhc2UsIGl0XG4gKiBnZW5lcmF0ZXMgYSBza2VsZXRvbiBkZWZpbml0aW9uIG9uIHRoZSBjaGlsZCBjbGFzcywgYW5kIGFwcGxpZXMgdGhpcyBmZWF0dXJlLlxuICpcbiAqIFRoZSBgybXJtUNvcHlEZWZpbml0aW9uRmVhdHVyZWAgdGhlbiBjb3BpZXMgYW55IG5lZWRlZCBmaWVsZHMgZnJvbSB0aGUgcGFyZW50IGNsYXNzJyBkZWZpbml0aW9uLFxuICogaW5jbHVkaW5nIHRoaW5ncyBsaWtlIHRoZSBjb21wb25lbnQgdGVtcGxhdGUgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIGRlZmluaXRpb24gVGhlIGRlZmluaXRpb24gb2YgYSBjaGlsZCBjbGFzcyB3aGljaCBpbmhlcml0cyBmcm9tIGEgcGFyZW50IGNsYXNzIHdpdGggaXRzXG4gKiBvd24gZGVmaW5pdGlvbi5cbiAqXG4gKiBAY29kZUdlbkFwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gybXJtUNvcHlEZWZpbml0aW9uRmVhdHVyZShkZWZpbml0aW9uOiBEaXJlY3RpdmVEZWY8YW55PnxDb21wb25lbnREZWY8YW55Pik6IHZvaWQge1xuICBsZXQgc3VwZXJUeXBlID0gZ2V0U3VwZXJUeXBlKGRlZmluaXRpb24udHlwZSkhO1xuXG4gIGxldCBzdXBlckRlZjogRGlyZWN0aXZlRGVmPGFueT58Q29tcG9uZW50RGVmPGFueT58dW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICBpZiAoaXNDb21wb25lbnREZWYoZGVmaW5pdGlvbikpIHtcbiAgICAvLyBEb24ndCB1c2UgZ2V0Q29tcG9uZW50RGVmL2dldERpcmVjdGl2ZURlZi4gVGhpcyBsb2dpYyByZWxpZXMgb24gaW5oZXJpdGFuY2UuXG4gICAgc3VwZXJEZWYgPSBzdXBlclR5cGUuybVjbXAhO1xuICB9IGVsc2Uge1xuICAgIC8vIERvbid0IHVzZSBnZXRDb21wb25lbnREZWYvZ2V0RGlyZWN0aXZlRGVmLiBUaGlzIGxvZ2ljIHJlbGllcyBvbiBpbmhlcml0YW5jZS5cbiAgICBzdXBlckRlZiA9IHN1cGVyVHlwZS7JtWRpciE7XG4gIH1cblxuICAvLyBOZWVkZWQgYmVjYXVzZSBgZGVmaW5pdGlvbmAgZmllbGRzIGFyZSByZWFkb25seS5cbiAgY29uc3QgZGVmQW55ID0gKGRlZmluaXRpb24gYXMgYW55KTtcblxuICAvLyBDb3B5IG92ZXIgYW55IGZpZWxkcyB0aGF0IGFwcGx5IHRvIGVpdGhlciBkaXJlY3RpdmVzIG9yIGNvbXBvbmVudHMuXG4gIGZvciAoY29uc3QgZmllbGQgb2YgQ09QWV9ESVJFQ1RJVkVfRklFTERTKSB7XG4gICAgZGVmQW55W2ZpZWxkXSA9IHN1cGVyRGVmW2ZpZWxkXTtcbiAgfVxuXG4gIGlmIChpc0NvbXBvbmVudERlZihzdXBlckRlZikpIHtcbiAgICAvLyBDb3B5IG92ZXIgYW55IGNvbXBvbmVudC1zcGVjaWZpYyBmaWVsZHMuXG4gICAgZm9yIChjb25zdCBmaWVsZCBvZiBDT1BZX0NPTVBPTkVOVF9GSUVMRFMpIHtcbiAgICAgIGRlZkFueVtmaWVsZF0gPSBzdXBlckRlZltmaWVsZF07XG4gICAgfVxuICB9XG59XG4iXX0=