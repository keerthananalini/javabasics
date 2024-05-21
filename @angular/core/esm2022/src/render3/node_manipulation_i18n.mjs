/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { assertDomNode, assertIndexInRange } from '../util/assert';
import { getInsertInFrontOfRNodeWithNoI18n, nativeInsertBefore } from './node_manipulation';
import { unwrapRNode } from './util/view_utils';
/**
 * Find a node in front of which `currentTNode` should be inserted (takes i18n into account).
 *
 * This method determines the `RNode` in front of which we should insert the `currentRNode`. This
 * takes `TNode.insertBeforeIndex` into account.
 *
 * @param parentTNode parent `TNode`
 * @param currentTNode current `TNode` (The node which we would like to insert into the DOM)
 * @param lView current `LView`
 */
export function getInsertInFrontOfRNodeWithI18n(parentTNode, currentTNode, lView) {
    const tNodeInsertBeforeIndex = currentTNode.insertBeforeIndex;
    const insertBeforeIndex = Array.isArray(tNodeInsertBeforeIndex) ? tNodeInsertBeforeIndex[0] : tNodeInsertBeforeIndex;
    if (insertBeforeIndex === null) {
        return getInsertInFrontOfRNodeWithNoI18n(parentTNode, currentTNode, lView);
    }
    else {
        ngDevMode && assertIndexInRange(lView, insertBeforeIndex);
        return unwrapRNode(lView[insertBeforeIndex]);
    }
}
/**
 * Process `TNode.insertBeforeIndex` by adding i18n text nodes.
 *
 * See `TNode.insertBeforeIndex`
 */
