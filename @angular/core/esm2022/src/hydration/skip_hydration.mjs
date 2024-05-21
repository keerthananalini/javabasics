/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * The name of an attribute that can be added to the hydration boundary node
 * (component host node) to disable hydration for the content within that boundary.
 */
export const SKIP_HYDRATION_ATTR_NAME = 'ngSkipHydration';
/** Lowercase name of the `ngSkipHydration` attribute used for case-insensitive comparisons. */
const SKIP_HYDRATION_ATTR_NAME_LOWER_CASE = 'ngskiphydration';
/**
 * Helper function to check if a given TNode has the 'ngSkipHydration' attribute.
 */
export function hasSkipHydrationAttrOnTNode(tNode) {
    const attrs = tNode.mergedAttrs;
    if (attrs === null)
        return false;
    // only ever look at the attribute name and skip the values
    for (let i = 0; i < attrs.length; i += 2) {
        const value = attrs[i];
        // This is a marker, which means that the static attributes section is over,
        // so we can exit early.
        if (typeof value === 'number')
            return false;
        if (typeof value === 'string' && value.toLowerCase() === SKIP_HYDRATION_ATTR_NAME_LOWER_CASE) {
            return true;
        }
    }
    return false;
}
/**
 * Helper function to check if a given RElement has the 'ngSkipHydration' attribute.
 */
export function hasSkipHydrationAttrOnRElement(rNode) {
    return rNode.hasAttribute(SKIP_HYDRATION_ATTR_NAME);
}
/**
 * Checks whether a TNode has a flag to indicate that it's a part of
 * a skip hydration block.
 */
export function hasInSkipHydrationBlockFlag(tNode) {
    return (tNode.flags & 128 /* TNodeFlags.inSkipHydrationBlock */) === 128 /* TNodeFlags.inSkipHydrationBlock */;
}
/**
 * Helper function that determines if a given node is within a skip hydration block
 * by navigating up the TNode tree to see if any parent nodes have skip hydration
 * attribute.
 */
