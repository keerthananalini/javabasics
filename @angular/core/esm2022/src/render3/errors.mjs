/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { RuntimeError } from '../errors';
import { getComponentDef } from './definition';
import { getDeclarationComponentDef } from './instructions/element_validation';
import { TVIEW } from './interfaces/view';
import { INTERPOLATION_DELIMITER } from './util/misc_utils';
import { stringifyForError } from './util/stringify_utils';
/**
 * The max length of the string representation of a value in an error message
 */
const VALUE_STRING_LENGTH_LIMIT = 200;
/** Verifies that a given type is a Standalone Component. */
export function assertStandaloneComponentType(type) {
    assertComponentDef(type);
    const componentDef = getComponentDef(type);
    if (!componentDef.standalone) {
        throw new RuntimeError(907 /* RuntimeErrorCode.TYPE_IS_NOT_STANDALONE */, `The ${stringifyForError(type)} component is not marked as standalone, ` +
            `but Angular expects to have a standalone component here. ` +
            `Please make sure the ${stringifyForError(type)} component has ` +
            `the \`standalone: true\` flag in the decorator.`);
    }
}
/** Verifies whether a given type is a component */
export function assertComponentDef(type) {
    if (!getComponentDef(type)) {
        throw new RuntimeError(906 /* RuntimeErrorCode.MISSING_GENERATED_DEF */, `The ${stringifyForError(type)} is not an Angular component, ` +
            `make sure it has the \`@Component\` decorator.`);
    }
}
/** Called when there are multiple component selectors that match a given node */
export function throwMultipleComponentError(tNode, first, second) {
    throw new RuntimeError(-300 /* RuntimeErrorCode.MULTIPLE_COMPONENTS_MATCH */, `Multiple components match node with tagname ${tNode.value}: ` +
        `${stringifyForError(first)} and ` +
        `${stringifyForError(second)}`);
}
/** Throws an ExpressionChangedAfterChecked error if checkNoChanges mode is on. */
export function throwErrorIfNoChangesMode(creationMode, oldValue, currValue, propName, lView) {
    const hostComponentDef = getDeclarationComponentDef(lView);
    const componentClassName = hostComponentDef?.type?.name;
    const field = propName ? ` for '${propName}'` : '';
    let msg = `ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value${field}: '${formatValue(oldValue)}'. Current value: '${formatValue(currValue)}'.${componentClassName ? ` Expression location: ${componentClassName} component` : ''}`;
    if (creationMode) {
        msg +=
            ` It seems like the view has been created after its parent and its children have been dirty checked.` +
                ` Has it been created in a change detection hook?`;
    }
    throw new RuntimeError(-100 /* RuntimeErrorCode.EXPRESSION_CHANGED_AFTER_CHECKED */, msg);
}
function formatValue(value) {
    let strValue = String(value);
    // JSON.stringify will throw on circular references
    try {
        if (Array.isArray(value) || strValue === '[object Object]') {
            strValue = JSON.stringify(value);
        }
    }
    catch (error) {
    }
    return strValue.length > VALUE_STRING_LENGTH_LIMIT ?
        (strValue.substring(0, VALUE_STRING_LENGTH_LIMIT) + '…') :
        strValue;
}
function constructDetailsForInterpolation(lView, rootIndex, expressionIndex, meta, changedValue) {
    const [propName, prefix, ...chunks] = meta.split(INTERPOLATION_DELIMITER);
    let oldValue = prefix, newValue = prefix;
    for (let i = 0; i < chunks.length; i++) {
        const slotIdx = rootIndex + i;
        oldValue += `${lView[slotIdx]}${chunks[i]}`;
        newValue += `${slotIdx === expressionIndex ? changedValue : lView[slotIdx]}${chunks[i]}`;
    }
    return { propName, oldValue, newValue };
}
/**
 * Constructs an object that contains details for the ExpressionChangedAfterItHasBeenCheckedError:
 * - property name (for property bindings or interpolations)
 * - old and new values, enriched using information from metadata
 *
 * More information on the metadata storage format can be found in `storePropertyBindingMetadata`
 * function description.
 */
