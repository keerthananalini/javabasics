/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { SimpleChange } from '../../interface/simple_change';
import { assertString } from '../../util/assert';
import { EMPTY_OBJ } from '../../util/empty';
import { applyValueToInputField } from '../apply_value_input_field';
/**
 * The NgOnChangesFeature decorates a component with support for the ngOnChanges
 * lifecycle hook, so it should be included in any component that implements
 * that hook.
 *
 * If the component or directive uses inheritance, the NgOnChangesFeature MUST
 * be included as a feature AFTER {@link InheritDefinitionFeature}, otherwise
 * inherited properties will not be propagated to the ngOnChanges lifecycle
 * hook.
 *
 * Example usage:
 *
 * ```
 * static ɵcmp = defineComponent({
 *   ...
 *   inputs: {name: 'publicName'},
 *   features: [NgOnChangesFeature]
 * });
 * ```
 *
 * @codeGenApi
 */
export function ɵɵNgOnChangesFeature() {
    return NgOnChangesFeatureImpl;
}
export function NgOnChangesFeatureImpl(definition) {
    if (definition.type.prototype.ngOnChanges) {
        definition.setInput = ngOnChangesSetInput;
    }
    return rememberChangeHistoryAndInvokeOnChangesHook;
}
// This option ensures that the ngOnChanges lifecycle hook will be inherited
// from superclasses (in InheritDefinitionFeature).
/** @nocollapse */
// tslint:disable-next-line:no-toplevel-property-access
ɵɵNgOnChangesFeature.ngInherit = true;
/**
 * This is a synthetic lifecycle hook which gets inserted into `TView.preOrderHooks` to simulate
 * `ngOnChanges`.
 *
 * The hook reads the `NgSimpleChangesStore` data from the component instance and if changes are
 * found it invokes `ngOnChanges` on the component instance.
 *
 * @param this Component instance. Because this function gets inserted into `TView.preOrderHooks`,
 *     it is guaranteed to be called with component instance.
 */