export function isInSkipHydrationBlock(tNode) {
    if (hasInSkipHydrationBlockFlag(tNode)) {
        return true;
    }
    let currentTNode = tNode.parent;
    while (currentTNode) {
        if (hasInSkipHydrationBlockFlag(tNode) || hasSkipHydrationAttrOnTNode(currentTNode)) {
            return true;
        }
        currentTNode = currentTNode.parent;
    }
    return false;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2tpcF9oeWRyYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9oeWRyYXRpb24vc2tpcF9oeWRyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBS0g7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sd0JBQXdCLEdBQUcsaUJBQWlCLENBQUM7QUFFMUQsK0ZBQStGO0FBQy9GLE1BQU0sbUNBQW1DLEdBQUcsaUJBQWlCLENBQUM7QUFFOUQ7O0dBRUc7QUFDSCxNQUFNLFVBQVUsMkJBQTJCLENBQUMsS0FBWTtJQUN0RCxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDO0lBQ2hDLElBQUksS0FBSyxLQUFLLElBQUk7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUNqQywyREFBMkQ7SUFDM0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ3pDLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2Qiw0RUFBNEU7UUFDNUUsd0JBQXdCO1FBQ3hCLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUTtZQUFFLE9BQU8sS0FBSyxDQUFDO1FBQzVDLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsS0FBSyxtQ0FBbUMsRUFBRSxDQUFDO1lBQzdGLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztJQUNILENBQUM7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUFFRDs7R0FFRztBQUNILE1BQU0sVUFBVSw4QkFBOEIsQ0FBQyxLQUFlO0lBQzVELE9BQU8sS0FBSyxDQUFDLFlBQVksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQ3RELENBQUM7QUFFRDs7O0dBR0c7QUFDSCxNQUFNLFVBQVUsMkJBQTJCLENBQUMsS0FBWTtJQUN0RCxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssNENBQWtDLENBQUMsOENBQW9DLENBQUM7QUFDN0YsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsc0JBQXNCLENBQUMsS0FBWTtJQUNqRCxJQUFJLDJCQUEyQixDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDdkMsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0QsSUFBSSxZQUFZLEdBQWUsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUM1QyxPQUFPLFlBQVksRUFBRSxDQUFDO1FBQ3BCLElBQUksMkJBQTJCLENBQUMsS0FBSyxDQUFDLElBQUksMkJBQTJCLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQztZQUNwRixPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFDRCxZQUFZLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQztJQUNyQyxDQUFDO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7VE5vZGUsIFROb2RlRmxhZ3N9IGZyb20gJy4uL3JlbmRlcjMvaW50ZXJmYWNlcy9ub2RlJztcbmltcG9ydCB7UkVsZW1lbnR9IGZyb20gJy4uL3JlbmRlcjMvaW50ZXJmYWNlcy9yZW5kZXJlcl9kb20nO1xuXG4vKipcbiAqIFRoZSBuYW1lIG9mIGFuIGF0dHJpYnV0ZSB0aGF0IGNhbiBiZSBhZGRlZCB0byB0aGUgaHlkcmF0aW9uIGJvdW5kYXJ5IG5vZGVcbiAqIChjb21wb25lbnQgaG9zdCBub2RlKSB0byBkaXNhYmxlIGh5ZHJhdGlvbiBmb3IgdGhlIGNvbnRlbnQgd2l0aGluIHRoYXQgYm91bmRhcnkuXG4gKi9cbmV4cG9ydCBjb25zdCBTS0lQX0hZRFJBVElPTl9BVFRSX05BTUUgPSAnbmdTa2lwSHlkcmF0aW9uJztcblxuLyoqIExvd2VyY2FzZSBuYW1lIG9mIHRoZSBgbmdTa2lwSHlkcmF0aW9uYCBhdHRyaWJ1dGUgdXNlZCBmb3IgY2FzZS1pbnNlbnNpdGl2ZSBjb21wYXJpc29ucy4gKi9cbmNvbnN0IFNLSVBfSFlEUkFUSU9OX0FUVFJfTkFNRV9MT1dFUl9DQVNFID0gJ25nc2tpcGh5ZHJhdGlvbic7XG5cbi8qKlxuICogSGVscGVyIGZ1bmN0aW9uIHRvIGNoZWNrIGlmIGEgZ2l2ZW4gVE5vZGUgaGFzIHRoZSAnbmdTa2lwSHlkcmF0aW9uJyBhdHRyaWJ1dGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYXNTa2lwSHlkcmF0aW9uQXR0ck9uVE5vZGUodE5vZGU6IFROb2RlKTogYm9vbGVhbiB7XG4gIGNvbnN0IGF0dHJzID0gdE5vZGUubWVyZ2VkQXR0cnM7XG4gIGlmIChhdHRycyA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuICAvLyBvbmx5IGV2ZXIgbG9vayBhdCB0aGUgYXR0cmlidXRlIG5hbWUgYW5kIHNraXAgdGhlIHZhbHVlc1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGF0dHJzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgY29uc3QgdmFsdWUgPSBhdHRyc1tpXTtcbiAgICAvLyBUaGlzIGlzIGEgbWFya2VyLCB3aGljaCBtZWFucyB0aGF0IHRoZSBzdGF0aWMgYXR0cmlidXRlcyBzZWN0aW9uIGlzIG92ZXIsXG4gICAgLy8gc28gd2UgY2FuIGV4aXQgZWFybHkuXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHJldHVybiBmYWxzZTtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZS50b0xvd2VyQ2FzZSgpID09PSBTS0lQX0hZRFJBVElPTl9BVFRSX05BTUVfTE9XRVJfQ0FTRSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBIZWxwZXIgZnVuY3Rpb24gdG8gY2hlY2sgaWYgYSBnaXZlbiBSRWxlbWVudCBoYXMgdGhlICduZ1NraXBIeWRyYXRpb24nIGF0dHJpYnV0ZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhc1NraXBIeWRyYXRpb25BdHRyT25SRWxlbWVudChyTm9kZTogUkVsZW1lbnQpOiBib29sZWFuIHtcbiAgcmV0dXJuIHJOb2RlLmhhc0F0dHJpYnV0ZShTS0lQX0hZRFJBVElPTl9BVFRSX05BTUUpO1xufVxuXG4vKipcbiAqIENoZWNrcyB3aGV0aGVyIGEgVE5vZGUgaGFzIGEgZmxhZyB0byBpbmRpY2F0ZSB0aGF0IGl0J3MgYSBwYXJ0IG9mXG4gKiBhIHNraXAgaHlkcmF0aW9uIGJsb2NrLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFzSW5Ta2lwSHlkcmF0aW9uQmxvY2tGbGFnKHROb2RlOiBUTm9kZSk6IGJvb2xlYW4ge1xuICByZXR1cm4gKHROb2RlLmZsYWdzICYgVE5vZGVGbGFncy5pblNraXBIeWRyYXRpb25CbG9jaykgPT09IFROb2RlRmxhZ3MuaW5Ta2lwSHlkcmF0aW9uQmxvY2s7XG59XG5cbi8qKlxuICogSGVscGVyIGZ1bmN0aW9uIHRoYXQgZGV0ZXJtaW5lcyBpZiBhIGdpdmVuIG5vZGUgaXMgd2l0aGluIGEgc2tpcCBoeWRyYXRpb24gYmxvY2tcbiAqIGJ5IG5hdmlnYXRpbmcgdXAgdGhlIFROb2RlIHRyZWUgdG8gc2VlIGlmIGFueSBwYXJlbnQgbm9kZXMgaGF2ZSBza2lwIGh5ZHJhdGlvblxuICogYXR0cmlidXRlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNJblNraXBIeWRyYXRpb25CbG9jayh0Tm9kZTogVE5vZGUpOiBib29sZWFuIHtcbiAgaWYgKGhhc0luU2tpcEh5ZHJhdGlvbkJsb2NrRmxhZyh0Tm9kZSkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBsZXQgY3VycmVudFROb2RlOiBUTm9kZXxudWxsID0gdE5vZGUucGFyZW50O1xuICB3aGlsZSAoY3VycmVudFROb2RlKSB7XG4gICAgaWYgKGhhc0luU2tpcEh5ZHJhdGlvbkJsb2NrRmxhZyh0Tm9kZSkgfHwgaGFzU2tpcEh5ZHJhdGlvbkF0dHJPblROb2RlKGN1cnJlbnRUTm9kZSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBjdXJyZW50VE5vZGUgPSBjdXJyZW50VE5vZGUucGFyZW50O1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cbiJdfQ==