export function getExpressionChangedErrorDetails(lView, bindingIndex, oldValue, newValue) {
    const tData = lView[TVIEW].data;
    const metadata = tData[bindingIndex];
    if (typeof metadata === 'string') {
        // metadata for property interpolation
        if (metadata.indexOf(INTERPOLATION_DELIMITER) > -1) {
            return constructDetailsForInterpolation(lView, bindingIndex, bindingIndex, metadata, newValue);
        }
        // metadata for property binding
        return { propName: metadata, oldValue, newValue };
    }
    // metadata is not available for this expression, check if this expression is a part of the
    // property interpolation by going from the current binding index left and look for a string that
    // contains INTERPOLATION_DELIMITER, the layout in tView.data for this case will look like this:
    // [..., 'id�Prefix � and � suffix', null, null, null, ...]
    if (metadata === null) {
        let idx = bindingIndex - 1;
        while (typeof tData[idx] !== 'string' && tData[idx + 1] === null) {
            idx--;
        }
        const meta = tData[idx];
        if (typeof meta === 'string') {
            const matches = meta.match(new RegExp(INTERPOLATION_DELIMITER, 'g'));
            // first interpolation delimiter separates property name from interpolation parts (in case of
            // property interpolations), so we subtract one from total number of found delimiters
            if (matches && (matches.length - 1) > bindingIndex - idx) {
                return constructDetailsForInterpolation(lView, idx, bindingIndex, meta, newValue);
            }
        }
    }
    return { propName: undefined, oldValue, newValue };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvcmVuZGVyMy9lcnJvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBbUIsTUFBTSxXQUFXLENBQUM7QUFHekQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUM3QyxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQztBQUU3RSxPQUFPLEVBQVEsS0FBSyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDL0MsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDMUQsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFFekQ7O0dBRUc7QUFDSCxNQUFNLHlCQUF5QixHQUFHLEdBQUcsQ0FBQztBQUV0Qyw0REFBNEQ7QUFDNUQsTUFBTSxVQUFVLDZCQUE2QixDQUFDLElBQW1CO0lBQy9ELGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pCLE1BQU0sWUFBWSxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUUsQ0FBQztJQUM1QyxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzdCLE1BQU0sSUFBSSxZQUFZLG9EQUVsQixPQUFPLGlCQUFpQixDQUFDLElBQUksQ0FBQywwQ0FBMEM7WUFDcEUsMkRBQTJEO1lBQzNELHdCQUF3QixpQkFBaUIsQ0FBQyxJQUFJLENBQUMsaUJBQWlCO1lBQ2hFLGlEQUFpRCxDQUFDLENBQUM7SUFDN0QsQ0FBQztBQUNILENBQUM7QUFFRCxtREFBbUQ7QUFDbkQsTUFBTSxVQUFVLGtCQUFrQixDQUFDLElBQW1CO0lBQ3BELElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUMzQixNQUFNLElBQUksWUFB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QUFDO1FBQ3hCLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFLENBQUM7WUFDN0IsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3JFLDZGQUE2RjtZQUM3RixxRkFBcUY7WUFDckYsSUFBSSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLFlBQVksR0FBRyxHQUFHLEVBQUUsQ0FBQztnQkFDekQsT0FBTyxnQ0FBZ0MsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDcEYsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBQ0QsT0FBTyxFQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBQyxDQUFDO0FBQ25ELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1J1bnRpbWVFcnJvciwgUnVudGltZUVycm9yQ29kZX0gZnJvbSAnLi4vZXJyb3JzJztcbmltcG9ydCB7VHlwZX0gZnJvbSAnLi4vaW50ZXJmYWNlL3R5cGUnO1xuXG5pbXBvcnQge2dldENvbXBvbmVudERlZn0gZnJvbSAnLi9kZWZpbml0aW9uJztcbmltcG9ydCB7Z2V0RGVjbGFyYXRpb25Db21wb25lbnREZWZ9IGZyb20gJy4vaW5zdHJ1Y3Rpb25zL2VsZW1lbnRfdmFsaWRhdGlvbic7XG5pbXBvcnQge1ROb2RlfSBmcm9tICcuL2ludGVyZmFjZXMvbm9kZSc7XG5pbXBvcnQge0xWaWV3LCBUVklFV30gZnJvbSAnLi9pbnRlcmZhY2VzL3ZpZXcnO1xuaW1wb3J0IHtJTlRFUlBPTEFUSU9OX0RFTElNSVRFUn0gZnJvbSAnLi91dGlsL21pc2NfdXRpbHMnO1xuaW1wb3J0IHtzdHJpbmdpZnlGb3JFcnJvcn0gZnJvbSAnLi91dGlsL3N0cmluZ2lmeV91dGlscyc7XG5cbi8qKlxuICogVGhlIG1heCBsZW5ndGggb2YgdGhlIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBhIHZhbHVlIGluIGFuIGVycm9yIG1lc3NhZ2VcbiAqL1xuY29uc3QgVkFMVUVfU1RSSU5HX0xFTkdUSF9MSU1JVCA9IDIwMDtcblxuLyoqIFZlcmlmaWVzIHRoYXQgYSBnaXZlbiB0eXBlIGlzIGEgU3RhbmRhbG9uZSBDb21wb25lbnQuICovXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0U3RhbmRhbG9uZUNvbXBvbmVudFR5cGUodHlwZTogVHlwZTx1bmtub3duPikge1xuICBhc3NlcnRDb21wb25lbnREZWYodHlwZSk7XG4gIGNvbnN0IGNvbXBvbmVudERlZiA9IGdldENvbXBvbmVudERlZih0eXBlKSE7XG4gIGlmICghY29tcG9uZW50RGVmLnN0YW5kYWxvbmUpIHtcbiAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFxuICAgICAgICBSdW50aW1lRXJyb3JDb2RlLlRZUEVfSVNfTk9UX1NUQU5EQUxPTkUsXG4gICAgICAgIGBUaGUgJHtzdHJpbmdpZnlGb3JFcnJvcih0eXBlKX0gY29tcG9uZW50IGlzIG5vdCBtYXJrZWQgYXMgc3RhbmRhbG9uZSwgYCArXG4gICAgICAgICAgICBgYnV0IEFuZ3VsYXIgZXhwZWN0cyB0byBoYXZlIGEgc3RhbmRhbG9uZSBjb21wb25lbnQgaGVyZS4gYCArXG4gICAgICAgICAgICBgUGxlYXNlIG1ha2Ugc3VyZSB0aGUgJHtzdHJpbmdpZnlGb3JFcnJvcih0eXBlKX0gY29tcG9uZW50IGhhcyBgICtcbiAgICAgICAgICAgIGB0aGUgXFxgc3RhbmRhbG9uZTogdHJ1ZVxcYCBmbGFnIGluIHRoZSBkZWNvcmF0b3IuYCk7XG4gIH1cbn1cblxuLyoqIFZlcmlmaWVzIHdoZXRoZXIgYSBnaXZlbiB0eXBlIGlzIGEgY29tcG9uZW50ICovXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0Q29tcG9uZW50RGVmKHR5cGU6IFR5cGU8dW5rbm93bj4pIHtcbiAgaWYgKCFnZXRDb21wb25lbnREZWYodHlwZSkpIHtcbiAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFxuICAgICAgICBSdW50aW1lRXJyb3JDb2RlLk1JU1NJTkdfR0VORVJBVEVEX0RFRixcbiAgICAgICAgYFRoZSAke3N0cmluZ2lmeUZvckVycm9yKHR5cGUpfSBpcyBub3QgYW4gQW5ndWxhciBjb21wb25lbnQsIGAgK1xuICAgICAgICAgICAgYG1ha2Ugc3VyZSBpdCBoYXMgdGhlIFxcYEBDb21wb25lbnRcXGAgZGVjb3JhdG9yLmApO1xuICB9XG59XG5cbi8qKiBDYWxsZWQgd2hlbiB0aGVyZSBhcmUgbXVsdGlwbGUgY29tcG9uZW50IHNlbGVjdG9ycyB0aGF0IG1hdGNoIGEgZ2l2ZW4gbm9kZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRocm93TXVsdGlwbGVDb21wb25lbnRFcnJvcihcbiAgICB0Tm9kZTogVE5vZGUsIGZpcnN0OiBUeXBlPHVua25vd24+LCBzZWNvbmQ6IFR5cGU8dW5rbm93bj4pOiBuZXZlciB7XG4gIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXG4gICAgICBSdW50aW1lRXJyb3JDb2RlLk1VTFRJUExFX0NPTVBPTkVOVFNfTUFUQ0gsXG4gICAgICBgTXVsdGlwbGUgY29tcG9uZW50cyBtYXRjaCBub2RlIHdpdGggdGFnbmFtZSAke3ROb2RlLnZhbHVlfTogYCArXG4gICAgICAgICAgYCR7c3RyaW5naWZ5Rm9yRXJyb3IoZmlyc3QpfSBhbmQgYCArXG4gICAgICAgICAgYCR7c3RyaW5naWZ5Rm9yRXJyb3Ioc2Vjb25kKX1gKTtcbn1cblxuLyoqIFRocm93cyBhbiBFeHByZXNzaW9uQ2hhbmdlZEFmdGVyQ2hlY2tlZCBlcnJvciBpZiBjaGVja05vQ2hhbmdlcyBtb2RlIGlzIG9uLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRocm93RXJyb3JJZk5vQ2hhbmdlc01vZGUoXG4gICAgY3JlYXRpb25Nb2RlOiBib29sZWFuLCBvbGRWYWx1ZTogYW55LCBjdXJyVmFsdWU6IGFueSwgcHJvcE5hbWU6IHN0cmluZ3x1bmRlZmluZWQsXG4gICAgbFZpZXc6IExWaWV3KTogbmV2ZXIge1xuICBjb25zdCBob3N0Q29tcG9uZW50RGVmID0gZ2V0RGVjbGFyYXRpb25Db21wb25lbnREZWYobFZpZXcpO1xuICBjb25zdCBjb21wb25lbnRDbGFzc05hbWUgPSBob3N0Q29tcG9uZW50RGVmPy50eXBlPy5uYW1lO1xuICBjb25zdCBmaWVsZCA9IHByb3BOYW1lID8gYCBmb3IgJyR7cHJvcE5hbWV9J2AgOiAnJztcbiAgbGV0IG1zZyA9XG4gICAgICBgRXhwcmVzc2lvbkNoYW5nZWRBZnRlckl0SGFzQmVlbkNoZWNrZWRFcnJvcjogRXhwcmVzc2lvbiBoYXMgY2hhbmdlZCBhZnRlciBpdCB3YXMgY2hlY2tlZC4gUHJldmlvdXMgdmFsdWUke1xuICAgICAgICAgIGZpZWxkfTogJyR7Zm9ybWF0VmFsdWUob2xkVmFsdWUpfScuIEN1cnJlbnQgdmFsdWU6ICcke2Zvcm1hdFZhbHVlKGN1cnJWYWx1ZSl9Jy4ke1xuICAgICAgICAgIGNvbXBvbmVudENsYXNzTmFtZSA/IGAgRXhwcmVzc2lvbiBsb2NhdGlvbjogJHtjb21wb25lbnRDbGFzc05hbWV9IGNvbXBvbmVudGAgOiAnJ31gO1xuICBpZiAoY3JlYXRpb25Nb2RlKSB7XG4gICAgbXNnICs9XG4gICAgICAgIGAgSXQgc2VlbXMgbGlrZSB0aGUgdmlldyBoYXMgYmVlbiBjcmVhdGVkIGFmdGVyIGl0cyBwYXJlbnQgYW5kIGl0cyBjaGlsZHJlbiBoYXZlIGJlZW4gZGlydHkgY2hlY2tlZC5gICtcbiAgICAgICAgYCBIYXMgaXQgYmVlbiBjcmVhdGVkIGluIGEgY2hhbmdlIGRldGVjdGlvbiBob29rP2A7XG4gIH1cbiAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihSdW50aW1lRXJyb3JDb2RlLkVYUFJFU1NJT05fQ0hBTkdFRF9BRlRFUl9DSEVDS0VELCBtc2cpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRWYWx1ZSh2YWx1ZTogdW5rbm93bik6IHN0cmluZyB7XG4gIGxldCBzdHJWYWx1ZTogc3RyaW5nID0gU3RyaW5nKHZhbHVlKTtcblxuICAvLyBKU09OLnN0cmluZ2lmeSB3aWxsIHRocm93IG9uIGNpcmN1bGFyIHJlZmVyZW5jZXNcbiAgdHJ5IHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkgfHwgc3RyVmFsdWUgPT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgICBzdHJWYWx1ZSA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gIH1cbiAgcmV0dXJuIHN0clZhbHVlLmxlbmd0aCA+IFZBTFVFX1NUUklOR19MRU5HVEhfTElNSVQgP1xuICAgICAgKHN0clZhbHVlLnN1YnN0cmluZygwLCBWQUxVRV9TVFJJTkdfTEVOR1RIX0xJTUlUKSArICfigKYnKSA6XG4gICAgICBzdHJWYWx1ZTtcbn1cblxuZnVuY3Rpb24gY29uc3RydWN0RGV0YWlsc0ZvckludGVycG9sYXRpb24oXG4gICAgbFZpZXc6IExWaWV3LCByb290SW5kZXg6IG51bWJlciwgZXhwcmVzc2lvbkluZGV4OiBudW1iZXIsIG1ldGE6IHN0cmluZywgY2hhbmdlZFZhbHVlOiBhbnkpIHtcbiAgY29uc3QgW3Byb3BOYW1lLCBwcmVmaXgsIC4uLmNodW5rc10gPSBtZXRhLnNwbGl0KElOVEVSUE9MQVRJT05fREVMSU1JVEVSKTtcbiAgbGV0IG9sZFZhbHVlID0gcHJlZml4LCBuZXdWYWx1ZSA9IHByZWZpeDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaHVua3MubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBzbG90SWR4ID0gcm9vdEluZGV4ICsgaTtcbiAgICBvbGRWYWx1ZSArPSBgJHtsVmlld1tzbG90SWR4XX0ke2NodW5rc1tpXX1gO1xuICAgIG5ld1ZhbHVlICs9IGAke3Nsb3RJZHggPT09IGV4cHJlc3Npb25JbmRleCA/IGNoYW5nZWRWYWx1ZSA6IGxWaWV3W3Nsb3RJZHhdfSR7Y2h1bmtzW2ldfWA7XG4gIH1cbiAgcmV0dXJuIHtwcm9wTmFtZSwgb2xkVmFsdWUsIG5ld1ZhbHVlfTtcbn1cblxuLyoqXG4gKiBDb25zdHJ1Y3RzIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIGRldGFpbHMgZm9yIHRoZSBFeHByZXNzaW9uQ2hhbmdlZEFmdGVySXRIYXNCZWVuQ2hlY2tlZEVycm9yOlxuICogLSBwcm9wZXJ0eSBuYW1lIChmb3IgcHJvcGVydHkgYmluZGluZ3Mgb3IgaW50ZXJwb2xhdGlvbnMpXG4gKiAtIG9sZCBhbmQgbmV3IHZhbHVlcywgZW5yaWNoZWQgdXNpbmcgaW5mb3JtYXRpb24gZnJvbSBtZXRhZGF0YVxuICpcbiAqIE1vcmUgaW5mb3JtYXRpb24gb24gdGhlIG1ldGFkYXRhIHN0b3JhZ2UgZm9ybWF0IGNhbiBiZSBmb3VuZCBpbiBgc3RvcmVQcm9wZXJ0eUJpbmRpbmdNZXRhZGF0YWBcbiAqIGZ1bmN0aW9uIGRlc2NyaXB0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RXhwcmVzc2lvbkNoYW5nZWRFcnJvckRldGFpbHMoXG4gICAgbFZpZXc6IExWaWV3LCBiaW5kaW5nSW5kZXg6IG51bWJlciwgb2xkVmFsdWU6IGFueSxcbiAgICBuZXdWYWx1ZTogYW55KToge3Byb3BOYW1lPzogc3RyaW5nLCBvbGRWYWx1ZTogYW55LCBuZXdWYWx1ZTogYW55fSB7XG4gIGNvbnN0IHREYXRhID0gbFZpZXdbVFZJRVddLmRhdGE7XG4gIGNvbnN0IG1ldGFkYXRhID0gdERhdGFbYmluZGluZ0luZGV4XTtcblxuICBpZiAodHlwZW9mIG1ldGFkYXRhID09PSAnc3RyaW5nJykge1xuICAgIC8vIG1ldGFkYXRhIGZvciBwcm9wZXJ0eSBpbnRlcnBvbGF0aW9uXG4gICAgaWYgKG1ldGFkYXRhLmluZGV4T2YoSU5URVJQT0xBVElPTl9ERUxJTUlURVIpID4gLTEpIHtcbiAgICAgIHJldHVybiBjb25zdHJ1Y3REZXRhaWxzRm9ySW50ZXJwb2xhdGlvbihcbiAgICAgICAgICBsVmlldywgYmluZGluZ0luZGV4LCBiaW5kaW5nSW5kZXgsIG1ldGFkYXRhLCBuZXdWYWx1ZSk7XG4gICAgfVxuICAgIC8vIG1ldGFkYXRhIGZvciBwcm9wZXJ0eSBiaW5kaW5nXG4gICAgcmV0dXJuIHtwcm9wTmFtZTogbWV0YWRhdGEsIG9sZFZhbHVlLCBuZXdWYWx1ZX07XG4gIH1cblxuICAvLyBtZXRhZGF0YSBpcyBub3QgYXZhaWxhYmxlIGZvciB0aGlzIGV4cHJlc3Npb24sIGNoZWNrIGlmIHRoaXMgZXhwcmVzc2lvbiBpcyBhIHBhcnQgb2YgdGhlXG4gIC8vIHByb3BlcnR5IGludGVycG9sYXRpb24gYnkgZ29pbmcgZnJvbSB0aGUgY3VycmVudCBiaW5kaW5nIGluZGV4IGxlZnQgYW5kIGxvb2sgZm9yIGEgc3RyaW5nIHRoYXRcbiAgLy8gY29udGFpbnMgSU5URVJQT0xBVElPTl9ERUxJTUlURVIsIHRoZSBsYXlvdXQgaW4gdFZpZXcuZGF0YSBmb3IgdGhpcyBjYXNlIHdpbGwgbG9vayBsaWtlIHRoaXM6XG4gIC8vIFsuLi4sICdpZO+/vVByZWZpeCDvv70gYW5kIO+/vSBzdWZmaXgnLCBudWxsLCBudWxsLCBudWxsLCAuLi5dXG4gIGlmIChtZXRhZGF0YSA9PT0gbnVsbCkge1xuICAgIGxldCBpZHggPSBiaW5kaW5nSW5kZXggLSAxO1xuICAgIHdoaWxlICh0eXBlb2YgdERhdGFbaWR4XSAhPT0gJ3N0cmluZycgJiYgdERhdGFbaWR4ICsgMV0gPT09IG51bGwpIHtcbiAgICAgIGlkeC0tO1xuICAgIH1cbiAgICBjb25zdCBtZXRhID0gdERhdGFbaWR4XTtcbiAgICBpZiAodHlwZW9mIG1ldGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb25zdCBtYXRjaGVzID0gbWV0YS5tYXRjaChuZXcgUmVnRXhwKElOVEVSUE9MQVRJT05fREVMSU1JVEVSLCAnZycpKTtcbiAgICAgIC8vIGZpcnN0IGludGVycG9sYXRpb24gZGVsaW1pdGVyIHNlcGFyYXRlcyBwcm9wZXJ0eSBuYW1lIGZyb20gaW50ZXJwb2xhdGlvbiBwYXJ0cyAoaW4gY2FzZSBvZlxuICAgICAgLy8gcHJvcGVydHkgaW50ZXJwb2xhdGlvbnMpLCBzbyB3ZSBzdWJ0cmFjdCBvbmUgZnJvbSB0b3RhbCBudW1iZXIgb2YgZm91bmQgZGVsaW1pdGVyc1xuICAgICAgaWYgKG1hdGNoZXMgJiYgKG1hdGNoZXMubGVuZ3RoIC0gMSkgPiBiaW5kaW5nSW5kZXggLSBpZHgpIHtcbiAgICAgICAgcmV0dXJuIGNvbnN0cnVjdERldGFpbHNGb3JJbnRlcnBvbGF0aW9uKGxWaWV3LCBpZHgsIGJpbmRpbmdJbmRleCwgbWV0YSwgbmV3VmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4ge3Byb3BOYW1lOiB1bmRlZmluZWQsIG9sZFZhbHVlLCBuZXdWYWx1ZX07XG59XG4iXX0=