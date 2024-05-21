/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken, ɵDeferBlockBehavior as DeferBlockBehavior } from '@angular/core';
/** Whether test modules should be torn down by default. */
export const TEARDOWN_TESTING_MODULE_ON_DESTROY_DEFAULT = true;
/** Whether unknown elements in templates should throw by default. */
export const THROW_ON_UNKNOWN_ELEMENTS_DEFAULT = false;
/** Whether unknown properties in templates should throw by default. */
export const THROW_ON_UNKNOWN_PROPERTIES_DEFAULT = false;
/** Whether defer blocks should use manual triggering or play through normally. */
export const DEFER_BLOCK_DEFAULT_BEHAVIOR = DeferBlockBehavior.Playthrough;
/**
 * An abstract class for inserting the root test component element in a platform independent way.
 *
 * @publicApi
 */
export class TestComponentRenderer {
    insertRootElement(rootElementId) { }
    removeAllRootElements() { }
}
/**
 * @publicApi
 */
export const ComponentFixtureAutoDetect = new InjectionToken('ComponentFixtureAutoDetect');
/**
 * TODO(atscott): Make public API once we have decided if we want this error and how we want devs to
 * disable it.
 */
export const AllowDetectChangesAndAcknowledgeItCanHideApplicationBugs = new InjectionToken('AllowDetectChangesAndAcknowledgeItCanHideApplicationBugs');
/**
 * @publicApi
 */
