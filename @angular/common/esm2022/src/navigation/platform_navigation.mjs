/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * This class wraps the platform Navigation API which allows server-specific and test
 * implementations.
 */
export class PlatformNavigation {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.6", ngImport: i0, type: PlatformNavigation, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.6", ngImport: i0, type: PlatformNavigation, providedIn: 'platform', useFactory: () => window.navigation }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.6", ngImport: i0, type: PlatformNavigation, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'platform', useFactory: () => window.navigation }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm1fbmF2aWdhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbW1vbi9zcmMvbmF2aWdhdGlvbi9wbGF0Zm9ybV9uYXZpZ2F0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7O0FBZXpDOzs7R0FHRztBQUVILE1BQU0sT0FBZ0Isa0JBQWtCO3lIQUFsQixrQkFBa0I7NkhBQWxCLGtCQUFrQixjQURmLFVBQVUsY0FBYyxHQUFHLEVBQUUsQ0FBRSxNQUFjLENBQUMsVUFBVTs7c0dBQzNELGtCQUFrQjtrQkFEdkMsVUFBVTttQkFBQyxFQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxDQUFFLE1BQWMsQ0FBQyxVQUFVLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtcbiAgTmF2aWdhdGVFdmVudCxcbiAgTmF2aWdhdGlvbixcbiAgTmF2aWdhdGlvbkN1cnJlbnRFbnRyeUNoYW5nZUV2ZW50LFxuICBOYXZpZ2F0aW9uSGlzdG9yeUVudHJ5LFxuICBOYXZpZ2F0aW9uTmF2aWdhdGVPcHRpb25zLFxuICBOYXZpZ2F0aW9uT3B0aW9ucyxcbiAgTmF2aWdhdGlvblJlbG9hZE9wdGlvbnMsXG4gIE5hdmlnYXRpb25SZXN1bHQsXG4gIE5hdmlnYXRpb25UcmFuc2l0aW9uLFxuICBOYXZpZ2F0aW9uVXBkYXRlQ3VycmVudEVudHJ5T3B0aW9ucyxcbn0gZnJvbSAnLi9uYXZpZ2F0aW9uX3R5cGVzJztcblxuLyoqXG4gKiBUaGlzIGNsYXNzIHdyYXBzIHRoZSBwbGF0Zm9ybSBOYXZpZ2F0aW9uIEFQSSB3aGljaCBhbGxvd3Mgc2VydmVyLXNwZWNpZmljIGFuZCB0ZXN0XG4gKiBpbXBsZW1lbnRhdGlvbnMuXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncGxhdGZvcm0nLCB1c2VGYWN0b3J5OiAoKSA9PiAod2luZG93IGFzIGFueSkubmF2aWdhdGlvbn0pXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUGxhdGZvcm1OYXZpZ2F0aW9uIGltcGxlbWVudHMgTmF2aWdhdGlvbiB7XG4gIGFic3RyYWN0IGVudHJpZXMoKTogTmF2aWdhdGlvbkhpc3RvcnlFbnRyeVtdO1xuICBhYnN0cmFjdCBjdXJyZW50RW50cnk6IE5hdmlnYXRpb25IaXN0b3J5RW50cnkgfCBudWxsO1xuICBhYnN0cmFjdCB1cGRhdGVDdXJyZW50RW50cnkob3B0aW9uczogTmF2aWdhdGlvblVwZGF0ZUN1cnJlbnRFbnRyeU9wdGlvbnMpOiB2b2lkO1xuICBhYnN0cmFjdCB0cmFuc2l0aW9uOiBOYXZpZ2F0aW9uVHJhbnNpdGlvbiB8IG51bGw7XG4gIGFic3RyYWN0IGNhbkdvQmFjazogYm9vbGVhbjtcbiAgYWJzdHJhY3QgY2FuR29Gb3J3YXJkOiBib29sZWFuO1xuICBhYnN0cmFjdCBuYXZpZ2F0ZSh1cmw6IHN0cmluZywgb3B0aW9ucz86IE5hdmlnYXRpb25OYXZpZ2F0ZU9wdGlvbnMgfCB1bmRlZmluZWQpOiBOYXZpZ2F0aW9uUmVzdWx0O1xuICBhYnN0cmFjdCByZWxvYWQob3B0aW9ucz86IE5hdmlnYXRpb25SZWxvYWRPcHRpb25zIHwgdW5kZWZpbmVkKTogTmF2aWdhdGlvblJlc3VsdDtcbiAgYWJzdHJhY3QgdHJhdmVyc2VUbyhrZXk6IHN0cmluZywgb3B0aW9ucz86IE5hdmlnYXRpb25PcHRpb25zIHwgdW5kZWZpbmVkKTogTmF2aWdhdGlvblJlc3VsdDtcbiAgYWJzdHJhY3QgYmFjayhvcHRpb25zPzogTmF2aWdhdGlvbk9wdGlvbnMgfCB1bmRlZmluZWQpOiBOYXZpZ2F0aW9uUmVzdWx0O1xuICBhYnN0cmFjdCBmb3J3YXJkKG9wdGlvbnM/OiBOYXZpZ2F0aW9uT3B0aW9ucyB8IHVuZGVmaW5lZCk6IE5hdmlnYXRpb25SZXN1bHQ7XG4gIGFic3RyYWN0IG9ubmF2aWdhdGU6ICgodGhpczogTmF2aWdhdGlvbiwgZXY6IE5hdmlnYXRlRXZlbnQpID0+IGFueSkgfCBudWxsO1xuICBhYnN0cmFjdCBvbm5hdmlnYXRlc3VjY2VzczogKCh0aGlzOiBOYXZpZ2F0aW9uLCBldjogRXZlbnQpID0+IGFueSkgfCBudWxsO1xuICBhYnN0cmFjdCBvbm5hdmlnYXRlZXJyb3I6ICgodGhpczogTmF2aWdhdGlvbiwgZXY6IEVycm9yRXZlbnQpID0+IGFueSkgfCBudWxsO1xuICBhYnN0cmFjdCBvbmN1cnJlbnRlbnRyeWNoYW5nZTpcbiAgICB8ICgodGhpczogTmF2aWdhdGlvbiwgZXY6IE5hdmlnYXRpb25DdXJyZW50RW50cnlDaGFuZ2VFdmVudCkgPT4gYW55KVxuICAgIHwgbnVsbDtcbiAgYWJzdHJhY3QgYWRkRXZlbnRMaXN0ZW5lcih0eXBlOiB1bmtub3duLCBsaXN0ZW5lcjogdW5rbm93biwgb3B0aW9ucz86IHVua25vd24pOiB2b2lkO1xuICBhYnN0cmFjdCByZW1vdmVFdmVudExpc3RlbmVyKHR5cGU6IHVua25vd24sIGxpc3RlbmVyOiB1bmtub3duLCBvcHRpb25zPzogdW5rbm93bik6IHZvaWQ7XG4gIGFic3RyYWN0IGRpc3BhdGNoRXZlbnQoZXZlbnQ6IEV2ZW50KTogYm9vbGVhbjtcbn1cbiJdfQ==