function rememberChangeHistoryAndInvokeOnChangesHook() {
    const simpleChangesStore = getSimpleChangesStore(this);
    const current = simpleChangesStore?.current;
    if (current) {
        const previous = simpleChangesStore.previous;
        if (previous === EMPTY_OBJ) {
            simpleChangesStore.previous = current;
        }
        else {
            // New changes are copied to the previous store, so that we don't lose history for inputs
            // which were not changed this time
            for (let key in current) {
                previous[key] = current[key];
            }
        }
        simpleChangesStore.current = null;
        this.ngOnChanges(current);
    }
}
function ngOnChangesSetInput(instance, inputSignalNode, value, publicName, privateName) {
    const declaredName = this.declaredInputs[publicName];
    ngDevMode && assertString(declaredName, 'Name of input in ngOnChanges has to be a string');
    const simpleChangesStore = getSimpleChangesStore(instance) ||
        setSimpleChangesStore(instance, { previous: EMPTY_OBJ, current: null });
    const current = simpleChangesStore.current || (simpleChangesStore.current = {});
    const previous = simpleChangesStore.previous;
    const previousChange = previous[declaredName];
    current[declaredName] = new SimpleChange(previousChange && previousChange.currentValue, value, previous === EMPTY_OBJ);
    applyValueToInputField(instance, inputSignalNode, privateName, value);
}
const SIMPLE_CHANGES_STORE = '__ngSimpleChanges__';
function getSimpleChangesStore(instance) {
    return instance[SIMPLE_CHANGES_STORE] || null;
}
function setSimpleChangesStore(instance, store) {
    return instance[SIMPLE_CHANGES_STORE] = store;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfb25jaGFuZ2VzX2ZlYXR1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9yZW5kZXIzL2ZlYXR1cmVzL25nX29uY2hhbmdlc19mZWF0dXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUlILE9BQU8sRUFBQyxZQUFZLEVBQWdCLE1BQU0sK0JBQStCLENBQUM7QUFDMUUsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQy9DLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUMzQyxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSw0QkFBNEIsQ0FBQztBQUdsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBcUJHO0FBQ0gsTUFBTSxVQUFVLG9CQUFvQjtJQUNsQyxPQUFPLHNCQUFzQixDQUFDO0FBQ2hDLENBQUM7QUFFRCxNQUFNLFVBQVUsc0JBQXNCLENBQUksVUFBMkI7SUFDbkUsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUMxQyxVQUFVLENBQUMsUUFBUSxHQUFHLG1CQUFtQixDQUFDO0lBQzVDLENBQUM7SUFDRCxPQUFPLDJDQUEyQyxDQUFDO0FBQ3JELENBQUM7QUFFRCw0RUFBNEU7QUFDNUUsbURBQW1EO0FBQ25ELGtCQUFrQjtBQUNsQix1REFBdUQ7QUFDdEQsb0JBQTRDLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztBQUUvRDs7Ozs7Ozs7O0dBU0c7QUFDSCxTQUFTLDJDQUEyQztJQUNsRCxNQUFNLGtCQUFrQixHQUFHLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZELE1BQU0sT0FBTyxHQUFHLGtCQUFrQixFQUFFLE9BQU8sQ0FBQztJQUU1QyxJQUFJLE9BQU8sRUFBRSxDQUFDO1FBQ1osTUFBTSxRQUFRLEdBQUcsa0JBQW1CLENBQUMsUUFBUSxDQUFDO1FBQzlDLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQzNCLGtCQUFtQixDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7UUFDekMsQ0FBQzthQUFNLENBQUM7WUFDTix5RkFBeUY7WUFDekYsbUNBQW1DO1lBQ25DLEtBQUssSUFBSSxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7Z0JBQ3hCLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDL0IsQ0FBQztRQUNILENBQUM7UUFDRCxrQkFBbUIsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ25DLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDNUIsQ0FBQztBQUNILENBQUM7QUFHRCxTQUFTLG1CQUFtQixDQUNELFFBQVcsRUFBRSxlQUF1RCxFQUMzRixLQUFjLEVBQUUsVUFBa0IsRUFBRSxXQUFtQjtJQUN6RCxNQUFNLFlBQVksR0FBSSxJQUFJLENBQUMsY0FBMEMsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNsRixTQUFTLElBQUksWUFBWSxDQUFDLFlBQVksRUFBRSxpREFBaUQsQ0FBQyxDQUFDO0lBQzNGLE1BQU0sa0JBQWtCLEdBQUcscUJBQXFCLENBQUMsUUFBUSxDQUFDO1FBQ3RELHFCQUFxQixDQUFDLFFBQVEsRUFBRSxFQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7SUFDMUUsTUFBTSxPQUFPLEdBQUcsa0JBQWtCLENBQUMsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2hGLE1BQU0sUUFBUSxHQUFHLGtCQUFrQixDQUFDLFFBQVEsQ0FBQztJQUM3QyxNQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDOUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxHQUFHLElBQUksWUFBWSxDQUNwQyxjQUFjLElBQUksY0FBYyxDQUFDLFlBQVksRUFBRSxLQUFLLEVBQUUsUUFBUSxLQUFLLFNBQVMsQ0FBQyxDQUFDO0lBRWxGLHNCQUFzQixDQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3hFLENBQUM7QUFFRCxNQUFNLG9CQUFvQixHQUFHLHFCQUFxQixDQUFDO0FBRW5ELFNBQVMscUJBQXFCLENBQUMsUUFBYTtJQUMxQyxPQUFPLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLElBQUksQ0FBQztBQUNoRCxDQUFDO0FBRUQsU0FBUyxxQkFBcUIsQ0FBQyxRQUFhLEVBQUUsS0FBMkI7SUFDdkUsT0FBTyxRQUFRLENBQUMsb0JBQW9CLENBQUMsR0FBRyxLQUFLLENBQUM7QUFDaEQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0lucHV0U2lnbmFsTm9kZX0gZnJvbSAnLi4vLi4vYXV0aG9yaW5nL2lucHV0L2lucHV0X3NpZ25hbF9ub2RlJztcbmltcG9ydCB7T25DaGFuZ2VzfSBmcm9tICcuLi8uLi9pbnRlcmZhY2UvbGlmZWN5Y2xlX2hvb2tzJztcbmltcG9ydCB7U2ltcGxlQ2hhbmdlLCBTaW1wbGVDaGFuZ2VzfSBmcm9tICcuLi8uLi9pbnRlcmZhY2Uvc2ltcGxlX2NoYW5nZSc7XG5pbXBvcnQge2Fzc2VydFN0cmluZ30gZnJvbSAnLi4vLi4vdXRpbC9hc3NlcnQnO1xuaW1wb3J0IHtFTVBUWV9PQkp9IGZyb20gJy4uLy4uL3V0aWwvZW1wdHknO1xuaW1wb3J0IHthcHBseVZhbHVlVG9JbnB1dEZpZWxkfSBmcm9tICcuLi9hcHBseV92YWx1ZV9pbnB1dF9maWVsZCc7XG5pbXBvcnQge0RpcmVjdGl2ZURlZiwgRGlyZWN0aXZlRGVmRmVhdHVyZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9kZWZpbml0aW9uJztcblxuLyoqXG4gKiBUaGUgTmdPbkNoYW5nZXNGZWF0dXJlIGRlY29yYXRlcyBhIGNvbXBvbmVudCB3aXRoIHN1cHBvcnQgZm9yIHRoZSBuZ09uQ2hhbmdlc1xuICogbGlmZWN5Y2xlIGhvb2ssIHNvIGl0IHNob3VsZCBiZSBpbmNsdWRlZCBpbiBhbnkgY29tcG9uZW50IHRoYXQgaW1wbGVtZW50c1xuICogdGhhdCBob29rLlxuICpcbiAqIElmIHRoZSBjb21wb25lbnQgb3IgZGlyZWN0aXZlIHVzZXMgaW5oZXJpdGFuY2UsIHRoZSBOZ09uQ2hhbmdlc0ZlYXR1cmUgTVVTVFxuICogYmUgaW5jbHVkZWQgYXMgYSBmZWF0dXJlIEFGVEVSIHtAbGluayBJbmhlcml0RGVmaW5pdGlvbkZlYXR1cmV9LCBvdGhlcndpc2VcbiAqIGluaGVyaXRlZCBwcm9wZXJ0aWVzIHdpbGwgbm90IGJlIHByb3BhZ2F0ZWQgdG8gdGhlIG5nT25DaGFuZ2VzIGxpZmVjeWNsZVxuICogaG9vay5cbiAqXG4gKiBFeGFtcGxlIHVzYWdlOlxuICpcbiAqIGBgYFxuICogc3RhdGljIMm1Y21wID0gZGVmaW5lQ29tcG9uZW50KHtcbiAqICAgLi4uXG4gKiAgIGlucHV0czoge25hbWU6ICdwdWJsaWNOYW1lJ30sXG4gKiAgIGZlYXR1cmVzOiBbTmdPbkNoYW5nZXNGZWF0dXJlXVxuICogfSk7XG4gKiBgYGBcbiAqXG4gKiBAY29kZUdlbkFwaVxuICovXG5leHBvcnQgZnVuY3Rpb24gybXJtU5nT25DaGFuZ2VzRmVhdHVyZTxUPigpOiBEaXJlY3RpdmVEZWZGZWF0dXJlIHtcbiAgcmV0dXJuIE5nT25DaGFuZ2VzRmVhdHVyZUltcGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBOZ09uQ2hhbmdlc0ZlYXR1cmVJbXBsPFQ+KGRlZmluaXRpb246IERpcmVjdGl2ZURlZjxUPikge1xuICBpZiAoZGVmaW5pdGlvbi50eXBlLnByb3RvdHlwZS5uZ09uQ2hhbmdlcykge1xuICAgIGRlZmluaXRpb24uc2V0SW5wdXQgPSBuZ09uQ2hhbmdlc1NldElucHV0O1xuICB9XG4gIHJldHVybiByZW1lbWJlckNoYW5nZUhpc3RvcnlBbmRJbnZva2VPbkNoYW5nZXNIb29rO1xufVxuXG4vLyBUaGlzIG9wdGlvbiBlbnN1cmVzIHRoYXQgdGhlIG5nT25DaGFuZ2VzIGxpZmVjeWNsZSBob29rIHdpbGwgYmUgaW5oZXJpdGVkXG4vLyBmcm9tIHN1cGVyY2xhc3NlcyAoaW4gSW5oZXJpdERlZmluaXRpb25GZWF0dXJlKS5cbi8qKiBAbm9jb2xsYXBzZSAqL1xuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXRvcGxldmVsLXByb3BlcnR5LWFjY2Vzc1xuKMm1ybVOZ09uQ2hhbmdlc0ZlYXR1cmUgYXMgRGlyZWN0aXZlRGVmRmVhdHVyZSkubmdJbmhlcml0ID0gdHJ1ZTtcblxuLyoqXG4gKiBUaGlzIGlzIGEgc3ludGhldGljIGxpZmVjeWNsZSBob29rIHdoaWNoIGdldHMgaW5zZXJ0ZWQgaW50byBgVFZpZXcucHJlT3JkZXJIb29rc2AgdG8gc2ltdWxhdGVcbiAqIGBuZ09uQ2hhbmdlc2AuXG4gKlxuICogVGhlIGhvb2sgcmVhZHMgdGhlIGBOZ1NpbXBsZUNoYW5nZXNTdG9yZWAgZGF0YSBmcm9tIHRoZSBjb21wb25lbnQgaW5zdGFuY2UgYW5kIGlmIGNoYW5nZXMgYXJlXG4gKiBmb3VuZCBpdCBpbnZva2VzIGBuZ09uQ2hhbmdlc2Agb24gdGhlIGNvbXBvbmVudCBpbnN0YW5jZS5cbiAqXG4gKiBAcGFyYW0gdGhpcyBDb21wb25lbnQgaW5zdGFuY2UuIEJlY2F1c2UgdGhpcyBmdW5jdGlvbiBnZXRzIGluc2VydGVkIGludG8gYFRWaWV3LnByZU9yZGVySG9va3NgLFxuICogICAgIGl0IGlzIGd1YXJhbnRlZWQgdG8gYmUgY2FsbGVkIHdpdGggY29tcG9uZW50IGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiByZW1lbWJlckNoYW5nZUhpc3RvcnlBbmRJbnZva2VPbkNoYW5nZXNIb29rKHRoaXM6IE9uQ2hhbmdlcykge1xuICBjb25zdCBzaW1wbGVDaGFuZ2VzU3RvcmUgPSBnZXRTaW1wbGVDaGFuZ2VzU3RvcmUodGhpcyk7XG4gIGNvbnN0IGN1cnJlbnQgPSBzaW1wbGVDaGFuZ2VzU3RvcmU/LmN1cnJlbnQ7XG5cbiAgaWYgKGN1cnJlbnQpIHtcbiAgICBjb25zdCBwcmV2aW91cyA9IHNpbXBsZUNoYW5nZXNTdG9yZSEucHJldmlvdXM7XG4gICAgaWYgKHByZXZpb3VzID09PSBFTVBUWV9PQkopIHtcbiAgICAgIHNpbXBsZUNoYW5nZXNTdG9yZSEucHJldmlvdXMgPSBjdXJyZW50O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBOZXcgY2hhbmdlcyBhcmUgY29waWVkIHRvIHRoZSBwcmV2aW91cyBzdG9yZSwgc28gdGhhdCB3ZSBkb24ndCBsb3NlIGhpc3RvcnkgZm9yIGlucHV0c1xuICAgICAgLy8gd2hpY2ggd2VyZSBub3QgY2hhbmdlZCB0aGlzIHRpbWVcbiAgICAgIGZvciAobGV0IGtleSBpbiBjdXJyZW50KSB7XG4gICAgICAgIHByZXZpb3VzW2tleV0gPSBjdXJyZW50W2tleV07XG4gICAgICB9XG4gICAgfVxuICAgIHNpbXBsZUNoYW5nZXNTdG9yZSEuY3VycmVudCA9IG51bGw7XG4gICAgdGhpcy5uZ09uQ2hhbmdlcyhjdXJyZW50KTtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIG5nT25DaGFuZ2VzU2V0SW5wdXQ8VD4oXG4gICAgdGhpczogRGlyZWN0aXZlRGVmPFQ+LCBpbnN0YW5jZTogVCwgaW5wdXRTaWduYWxOb2RlOiBudWxsfElucHV0U2lnbmFsTm9kZTx1bmtub3duLCB1bmtub3duPixcbiAgICB2YWx1ZTogdW5rbm93biwgcHVibGljTmFtZTogc3RyaW5nLCBwcml2YXRlTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gIGNvbnN0IGRlY2xhcmVkTmFtZSA9ICh0aGlzLmRlY2xhcmVkSW5wdXRzIGFzIHtba2V5OiBzdHJpbmddOiBzdHJpbmd9KVtwdWJsaWNOYW1lXTtcbiAgbmdEZXZNb2RlICYmIGFzc2VydFN0cmluZyhkZWNsYXJlZE5hbWUsICdOYW1lIG9mIGlucHV0IGluIG5nT25DaGFuZ2VzIGhhcyB0byBiZSBhIHN0cmluZycpO1xuICBjb25zdCBzaW1wbGVDaGFuZ2VzU3RvcmUgPSBnZXRTaW1wbGVDaGFuZ2VzU3RvcmUoaW5zdGFuY2UpIHx8XG4gICAgICBzZXRTaW1wbGVDaGFuZ2VzU3RvcmUoaW5zdGFuY2UsIHtwcmV2aW91czogRU1QVFlfT0JKLCBjdXJyZW50OiBudWxsfSk7XG4gIGNvbnN0IGN1cnJlbnQgPSBzaW1wbGVDaGFuZ2VzU3RvcmUuY3VycmVudCB8fCAoc2ltcGxlQ2hhbmdlc1N0b3JlLmN1cnJlbnQgPSB7fSk7XG4gIGNvbnN0IHByZXZpb3VzID0gc2ltcGxlQ2hhbmdlc1N0b3JlLnByZXZpb3VzO1xuICBjb25zdCBwcmV2aW91c0NoYW5nZSA9IHByZXZpb3VzW2RlY2xhcmVkTmFtZV07XG4gIGN1cnJlbnRbZGVjbGFyZWROYW1lXSA9IG5ldyBTaW1wbGVDaGFuZ2UoXG4gICAgICBwcmV2aW91c0NoYW5nZSAmJiBwcmV2aW91c0NoYW5nZS5jdXJyZW50VmFsdWUsIHZhbHVlLCBwcmV2aW91cyA9PT0gRU1QVFlfT0JKKTtcblxuICBhcHBseVZhbHVlVG9JbnB1dEZpZWxkKGluc3RhbmNlLCBpbnB1dFNpZ25hbE5vZGUsIHByaXZhdGVOYW1lLCB2YWx1ZSk7XG59XG5cbmNvbnN0IFNJTVBMRV9DSEFOR0VTX1NUT1JFID0gJ19fbmdTaW1wbGVDaGFuZ2VzX18nO1xuXG5mdW5jdGlvbiBnZXRTaW1wbGVDaGFuZ2VzU3RvcmUoaW5zdGFuY2U6IGFueSk6IG51bGx8TmdTaW1wbGVDaGFuZ2VzU3RvcmUge1xuICByZXR1cm4gaW5zdGFuY2VbU0lNUExFX0NIQU5HRVNfU1RPUkVdIHx8IG51bGw7XG59XG5cbmZ1bmN0aW9uIHNldFNpbXBsZUNoYW5nZXNTdG9yZShpbnN0YW5jZTogYW55LCBzdG9yZTogTmdTaW1wbGVDaGFuZ2VzU3RvcmUpOiBOZ1NpbXBsZUNoYW5nZXNTdG9yZSB7XG4gIHJldHVybiBpbnN0YW5jZVtTSU1QTEVfQ0hBTkdFU19TVE9SRV0gPSBzdG9yZTtcbn1cblxuLyoqXG4gKiBEYXRhIHN0cnVjdHVyZSB3aGljaCBpcyBtb25rZXktcGF0Y2hlZCBvbiB0aGUgY29tcG9uZW50IGluc3RhbmNlIGFuZCB1c2VkIGJ5IGBuZ09uQ2hhbmdlc2BcbiAqIGxpZmUtY3ljbGUgaG9vayB0byB0cmFjayBwcmV2aW91cyBpbnB1dCB2YWx1ZXMuXG4gKi9cbmludGVyZmFjZSBOZ1NpbXBsZUNoYW5nZXNTdG9yZSB7XG4gIHByZXZpb3VzOiBTaW1wbGVDaGFuZ2VzO1xuICBjdXJyZW50OiBTaW1wbGVDaGFuZ2VzfG51bGw7XG59XG4iXX0=