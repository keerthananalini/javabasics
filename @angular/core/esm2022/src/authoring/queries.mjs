/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { assertInInjectionContext } from '../di';
import { createMultiResultQuerySignalFn, createSingleResultOptionalQuerySignalFn, createSingleResultRequiredQuerySignalFn } from '../render3/query_reactive';
function viewChildFn(locator, opts) {
    ngDevMode && assertInInjectionContext(viewChild);
    return createSingleResultOptionalQuerySignalFn();
}
function viewChildRequiredFn(locator, opts) {
    ngDevMode && assertInInjectionContext(viewChild);
    return createSingleResultRequiredQuerySignalFn();
}
/**
 * Initializes a view child query.
 *
 * Consider using `viewChild.required` for queries that should always match.
 *
 * @usageNotes
 * Create a child query in your component by declaring a
 * class field and initializing it with the `viewChild()` function.
 *
 * ```ts
 * @Component({template: '<div #el></div><my-component #cmp />'})
 * export class TestComponent {
 *   divEl = viewChild<ElementRef>('el');                   // Signal<ElementRef|undefined>
 *   divElRequired = viewChild.required<ElementRef>('el');  // Signal<ElementRef>
 *   cmp = viewChild(MyComponent);                          // Signal<MyComponent|undefined>
 *   cmpRequired = viewChild.required(MyComponent);         // Signal<MyComponent>
 * }
 * ```
 *
 * @developerPreview
 * @initializerApiFunction
 */
export const viewChild = (() => {
    // Note: This may be considered a side-effect, but nothing will depend on
    // this assignment, unless this `viewChild` constant export is accessed. It's a
    // self-contained side effect that is local to the user facing `viewChild` export.
    viewChildFn.required = viewChildRequiredFn;
    return viewChildFn;
})();
/**
 * Initializes a view children query.
 *
 * Query results are represented as a signal of a read-only collection containing all matched
 * elements.
 *
 * @usageNotes
 * Create a children query in your component by declaring a
 * class field and initializing it with the `viewChildren()` function.
 *
 * ```ts
 * @Component({...})
 * export class TestComponent {
 *   divEls = viewChildren<ElementRef>('el');   // Signal<ReadonlyArray<ElementRef>>
 * }
 * ```
 *
 * @initializerApiFunction
 * @developerPreview
 */
export function viewChildren(locator, opts) {
    ngDevMode && assertInInjectionContext(viewChildren);
    return createMultiResultQuerySignalFn();
}
export function contentChildFn(locator, opts) {
    ngDevMode && assertInInjectionContext(contentChild);
    return createSingleResultOptionalQuerySignalFn();
}
function contentChildRequiredFn(locator, opts) {
    ngDevMode && assertInInjectionContext(contentChildren);
    return createSingleResultRequiredQuerySignalFn();
}
/**
 * Initializes a content child query. Consider using `contentChild.required` for queries that should
 * always match.
 *
 * @usageNotes
 * Create a child query in your component by declaring a
 * class field and initializing it with the `contentChild()` function.
 *
 * ```ts
 * @Component({...})
 * export class TestComponent {
 *   headerEl = contentChild<ElementRef>('h');                    // Signal<ElementRef|undefined>
 *   headerElElRequired = contentChild.required<ElementRef>('h'); // Signal<ElementRef>
 *   header = contentChild(MyHeader);                             // Signal<MyHeader|undefined>
 *   headerRequired = contentChild.required(MyHeader);            // Signal<MyHeader>
 * }
 * ```
 *
 * @initializerApiFunction
 * @developerPreview
 */
export const contentChild = (() => {
    // Note: This may be considered a side-effect, but nothing will depend on
    // this assignment, unless this `viewChild` constant export is accessed. It's a
    // self-contained side effect that is local to the user facing `viewChild` export.
    contentChildFn.required = contentChildRequiredFn;
    return contentChildFn;
})();
/**
 * Initializes a content children query.
 *
 * Query results are represented as a signal of a read-only collection containing all matched
 * elements.
 *
 * @usageNotes
 * Create a children query in your component by declaring a
 * class field and initializing it with the `contentChildren()` function.
 *
 * ```ts
 * @Component({...})
 * export class TestComponent {
 *   headerEl = contentChildren<ElementRef>('h');   // Signal<ReadonlyArray<ElementRef>>
 * }
 * ```
 *
 * @initializerApiFunction
 * @developerPreview
 */