export function processI18nInsertBefore(renderer, childTNode, lView, childRNode, parentRElement) {
    const tNodeInsertBeforeIndex = childTNode.insertBeforeIndex;
    if (Array.isArray(tNodeInsertBeforeIndex)) {
        // An array indicates that there are i18n nodes that need to be added as children of this
        // `childRNode`. These i18n nodes were created before this `childRNode` was available and so
        // only now can be added. The first element of the array is the normal index where we should
        // insert the `childRNode`. Additional elements are the extra nodes to be added as children of
        // `childRNode`.
        ngDevMode && assertDomNode(childRNode);
        let i18nParent = childRNode;
        let anchorRNode = null;
        if (!(childTNode.type & 3 /* TNodeType.AnyRNode */)) {
            anchorRNode = i18nParent;
            i18nParent = parentRElement;
        }
        if (i18nParent !== null && childTNode.componentOffset === -1) {
            for (let i = 1; i < tNodeInsertBeforeIndex.length; i++) {
                // No need to `unwrapRNode` because all of the indexes point to i18n text nodes.
                // see `assertDomNode` below.
                const i18nChild = lView[tNodeInsertBeforeIndex[i]];
                nativeInsertBefore(renderer, i18nParent, i18nChild, anchorRNode, false);
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZV9tYW5pcHVsYXRpb25faTE4bi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3JlbmRlcjMvbm9kZV9tYW5pcHVsYXRpb25faTE4bi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsYUFBYSxFQUFFLGtCQUFrQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFNakUsT0FBTyxFQUFDLGlDQUFpQyxFQUFFLGtCQUFrQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDMUYsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRzlDOzs7Ozs7Ozs7R0FTRztBQUNILE1BQU0sVUFBVSwrQkFBK0IsQ0FDM0MsV0FBa0IsRUFBRSxZQUFtQixFQUFFLEtBQVk7SUFDdkQsTUFBTSxzQkFBc0IsR0FBRyxZQUFZLENBQUMsaUJBQWlCLENBQUM7SUFDOUQsTUFBTSxpQkFBaUIsR0FDbkIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsc0JBQXNCLENBQUM7SUFDL0YsSUFBSSxpQkFBaUIsS0FBSyxJQUFJLEVBQUUsQ0FBQztRQUMvQixPQUFPLGlDQUFpQyxDQUFDLFdBQVcsRUFBRSxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDN0UsQ0FBQztTQUFNLENBQUM7UUFDTixTQUFTLElBQUksa0JBQWtCLENBQUMsS0FBSyxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDMUQsT0FBTyxXQUFXLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztJQUMvQyxDQUFDO0FBQ0gsQ0FBQztBQUdEOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsdUJBQXVCLENBQ25DLFFBQWtCLEVBQUUsVUFBaUIsRUFBRSxLQUFZLEVBQUUsVUFBeUIsRUFDOUUsY0FBNkI7SUFDL0IsTUFBTSxzQkFBc0IsR0FBRyxVQUFVLENBQUMsaUJBQWlCLENBQUM7SUFDNUQsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLHNCQUFzQixDQUFDLEVBQUUsQ0FBQztRQUMxQyx5RkFBeUY7UUFDekYsNEZBQTRGO1FBQzVGLDRGQUE0RjtRQUM1Riw4RkFBOEY7UUFDOUYsZ0JBQWdCO1FBQ2hCLFNBQVMsSUFBSSxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDdkMsSUFBSSxVQUFVLEdBQWtCLFVBQXNCLENBQUM7UUFDdkQsSUFBSSxXQUFXLEdBQWUsSUFBSSxDQUFDO1FBQ25DLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLDZCQUFxQixDQUFDLEVBQUUsQ0FBQztZQUM1QyxXQUFXLEdBQUcsVUFBVSxDQUFDO1lBQ3pCLFVBQVUsR0FBRyxjQUFjLENBQUM7UUFDOUIsQ0FBQztRQUNELElBQUksVUFBVSxLQUFLLElBQUksSUFBSSxVQUFVLENBQUMsZUFBZSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDN0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLHNCQUFzQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUN2RCxnRkFBZ0Y7Z0JBQ2hGLDZCQUE2QjtnQkFDN0IsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25ELGtCQUFrQixDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUMxRSxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7YXNzZXJ0RG9tTm9kZSwgYXNzZXJ0SW5kZXhJblJhbmdlfSBmcm9tICcuLi91dGlsL2Fzc2VydCc7XG5cbmltcG9ydCB7VE5vZGUsIFROb2RlRmxhZ3MsIFROb2RlVHlwZX0gZnJvbSAnLi9pbnRlcmZhY2VzL25vZGUnO1xuaW1wb3J0IHtSZW5kZXJlcn0gZnJvbSAnLi9pbnRlcmZhY2VzL3JlbmRlcmVyJztcbmltcG9ydCB7UkVsZW1lbnQsIFJOb2RlfSBmcm9tICcuL2ludGVyZmFjZXMvcmVuZGVyZXJfZG9tJztcbmltcG9ydCB7TFZpZXd9IGZyb20gJy4vaW50ZXJmYWNlcy92aWV3JztcbmltcG9ydCB7Z2V0SW5zZXJ0SW5Gcm9udE9mUk5vZGVXaXRoTm9JMThuLCBuYXRpdmVJbnNlcnRCZWZvcmV9IGZyb20gJy4vbm9kZV9tYW5pcHVsYXRpb24nO1xuaW1wb3J0IHt1bndyYXBSTm9kZX0gZnJvbSAnLi91dGlsL3ZpZXdfdXRpbHMnO1xuXG5cbi8qKlxuICogRmluZCBhIG5vZGUgaW4gZnJvbnQgb2Ygd2hpY2ggYGN1cnJlbnRUTm9kZWAgc2hvdWxkIGJlIGluc2VydGVkICh0YWtlcyBpMThuIGludG8gYWNjb3VudCkuXG4gKlxuICogVGhpcyBtZXRob2QgZGV0ZXJtaW5lcyB0aGUgYFJOb2RlYCBpbiBmcm9udCBvZiB3aGljaCB3ZSBzaG91bGQgaW5zZXJ0IHRoZSBgY3VycmVudFJOb2RlYC4gVGhpc1xuICogdGFrZXMgYFROb2RlLmluc2VydEJlZm9yZUluZGV4YCBpbnRvIGFjY291bnQuXG4gKlxuICogQHBhcmFtIHBhcmVudFROb2RlIHBhcmVudCBgVE5vZGVgXG4gKiBAcGFyYW0gY3VycmVudFROb2RlIGN1cnJlbnQgYFROb2RlYCAoVGhlIG5vZGUgd2hpY2ggd2Ugd291bGQgbGlrZSB0byBpbnNlcnQgaW50byB0aGUgRE9NKVxuICogQHBhcmFtIGxWaWV3IGN1cnJlbnQgYExWaWV3YFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW5zZXJ0SW5Gcm9udE9mUk5vZGVXaXRoSTE4bihcbiAgICBwYXJlbnRUTm9kZTogVE5vZGUsIGN1cnJlbnRUTm9kZTogVE5vZGUsIGxWaWV3OiBMVmlldyk6IFJOb2RlfG51bGwge1xuICBjb25zdCB0Tm9kZUluc2VydEJlZm9yZUluZGV4ID0gY3VycmVudFROb2RlLmluc2VydEJlZm9yZUluZGV4O1xuICBjb25zdCBpbnNlcnRCZWZvcmVJbmRleCA9XG4gICAgICBBcnJheS5pc0FycmF5KHROb2RlSW5zZXJ0QmVmb3JlSW5kZXgpID8gdE5vZGVJbnNlcnRCZWZvcmVJbmRleFswXSA6IHROb2RlSW5zZXJ0QmVmb3JlSW5kZXg7XG4gIGlmIChpbnNlcnRCZWZvcmVJbmRleCA9PT0gbnVsbCkge1xuICAgIHJldHVybiBnZXRJbnNlcnRJbkZyb250T2ZSTm9kZVdpdGhOb0kxOG4ocGFyZW50VE5vZGUsIGN1cnJlbnRUTm9kZSwgbFZpZXcpO1xuICB9IGVsc2Uge1xuICAgIG5nRGV2TW9kZSAmJiBhc3NlcnRJbmRleEluUmFuZ2UobFZpZXcsIGluc2VydEJlZm9yZUluZGV4KTtcbiAgICByZXR1cm4gdW53cmFwUk5vZGUobFZpZXdbaW5zZXJ0QmVmb3JlSW5kZXhdKTtcbiAgfVxufVxuXG5cbi8qKlxuICogUHJvY2VzcyBgVE5vZGUuaW5zZXJ0QmVmb3JlSW5kZXhgIGJ5IGFkZGluZyBpMThuIHRleHQgbm9kZXMuXG4gKlxuICogU2VlIGBUTm9kZS5pbnNlcnRCZWZvcmVJbmRleGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3NJMThuSW5zZXJ0QmVmb3JlKFxuICAgIHJlbmRlcmVyOiBSZW5kZXJlciwgY2hpbGRUTm9kZTogVE5vZGUsIGxWaWV3OiBMVmlldywgY2hpbGRSTm9kZTogUk5vZGV8Uk5vZGVbXSxcbiAgICBwYXJlbnRSRWxlbWVudDogUkVsZW1lbnR8bnVsbCk6IHZvaWQge1xuICBjb25zdCB0Tm9kZUluc2VydEJlZm9yZUluZGV4ID0gY2hpbGRUTm9kZS5pbnNlcnRCZWZvcmVJbmRleDtcbiAgaWYgKEFycmF5LmlzQXJyYXkodE5vZGVJbnNlcnRCZWZvcmVJbmRleCkpIHtcbiAgICAvLyBBbiBhcnJheSBpbmRpY2F0ZXMgdGhhdCB0aGVyZSBhcmUgaTE4biBub2RlcyB0aGF0IG5lZWQgdG8gYmUgYWRkZWQgYXMgY2hpbGRyZW4gb2YgdGhpc1xuICAgIC8vIGBjaGlsZFJOb2RlYC4gVGhlc2UgaTE4biBub2RlcyB3ZXJlIGNyZWF0ZWQgYmVmb3JlIHRoaXMgYGNoaWxkUk5vZGVgIHdhcyBhdmFpbGFibGUgYW5kIHNvXG4gICAgLy8gb25seSBub3cgY2FuIGJlIGFkZGVkLiBUaGUgZmlyc3QgZWxlbWVudCBvZiB0aGUgYXJyYXkgaXMgdGhlIG5vcm1hbCBpbmRleCB3aGVyZSB3ZSBzaG91bGRcbiAgICAvLyBpbnNlcnQgdGhlIGBjaGlsZFJOb2RlYC4gQWRkaXRpb25hbCBlbGVtZW50cyBhcmUgdGhlIGV4dHJhIG5vZGVzIHRvIGJlIGFkZGVkIGFzIGNoaWxkcmVuIG9mXG4gICAgLy8gYGNoaWxkUk5vZGVgLlxuICAgIG5nRGV2TW9kZSAmJiBhc3NlcnREb21Ob2RlKGNoaWxkUk5vZGUpO1xuICAgIGxldCBpMThuUGFyZW50OiBSRWxlbWVudHxudWxsID0gY2hpbGRSTm9kZSBhcyBSRWxlbWVudDtcbiAgICBsZXQgYW5jaG9yUk5vZGU6IFJOb2RlfG51bGwgPSBudWxsO1xuICAgIGlmICghKGNoaWxkVE5vZGUudHlwZSAmIFROb2RlVHlwZS5BbnlSTm9kZSkpIHtcbiAgICAgIGFuY2hvclJOb2RlID0gaTE4blBhcmVudDtcbiAgICAgIGkxOG5QYXJlbnQgPSBwYXJlbnRSRWxlbWVudDtcbiAgICB9XG4gICAgaWYgKGkxOG5QYXJlbnQgIT09IG51bGwgJiYgY2hpbGRUTm9kZS5jb21wb25lbnRPZmZzZXQgPT09IC0xKSB7XG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHROb2RlSW5zZXJ0QmVmb3JlSW5kZXgubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gTm8gbmVlZCB0byBgdW53cmFwUk5vZGVgIGJlY2F1c2UgYWxsIG9mIHRoZSBpbmRleGVzIHBvaW50IHRvIGkxOG4gdGV4dCBub2Rlcy5cbiAgICAgICAgLy8gc2VlIGBhc3NlcnREb21Ob2RlYCBiZWxvdy5cbiAgICAgICAgY29uc3QgaTE4bkNoaWxkID0gbFZpZXdbdE5vZGVJbnNlcnRCZWZvcmVJbmRleFtpXV07XG4gICAgICAgIG5hdGl2ZUluc2VydEJlZm9yZShyZW5kZXJlciwgaTE4blBhcmVudCwgaTE4bkNoaWxkLCBhbmNob3JSTm9kZSwgZmFsc2UpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19