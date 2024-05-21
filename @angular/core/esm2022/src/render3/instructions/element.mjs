/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { invalidSkipHydrationHost, validateMatchingNode, validateNodeExists } from '../../hydration/error_handling';
import { locateNextRNode } from '../../hydration/node_lookup_utils';
import { hasSkipHydrationAttrOnRElement, hasSkipHydrationAttrOnTNode } from '../../hydration/skip_hydration';
import { getSerializedContainerViews, isDisconnectedNode, markRNodeAsClaimedByHydration, markRNodeAsSkippedByHydration, setSegmentHead } from '../../hydration/utils';
import { isDetachedByI18n } from '../../i18n/utils';
import { assertDefined, assertEqual, assertIndexInRange } from '../../util/assert';
import { assertFirstCreatePass, assertHasParent } from '../assert';
import { attachPatchData } from '../context_discovery';
import { registerPostOrderHooks } from '../hooks';
import { hasClassInput, hasStyleInput } from '../interfaces/node';
import { isComponentHost, isContentQueryHost, isDirectiveHost } from '../interfaces/type_checks';
import { HEADER_OFFSET, HYDRATION, RENDERER } from '../interfaces/view';
import { assertTNodeType } from '../node_assert';
import { appendChild, clearElementContents, createElementNode, setupStaticAttributes } from '../node_manipulation';
import { decreaseElementDepthCount, enterSkipHydrationBlock, getBindingIndex, getCurrentTNode, getElementDepthCount, getLView, getNamespace, getTView, increaseElementDepthCount, isCurrentTNodeParent, isInSkipHydrationBlock, isSkipHydrationRootTNode, lastNodeWasCreated, leaveSkipHydrationBlock, setCurrentTNode, setCurrentTNodeAsNotParent, wasLastNodeCreated } from '../state';
import { computeStaticStyling } from '../styling/static_styling';
import { getConstant } from '../util/view_utils';
import { validateElementIsKnown } from './element_validation';
import { setDirectiveInputsWhichShadowsStyling } from './property';
import { createDirectivesInstances, executeContentQueries, getOrCreateTNode, resolveDirectives, saveResolvedLocalsInData } from './shared';
function elementStartFirstCreatePass(index, tView, lView, name, attrsIndex, localRefsIndex) {
    ngDevMode && assertFirstCreatePass(tView);
    ngDevMode && ngDevMode.firstCreatePass++;
    const tViewConsts = tView.consts;
    const attrs = getConstant(tViewConsts, attrsIndex);
    const tNode = getOrCreateTNode(tView, index, 2 /* TNodeType.Element */, name, attrs);
    resolveDirectives(tView, lView, tNode, getConstant(tViewConsts, localRefsIndex));
    if (tNode.attrs !== null) {
        computeStaticStyling(tNode, tNode.attrs, false);
    }
    if (tNode.mergedAttrs !== null) {
        computeStaticStyling(tNode, tNode.mergedAttrs, true);
    }
    if (tView.queries !== null) {
        tView.queries.elementStart(tView, tNode);
    }
    return tNode;
}
/**
 * Create DOM element. The instruction must later be followed by `elementEnd()` call.
 *
 * @param index Index of the element in the LView array
 * @param name Name of the DOM Node
 * @param attrsIndex Index of the element's attributes in the `consts` array.
 * @param localRefsIndex Index of the element's local references in the `consts` array.
 * @returns This function returns itself so that it may be chained.
 *
 * Attributes and localRefs are passed as an array of strings where elements with an even index
 * hold an attribute name and elements with an odd index hold an attribute value, ex.:
 * ['id', 'warning5', 'class', 'alert']
 *
 * @codeGenApi
 */
export function ɵɵelementStart(index, name, attrsIndex, localRefsIndex) {
    const lView = getLView();
    const tView = getTView();
    const adjustedIndex = HEADER_OFFSET + index;
    ngDevMode &&
        assertEqual(getBindingIndex(), tView.bindingStartIndex, 'elements should be created before any bindings');
    ngDevMode && assertIndexInRange(lView, adjustedIndex);
    const renderer = lView[RENDERER];
    const tNode = tView.firstCreatePass ?
        elementStartFirstCreatePass(adjustedIndex, tView, lView, name, attrsIndex, localRefsIndex) :
        tView.data[adjustedIndex];
    const native = _locateOrCreateElementNode(tView, lView, tNode, renderer, name, index);
    lView[adjustedIndex] = native;
    const hasDirectives = isDirectiveHost(tNode);
    if (ngDevMode && tView.firstCreatePass) {
        validateElementIsKnown(native, lView, tNode.value, tView.schemas, hasDirectives);
    }
    setCurrentTNode(tNode, true);
    setupStaticAttributes(renderer, native, tNode);
    if (!isDetachedByI18n(tNode) && wasLastNodeCreated()) {
        // In the i18n case, the translation may have removed this element, so only add it if it is not
        // detached. See `TNodeType.Placeholder` and `LFrame.inI18n` for more context.
        appendChild(tView, lView, native, tNode);
    }
    // any immediate children of a component or template container must be pre-emptively
    // monkey-patched with the component view data so that the element can be inspected
    // later on using any element discovery utility methods (see `element_discovery.ts`)
    if (getElementDepthCount() === 0) {
        attachPatchData(native, lView);
    }
    increaseElementDepthCount();
    if (hasDirectives) {
        createDirectivesInstances(tView, lView, tNode);
        executeContentQueries(tView, tNode, lView);
    }
    if (localRefsIndex !== null) {
        saveResolvedLocalsInData(lView, tNode);
    }
    return ɵɵelementStart;
}
/**
 * Mark the end of the element.
 * @returns This function returns itself so that it may be chained.
 *
 * @codeGenApi
 */
export function ɵɵelementEnd() {
    let currentTNode = getCurrentTNode();
    ngDevMode && assertDefined(currentTNode, 'No parent node to close.');
    if (isCurrentTNodeParent()) {
        setCurrentTNodeAsNotParent();
    }
    else {
        ngDevMode && assertHasParent(getCurrentTNode());
        currentTNode = currentTNode.parent;
        setCurrentTNode(currentTNode, false);
    }
    const tNode = currentTNode;
    ngDevMode && assertTNodeType(tNode, 3 /* TNodeType.AnyRNode */);
    if (isSkipHydrationRootTNode(tNode)) {
        leaveSkipHydrationBlock();
    }
    decreaseElementDepthCount();
    const tView = getTView();
    if (tView.firstCreatePass) {
        registerPostOrderHooks(tView, currentTNode);
        if (isContentQueryHost(currentTNode)) {
            tView.queries.elementEnd(currentTNode);
        }
    }
    if (tNode.classesWithoutHost != null && hasClassInput(tNode)) {
        setDirectiveInputsWhichShadowsStyling(tView, tNode, getLView(), tNode.classesWithoutHost, true);
    }
    if (tNode.stylesWithoutHost != null && hasStyleInput(tNode)) {
        setDirectiveInputsWhichShadowsStyling(tView, tNode, getLView(), tNode.stylesWithoutHost, false);
    }
    return ɵɵelementEnd;
}
/**
 * Creates an empty element using {@link elementStart} and {@link elementEnd}
 *
 * @param index Index of the element in the data array
 * @param name Name of the DOM Node
 * @param attrsIndex Index of the element's attributes in the `consts` array.
 * @param localRefsIndex Index of the element's local references in the `consts` array.
 * @returns This function returns itself so that it may be chained.
 *
 * @codeGenApi
 */
