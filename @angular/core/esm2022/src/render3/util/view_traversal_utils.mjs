/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { assertDefined } from '../../util/assert';
import { assertLView } from '../assert';
import { readPatchedLView } from '../context_discovery';
import { isLContainer, isLView } from '../interfaces/type_checks';
import { CHILD_HEAD, CONTEXT, FLAGS, NEXT } from '../interfaces/view';
import { getLViewParent } from './view_utils';
/**
 * Retrieve the root view from any component or `LView` by walking the parent `LView` until
 * reaching the root `LView`.
 *
 * @param componentOrLView any component or `LView`
 */
export function getRootView(componentOrLView) {
    ngDevMode && assertDefined(componentOrLView, 'component');
    let lView = isLView(componentOrLView) ? componentOrLView : readPatchedLView(componentOrLView);
    while (lView && !(lView[FLAGS] & 512 /* LViewFlags.IsRoot */)) {
        lView = getLViewParent(lView);
    }
    ngDevMode && assertLView(lView);
    return lView;
}
/**
 * Returns the context information associated with the application where the target is situated. It
 * does this by walking the parent views until it gets to the root view, then getting the context
 * off of that.
 *
 * @param viewOrComponent the `LView` or component to get the root context for.
 */
export function getRootContext(viewOrComponent) {
    const rootView = getRootView(viewOrComponent);
    ngDevMode &&
        assertDefined(rootView[CONTEXT], 'Root view has no context. Perhaps it is disconnected?');
    return rootView[CONTEXT];
}
/**
 * Gets the first `LContainer` in the LView or `null` if none exists.
 */
export function getFirstLContainer(lView) {
    return getNearestLContainer(lView[CHILD_HEAD]);
}
/**
 * Gets the next `LContainer` that is a sibling of the given container.
 */
