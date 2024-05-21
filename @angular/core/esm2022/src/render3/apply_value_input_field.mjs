/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export function applyValueToInputField(instance, inputSignalNode, privateName, value) {
    if (inputSignalNode !== null) {
        inputSignalNode.applyValueToInputSignal(inputSignalNode, value);
    }
    else {
        instance[privateName] = value;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbHlfdmFsdWVfaW5wdXRfZmllbGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9yZW5kZXIzL2FwcGx5X3ZhbHVlX2lucHV0X2ZpZWxkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUtILE1BQU0sVUFBVSxzQkFBc0IsQ0FDbEMsUUFBVyxFQUFFLGVBQXVELEVBQUUsV0FBbUIsRUFDekYsS0FBYztJQUNoQixJQUFJLGVBQWUsS0FBSyxJQUFJLEVBQUUsQ0FBQztRQUM3QixlQUFlLENBQUMsdUJBQXVCLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2xFLENBQUM7U0FBTSxDQUFDO1FBQ0wsUUFBZ0IsQ0FBQyxXQUFXLENBQUMsR0FBRyxLQUFLLENBQUM7SUFDekMsQ0FBQztBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuXG5pbXBvcnQge0lucHV0U2lnbmFsTm9kZX0gZnJvbSAnLi4vYXV0aG9yaW5nL2lucHV0L2lucHV0X3NpZ25hbF9ub2RlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5VmFsdWVUb0lucHV0RmllbGQ8VD4oXG4gICAgaW5zdGFuY2U6IFQsIGlucHV0U2lnbmFsTm9kZTogbnVsbHxJbnB1dFNpZ25hbE5vZGU8dW5rbm93biwgdW5rbm93bj4sIHByaXZhdGVOYW1lOiBzdHJpbmcsXG4gICAgdmFsdWU6IHVua25vd24pIHtcbiAgaWYgKGlucHV0U2lnbmFsTm9kZSAhPT0gbnVsbCkge1xuICAgIGlucHV0U2lnbmFsTm9kZS5hcHBseVZhbHVlVG9JbnB1dFNpZ25hbChpbnB1dFNpZ25hbE5vZGUsIHZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICAoaW5zdGFuY2UgYXMgYW55KVtwcml2YXRlTmFtZV0gPSB2YWx1ZTtcbiAgfVxufVxuIl19