export const ComponentFixtureNoNgZone = new InjectionToken('ComponentFixtureNoNgZone');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF9iZWRfY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0aW5nL3NyYy90ZXN0X2JlZF9jb21tb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGNBQWMsRUFBa0IsbUJBQW1CLElBQUksa0JBQWtCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFHeEcsMkRBQTJEO0FBQzNELE1BQU0sQ0FBQyxNQUFNLDBDQUEwQyxHQUFHLElBQUksQ0FBQztBQUUvRCxxRUFBcUU7QUFDckUsTUFBTSxDQUFDLE1BQU0saUNBQWlDLEdBQUcsS0FBSyxDQUFDO0FBRXZELHVFQUF1RTtBQUN2RSxNQUFNLENBQUMsTUFBTSxtQ0FBbUMsR0FBRyxLQUFLLENBQUM7QUFFekQsa0ZBQWtGO0FBQ2xGLE1BQU0sQ0FBQyxNQUFNLDRCQUE0QixHQUFHLGtCQUFrQixDQUFDLFdBQVcsQ0FBQztBQUUzRTs7OztHQUlHO0FBQ0gsTUFBTSxPQUFPLHFCQUFxQjtJQUNoQyxpQkFBaUIsQ0FBQyxhQUFxQixJQUFHLENBQUM7SUFDM0MscUJBQXFCLEtBQUssQ0FBQztDQUM1QjtBQUVEOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sMEJBQTBCLEdBQUcsSUFBSSxjQUFjLENBQVUsNEJBQTRCLENBQUMsQ0FBQztBQUVwRzs7O0dBR0c7QUFDSCxNQUFNLENBQUMsTUFBTSx3REFBd0QsR0FDakUsSUFBSSxjQUFjLENBQVUsMERBQTBELENBQUMsQ0FBQztBQUU1Rjs7R0FFRztBQUNILE1BQU0sQ0FBQyxNQUFNLHdCQUF3QixHQUFHLElBQUksY0FBYyxDQUFVLDBCQUEwQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtJbmplY3Rpb25Ub2tlbiwgU2NoZW1hTWV0YWRhdGEsIMm1RGVmZXJCbG9ja0JlaGF2aW9yIGFzIERlZmVyQmxvY2tCZWhhdmlvcn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cblxuLyoqIFdoZXRoZXIgdGVzdCBtb2R1bGVzIHNob3VsZCBiZSB0b3JuIGRvd24gYnkgZGVmYXVsdC4gKi9cbmV4cG9ydCBjb25zdCBURUFSRE9XTl9URVNUSU5HX01PRFVMRV9PTl9ERVNUUk9ZX0RFRkFVTFQgPSB0cnVlO1xuXG4vKiogV2hldGhlciB1bmtub3duIGVsZW1lbnRzIGluIHRlbXBsYXRlcyBzaG91bGQgdGhyb3cgYnkgZGVmYXVsdC4gKi9cbmV4cG9ydCBjb25zdCBUSFJPV19PTl9VTktOT1dOX0VMRU1FTlRTX0RFRkFVTFQgPSBmYWxzZTtcblxuLyoqIFdoZXRoZXIgdW5rbm93biBwcm9wZXJ0aWVzIGluIHRlbXBsYXRlcyBzaG91bGQgdGhyb3cgYnkgZGVmYXVsdC4gKi9cbmV4cG9ydCBjb25zdCBUSFJPV19PTl9VTktOT1dOX1BST1BFUlRJRVNfREVGQVVMVCA9IGZhbHNlO1xuXG4vKiogV2hldGhlciBkZWZlciBibG9ja3Mgc2hvdWxkIHVzZSBtYW51YWwgdHJpZ2dlcmluZyBvciBwbGF5IHRocm91Z2ggbm9ybWFsbHkuICovXG5leHBvcnQgY29uc3QgREVGRVJfQkxPQ0tfREVGQVVMVF9CRUhBVklPUiA9IERlZmVyQmxvY2tCZWhhdmlvci5QbGF5dGhyb3VnaDtcblxuLyoqXG4gKiBBbiBhYnN0cmFjdCBjbGFzcyBmb3IgaW5zZXJ0aW5nIHRoZSByb290IHRlc3QgY29tcG9uZW50IGVsZW1lbnQgaW4gYSBwbGF0Zm9ybSBpbmRlcGVuZGVudCB3YXkuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY2xhc3MgVGVzdENvbXBvbmVudFJlbmRlcmVyIHtcbiAgaW5zZXJ0Um9vdEVsZW1lbnQocm9vdEVsZW1lbnRJZDogc3RyaW5nKSB7fVxuICByZW1vdmVBbGxSb290RWxlbWVudHM/KCkge31cbn1cblxuLyoqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBjb25zdCBDb21wb25lbnRGaXh0dXJlQXV0b0RldGVjdCA9IG5ldyBJbmplY3Rpb25Ub2tlbjxib29sZWFuPignQ29tcG9uZW50Rml4dHVyZUF1dG9EZXRlY3QnKTtcblxuLyoqXG4gKiBUT0RPKGF0c2NvdHQpOiBNYWtlIHB1YmxpYyBBUEkgb25jZSB3ZSBoYXZlIGRlY2lkZWQgaWYgd2Ugd2FudCB0aGlzIGVycm9yIGFuZCBob3cgd2Ugd2FudCBkZXZzIHRvXG4gKiBkaXNhYmxlIGl0LlxuICovXG5leHBvcnQgY29uc3QgQWxsb3dEZXRlY3RDaGFuZ2VzQW5kQWNrbm93bGVkZ2VJdENhbkhpZGVBcHBsaWNhdGlvbkJ1Z3MgPVxuICAgIG5ldyBJbmplY3Rpb25Ub2tlbjxib29sZWFuPignQWxsb3dEZXRlY3RDaGFuZ2VzQW5kQWNrbm93bGVkZ2VJdENhbkhpZGVBcHBsaWNhdGlvbkJ1Z3MnKTtcblxuLyoqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBjb25zdCBDb21wb25lbnRGaXh0dXJlTm9OZ1pvbmUgPSBuZXcgSW5qZWN0aW9uVG9rZW48Ym9vbGVhbj4oJ0NvbXBvbmVudEZpeHR1cmVOb05nWm9uZScpO1xuXG4vKipcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUZXN0TW9kdWxlTWV0YWRhdGEge1xuICBwcm92aWRlcnM/OiBhbnlbXTtcbiAgZGVjbGFyYXRpb25zPzogYW55W107XG4gIGltcG9ydHM/OiBhbnlbXTtcbiAgc2NoZW1hcz86IEFycmF5PFNjaGVtYU1ldGFkYXRhfGFueVtdPjtcbiAgdGVhcmRvd24/OiBNb2R1bGVUZWFyZG93bk9wdGlvbnM7XG4gIC8qKlxuICAgKiBXaGV0aGVyIE5HMDMwNCBydW50aW1lIGVycm9ycyBzaG91bGQgYmUgdGhyb3duIHdoZW4gdW5rbm93biBlbGVtZW50cyBhcmUgcHJlc2VudCBpbiBjb21wb25lbnQnc1xuICAgKiB0ZW1wbGF0ZS4gRGVmYXVsdHMgdG8gYGZhbHNlYCwgd2hlcmUgdGhlIGVycm9yIGlzIHNpbXBseSBsb2dnZWQuIElmIHNldCB0byBgdHJ1ZWAsIHRoZSBlcnJvciBpc1xuICAgKiB0aHJvd24uXG4gICAqIEBzZWUgW05HODAwMV0oL2Vycm9ycy9ORzgwMDEpIGZvciB0aGUgZGVzY3JpcHRpb24gb2YgdGhlIHByb2JsZW0gYW5kIGhvdyB0byBmaXggaXRcbiAgICovXG4gIGVycm9yT25Vbmtub3duRWxlbWVudHM/OiBib29sZWFuO1xuICAvKipcbiAgICogV2hldGhlciBlcnJvcnMgc2hvdWxkIGJlIHRocm93biB3aGVuIHVua25vd24gcHJvcGVydGllcyBhcmUgcHJlc2VudCBpbiBjb21wb25lbnQncyB0ZW1wbGF0ZS5cbiAgICogRGVmYXVsdHMgdG8gYGZhbHNlYCwgd2hlcmUgdGhlIGVycm9yIGlzIHNpbXBseSBsb2dnZWQuXG4gICAqIElmIHNldCB0byBgdHJ1ZWAsIHRoZSBlcnJvciBpcyB0aHJvd24uXG4gICAqIEBzZWUgW05HODAwMl0oL2Vycm9ycy9ORzgwMDIpIGZvciB0aGUgZGVzY3JpcHRpb24gb2YgdGhlIGVycm9yIGFuZCBob3cgdG8gZml4IGl0XG4gICAqL1xuICBlcnJvck9uVW5rbm93blByb3BlcnRpZXM/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIGRlZmVyIGJsb2NrcyBzaG91bGQgYmVoYXZlIHdpdGggbWFudWFsIHRyaWdnZXJpbmcgb3IgcGxheSB0aHJvdWdoIG5vcm1hbGx5LlxuICAgKiBEZWZhdWx0cyB0byBgbWFudWFsYC5cbiAgICovXG4gIGRlZmVyQmxvY2tCZWhhdmlvcj86IERlZmVyQmxvY2tCZWhhdmlvcjtcbn1cblxuLyoqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVGVzdEVudmlyb25tZW50T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBDb25maWd1cmVzIHRoZSB0ZXN0IG1vZHVsZSB0ZWFyZG93biBiZWhhdmlvciBpbiBgVGVzdEJlZGAuXG4gICAqL1xuICB0ZWFyZG93bj86IE1vZHVsZVRlYXJkb3duT3B0aW9ucztcbiAgLyoqXG4gICAqIFdoZXRoZXIgZXJyb3JzIHNob3VsZCBiZSB0aHJvd24gd2hlbiB1bmtub3duIGVsZW1lbnRzIGFyZSBwcmVzZW50IGluIGNvbXBvbmVudCdzIHRlbXBsYXRlLlxuICAgKiBEZWZhdWx0cyB0byBgZmFsc2VgLCB3aGVyZSB0aGUgZXJyb3IgaXMgc2ltcGx5IGxvZ2dlZC5cbiAgICogSWYgc2V0IHRvIGB0cnVlYCwgdGhlIGVycm9yIGlzIHRocm93bi5cbiAgICogQHNlZSBbTkc4MDAxXSgvZXJyb3JzL05HODAwMSkgZm9yIHRoZSBkZXNjcmlwdGlvbiBvZiB0aGUgZXJyb3IgYW5kIGhvdyB0byBmaXggaXRcbiAgICovXG4gIGVycm9yT25Vbmtub3duRWxlbWVudHM/OiBib29sZWFuO1xuICAvKipcbiAgICogV2hldGhlciBlcnJvcnMgc2hvdWxkIGJlIHRocm93biB3aGVuIHVua25vd24gcHJvcGVydGllcyBhcmUgcHJlc2VudCBpbiBjb21wb25lbnQncyB0ZW1wbGF0ZS5cbiAgICogRGVmYXVsdHMgdG8gYGZhbHNlYCwgd2hlcmUgdGhlIGVycm9yIGlzIHNpbXBseSBsb2dnZWQuXG4gICAqIElmIHNldCB0byBgdHJ1ZWAsIHRoZSBlcnJvciBpcyB0aHJvd24uXG4gICAqIEBzZWUgW05HODAwMl0oL2Vycm9ycy9ORzgwMDIpIGZvciB0aGUgZGVzY3JpcHRpb24gb2YgdGhlIGVycm9yIGFuZCBob3cgdG8gZml4IGl0XG4gICAqL1xuICBlcnJvck9uVW5rbm93blByb3BlcnRpZXM/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIENvbmZpZ3VyZXMgdGhlIHRlc3QgbW9kdWxlIHRlYXJkb3duIGJlaGF2aW9yIGluIGBUZXN0QmVkYC5cbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNb2R1bGVUZWFyZG93bk9wdGlvbnMge1xuICAvKiogV2hldGhlciB0aGUgdGVzdCBtb2R1bGUgc2hvdWxkIGJlIGRlc3Ryb3llZCBhZnRlciBldmVyeSB0ZXN0LiBEZWZhdWx0cyB0byBgdHJ1ZWAuICovXG4gIGRlc3Ryb3lBZnRlckVhY2g6IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgZXJyb3JzIGR1cmluZyB0ZXN0IG1vZHVsZSBkZXN0cnVjdGlvbiBzaG91bGQgYmUgcmUtdGhyb3duLiBEZWZhdWx0cyB0byBgdHJ1ZWAuICovXG4gIHJldGhyb3dFcnJvcnM/OiBib29sZWFuO1xufVxuIl19