export function contentChildren(locator, opts) {
    return createMultiResultQuerySignalFn();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL2F1dGhvcmluZy9xdWVyaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLE9BQU8sQ0FBQztBQUUvQyxPQUFPLEVBQUMsOEJBQThCLEVBQUUsdUNBQXVDLEVBQUUsdUNBQXVDLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUczSixTQUFTLFdBQVcsQ0FDaEIsT0FBdUMsRUFDdkMsSUFBb0M7SUFDdEMsU0FBUyxJQUFJLHdCQUF3QixDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2pELE9BQU8sdUNBQXVDLEVBQVMsQ0FBQztBQUMxRCxDQUFDO0FBRUQsU0FBUyxtQkFBbUIsQ0FDeEIsT0FBdUMsRUFBRSxJQUFvQztJQUMvRSxTQUFTLElBQUksd0JBQXdCLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDakQsT0FBTyx1Q0FBdUMsRUFBUyxDQUFDO0FBQzFELENBQUM7QUFtQ0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFCRztBQUNILE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FBc0IsQ0FBQyxHQUFHLEVBQUU7SUFDaEQseUVBQXlFO0lBQ3pFLCtFQUErRTtJQUMvRSxrRkFBa0Y7SUFDakYsV0FBbUIsQ0FBQyxRQUFRLEdBQUcsbUJBQW1CLENBQUM7SUFDcEQsT0FBTyxXQUEwRSxDQUFDO0FBQ3BGLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFRTDs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW1CRztBQUNILE1BQU0sVUFBVSxZQUFZLENBQ3hCLE9BQXVDLEVBQ3ZDLElBQW9DO0lBQ3RDLFNBQVMsSUFBSSx3QkFBd0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNwRCxPQUFPLDhCQUE4QixFQUFTLENBQUM7QUFDakQsQ0FBQztBQUVELE1BQU0sVUFBVSxjQUFjLENBQzFCLE9BQXVDLEVBQ3ZDLElBQTJEO0lBQzdELFNBQVMsSUFBSSx3QkFBd0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNwRCxPQUFPLHVDQUF1QyxFQUFTLENBQUM7QUFDMUQsQ0FBQztBQUVELFNBQVMsc0JBQXNCLENBQzNCLE9BQXVDLEVBQ3ZDLElBQTJEO0lBQzdELFNBQVMsSUFBSSx3QkFBd0IsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUN2RCxPQUFPLHVDQUF1QyxFQUFTLENBQUM7QUFDMUQsQ0FBQztBQTBDRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FvQkc7QUFDSCxNQUFNLENBQUMsTUFBTSxZQUFZLEdBQXlCLENBQUMsR0FBRyxFQUFFO0lBQ3RELHlFQUF5RTtJQUN6RSwrRUFBK0U7SUFDL0Usa0ZBQWtGO0lBQ2pGLGNBQXNCLENBQUMsUUFBUSxHQUFHLHNCQUFzQixDQUFDO0lBQzFELE9BQU8sY0FBbUYsQ0FBQztBQUM3RixDQUFDLENBQUMsRUFBRSxDQUFDO0FBVUw7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtQkc7QUFDSCxNQUFNLFVBQVUsZUFBZSxDQUMzQixPQUF1QyxFQUN2QyxJQUEyRDtJQUM3RCxPQUFPLDhCQUE4QixFQUFTLENBQUM7QUFDakQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2Fzc2VydEluSW5qZWN0aW9uQ29udGV4dH0gZnJvbSAnLi4vZGknO1xuaW1wb3J0IHtQcm92aWRlclRva2VufSBmcm9tICcuLi9kaS9wcm92aWRlcl90b2tlbic7XG5pbXBvcnQge2NyZWF0ZU11bHRpUmVzdWx0UXVlcnlTaWduYWxGbiwgY3JlYXRlU2luZ2xlUmVzdWx0T3B0aW9uYWxRdWVyeVNpZ25hbEZuLCBjcmVhdGVTaW5nbGVSZXN1bHRSZXF1aXJlZFF1ZXJ5U2lnbmFsRm59IGZyb20gJy4uL3JlbmRlcjMvcXVlcnlfcmVhY3RpdmUnO1xuaW1wb3J0IHtTaWduYWx9IGZyb20gJy4uL3JlbmRlcjMvcmVhY3Rpdml0eS9hcGknO1xuXG5mdW5jdGlvbiB2aWV3Q2hpbGRGbjxMb2NhdG9yVCwgUmVhZFQ+KFxuICAgIGxvY2F0b3I6IFByb3ZpZGVyVG9rZW48TG9jYXRvclQ+fHN0cmluZyxcbiAgICBvcHRzPzoge3JlYWQ/OiBQcm92aWRlclRva2VuPFJlYWRUPn0pOiBTaWduYWw8UmVhZFR8dW5kZWZpbmVkPiB7XG4gIG5nRGV2TW9kZSAmJiBhc3NlcnRJbkluamVjdGlvbkNvbnRleHQodmlld0NoaWxkKTtcbiAgcmV0dXJuIGNyZWF0ZVNpbmdsZVJlc3VsdE9wdGlvbmFsUXVlcnlTaWduYWxGbjxSZWFkVD4oKTtcbn1cblxuZnVuY3Rpb24gdmlld0NoaWxkUmVxdWlyZWRGbjxMb2NhdG9yVCwgUmVhZFQ+KFxuICAgIGxvY2F0b3I6IFByb3ZpZGVyVG9rZW48TG9jYXRvclQ+fHN0cmluZywgb3B0cz86IHtyZWFkPzogUHJvdmlkZXJUb2tlbjxSZWFkVD59KTogU2lnbmFsPFJlYWRUPiB7XG4gIG5nRGV2TW9kZSAmJiBhc3NlcnRJbkluamVjdGlvbkNvbnRleHQodmlld0NoaWxkKTtcbiAgcmV0dXJuIGNyZWF0ZVNpbmdsZVJlc3VsdFJlcXVpcmVkUXVlcnlTaWduYWxGbjxSZWFkVD4oKTtcbn1cblxuLyoqXG4gKiBUeXBlIG9mIHRoZSBgdmlld0NoaWxkYCBmdW5jdGlvbi4gVGhlIHZpZXdDaGlsZCBmdW5jdGlvbiBjcmVhdGVzIGEgc2luZ3VsYXIgdmlldyBxdWVyeS5cbiAqXG4gKiBJdCBpcyBhIHNwZWNpYWwgZnVuY3Rpb24gdGhhdCBhbHNvIHByb3ZpZGVzIGFjY2VzcyB0byByZXF1aXJlZCBxdWVyeSByZXN1bHRzIHZpYSB0aGUgYC5yZXF1aXJlZGBcbiAqIHByb3BlcnR5LlxuICpcbiAqIEBkZXZlbG9wZXJQcmV2aWV3XG4gKiBAZG9jc1ByaXZhdGUgSWdub3JlZCBiZWNhdXNlIGB2aWV3Q2hpbGRgIGlzIHRoZSBjYW5vbmljYWwgQVBJIGVudHJ5LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFZpZXdDaGlsZEZ1bmN0aW9uIHtcbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIGEgdmlldyBjaGlsZCBxdWVyeS4gQ29uc2lkZXIgdXNpbmcgYHZpZXdDaGlsZC5yZXF1aXJlZGAgZm9yIHF1ZXJpZXMgdGhhdCBzaG91bGRcbiAgICogYWx3YXlzIG1hdGNoLlxuICAgKlxuICAgKiBAZGV2ZWxvcGVyUHJldmlld1xuICAgKi9cbiAgPExvY2F0b3JUPihsb2NhdG9yOiBQcm92aWRlclRva2VuPExvY2F0b3JUPnxzdHJpbmcpOiBTaWduYWw8TG9jYXRvclR8dW5kZWZpbmVkPjtcbiAgPExvY2F0b3JULCBSZWFkVD4obG9jYXRvcjogUHJvdmlkZXJUb2tlbjxMb2NhdG9yVD58c3RyaW5nLCBvcHRzOiB7cmVhZDogUHJvdmlkZXJUb2tlbjxSZWFkVD59KTpcbiAgICAgIFNpZ25hbDxSZWFkVHx1bmRlZmluZWQ+O1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyBhIHZpZXcgY2hpbGQgcXVlcnkgdGhhdCBpcyBleHBlY3RlZCB0byBhbHdheXMgbWF0Y2ggYW4gZWxlbWVudC5cbiAgICpcbiAgICogQGRldmVsb3BlclByZXZpZXdcbiAgICovXG4gIHJlcXVpcmVkOiB7XG4gICAgPExvY2F0b3JUPihsb2NhdG9yOiBQcm92aWRlclRva2VuPExvY2F0b3JUPnxzdHJpbmcpOiBTaWduYWw8TG9jYXRvclQ+O1xuXG4gICAgPExvY2F0b3JULCBSZWFkVD4obG9jYXRvcjogUHJvdmlkZXJUb2tlbjxMb2NhdG9yVD58c3RyaW5nLCBvcHRzOiB7cmVhZDogUHJvdmlkZXJUb2tlbjxSZWFkVD59KTpcbiAgICAgICAgU2lnbmFsPFJlYWRUPjtcbiAgfTtcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplcyBhIHZpZXcgY2hpbGQgcXVlcnkuXG4gKlxuICogQ29uc2lkZXIgdXNpbmcgYHZpZXdDaGlsZC5yZXF1aXJlZGAgZm9yIHF1ZXJpZXMgdGhhdCBzaG91bGQgYWx3YXlzIG1hdGNoLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKiBDcmVhdGUgYSBjaGlsZCBxdWVyeSBpbiB5b3VyIGNvbXBvbmVudCBieSBkZWNsYXJpbmcgYVxuICogY2xhc3MgZmllbGQgYW5kIGluaXRpYWxpemluZyBpdCB3aXRoIHRoZSBgdmlld0NoaWxkKClgIGZ1bmN0aW9uLlxuICpcbiAqIGBgYHRzXG4gKiBAQ29tcG9uZW50KHt0ZW1wbGF0ZTogJzxkaXYgI2VsPjwvZGl2PjxteS1jb21wb25lbnQgI2NtcCAvPid9KVxuICogZXhwb3J0IGNsYXNzIFRlc3RDb21wb25lbnQge1xuICogICBkaXZFbCA9IHZpZXdDaGlsZDxFbGVtZW50UmVmPignZWwnKTsgICAgICAgICAgICAgICAgICAgLy8gU2lnbmFsPEVsZW1lbnRSZWZ8dW5kZWZpbmVkPlxuICogICBkaXZFbFJlcXVpcmVkID0gdmlld0NoaWxkLnJlcXVpcmVkPEVsZW1lbnRSZWY+KCdlbCcpOyAgLy8gU2lnbmFsPEVsZW1lbnRSZWY+XG4gKiAgIGNtcCA9IHZpZXdDaGlsZChNeUNvbXBvbmVudCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTaWduYWw8TXlDb21wb25lbnR8dW5kZWZpbmVkPlxuICogICBjbXBSZXF1aXJlZCA9IHZpZXdDaGlsZC5yZXF1aXJlZChNeUNvbXBvbmVudCk7ICAgICAgICAgLy8gU2lnbmFsPE15Q29tcG9uZW50PlxuICogfVxuICogYGBgXG4gKlxuICogQGRldmVsb3BlclByZXZpZXdcbiAqIEBpbml0aWFsaXplckFwaUZ1bmN0aW9uXG4gKi9cbmV4cG9ydCBjb25zdCB2aWV3Q2hpbGQ6IFZpZXdDaGlsZEZ1bmN0aW9uID0gKCgpID0+IHtcbiAgLy8gTm90ZTogVGhpcyBtYXkgYmUgY29uc2lkZXJlZCBhIHNpZGUtZWZmZWN0LCBidXQgbm90aGluZyB3aWxsIGRlcGVuZCBvblxuICAvLyB0aGlzIGFzc2lnbm1lbnQsIHVubGVzcyB0aGlzIGB2aWV3Q2hpbGRgIGNvbnN0YW50IGV4cG9ydCBpcyBhY2Nlc3NlZC4gSXQncyBhXG4gIC8vIHNlbGYtY29udGFpbmVkIHNpZGUgZWZmZWN0IHRoYXQgaXMgbG9jYWwgdG8gdGhlIHVzZXIgZmFjaW5nIGB2aWV3Q2hpbGRgIGV4cG9ydC5cbiAgKHZpZXdDaGlsZEZuIGFzIGFueSkucmVxdWlyZWQgPSB2aWV3Q2hpbGRSZXF1aXJlZEZuO1xuICByZXR1cm4gdmlld0NoaWxkRm4gYXMgKHR5cGVvZiB2aWV3Q2hpbGRGbiZ7cmVxdWlyZWQ6IHR5cGVvZiB2aWV3Q2hpbGRSZXF1aXJlZEZufSk7XG59KSgpO1xuXG5leHBvcnQgZnVuY3Rpb24gdmlld0NoaWxkcmVuPExvY2F0b3JUPihsb2NhdG9yOiBQcm92aWRlclRva2VuPExvY2F0b3JUPnxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZyk6IFNpZ25hbDxSZWFkb25seUFycmF5PExvY2F0b3JUPj47XG5leHBvcnQgZnVuY3Rpb24gdmlld0NoaWxkcmVuPExvY2F0b3JULCBSZWFkVD4oXG4gICAgbG9jYXRvcjogUHJvdmlkZXJUb2tlbjxMb2NhdG9yVD58c3RyaW5nLFxuICAgIG9wdHM6IHtyZWFkOiBQcm92aWRlclRva2VuPFJlYWRUPn0pOiBTaWduYWw8UmVhZG9ubHlBcnJheTxSZWFkVD4+O1xuXG4vKipcbiAqIEluaXRpYWxpemVzIGEgdmlldyBjaGlsZHJlbiBxdWVyeS5cbiAqXG4gKiBRdWVyeSByZXN1bHRzIGFyZSByZXByZXNlbnRlZCBhcyBhIHNpZ25hbCBvZiBhIHJlYWQtb25seSBjb2xsZWN0aW9uIGNvbnRhaW5pbmcgYWxsIG1hdGNoZWRcbiAqIGVsZW1lbnRzLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKiBDcmVhdGUgYSBjaGlsZHJlbiBxdWVyeSBpbiB5b3VyIGNvbXBvbmVudCBieSBkZWNsYXJpbmcgYVxuICogY2xhc3MgZmllbGQgYW5kIGluaXRpYWxpemluZyBpdCB3aXRoIHRoZSBgdmlld0NoaWxkcmVuKClgIGZ1bmN0aW9uLlxuICpcbiAqIGBgYHRzXG4gKiBAQ29tcG9uZW50KHsuLi59KVxuICogZXhwb3J0IGNsYXNzIFRlc3RDb21wb25lbnQge1xuICogICBkaXZFbHMgPSB2aWV3Q2hpbGRyZW48RWxlbWVudFJlZj4oJ2VsJyk7ICAgLy8gU2lnbmFsPFJlYWRvbmx5QXJyYXk8RWxlbWVudFJlZj4+XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBAaW5pdGlhbGl6ZXJBcGlGdW5jdGlvblxuICogQGRldmVsb3BlclByZXZpZXdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHZpZXdDaGlsZHJlbjxMb2NhdG9yVCwgUmVhZFQ+KFxuICAgIGxvY2F0b3I6IFByb3ZpZGVyVG9rZW48TG9jYXRvclQ+fHN0cmluZyxcbiAgICBvcHRzPzoge3JlYWQ/OiBQcm92aWRlclRva2VuPFJlYWRUPn0pOiBTaWduYWw8UmVhZG9ubHlBcnJheTxSZWFkVD4+IHtcbiAgbmdEZXZNb2RlICYmIGFzc2VydEluSW5qZWN0aW9uQ29udGV4dCh2aWV3Q2hpbGRyZW4pO1xuICByZXR1cm4gY3JlYXRlTXVsdGlSZXN1bHRRdWVyeVNpZ25hbEZuPFJlYWRUPigpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29udGVudENoaWxkRm48TG9jYXRvclQsIFJlYWRUPihcbiAgICBsb2NhdG9yOiBQcm92aWRlclRva2VuPExvY2F0b3JUPnxzdHJpbmcsXG4gICAgb3B0cz86IHtkZXNjZW5kYW50cz86IGJvb2xlYW4sIHJlYWQ/OiBQcm92aWRlclRva2VuPFJlYWRUPn0pOiBTaWduYWw8UmVhZFR8dW5kZWZpbmVkPiB7XG4gIG5nRGV2TW9kZSAmJiBhc3NlcnRJbkluamVjdGlvbkNvbnRleHQoY29udGVudENoaWxkKTtcbiAgcmV0dXJuIGNyZWF0ZVNpbmdsZVJlc3VsdE9wdGlvbmFsUXVlcnlTaWduYWxGbjxSZWFkVD4oKTtcbn1cblxuZnVuY3Rpb24gY29udGVudENoaWxkUmVxdWlyZWRGbjxMb2NhdG9yVCwgUmVhZFQ+KFxuICAgIGxvY2F0b3I6IFByb3ZpZGVyVG9rZW48TG9jYXRvclQ+fHN0cmluZyxcbiAgICBvcHRzPzoge2Rlc2NlbmRhbnRzPzogYm9vbGVhbiwgcmVhZD86IFByb3ZpZGVyVG9rZW48UmVhZFQ+fSk6IFNpZ25hbDxSZWFkVD4ge1xuICBuZ0Rldk1vZGUgJiYgYXNzZXJ0SW5JbmplY3Rpb25Db250ZXh0KGNvbnRlbnRDaGlsZHJlbik7XG4gIHJldHVybiBjcmVhdGVTaW5nbGVSZXN1bHRSZXF1aXJlZFF1ZXJ5U2lnbmFsRm48UmVhZFQ+KCk7XG59XG5cbi8qKlxuICogVHlwZSBvZiB0aGUgYGNvbnRlbnRDaGlsZGAgZnVuY3Rpb24uXG4gKlxuICogVGhlIGNvbnRlbnRDaGlsZCBmdW5jdGlvbiBjcmVhdGVzIGEgc2luZ3VsYXIgY29udGVudCBxdWVyeS4gSXQgaXMgYSBzcGVjaWFsIGZ1bmN0aW9uIHRoYXQgYWxzb1xuICogcHJvdmlkZXMgYWNjZXNzIHRvIHJlcXVpcmVkIHF1ZXJ5IHJlc3VsdHMgdmlhIHRoZSBgLnJlcXVpcmVkYCBwcm9wZXJ0eS5cbiAqXG4gKiBAZGV2ZWxvcGVyUHJldmlld1xuICogQGRvY3NQcml2YXRlIElnbm9yZWQgYmVjYXVzZSBgY29udGVudENoaWxkYCBpcyB0aGUgY2Fub25pY2FsIEFQSSBlbnRyeS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb250ZW50Q2hpbGRGdW5jdGlvbiB7XG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyBhIGNvbnRlbnQgY2hpbGQgcXVlcnkuXG4gICAqXG4gICAqIENvbnNpZGVyIHVzaW5nIGBjb250ZW50Q2hpbGQucmVxdWlyZWRgIGZvciBxdWVyaWVzIHRoYXQgc2hvdWxkIGFsd2F5cyBtYXRjaC5cbiAgICogQGRldmVsb3BlclByZXZpZXdcbiAgICovXG4gIDxMb2NhdG9yVD4obG9jYXRvcjogUHJvdmlkZXJUb2tlbjxMb2NhdG9yVD58c3RyaW5nLCBvcHRzPzoge1xuICAgIGRlc2NlbmRhbnRzPzogYm9vbGVhbixcbiAgICByZWFkPzogdW5kZWZpbmVkXG4gIH0pOiBTaWduYWw8TG9jYXRvclR8dW5kZWZpbmVkPjtcblxuICA8TG9jYXRvclQsIFJlYWRUPihsb2NhdG9yOiBQcm92aWRlclRva2VuPExvY2F0b3JUPnxzdHJpbmcsIG9wdHM6IHtcbiAgICBkZXNjZW5kYW50cz86IGJvb2xlYW4sIHJlYWQ6IFByb3ZpZGVyVG9rZW48UmVhZFQ+XG4gIH0pOiBTaWduYWw8UmVhZFR8dW5kZWZpbmVkPjtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgYSBjb250ZW50IGNoaWxkIHF1ZXJ5IHRoYXQgaXMgYWx3YXlzIGV4cGVjdGVkIHRvIG1hdGNoLlxuICAgKi9cbiAgcmVxdWlyZWQ6IHtcbiAgICA8TG9jYXRvclQ+KGxvY2F0b3I6IFByb3ZpZGVyVG9rZW48TG9jYXRvclQ+fHN0cmluZywgb3B0cz86IHtcbiAgICAgIGRlc2NlbmRhbnRzPzogYm9vbGVhbixcbiAgICAgIHJlYWQ/OiB1bmRlZmluZWQsXG4gICAgfSk6IFNpZ25hbDxMb2NhdG9yVD47XG5cbiAgICA8TG9jYXRvclQsIFJlYWRUPihcbiAgICAgICAgbG9jYXRvcjogUHJvdmlkZXJUb2tlbjxMb2NhdG9yVD58c3RyaW5nLFxuICAgICAgICBvcHRzOiB7ZGVzY2VuZGFudHM/OiBib29sZWFuLCByZWFkOiBQcm92aWRlclRva2VuPFJlYWRUPn0pOiBTaWduYWw8UmVhZFQ+O1xuICB9O1xufVxuXG4vKipcbiAqIEluaXRpYWxpemVzIGEgY29udGVudCBjaGlsZCBxdWVyeS4gQ29uc2lkZXIgdXNpbmcgYGNvbnRlbnRDaGlsZC5yZXF1aXJlZGAgZm9yIHF1ZXJpZXMgdGhhdCBzaG91bGRcbiAqIGFsd2F5cyBtYXRjaC5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICogQ3JlYXRlIGEgY2hpbGQgcXVlcnkgaW4geW91ciBjb21wb25lbnQgYnkgZGVjbGFyaW5nIGFcbiAqIGNsYXNzIGZpZWxkIGFuZCBpbml0aWFsaXppbmcgaXQgd2l0aCB0aGUgYGNvbnRlbnRDaGlsZCgpYCBmdW5jdGlvbi5cbiAqXG4gKiBgYGB0c1xuICogQENvbXBvbmVudCh7Li4ufSlcbiAqIGV4cG9ydCBjbGFzcyBUZXN0Q29tcG9uZW50IHtcbiAqICAgaGVhZGVyRWwgPSBjb250ZW50Q2hpbGQ8RWxlbWVudFJlZj4oJ2gnKTsgICAgICAgICAgICAgICAgICAgIC8vIFNpZ25hbDxFbGVtZW50UmVmfHVuZGVmaW5lZD5cbiAqICAgaGVhZGVyRWxFbFJlcXVpcmVkID0gY29udGVudENoaWxkLnJlcXVpcmVkPEVsZW1lbnRSZWY+KCdoJyk7IC8vIFNpZ25hbDxFbGVtZW50UmVmPlxuICogICBoZWFkZXIgPSBjb250ZW50Q2hpbGQoTXlIZWFkZXIpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2lnbmFsPE15SGVhZGVyfHVuZGVmaW5lZD5cbiAqICAgaGVhZGVyUmVxdWlyZWQgPSBjb250ZW50Q2hpbGQucmVxdWlyZWQoTXlIZWFkZXIpOyAgICAgICAgICAgIC8vIFNpZ25hbDxNeUhlYWRlcj5cbiAqIH1cbiAqIGBgYFxuICpcbiAqIEBpbml0aWFsaXplckFwaUZ1bmN0aW9uXG4gKiBAZGV2ZWxvcGVyUHJldmlld1xuICovXG5leHBvcnQgY29uc3QgY29udGVudENoaWxkOiBDb250ZW50Q2hpbGRGdW5jdGlvbiA9ICgoKSA9PiB7XG4gIC8vIE5vdGU6IFRoaXMgbWF5IGJlIGNvbnNpZGVyZWQgYSBzaWRlLWVmZmVjdCwgYnV0IG5vdGhpbmcgd2lsbCBkZXBlbmQgb25cbiAgLy8gdGhpcyBhc3NpZ25tZW50LCB1bmxlc3MgdGhpcyBgdmlld0NoaWxkYCBjb25zdGFudCBleHBvcnQgaXMgYWNjZXNzZWQuIEl0J3MgYVxuICAvLyBzZWxmLWNvbnRhaW5lZCBzaWRlIGVmZmVjdCB0aGF0IGlzIGxvY2FsIHRvIHRoZSB1c2VyIGZhY2luZyBgdmlld0NoaWxkYCBleHBvcnQuXG4gIChjb250ZW50Q2hpbGRGbiBhcyBhbnkpLnJlcXVpcmVkID0gY29udGVudENoaWxkUmVxdWlyZWRGbjtcbiAgcmV0dXJuIGNvbnRlbnRDaGlsZEZuIGFzICh0eXBlb2YgY29udGVudENoaWxkRm4me3JlcXVpcmVkOiB0eXBlb2YgY29udGVudENoaWxkUmVxdWlyZWRGbn0pO1xufSkoKTtcblxuXG5leHBvcnQgZnVuY3Rpb24gY29udGVudENoaWxkcmVuPExvY2F0b3JUPihcbiAgICBsb2NhdG9yOiBQcm92aWRlclRva2VuPExvY2F0b3JUPnxzdHJpbmcsXG4gICAgb3B0cz86IHtkZXNjZW5kYW50cz86IGJvb2xlYW4sIHJlYWQ/OiB1bmRlZmluZWR9KTogU2lnbmFsPFJlYWRvbmx5QXJyYXk8TG9jYXRvclQ+PjtcbmV4cG9ydCBmdW5jdGlvbiBjb250ZW50Q2hpbGRyZW48TG9jYXRvclQsIFJlYWRUPihcbiAgICBsb2NhdG9yOiBQcm92aWRlclRva2VuPExvY2F0b3JUPnxzdHJpbmcsXG4gICAgb3B0czoge2Rlc2NlbmRhbnRzPzogYm9vbGVhbiwgcmVhZDogUHJvdmlkZXJUb2tlbjxSZWFkVD59KTogU2lnbmFsPFJlYWRvbmx5QXJyYXk8UmVhZFQ+PjtcblxuLyoqXG4gKiBJbml0aWFsaXplcyBhIGNvbnRlbnQgY2hpbGRyZW4gcXVlcnkuXG4gKlxuICogUXVlcnkgcmVzdWx0cyBhcmUgcmVwcmVzZW50ZWQgYXMgYSBzaWduYWwgb2YgYSByZWFkLW9ubHkgY29sbGVjdGlvbiBjb250YWluaW5nIGFsbCBtYXRjaGVkXG4gKiBlbGVtZW50cy5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICogQ3JlYXRlIGEgY2hpbGRyZW4gcXVlcnkgaW4geW91ciBjb21wb25lbnQgYnkgZGVjbGFyaW5nIGFcbiAqIGNsYXNzIGZpZWxkIGFuZCBpbml0aWFsaXppbmcgaXQgd2l0aCB0aGUgYGNvbnRlbnRDaGlsZHJlbigpYCBmdW5jdGlvbi5cbiAqXG4gKiBgYGB0c1xuICogQENvbXBvbmVudCh7Li4ufSlcbiAqIGV4cG9ydCBjbGFzcyBUZXN0Q29tcG9uZW50IHtcbiAqICAgaGVhZGVyRWwgPSBjb250ZW50Q2hpbGRyZW48RWxlbWVudFJlZj4oJ2gnKTsgICAvLyBTaWduYWw8UmVhZG9ubHlBcnJheTxFbGVtZW50UmVmPj5cbiAqIH1cbiAqIGBgYFxuICpcbiAqIEBpbml0aWFsaXplckFwaUZ1bmN0aW9uXG4gKiBAZGV2ZWxvcGVyUHJldmlld1xuICovXG5leHBvcnQgZnVuY3Rpb24gY29udGVudENoaWxkcmVuPExvY2F0b3JULCBSZWFkVD4oXG4gICAgbG9jYXRvcjogUHJvdmlkZXJUb2tlbjxMb2NhdG9yVD58c3RyaW5nLFxuICAgIG9wdHM/OiB7ZGVzY2VuZGFudHM/OiBib29sZWFuLCByZWFkPzogUHJvdmlkZXJUb2tlbjxSZWFkVD59KTogU2lnbmFsPFJlYWRvbmx5QXJyYXk8UmVhZFQ+PiB7XG4gIHJldHVybiBjcmVhdGVNdWx0aVJlc3VsdFF1ZXJ5U2lnbmFsRm48UmVhZFQ+KCk7XG59XG4iXX0=