export function getNextLContainer(container) {
    return getNearestLContainer(container[NEXT]);
}
function getNearestLContainer(viewOrContainer) {
    while (viewOrContainer !== null && !isLContainer(viewOrContainer)) {
        viewOrContainer = viewOrContainer[NEXT];
    }
    return viewOrContainer;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld190cmF2ZXJzYWxfdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9yZW5kZXIzL3V0aWwvdmlld190cmF2ZXJzYWxfdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2hELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDdEMsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFFdEQsT0FBTyxFQUFDLFlBQVksRUFBRSxPQUFPLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUNoRSxPQUFPLEVBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQXFCLElBQUksRUFBUyxNQUFNLG9CQUFvQixDQUFDO0FBRS9GLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFHNUM7Ozs7O0dBS0c7QUFDSCxNQUFNLFVBQVUsV0FBVyxDQUFJLGdCQUEwQjtJQUN2RCxTQUFTLElBQUksYUFBYSxDQUFDLGdCQUFnQixFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQzFELElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUUsQ0FBQztJQUMvRixPQUFPLEtBQUssSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyw4QkFBb0IsQ0FBQyxFQUFFLENBQUM7UUFDcEQsS0FBSyxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUUsQ0FBQztJQUNqQyxDQUFDO0lBQ0QsU0FBUyxJQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoQyxPQUFPLEtBQWlCLENBQUM7QUFDM0IsQ0FBQztBQUVEOzs7Ozs7R0FNRztBQUNILE1BQU0sVUFBVSxjQUFjLENBQUksZUFBNEI7SUFDNUQsTUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQzlDLFNBQVM7UUFDTCxhQUFhLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLHVEQUF1RCxDQUFDLENBQUM7SUFDOUYsT0FBTyxRQUFRLENBQUMsT0FBTyxDQUFNLENBQUM7QUFDaEMsQ0FBQztBQUdEOztHQUVHO0FBQ0gsTUFBTSxVQUFVLGtCQUFrQixDQUFDLEtBQVk7SUFDN0MsT0FBTyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztBQUNqRCxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLFVBQVUsaUJBQWlCLENBQUMsU0FBcUI7SUFDckQsT0FBTyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUMvQyxDQUFDO0FBRUQsU0FBUyxvQkFBb0IsQ0FBQyxlQUFzQztJQUNsRSxPQUFPLGVBQWUsS0FBSyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQztRQUNsRSxlQUFlLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFDRCxPQUFPLGVBQW9DLENBQUM7QUFDOUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2Fzc2VydERlZmluZWR9IGZyb20gJy4uLy4uL3V0aWwvYXNzZXJ0JztcbmltcG9ydCB7YXNzZXJ0TFZpZXd9IGZyb20gJy4uL2Fzc2VydCc7XG5pbXBvcnQge3JlYWRQYXRjaGVkTFZpZXd9IGZyb20gJy4uL2NvbnRleHRfZGlzY292ZXJ5JztcbmltcG9ydCB7TENvbnRhaW5lcn0gZnJvbSAnLi4vaW50ZXJmYWNlcy9jb250YWluZXInO1xuaW1wb3J0IHtpc0xDb250YWluZXIsIGlzTFZpZXd9IGZyb20gJy4uL2ludGVyZmFjZXMvdHlwZV9jaGVja3MnO1xuaW1wb3J0IHtDSElMRF9IRUFELCBDT05URVhULCBGTEFHUywgTFZpZXcsIExWaWV3RmxhZ3MsIE5FWFQsIFBBUkVOVH0gZnJvbSAnLi4vaW50ZXJmYWNlcy92aWV3JztcblxuaW1wb3J0IHtnZXRMVmlld1BhcmVudH0gZnJvbSAnLi92aWV3X3V0aWxzJztcblxuXG4vKipcbiAqIFJldHJpZXZlIHRoZSByb290IHZpZXcgZnJvbSBhbnkgY29tcG9uZW50IG9yIGBMVmlld2AgYnkgd2Fsa2luZyB0aGUgcGFyZW50IGBMVmlld2AgdW50aWxcbiAqIHJlYWNoaW5nIHRoZSByb290IGBMVmlld2AuXG4gKlxuICogQHBhcmFtIGNvbXBvbmVudE9yTFZpZXcgYW55IGNvbXBvbmVudCBvciBgTFZpZXdgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRSb290VmlldzxUPihjb21wb25lbnRPckxWaWV3OiBMVmlld3x7fSk6IExWaWV3PFQ+IHtcbiAgbmdEZXZNb2RlICYmIGFzc2VydERlZmluZWQoY29tcG9uZW50T3JMVmlldywgJ2NvbXBvbmVudCcpO1xuICBsZXQgbFZpZXcgPSBpc0xWaWV3KGNvbXBvbmVudE9yTFZpZXcpID8gY29tcG9uZW50T3JMVmlldyA6IHJlYWRQYXRjaGVkTFZpZXcoY29tcG9uZW50T3JMVmlldykhO1xuICB3aGlsZSAobFZpZXcgJiYgIShsVmlld1tGTEFHU10gJiBMVmlld0ZsYWdzLklzUm9vdCkpIHtcbiAgICBsVmlldyA9IGdldExWaWV3UGFyZW50KGxWaWV3KSE7XG4gIH1cbiAgbmdEZXZNb2RlICYmIGFzc2VydExWaWV3KGxWaWV3KTtcbiAgcmV0dXJuIGxWaWV3IGFzIExWaWV3PFQ+O1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGNvbnRleHQgaW5mb3JtYXRpb24gYXNzb2NpYXRlZCB3aXRoIHRoZSBhcHBsaWNhdGlvbiB3aGVyZSB0aGUgdGFyZ2V0IGlzIHNpdHVhdGVkLiBJdFxuICogZG9lcyB0aGlzIGJ5IHdhbGtpbmcgdGhlIHBhcmVudCB2aWV3cyB1bnRpbCBpdCBnZXRzIHRvIHRoZSByb290IHZpZXcsIHRoZW4gZ2V0dGluZyB0aGUgY29udGV4dFxuICogb2ZmIG9mIHRoYXQuXG4gKlxuICogQHBhcmFtIHZpZXdPckNvbXBvbmVudCB0aGUgYExWaWV3YCBvciBjb21wb25lbnQgdG8gZ2V0IHRoZSByb290IGNvbnRleHQgZm9yLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Um9vdENvbnRleHQ8VD4odmlld09yQ29tcG9uZW50OiBMVmlldzxUPnx7fSk6IFQge1xuICBjb25zdCByb290VmlldyA9IGdldFJvb3RWaWV3KHZpZXdPckNvbXBvbmVudCk7XG4gIG5nRGV2TW9kZSAmJlxuICAgICAgYXNzZXJ0RGVmaW5lZChyb290Vmlld1tDT05URVhUXSwgJ1Jvb3QgdmlldyBoYXMgbm8gY29udGV4dC4gUGVyaGFwcyBpdCBpcyBkaXNjb25uZWN0ZWQ/Jyk7XG4gIHJldHVybiByb290Vmlld1tDT05URVhUXSBhcyBUO1xufVxuXG5cbi8qKlxuICogR2V0cyB0aGUgZmlyc3QgYExDb250YWluZXJgIGluIHRoZSBMVmlldyBvciBgbnVsbGAgaWYgbm9uZSBleGlzdHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRGaXJzdExDb250YWluZXIobFZpZXc6IExWaWV3KTogTENvbnRhaW5lcnxudWxsIHtcbiAgcmV0dXJuIGdldE5lYXJlc3RMQ29udGFpbmVyKGxWaWV3W0NISUxEX0hFQURdKTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBuZXh0IGBMQ29udGFpbmVyYCB0aGF0IGlzIGEgc2libGluZyBvZiB0aGUgZ2l2ZW4gY29udGFpbmVyLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmV4dExDb250YWluZXIoY29udGFpbmVyOiBMQ29udGFpbmVyKTogTENvbnRhaW5lcnxudWxsIHtcbiAgcmV0dXJuIGdldE5lYXJlc3RMQ29udGFpbmVyKGNvbnRhaW5lcltORVhUXSk7XG59XG5cbmZ1bmN0aW9uIGdldE5lYXJlc3RMQ29udGFpbmVyKHZpZXdPckNvbnRhaW5lcjogTENvbnRhaW5lcnxMVmlld3xudWxsKSB7XG4gIHdoaWxlICh2aWV3T3JDb250YWluZXIgIT09IG51bGwgJiYgIWlzTENvbnRhaW5lcih2aWV3T3JDb250YWluZXIpKSB7XG4gICAgdmlld09yQ29udGFpbmVyID0gdmlld09yQ29udGFpbmVyW05FWFRdO1xuICB9XG4gIHJldHVybiB2aWV3T3JDb250YWluZXIgYXMgTENvbnRhaW5lciB8IG51bGw7XG59XG4iXX0=