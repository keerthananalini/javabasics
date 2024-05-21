/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { setActiveConsumer, SIGNAL } from '@angular/core/primitives/signals';
import { applyValueToInputField } from '../apply_value_input_field';
import { InputFlags } from '../interfaces/input_flags';
export function writeToDirectiveInput(def, instance, publicName, privateName, flags, value) {
    const prevConsumer = setActiveConsumer(null);
    try {
        // If we know we are dealing with a signal input, we cache its reference
        // in a tree-shakable way. The input signal node can then be used for
        // value transform execution or actual value updates without introducing
        // additional megamorphic accesses for accessing the instance field.
        let inputSignalNode = null;
        if ((flags & InputFlags.SignalBased) !== 0) {
            const field = instance[privateName];
            inputSignalNode = field[SIGNAL];
        }
        // If there is a signal node and a transform, run it before potentially
        // delegating to features like `NgOnChanges`.
        if (inputSignalNode !== null && inputSignalNode.transformFn !== undefined) {
            value = inputSignalNode.transformFn(value);
        }
        // If there is a decorator input transform, run it.
        if ((flags & InputFlags.HasDecoratorInputTransform) !== 0) {
            value = def.inputTransforms[privateName].call(instance, value);
        }
        if (def.setInput !== null) {
            def.setInput(instance, inputSignalNode, value, publicName, privateName);
        }
        else {
            applyValueToInputField(instance, inputSignalNode, privateName, value);
        }
    }
    finally {
        setActiveConsumer(prevConsumer);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3JpdGVfdG9fZGlyZWN0aXZlX2lucHV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvcmVuZGVyMy9pbnN0cnVjdGlvbnMvd3JpdGVfdG9fZGlyZWN0aXZlX2lucHV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxpQkFBaUIsRUFBRSxNQUFNLEVBQUMsTUFBTSxrQ0FBa0MsQ0FBQztBQUkzRSxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSw0QkFBNEIsQ0FBQztBQUVsRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFdkQsTUFBTSxVQUFVLHFCQUFxQixDQUNqQyxHQUFvQixFQUFFLFFBQVcsRUFBRSxVQUFrQixFQUFFLFdBQW1CLEVBQUUsS0FBaUIsRUFDN0YsS0FBYztJQUNoQixNQUFNLFlBQVksR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QyxJQUFJLENBQUM7UUFDSCx3RUFBd0U7UUFDeEUscUVBQXFFO1FBQ3JFLHdFQUF3RTtRQUN4RSxvRUFBb0U7UUFDcEUsSUFBSSxlQUFlLEdBQTJDLElBQUksQ0FBQztRQUNuRSxJQUFJLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUMzQyxNQUFNLEtBQUssR0FBSSxRQUFnQixDQUFDLFdBQVcsQ0FBK0MsQ0FBQztZQUMzRixlQUFlLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2xDLENBQUM7UUFFRCx1RUFBdUU7UUFDdkUsNkNBQTZDO1FBQzdDLElBQUksZUFBZSxLQUFLLElBQUksSUFBSSxlQUFlLENBQUMsV0FBVyxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQzFFLEtBQUssR0FBRyxlQUFlLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFDRCxtREFBbUQ7UUFDbkQsSUFBSSxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUMsMEJBQTBCLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUMxRCxLQUFLLEdBQUcsR0FBRyxDQUFDLGVBQWdCLENBQUMsV0FBVyxDQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNuRSxDQUFDO1FBRUQsSUFBSSxHQUFHLENBQUMsUUFBUSxLQUFLLElBQUksRUFBRSxDQUFDO1lBQzFCLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQzFFLENBQUM7YUFBTSxDQUFDO1lBQ04sc0JBQXNCLENBQUMsUUFBUSxFQUFFLGVBQWUsRUFBRSxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDeEUsQ0FBQztJQUNILENBQUM7WUFBUyxDQUFDO1FBQ1QsaUJBQWlCLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDbEMsQ0FBQztBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtzZXRBY3RpdmVDb25zdW1lciwgU0lHTkFMfSBmcm9tICdAYW5ndWxhci9jb3JlL3ByaW1pdGl2ZXMvc2lnbmFscyc7XG5cbmltcG9ydCB7SW5wdXRTaWduYWxXaXRoVHJhbnNmb3JtfSBmcm9tICcuLi8uLi9hdXRob3JpbmcvaW5wdXQvaW5wdXRfc2lnbmFsJztcbmltcG9ydCB7SW5wdXRTaWduYWxOb2RlfSBmcm9tICcuLi8uLi9hdXRob3JpbmcvaW5wdXQvaW5wdXRfc2lnbmFsX25vZGUnO1xuaW1wb3J0IHthcHBseVZhbHVlVG9JbnB1dEZpZWxkfSBmcm9tICcuLi9hcHBseV92YWx1ZV9pbnB1dF9maWVsZCc7XG5pbXBvcnQge0RpcmVjdGl2ZURlZn0gZnJvbSAnLi4vaW50ZXJmYWNlcy9kZWZpbml0aW9uJztcbmltcG9ydCB7IElucHV0RmxhZ3MgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2lucHV0X2ZsYWdzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHdyaXRlVG9EaXJlY3RpdmVJbnB1dDxUPihcbiAgICBkZWY6IERpcmVjdGl2ZURlZjxUPiwgaW5zdGFuY2U6IFQsIHB1YmxpY05hbWU6IHN0cmluZywgcHJpdmF0ZU5hbWU6IHN0cmluZywgZmxhZ3M6IElucHV0RmxhZ3MsXG4gICAgdmFsdWU6IHVua25vd24pIHtcbiAgY29uc3QgcHJldkNvbnN1bWVyID0gc2V0QWN0aXZlQ29uc3VtZXIobnVsbCk7XG4gIHRyeSB7XG4gICAgLy8gSWYgd2Uga25vdyB3ZSBhcmUgZGVhbGluZyB3aXRoIGEgc2lnbmFsIGlucHV0LCB3ZSBjYWNoZSBpdHMgcmVmZXJlbmNlXG4gICAgLy8gaW4gYSB0cmVlLXNoYWthYmxlIHdheS4gVGhlIGlucHV0IHNpZ25hbCBub2RlIGNhbiB0aGVuIGJlIHVzZWQgZm9yXG4gICAgLy8gdmFsdWUgdHJhbnNmb3JtIGV4ZWN1dGlvbiBvciBhY3R1YWwgdmFsdWUgdXBkYXRlcyB3aXRob3V0IGludHJvZHVjaW5nXG4gICAgLy8gYWRkaXRpb25hbCBtZWdhbW9ycGhpYyBhY2Nlc3NlcyBmb3IgYWNjZXNzaW5nIHRoZSBpbnN0YW5jZSBmaWVsZC5cbiAgICBsZXQgaW5wdXRTaWduYWxOb2RlOiBJbnB1dFNpZ25hbE5vZGU8dW5rbm93biwgdW5rbm93bj58bnVsbCA9IG51bGw7XG4gICAgaWYgKChmbGFncyAmIElucHV0RmxhZ3MuU2lnbmFsQmFzZWQpICE9PSAwKSB7XG4gICAgICBjb25zdCBmaWVsZCA9IChpbnN0YW5jZSBhcyBhbnkpW3ByaXZhdGVOYW1lXSBhcyBJbnB1dFNpZ25hbFdpdGhUcmFuc2Zvcm08dW5rbm93biwgdW5rbm93bj47XG4gICAgICBpbnB1dFNpZ25hbE5vZGUgPSBmaWVsZFtTSUdOQUxdO1xuICAgIH1cblxuICAgIC8vIElmIHRoZXJlIGlzIGEgc2lnbmFsIG5vZGUgYW5kIGEgdHJhbnNmb3JtLCBydW4gaXQgYmVmb3JlIHBvdGVudGlhbGx5XG4gICAgLy8gZGVsZWdhdGluZyB0byBmZWF0dXJlcyBsaWtlIGBOZ09uQ2hhbmdlc2AuXG4gICAgaWYgKGlucHV0U2lnbmFsTm9kZSAhPT0gbnVsbCAmJiBpbnB1dFNpZ25hbE5vZGUudHJhbnNmb3JtRm4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFsdWUgPSBpbnB1dFNpZ25hbE5vZGUudHJhbnNmb3JtRm4odmFsdWUpO1xuICAgIH1cbiAgICAvLyBJZiB0aGVyZSBpcyBhIGRlY29yYXRvciBpbnB1dCB0cmFuc2Zvcm0sIHJ1biBpdC5cbiAgICBpZiAoKGZsYWdzICYgSW5wdXRGbGFncy5IYXNEZWNvcmF0b3JJbnB1dFRyYW5zZm9ybSkgIT09IDApIHtcbiAgICAgIHZhbHVlID0gZGVmLmlucHV0VHJhbnNmb3JtcyFbcHJpdmF0ZU5hbWVdIS5jYWxsKGluc3RhbmNlLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKGRlZi5zZXRJbnB1dCAhPT0gbnVsbCkge1xuICAgICAgZGVmLnNldElucHV0KGluc3RhbmNlLCBpbnB1dFNpZ25hbE5vZGUsIHZhbHVlLCBwdWJsaWNOYW1lLCBwcml2YXRlTmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwcGx5VmFsdWVUb0lucHV0RmllbGQoaW5zdGFuY2UsIGlucHV0U2lnbmFsTm9kZSwgcHJpdmF0ZU5hbWUsIHZhbHVlKTtcbiAgICB9XG4gIH0gZmluYWxseSB7XG4gICAgc2V0QWN0aXZlQ29uc3VtZXIocHJldkNvbnN1bWVyKTtcbiAgfVxufVxuIl19