export function ɵɵelement(index, name, attrsIndex, localRefsIndex) {
    ɵɵelementStart(index, name, attrsIndex, localRefsIndex);
    ɵɵelementEnd();
    return ɵɵelement;
}
let _locateOrCreateElementNode = (tView, lView, tNode, renderer, name, index) => {
    lastNodeWasCreated(true);
    return createElementNode(renderer, name, getNamespace());
};
/**
 * Enables hydration code path (to lookup existing elements in DOM)
 * in addition to the regular creation mode of element nodes.
 */
function locateOrCreateElementNodeImpl(tView, lView, tNode, renderer, name, index) {
    const hydrationInfo = lView[HYDRATION];
    const isNodeCreationMode = !hydrationInfo || isInSkipHydrationBlock() ||
        isDetachedByI18n(tNode) || isDisconnectedNode(hydrationInfo, index);
    lastNodeWasCreated(isNodeCreationMode);
    // Regular creation mode.
    if (isNodeCreationMode) {
        return createElementNode(renderer, name, getNamespace());
    }
    // Hydration mode, looking up an existing element in DOM.
    const native = locateNextRNode(hydrationInfo, tView, lView, tNode);
    ngDevMode && validateMatchingNode(native, Node.ELEMENT_NODE, name, lView, tNode);
    ngDevMode && markRNodeAsClaimedByHydration(native);
    // This element might also be an anchor of a view container.
    if (getSerializedContainerViews(hydrationInfo, index)) {
        // Important note: this element acts as an anchor, but it's **not** a part
        // of the embedded view, so we start the segment **after** this element, taking
        // a reference to the next sibling. For example, the following template:
        // `<div #vcrTarget>` is represented in the DOM as `<div></div>...<!--container-->`,
        // so while processing a `<div>` instruction, point to the next sibling as a
        // start of a segment.
        ngDevMode && validateNodeExists(native.nextSibling, lView, tNode);
        setSegmentHead(hydrationInfo, index, native.nextSibling);
    }
    // Checks if the skip hydration attribute is present during hydration so we know to
    // skip attempting to hydrate this block. We check both TNode and RElement for an
    // attribute: the RElement case is needed for i18n cases, when we add it to host
    // elements during the annotation phase (after all internal data structures are setup).
    if (hydrationInfo &&
        (hasSkipHydrationAttrOnTNode(tNode) || hasSkipHydrationAttrOnRElement(native))) {
        if (isComponentHost(tNode)) {
            enterSkipHydrationBlock(tNode);
            // Since this isn't hydratable, we need to empty the node
            // so there's no duplicate content after render
            clearElementContents(native);
            ngDevMode && markRNodeAsSkippedByHydration(native);
        }
        else if (ngDevMode) {
            // If this is not a component host, throw an error.
            // Hydration can be skipped on per-component basis only.
            throw invalidSkipHydrationHost(native);
        }
    }
    return native;
}
export function enableLocateOrCreateElementNodeImpl() {
    _locateOrCreateElementNode = locateOrCreateElementNodeImpl;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlbWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3JlbmRlcjMvaW5zdHJ1Y3Rpb25zL2VsZW1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLHdCQUF3QixFQUFFLG9CQUFvQixFQUFFLGtCQUFrQixFQUFDLE1BQU0sZ0NBQWdDLENBQUM7QUFDbEgsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG1DQUFtQyxDQUFDO0FBQ2xFLE9BQU8sRUFBQyw4QkFBOEIsRUFBRSwyQkFBMkIsRUFBQyxNQUFNLGdDQUFnQyxDQUFDO0FBQzNHLE9BQU8sRUFBQywyQkFBMkIsRUFBRSxrQkFBa0IsRUFBRSw2QkFBNkIsRUFBRSw2QkFBNkIsRUFBRSxjQUFjLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNwSyxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUNsRCxPQUFPLEVBQUMsYUFBYSxFQUFFLFdBQVcsRUFBRSxrQkFBa0IsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pGLE9BQU8sRUFBQyxxQkFBcUIsRUFBRSxlQUFlLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDakUsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3JELE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUNoRCxPQUFPLEVBQUMsYUFBYSxFQUFFLGFBQWEsRUFBMEQsTUFBTSxvQkFBb0IsQ0FBQztBQUd6SCxPQUFPLEVBQUMsZUFBZSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQy9GLE9BQU8sRUFBQyxhQUFhLEVBQUUsU0FBUyxFQUFTLFFBQVEsRUFBUSxNQUFNLG9CQUFvQixDQUFDO0FBQ3BGLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMvQyxPQUFPLEVBQUMsV0FBVyxFQUFFLG9CQUFvQixFQUFFLGlCQUFpQixFQUFFLHFCQUFxQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDakgsT0FBTyxFQUFDLHlCQUF5QixFQUFFLHVCQUF1QixFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUUsb0JBQW9CLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUseUJBQXlCLEVBQUUsb0JBQW9CLEVBQUUsc0JBQXNCLEVBQUUsd0JBQXdCLEVBQUUsa0JBQWtCLEVBQUUsdUJBQXVCLEVBQUUsZUFBZSxFQUFFLDBCQUEwQixFQUFFLGtCQUFrQixFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ3ZYLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQy9ELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUUvQyxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUM1RCxPQUFPLEVBQUMscUNBQXFDLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDakUsT0FBTyxFQUFDLHlCQUF5QixFQUFFLHFCQUFxQixFQUFFLGdCQUFnQixFQUFFLGlCQUFpQixFQUFFLHdCQUF3QixFQUFDLE1BQU0sVUFBVSxDQUFDO0FBR3pJLFNBQVMsMkJBQTJCLENBQ2hDLEtBQWEsRUFBRSxLQUFZLEVBQUUsS0FBWSxFQUFFLElBQVksRUFBRSxVQUF3QixFQUNqRixjQUF1QjtJQUN6QixTQUFTLElBQUkscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUMsU0FBUyxJQUFJLFNBQVMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUV6QyxNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQ2pDLE1BQU0sS0FBSyxHQUFHLFdBQVcsQ0FBYyxXQUFXLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDaEUsTUFBTSxLQUFLLEdBQUcsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLEtBQUssNkJBQXFCLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUU3RSxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxXQUFXLENBQVcsV0FBVyxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUM7SUFFM0YsSUFBSSxLQUFLLENBQUMsS0FBSyxLQUFLLElBQUksRUFBRSxDQUFDO1FBQ3pCLG9CQUFvQixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFRCxJQUFJLEtBQUssQ0FBQyxXQUFXLEtBQUssSUFBSSxFQUFFLENBQUM7UUFDL0Isb0JBQW9CLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVELElBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxJQUFJLEVBQUUsQ0FBQztRQUMzQixLQUFLLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUVEOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBQ0gsTUFBTSxVQUFVLGNBQWMsQ0FDMUIsS0FBYSxFQUFFLElBQVksRUFBRSxVQUF3QixFQUNyRCxjQUF1QjtJQUN6QixNQUFNLEtBQUssR0FBRyxRQUFRLEVBQUUsQ0FBQztJQUN6QixNQUFNLEtBQUssR0FBRyxRQUFRLEVBQUUsQ0FBQztJQUN6QixNQUFNLGFBQWEsR0FBRyxhQUFhLEdBQUcsS0FBSyxDQUFDO0lBRTVDLFNBQVM7UUFDTCxXQUFXLENBQ1AsZUFBZSxFQUFFLEVBQUUsS0FBSyxDQUFDLGlCQUFpQixFQUMxQyxnREFBZ0QsQ0FBQyxDQUFDO0lBQzFELFNBQVMsSUFBSSxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFFdEQsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2pDLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUNqQywyQkFBMkIsQ0FBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFDNUYsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQWlCLENBQUM7SUFFOUMsTUFBTSxNQUFNLEdBQUcsMEJBQTBCLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN0RixLQUFLLENBQUMsYUFBYSxDQUFDLEdBQUcsTUFBTSxDQUFDO0lBRTlCLE1BQU0sYUFBYSxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUU3QyxJQUFJLFNBQVMsSUFBSSxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDdkMsc0JBQXNCLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDbkYsQ0FBQztJQUVELGVBQWUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDN0IscUJBQXFCLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUUvQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLElBQUksa0JBQWtCLEVBQUUsRUFBRSxDQUFDO1FBQ3JELCtGQUErRjtRQUMvRiw4RUFBOEU7UUFDOUUsV0FBVyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCxvRkFBb0Y7SUFDcEYsbUZBQW1GO0lBQ25GLG9GQUFvRjtJQUNwRixJQUFJLG9CQUFvQixFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDakMsZUFBZSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBQ0QseUJBQXlCLEVBQUUsQ0FBQztJQUU1QixJQUFJLGFBQWEsRUFBRSxDQUFDO1FBQ2xCLHlCQUF5QixDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDL0MscUJBQXFCLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBQ0QsSUFBSSxjQUFjLEtBQUssSUFBSSxFQUFFLENBQUM7UUFDNUIsd0JBQXdCLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFDRCxPQUFPLGNBQWMsQ0FBQztBQUN4QixDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxNQUFNLFVBQVUsWUFBWTtJQUMxQixJQUFJLFlBQVksR0FBRyxlQUFlLEVBQUcsQ0FBQztJQUN0QyxTQUFTLElBQUksYUFBYSxDQUFDLFlBQVksRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO0lBQ3JFLElBQUksb0JBQW9CLEVBQUUsRUFBRSxDQUFDO1FBQzNCLDBCQUEwQixFQUFFLENBQUM7SUFDL0IsQ0FBQztTQUFNLENBQUM7UUFDTixTQUFTLElBQUksZUFBZSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7UUFDaEQsWUFBWSxHQUFHLFlBQVksQ0FBQyxNQUFPLENBQUM7UUFDcEMsZUFBZSxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQsTUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDO0lBQzNCLFNBQVMsSUFBSSxlQUFlLENBQUMsS0FBSyw2QkFBcUIsQ0FBQztJQUV4RCxJQUFJLHdCQUF3QixDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDcEMsdUJBQXVCLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBRUQseUJBQXlCLEVBQUUsQ0FBQztJQUU1QixNQUFNLEtBQUssR0FBRyxRQUFRLEVBQUUsQ0FBQztJQUN6QixJQUFJLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUMxQixzQkFBc0IsQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDNUMsSUFBSSxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDO1lBQ3JDLEtBQUssQ0FBQyxPQUFRLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzFDLENBQUM7SUFDSCxDQUFDO0lBRUQsSUFBSSxLQUFLLENBQUMsa0JBQWtCLElBQUksSUFBSSxJQUFJLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQzdELHFDQUFxQyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQUUsS0FBSyxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2xHLENBQUM7SUFFRCxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsSUFBSSxJQUFJLElBQUksYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDNUQscUNBQXFDLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsRUFBRSxLQUFLLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDbEcsQ0FBQztJQUNELE9BQU8sWUFBWSxDQUFDO0FBQ3RCLENBQUM7QUFFRDs7Ozs7Ozs7OztHQVVHO0FBQ0gsTUFBTSxVQUFVLFNBQVMsQ0FDckIsS0FBYSxFQUFFLElBQVksRUFBRSxVQUF3QixFQUNyRCxjQUF1QjtJQUN6QixjQUFjLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDeEQsWUFBWSxFQUFFLENBQUM7SUFDZixPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDO0FBRUQsSUFBSSwwQkFBMEIsR0FDMUIsQ0FBQyxLQUFZLEVBQUUsS0FBWSxFQUFFLEtBQVksRUFBRSxRQUFrQixFQUFFLElBQVksRUFBRSxLQUFhLEVBQUUsRUFBRTtJQUM1RixrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6QixPQUFPLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQztBQUMzRCxDQUFDLENBQUM7QUFFTjs7O0dBR0c7QUFDSCxTQUFTLDZCQUE2QixDQUNsQyxLQUFZLEVBQUUsS0FBWSxFQUFFLEtBQVksRUFBRSxRQUFrQixFQUFFLElBQVksRUFDMUUsS0FBYTtJQUNmLE1BQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN2QyxNQUFNLGtCQUFrQixHQUFHLENBQUMsYUFBYSxJQUFJLHNCQUFzQixFQUFFO1FBQ2pFLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxJQUFJLGtCQUFrQixDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN4RSxrQkFBa0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBRXZDLHlCQUF5QjtJQUN6QixJQUFJLGtCQUFrQixFQUFFLENBQUM7UUFDdkIsT0FBTyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELHlEQUF5RDtJQUN6RCxNQUFNLE1BQU0sR0FBRyxlQUFlLENBQVcsYUFBYSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFFLENBQUM7SUFDOUUsU0FBUyxJQUFJLG9CQUFvQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDakYsU0FBUyxJQUFJLDZCQUE2QixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRW5ELDREQUE0RDtJQUM1RCxJQUFJLDJCQUEyQixDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQ3RELDBFQUEwRTtRQUMxRSwrRUFBK0U7UUFDL0Usd0VBQXdFO1FBQ3hFLG9GQUFvRjtRQUNwRiw0RUFBNEU7UUFDNUUsc0JBQXNCO1FBQ3RCLFNBQVMsSUFBSSxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNsRSxjQUFjLENBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELG1GQUFtRjtJQUNuRixpRkFBaUY7SUFDakYsZ0ZBQWdGO0lBQ2hGLHVGQUF1RjtJQUN2RixJQUFJLGFBQWE7UUFDYixDQUFDLDJCQUEyQixDQUFDLEtBQUssQ0FBQyxJQUFJLDhCQUE4QixDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNuRixJQUFJLGVBQWUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQzNCLHVCQUF1QixDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRS9CLHlEQUF5RDtZQUN6RCwrQ0FBK0M7WUFDL0Msb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFN0IsU0FBUyxJQUFJLDZCQUE2QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXJELENBQUM7YUFBTSxJQUFJLFNBQVMsRUFBRSxDQUFDO1lBQ3JCLG1EQUFtRDtZQUNuRCx3REFBd0Q7WUFDeEQsTUFBTSx3QkFBd0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6QyxDQUFDO0lBQ0gsQ0FBQztJQUNELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFFRCxNQUFNLFVBQVUsbUNBQW1DO0lBQ2pELDBCQUEwQixHQUFHLDZCQUE2QixDQUFDO0FBQzdELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtpbnZhbGlkU2tpcEh5ZHJhdGlvbkhvc3QsIHZhbGlkYXRlTWF0Y2hpbmdOb2RlLCB2YWxpZGF0ZU5vZGVFeGlzdHN9IGZyb20gJy4uLy4uL2h5ZHJhdGlvbi9lcnJvcl9oYW5kbGluZyc7XG5pbXBvcnQge2xvY2F0ZU5leHRSTm9kZX0gZnJvbSAnLi4vLi4vaHlkcmF0aW9uL25vZGVfbG9va3VwX3V0aWxzJztcbmltcG9ydCB7aGFzU2tpcEh5ZHJhdGlvbkF0dHJPblJFbGVtZW50LCBoYXNTa2lwSHlkcmF0aW9uQXR0ck9uVE5vZGV9IGZyb20gJy4uLy4uL2h5ZHJhdGlvbi9za2lwX2h5ZHJhdGlvbic7XG5pbXBvcnQge2dldFNlcmlhbGl6ZWRDb250YWluZXJWaWV3cywgaXNEaXNjb25uZWN0ZWROb2RlLCBtYXJrUk5vZGVBc0NsYWltZWRCeUh5ZHJhdGlvbiwgbWFya1JOb2RlQXNTa2lwcGVkQnlIeWRyYXRpb24sIHNldFNlZ21lbnRIZWFkfSBmcm9tICcuLi8uLi9oeWRyYXRpb24vdXRpbHMnO1xuaW1wb3J0IHtpc0RldGFjaGVkQnlJMThufSBmcm9tICcuLi8uLi9pMThuL3V0aWxzJztcbmltcG9ydCB7YXNzZXJ0RGVmaW5lZCwgYXNzZXJ0RXF1YWwsIGFzc2VydEluZGV4SW5SYW5nZX0gZnJvbSAnLi4vLi4vdXRpbC9hc3NlcnQnO1xuaW1wb3J0IHthc3NlcnRGaXJzdENyZWF0ZVBhc3MsIGFzc2VydEhhc1BhcmVudH0gZnJvbSAnLi4vYXNzZXJ0JztcbmltcG9ydCB7YXR0YWNoUGF0Y2hEYXRhfSBmcm9tICcuLi9jb250ZXh0X2Rpc2NvdmVyeSc7XG5pbXBvcnQge3JlZ2lzdGVyUG9zdE9yZGVySG9va3N9IGZyb20gJy4uL2hvb2tzJztcbmltcG9ydCB7aGFzQ2xhc3NJbnB1dCwgaGFzU3R5bGVJbnB1dCwgVEF0dHJpYnV0ZXMsIFRFbGVtZW50Tm9kZSwgVE5vZGUsIFROb2RlRmxhZ3MsIFROb2RlVHlwZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9ub2RlJztcbmltcG9ydCB7UmVuZGVyZXJ9IGZyb20gJy4uL2ludGVyZmFjZXMvcmVuZGVyZXInO1xuaW1wb3J0IHtSRWxlbWVudH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9yZW5kZXJlcl9kb20nO1xuaW1wb3J0IHtpc0NvbXBvbmVudEhvc3QsIGlzQ29udGVudFF1ZXJ5SG9zdCwgaXNEaXJlY3RpdmVIb3N0fSBmcm9tICcuLi9pbnRlcmZhY2VzL3R5cGVfY2hlY2tzJztcbmltcG9ydCB7SEVBREVSX09GRlNFVCwgSFlEUkFUSU9OLCBMVmlldywgUkVOREVSRVIsIFRWaWV3fSBmcm9tICcuLi9pbnRlcmZhY2VzL3ZpZXcnO1xuaW1wb3J0IHthc3NlcnRUTm9kZVR5cGV9IGZyb20gJy4uL25vZGVfYXNzZXJ0JztcbmltcG9ydCB7YXBwZW5kQ2hpbGQsIGNsZWFyRWxlbWVudENvbnRlbnRzLCBjcmVhdGVFbGVtZW50Tm9kZSwgc2V0dXBTdGF0aWNBdHRyaWJ1dGVzfSBmcm9tICcuLi9ub2RlX21hbmlwdWxhdGlvbic7XG5pbXBvcnQge2RlY3JlYXNlRWxlbWVudERlcHRoQ291bnQsIGVudGVyU2tpcEh5ZHJhdGlvbkJsb2NrLCBnZXRCaW5kaW5nSW5kZXgsIGdldEN1cnJlbnRUTm9kZSwgZ2V0RWxlbWVudERlcHRoQ291bnQsIGdldExWaWV3LCBnZXROYW1lc3BhY2UsIGdldFRWaWV3LCBpbmNyZWFzZUVsZW1lbnREZXB0aENvdW50LCBpc0N1cnJlbnRUTm9kZVBhcmVudCwgaXNJblNraXBIeWRyYXRpb25CbG9jaywgaXNTa2lwSHlkcmF0aW9uUm9vdFROb2RlLCBsYXN0Tm9kZVdhc0NyZWF0ZWQsIGxlYXZlU2tpcEh5ZHJhdGlvbkJsb2NrLCBzZXRDdXJyZW50VE5vZGUsIHNldEN1cnJlbnRUTm9kZUFzTm90UGFyZW50LCB3YXNMYXN0Tm9kZUNyZWF0ZWR9IGZyb20gJy4uL3N0YXRlJztcbmltcG9ydCB7Y29tcHV0ZVN0YXRpY1N0eWxpbmd9IGZyb20gJy4uL3N0eWxpbmcvc3RhdGljX3N0eWxpbmcnO1xuaW1wb3J0IHtnZXRDb25zdGFudH0gZnJvbSAnLi4vdXRpbC92aWV3X3V0aWxzJztcblxuaW1wb3J0IHt2YWxpZGF0ZUVsZW1lbnRJc0tub3dufSBmcm9tICcuL2VsZW1lbnRfdmFsaWRhdGlvbic7XG5pbXBvcnQge3NldERpcmVjdGl2ZUlucHV0c1doaWNoU2hhZG93c1N0eWxpbmd9IGZyb20gJy4vcHJvcGVydHknO1xuaW1wb3J0IHtjcmVhdGVEaXJlY3RpdmVzSW5zdGFuY2VzLCBleGVjdXRlQ29udGVudFF1ZXJpZXMsIGdldE9yQ3JlYXRlVE5vZGUsIHJlc29sdmVEaXJlY3RpdmVzLCBzYXZlUmVzb2x2ZWRMb2NhbHNJbkRhdGF9IGZyb20gJy4vc2hhcmVkJztcblxuXG5mdW5jdGlvbiBlbGVtZW50U3RhcnRGaXJzdENyZWF0ZVBhc3MoXG4gICAgaW5kZXg6IG51bWJlciwgdFZpZXc6IFRWaWV3LCBsVmlldzogTFZpZXcsIG5hbWU6IHN0cmluZywgYXR0cnNJbmRleD86IG51bWJlcnxudWxsLFxuICAgIGxvY2FsUmVmc0luZGV4PzogbnVtYmVyKTogVEVsZW1lbnROb2RlIHtcbiAgbmdEZXZNb2RlICYmIGFzc2VydEZpcnN0Q3JlYXRlUGFzcyh0Vmlldyk7XG4gIG5nRGV2TW9kZSAmJiBuZ0Rldk1vZGUuZmlyc3RDcmVhdGVQYXNzKys7XG5cbiAgY29uc3QgdFZpZXdDb25zdHMgPSB0Vmlldy5jb25zdHM7XG4gIGNvbnN0IGF0dHJzID0gZ2V0Q29uc3RhbnQ8VEF0dHJpYnV0ZXM+KHRWaWV3Q29uc3RzLCBhdHRyc0luZGV4KTtcbiAgY29uc3QgdE5vZGUgPSBnZXRPckNyZWF0ZVROb2RlKHRWaWV3LCBpbmRleCwgVE5vZGVUeXBlLkVsZW1lbnQsIG5hbWUsIGF0dHJzKTtcblxuICByZXNvbHZlRGlyZWN0aXZlcyh0VmlldywgbFZpZXcsIHROb2RlLCBnZXRDb25zdGFudDxzdHJpbmdbXT4odFZpZXdDb25zdHMsIGxvY2FsUmVmc0luZGV4KSk7XG5cbiAgaWYgKHROb2RlLmF0dHJzICE9PSBudWxsKSB7XG4gICAgY29tcHV0ZVN0YXRpY1N0eWxpbmcodE5vZGUsIHROb2RlLmF0dHJzLCBmYWxzZSk7XG4gIH1cblxuICBpZiAodE5vZGUubWVyZ2VkQXR0cnMgIT09IG51bGwpIHtcbiAgICBjb21wdXRlU3RhdGljU3R5bGluZyh0Tm9kZSwgdE5vZGUubWVyZ2VkQXR0cnMsIHRydWUpO1xuICB9XG5cbiAgaWYgKHRWaWV3LnF1ZXJpZXMgIT09IG51bGwpIHtcbiAgICB0Vmlldy5xdWVyaWVzLmVsZW1lbnRTdGFydCh0VmlldywgdE5vZGUpO1xuICB9XG5cbiAgcmV0dXJuIHROb2RlO1xufVxuXG4vKipcbiAqIENyZWF0ZSBET00gZWxlbWVudC4gVGhlIGluc3RydWN0aW9uIG11c3QgbGF0ZXIgYmUgZm9sbG93ZWQgYnkgYGVsZW1lbnRFbmQoKWAgY2FsbC5cbiAqXG4gKiBAcGFyYW0gaW5kZXggSW5kZXggb2YgdGhlIGVsZW1lbnQgaW4gdGhlIExWaWV3IGFycmF5XG4gKiBAcGFyYW0gbmFtZSBOYW1lIG9mIHRoZSBET00gTm9kZVxuICogQHBhcmFtIGF0dHJzSW5kZXggSW5kZXggb2YgdGhlIGVsZW1lbnQncyBhdHRyaWJ1dGVzIGluIHRoZSBgY29uc3RzYCBhcnJheS5cbiAqIEBwYXJhbSBsb2NhbFJlZnNJbmRleCBJbmRleCBvZiB0aGUgZWxlbWVudCdzIGxvY2FsIHJlZmVyZW5jZXMgaW4gdGhlIGBjb25zdHNgIGFycmF5LlxuICogQHJldHVybnMgVGhpcyBmdW5jdGlvbiByZXR1cm5zIGl0c2VsZiBzbyB0aGF0IGl0IG1heSBiZSBjaGFpbmVkLlxuICpcbiAqIEF0dHJpYnV0ZXMgYW5kIGxvY2FsUmVmcyBhcmUgcGFzc2VkIGFzIGFuIGFycmF5IG9mIHN0cmluZ3Mgd2hlcmUgZWxlbWVudHMgd2l0aCBhbiBldmVuIGluZGV4XG4gKiBob2xkIGFuIGF0dHJpYnV0ZSBuYW1lIGFuZCBlbGVtZW50cyB3aXRoIGFuIG9kZCBpbmRleCBob2xkIGFuIGF0dHJpYnV0ZSB2YWx1ZSwgZXguOlxuICogWydpZCcsICd3YXJuaW5nNScsICdjbGFzcycsICdhbGVydCddXG4gKlxuICogQGNvZGVHZW5BcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIMm1ybVlbGVtZW50U3RhcnQoXG4gICAgaW5kZXg6IG51bWJlciwgbmFtZTogc3RyaW5nLCBhdHRyc0luZGV4PzogbnVtYmVyfG51bGwsXG4gICAgbG9jYWxSZWZzSW5kZXg/OiBudW1iZXIpOiB0eXBlb2YgybXJtWVsZW1lbnRTdGFydCB7XG4gIGNvbnN0IGxWaWV3ID0gZ2V0TFZpZXcoKTtcbiAgY29uc3QgdFZpZXcgPSBnZXRUVmlldygpO1xuICBjb25zdCBhZGp1c3RlZEluZGV4ID0gSEVBREVSX09GRlNFVCArIGluZGV4O1xuXG4gIG5nRGV2TW9kZSAmJlxuICAgICAgYXNzZXJ0RXF1YWwoXG4gICAgICAgICAgZ2V0QmluZGluZ0luZGV4KCksIHRWaWV3LmJpbmRpbmdTdGFydEluZGV4LFxuICAgICAgICAgICdlbGVtZW50cyBzaG91bGQgYmUgY3JlYXRlZCBiZWZvcmUgYW55IGJpbmRpbmdzJyk7XG4gIG5nRGV2TW9kZSAmJiBhc3NlcnRJbmRleEluUmFuZ2UobFZpZXcsIGFkanVzdGVkSW5kZXgpO1xuXG4gIGNvbnN0IHJlbmRlcmVyID0gbFZpZXdbUkVOREVSRVJdO1xuICBjb25zdCB0Tm9kZSA9IHRWaWV3LmZpcnN0Q3JlYXRlUGFzcyA/XG4gICAgICBlbGVtZW50U3RhcnRGaXJzdENyZWF0ZVBhc3MoYWRqdXN0ZWRJbmRleCwgdFZpZXcsIGxWaWV3LCBuYW1lLCBhdHRyc0luZGV4LCBsb2NhbFJlZnNJbmRleCkgOlxuICAgICAgdFZpZXcuZGF0YVthZGp1c3RlZEluZGV4XSBhcyBURWxlbWVudE5vZGU7XG5cbiAgY29uc3QgbmF0aXZlID0gX2xvY2F0ZU9yQ3JlYXRlRWxlbWVudE5vZGUodFZpZXcsIGxWaWV3LCB0Tm9kZSwgcmVuZGVyZXIsIG5hbWUsIGluZGV4KTtcbiAgbFZpZXdbYWRqdXN0ZWRJbmRleF0gPSBuYXRpdmU7XG5cbiAgY29uc3QgaGFzRGlyZWN0aXZlcyA9IGlzRGlyZWN0aXZlSG9zdCh0Tm9kZSk7XG5cbiAgaWYgKG5nRGV2TW9kZSAmJiB0Vmlldy5maXJzdENyZWF0ZVBhc3MpIHtcbiAgICB2YWxpZGF0ZUVsZW1lbnRJc0tub3duKG5hdGl2ZSwgbFZpZXcsIHROb2RlLnZhbHVlLCB0Vmlldy5zY2hlbWFzLCBoYXNEaXJlY3RpdmVzKTtcbiAgfVxuXG4gIHNldEN1cnJlbnRUTm9kZSh0Tm9kZSwgdHJ1ZSk7XG4gIHNldHVwU3RhdGljQXR0cmlidXRlcyhyZW5kZXJlciwgbmF0aXZlLCB0Tm9kZSk7XG5cbiAgaWYgKCFpc0RldGFjaGVkQnlJMThuKHROb2RlKSAmJiB3YXNMYXN0Tm9kZUNyZWF0ZWQoKSkge1xuICAgIC8vIEluIHRoZSBpMThuIGNhc2UsIHRoZSB0cmFuc2xhdGlvbiBtYXkgaGF2ZSByZW1vdmVkIHRoaXMgZWxlbWVudCwgc28gb25seSBhZGQgaXQgaWYgaXQgaXMgbm90XG4gICAgLy8gZGV0YWNoZWQuIFNlZSBgVE5vZGVUeXBlLlBsYWNlaG9sZGVyYCBhbmQgYExGcmFtZS5pbkkxOG5gIGZvciBtb3JlIGNvbnRleHQuXG4gICAgYXBwZW5kQ2hpbGQodFZpZXcsIGxWaWV3LCBuYXRpdmUsIHROb2RlKTtcbiAgfVxuXG4gIC8vIGFueSBpbW1lZGlhdGUgY2hpbGRyZW4gb2YgYSBjb21wb25lbnQgb3IgdGVtcGxhdGUgY29udGFpbmVyIG11c3QgYmUgcHJlLWVtcHRpdmVseVxuICAvLyBtb25rZXktcGF0Y2hlZCB3aXRoIHRoZSBjb21wb25lbnQgdmlldyBkYXRhIHNvIHRoYXQgdGhlIGVsZW1lbnQgY2FuIGJlIGluc3BlY3RlZFxuICAvLyBsYXRlciBvbiB1c2luZyBhbnkgZWxlbWVudCBkaXNjb3ZlcnkgdXRpbGl0eSBtZXRob2RzIChzZWUgYGVsZW1lbnRfZGlzY292ZXJ5LnRzYClcbiAgaWYgKGdldEVsZW1lbnREZXB0aENvdW50KCkgPT09IDApIHtcbiAgICBhdHRhY2hQYXRjaERhdGEobmF0aXZlLCBsVmlldyk7XG4gIH1cbiAgaW5jcmVhc2VFbGVtZW50RGVwdGhDb3VudCgpO1xuXG4gIGlmIChoYXNEaXJlY3RpdmVzKSB7XG4gICAgY3JlYXRlRGlyZWN0aXZlc0luc3RhbmNlcyh0VmlldywgbFZpZXcsIHROb2RlKTtcbiAgICBleGVjdXRlQ29udGVudFF1ZXJpZXModFZpZXcsIHROb2RlLCBsVmlldyk7XG4gIH1cbiAgaWYgKGxvY2FsUmVmc0luZGV4ICE9PSBudWxsKSB7XG4gICAgc2F2ZVJlc29sdmVkTG9jYWxzSW5EYXRhKGxWaWV3LCB0Tm9kZSk7XG4gIH1cbiAgcmV0dXJuIMm1ybVlbGVtZW50U3RhcnQ7XG59XG5cbi8qKlxuICogTWFyayB0aGUgZW5kIG9mIHRoZSBlbGVtZW50LlxuICogQHJldHVybnMgVGhpcyBmdW5jdGlvbiByZXR1cm5zIGl0c2VsZiBzbyB0aGF0IGl0IG1heSBiZSBjaGFpbmVkLlxuICpcbiAqIEBjb2RlR2VuQXBpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiDJtcm1ZWxlbWVudEVuZCgpOiB0eXBlb2YgybXJtWVsZW1lbnRFbmQge1xuICBsZXQgY3VycmVudFROb2RlID0gZ2V0Q3VycmVudFROb2RlKCkhO1xuICBuZ0Rldk1vZGUgJiYgYXNzZXJ0RGVmaW5lZChjdXJyZW50VE5vZGUsICdObyBwYXJlbnQgbm9kZSB0byBjbG9zZS4nKTtcbiAgaWYgKGlzQ3VycmVudFROb2RlUGFyZW50KCkpIHtcbiAgICBzZXRDdXJyZW50VE5vZGVBc05vdFBhcmVudCgpO1xuICB9IGVsc2Uge1xuICAgIG5nRGV2TW9kZSAmJiBhc3NlcnRIYXNQYXJlbnQoZ2V0Q3VycmVudFROb2RlKCkpO1xuICAgIGN1cnJlbnRUTm9kZSA9IGN1cnJlbnRUTm9kZS5wYXJlbnQhO1xuICAgIHNldEN1cnJlbnRUTm9kZShjdXJyZW50VE5vZGUsIGZhbHNlKTtcbiAgfVxuXG4gIGNvbnN0IHROb2RlID0gY3VycmVudFROb2RlO1xuICBuZ0Rldk1vZGUgJiYgYXNzZXJ0VE5vZGVUeXBlKHROb2RlLCBUTm9kZVR5cGUuQW55Uk5vZGUpO1xuXG4gIGlmIChpc1NraXBIeWRyYXRpb25Sb290VE5vZGUodE5vZGUpKSB7XG4gICAgbGVhdmVTa2lwSHlkcmF0aW9uQmxvY2soKTtcbiAgfVxuXG4gIGRlY3JlYXNlRWxlbWVudERlcHRoQ291bnQoKTtcblxuICBjb25zdCB0VmlldyA9IGdldFRWaWV3KCk7XG4gIGlmICh0Vmlldy5maXJzdENyZWF0ZVBhc3MpIHtcbiAgICByZWdpc3RlclBvc3RPcmRlckhvb2tzKHRWaWV3LCBjdXJyZW50VE5vZGUpO1xuICAgIGlmIChpc0NvbnRlbnRRdWVyeUhvc3QoY3VycmVudFROb2RlKSkge1xuICAgICAgdFZpZXcucXVlcmllcyEuZWxlbWVudEVuZChjdXJyZW50VE5vZGUpO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0Tm9kZS5jbGFzc2VzV2l0aG91dEhvc3QgIT0gbnVsbCAmJiBoYXNDbGFzc0lucHV0KHROb2RlKSkge1xuICAgIHNldERpcmVjdGl2ZUlucHV0c1doaWNoU2hhZG93c1N0eWxpbmcodFZpZXcsIHROb2RlLCBnZXRMVmlldygpLCB0Tm9kZS5jbGFzc2VzV2l0aG91dEhvc3QsIHRydWUpO1xuICB9XG5cbiAgaWYgKHROb2RlLnN0eWxlc1dpdGhvdXRIb3N0ICE9IG51bGwgJiYgaGFzU3R5bGVJbnB1dCh0Tm9kZSkpIHtcbiAgICBzZXREaXJlY3RpdmVJbnB1dHNXaGljaFNoYWRvd3NTdHlsaW5nKHRWaWV3LCB0Tm9kZSwgZ2V0TFZpZXcoKSwgdE5vZGUuc3R5bGVzV2l0aG91dEhvc3QsIGZhbHNlKTtcbiAgfVxuICByZXR1cm4gybXJtWVsZW1lbnRFbmQ7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBlbXB0eSBlbGVtZW50IHVzaW5nIHtAbGluayBlbGVtZW50U3RhcnR9IGFuZCB7QGxpbmsgZWxlbWVudEVuZH1cbiAqXG4gKiBAcGFyYW0gaW5kZXggSW5kZXggb2YgdGhlIGVsZW1lbnQgaW4gdGhlIGRhdGEgYXJyYXlcbiAqIEBwYXJhbSBuYW1lIE5hbWUgb2YgdGhlIERPTSBOb2RlXG4gKiBAcGFyYW0gYXR0cnNJbmRleCBJbmRleCBvZiB0aGUgZWxlbWVudCdzIGF0dHJpYnV0ZXMgaW4gdGhlIGBjb25zdHNgIGFycmF5LlxuICogQHBhcmFtIGxvY2FsUmVmc0luZGV4IEluZGV4IG9mIHRoZSBlbGVtZW50J3MgbG9jYWwgcmVmZXJlbmNlcyBpbiB0aGUgYGNvbnN0c2AgYXJyYXkuXG4gKiBAcmV0dXJucyBUaGlzIGZ1bmN0aW9uIHJldHVybnMgaXRzZWxmIHNvIHRoYXQgaXQgbWF5IGJlIGNoYWluZWQuXG4gKlxuICogQGNvZGVHZW5BcGlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIMm1ybVlbGVtZW50KFxuICAgIGluZGV4OiBudW1iZXIsIG5hbWU6IHN0cmluZywgYXR0cnNJbmRleD86IG51bWJlcnxudWxsLFxuICAgIGxvY2FsUmVmc0luZGV4PzogbnVtYmVyKTogdHlwZW9mIMm1ybVlbGVtZW50IHtcbiAgybXJtWVsZW1lbnRTdGFydChpbmRleCwgbmFtZSwgYXR0cnNJbmRleCwgbG9jYWxSZWZzSW5kZXgpO1xuICDJtcm1ZWxlbWVudEVuZCgpO1xuICByZXR1cm4gybXJtWVsZW1lbnQ7XG59XG5cbmxldCBfbG9jYXRlT3JDcmVhdGVFbGVtZW50Tm9kZTogdHlwZW9mIGxvY2F0ZU9yQ3JlYXRlRWxlbWVudE5vZGVJbXBsID1cbiAgICAodFZpZXc6IFRWaWV3LCBsVmlldzogTFZpZXcsIHROb2RlOiBUTm9kZSwgcmVuZGVyZXI6IFJlbmRlcmVyLCBuYW1lOiBzdHJpbmcsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgIGxhc3ROb2RlV2FzQ3JlYXRlZCh0cnVlKTtcbiAgICAgIHJldHVybiBjcmVhdGVFbGVtZW50Tm9kZShyZW5kZXJlciwgbmFtZSwgZ2V0TmFtZXNwYWNlKCkpO1xuICAgIH07XG5cbi8qKlxuICogRW5hYmxlcyBoeWRyYXRpb24gY29kZSBwYXRoICh0byBsb29rdXAgZXhpc3RpbmcgZWxlbWVudHMgaW4gRE9NKVxuICogaW4gYWRkaXRpb24gdG8gdGhlIHJlZ3VsYXIgY3JlYXRpb24gbW9kZSBvZiBlbGVtZW50IG5vZGVzLlxuICovXG5mdW5jdGlvbiBsb2NhdGVPckNyZWF0ZUVsZW1lbnROb2RlSW1wbChcbiAgICB0VmlldzogVFZpZXcsIGxWaWV3OiBMVmlldywgdE5vZGU6IFROb2RlLCByZW5kZXJlcjogUmVuZGVyZXIsIG5hbWU6IHN0cmluZyxcbiAgICBpbmRleDogbnVtYmVyKTogUkVsZW1lbnQge1xuICBjb25zdCBoeWRyYXRpb25JbmZvID0gbFZpZXdbSFlEUkFUSU9OXTtcbiAgY29uc3QgaXNOb2RlQ3JlYXRpb25Nb2RlID0gIWh5ZHJhdGlvbkluZm8gfHwgaXNJblNraXBIeWRyYXRpb25CbG9jaygpIHx8XG4gICAgICBpc0RldGFjaGVkQnlJMThuKHROb2RlKSB8fCBpc0Rpc2Nvbm5lY3RlZE5vZGUoaHlkcmF0aW9uSW5mbywgaW5kZXgpO1xuICBsYXN0Tm9kZVdhc0NyZWF0ZWQoaXNOb2RlQ3JlYXRpb25Nb2RlKTtcblxuICAvLyBSZWd1bGFyIGNyZWF0aW9uIG1vZGUuXG4gIGlmIChpc05vZGVDcmVhdGlvbk1vZGUpIHtcbiAgICByZXR1cm4gY3JlYXRlRWxlbWVudE5vZGUocmVuZGVyZXIsIG5hbWUsIGdldE5hbWVzcGFjZSgpKTtcbiAgfVxuXG4gIC8vIEh5ZHJhdGlvbiBtb2RlLCBsb29raW5nIHVwIGFuIGV4aXN0aW5nIGVsZW1lbnQgaW4gRE9NLlxuICBjb25zdCBuYXRpdmUgPSBsb2NhdGVOZXh0Uk5vZGU8UkVsZW1lbnQ+KGh5ZHJhdGlvbkluZm8sIHRWaWV3LCBsVmlldywgdE5vZGUpITtcbiAgbmdEZXZNb2RlICYmIHZhbGlkYXRlTWF0Y2hpbmdOb2RlKG5hdGl2ZSwgTm9kZS5FTEVNRU5UX05PREUsIG5hbWUsIGxWaWV3LCB0Tm9kZSk7XG4gIG5nRGV2TW9kZSAmJiBtYXJrUk5vZGVBc0NsYWltZWRCeUh5ZHJhdGlvbihuYXRpdmUpO1xuXG4gIC8vIFRoaXMgZWxlbWVudCBtaWdodCBhbHNvIGJlIGFuIGFuY2hvciBvZiBhIHZpZXcgY29udGFpbmVyLlxuICBpZiAoZ2V0U2VyaWFsaXplZENvbnRhaW5lclZpZXdzKGh5ZHJhdGlvbkluZm8sIGluZGV4KSkge1xuICAgIC8vIEltcG9ydGFudCBub3RlOiB0aGlzIGVsZW1lbnQgYWN0cyBhcyBhbiBhbmNob3IsIGJ1dCBpdCdzICoqbm90KiogYSBwYXJ0XG4gICAgLy8gb2YgdGhlIGVtYmVkZGVkIHZpZXcsIHNvIHdlIHN0YXJ0IHRoZSBzZWdtZW50ICoqYWZ0ZXIqKiB0aGlzIGVsZW1lbnQsIHRha2luZ1xuICAgIC8vIGEgcmVmZXJlbmNlIHRvIHRoZSBuZXh0IHNpYmxpbmcuIEZvciBleGFtcGxlLCB0aGUgZm9sbG93aW5nIHRlbXBsYXRlOlxuICAgIC8vIGA8ZGl2ICN2Y3JUYXJnZXQ+YCBpcyByZXByZXNlbnRlZCBpbiB0aGUgRE9NIGFzIGA8ZGl2PjwvZGl2Pi4uLjwhLS1jb250YWluZXItLT5gLFxuICAgIC8vIHNvIHdoaWxlIHByb2Nlc3NpbmcgYSBgPGRpdj5gIGluc3RydWN0aW9uLCBwb2ludCB0byB0aGUgbmV4dCBzaWJsaW5nIGFzIGFcbiAgICAvLyBzdGFydCBvZiBhIHNlZ21lbnQuXG4gICAgbmdEZXZNb2RlICYmIHZhbGlkYXRlTm9kZUV4aXN0cyhuYXRpdmUubmV4dFNpYmxpbmcsIGxWaWV3LCB0Tm9kZSk7XG4gICAgc2V0U2VnbWVudEhlYWQoaHlkcmF0aW9uSW5mbywgaW5kZXgsIG5hdGl2ZS5uZXh0U2libGluZyk7XG4gIH1cblxuICAvLyBDaGVja3MgaWYgdGhlIHNraXAgaHlkcmF0aW9uIGF0dHJpYnV0ZSBpcyBwcmVzZW50IGR1cmluZyBoeWRyYXRpb24gc28gd2Uga25vdyB0b1xuICAvLyBza2lwIGF0dGVtcHRpbmcgdG8gaHlkcmF0ZSB0aGlzIGJsb2NrLiBXZSBjaGVjayBib3RoIFROb2RlIGFuZCBSRWxlbWVudCBmb3IgYW5cbiAgLy8gYXR0cmlidXRlOiB0aGUgUkVsZW1lbnQgY2FzZSBpcyBuZWVkZWQgZm9yIGkxOG4gY2FzZXMsIHdoZW4gd2UgYWRkIGl0IHRvIGhvc3RcbiAgLy8gZWxlbWVudHMgZHVyaW5nIHRoZSBhbm5vdGF0aW9uIHBoYXNlIChhZnRlciBhbGwgaW50ZXJuYWwgZGF0YSBzdHJ1Y3R1cmVzIGFyZSBzZXR1cCkuXG4gIGlmIChoeWRyYXRpb25JbmZvICYmXG4gICAgICAoaGFzU2tpcEh5ZHJhdGlvbkF0dHJPblROb2RlKHROb2RlKSB8fCBoYXNTa2lwSHlkcmF0aW9uQXR0ck9uUkVsZW1lbnQobmF0aXZlKSkpIHtcbiAgICBpZiAoaXNDb21wb25lbnRIb3N0KHROb2RlKSkge1xuICAgICAgZW50ZXJTa2lwSHlkcmF0aW9uQmxvY2sodE5vZGUpO1xuXG4gICAgICAvLyBTaW5jZSB0aGlzIGlzbid0IGh5ZHJhdGFibGUsIHdlIG5lZWQgdG8gZW1wdHkgdGhlIG5vZGVcbiAgICAgIC8vIHNvIHRoZXJlJ3Mgbm8gZHVwbGljYXRlIGNvbnRlbnQgYWZ0ZXIgcmVuZGVyXG4gICAgICBjbGVhckVsZW1lbnRDb250ZW50cyhuYXRpdmUpO1xuXG4gICAgICBuZ0Rldk1vZGUgJiYgbWFya1JOb2RlQXNTa2lwcGVkQnlIeWRyYXRpb24obmF0aXZlKTtcblxuICAgIH0gZWxzZSBpZiAobmdEZXZNb2RlKSB7XG4gICAgICAvLyBJZiB0aGlzIGlzIG5vdCBhIGNvbXBvbmVudCBob3N0LCB0aHJvdyBhbiBlcnJvci5cbiAgICAgIC8vIEh5ZHJhdGlvbiBjYW4gYmUgc2tpcHBlZCBvbiBwZXItY29tcG9uZW50IGJhc2lzIG9ubHkuXG4gICAgICB0aHJvdyBpbnZhbGlkU2tpcEh5ZHJhdGlvbkhvc3QobmF0aXZlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG5hdGl2ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVuYWJsZUxvY2F0ZU9yQ3JlYXRlRWxlbWVudE5vZGVJbXBsKCkge1xuICBfbG9jYXRlT3JDcmVhdGVFbGVtZW50Tm9kZSA9IGxvY2F0ZU9yQ3JlYXRlRWxlbWVudE5vZGVJbXBsO1xufVxuIl19