/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { createInjectorWithoutInjectorInstances } from '../di/create_injector';
import { getNullInjector, R3Injector } from '../di/r3_injector';
import { ComponentFactoryResolver as viewEngine_ComponentFactoryResolver } from '../linker/component_factory_resolver';
import { NgModuleFactory as viewEngine_NgModuleFactory, NgModuleRef as viewEngine_NgModuleRef } from '../linker/ng_module_factory';
import { assertDefined } from '../util/assert';
import { stringify } from '../util/stringify';
import { ComponentFactoryResolver } from './component_ref';
import { getNgModuleDef } from './definition';
import { maybeUnwrapFn } from './util/misc_utils';
/**
 * Returns a new NgModuleRef instance based on the NgModule class and parent injector provided.
 *
 * @param ngModule NgModule class.
 * @param parentInjector Optional injector instance to use as a parent for the module injector. If
 *     not provided, `NullInjector` will be used instead.
 * @returns NgModuleRef that represents an NgModule instance.
 *
 * @publicApi
 */
export function createNgModule(ngModule, parentInjector) {
    return new NgModuleRef(ngModule, parentInjector ?? null, []);
}
/**
 * The `createNgModule` function alias for backwards-compatibility.
 * Please avoid using it directly and use `createNgModule` instead.
 *
 * @deprecated Use `createNgModule` instead.
 */
export const createNgModuleRef = createNgModule;
export class NgModuleRef extends viewEngine_NgModuleRef {
    constructor(ngModuleType, _parent, additionalProviders) {
        super();
        this._parent = _parent;
        // tslint:disable-next-line:require-internal-with-underscore
        this._bootstrapComponents = [];
        this.destroyCbs = [];
        // When bootstrapping a module we have a dependency graph that looks like this:
        // ApplicationRef -> ComponentFactoryResolver -> NgModuleRef. The problem is that if the
        // module being resolved tries to inject the ComponentFactoryResolver, it'll create a
        // circular dependency which will result in a runtime error, because the injector doesn't
        // exist yet. We work around the issue by creating the ComponentFactoryResolver ourselves
        // and providing it, rather than letting the injector resolve it.
        this.componentFactoryResolver = new ComponentFactoryResolver(this);
        const ngModuleDef = getNgModuleDef(ngModuleType);
        ngDevMode &&
            assertDefined(ngModuleDef, `NgModule '${stringify(ngModuleType)}' is not a subtype of 'NgModuleType'.`);
        this._bootstrapComponents = maybeUnwrapFn(ngModuleDef.bootstrap);
        this._r3Injector = createInjectorWithoutInjectorInstances(ngModuleType, _parent, [
            { provide: viewEngine_NgModuleRef, useValue: this }, {
                provide: viewEngine_ComponentFactoryResolver,
                useValue: this.componentFactoryResolver
            },
            ...additionalProviders
        ], stringify(ngModuleType), new Set(['environment']));
        // We need to resolve the injector types separately from the injector creation, because
        // the module might be trying to use this ref in its constructor for DI which will cause a
        // circular error that will eventually error out, because the injector isn't created yet.
        this._r3Injector.resolveInjectorInitializers();
        this.instance = this._r3Injector.get(ngModuleType);
    }
    get injector() {
        return this._r3Injector;
    }
    destroy() {
        ngDevMode && assertDefined(this.destroyCbs, 'NgModule already destroyed');
        const injector = this._r3Injector;
        !injector.destroyed && injector.destroy();
        this.destroyCbs.forEach(fn => fn());
        this.destroyCbs = null;
    }
    onDestroy(callback) {
        ngDevMode && assertDefined(this.destroyCbs, 'NgModule already destroyed');
        this.destroyCbs.push(callback);
    }
}
export class NgModuleFactory extends viewEngine_NgModuleFactory {
    constructor(moduleType) {
        super();
        this.moduleType = moduleType;
    }
    create(parentInjector) {
        return new NgModuleRef(this.moduleType, parentInjector, []);
    }
}
export function createNgModuleRefWithProviders(moduleType, parentInjector, additionalProviders) {
    return new NgModuleRef(moduleType, parentInjector, additionalProviders);
}
export class EnvironmentNgModuleRefAdapter extends viewEngine_NgModuleRef {
    constructor(config) {
        super();
        this.componentFactoryResolver = new ComponentFactoryResolver(this);
        this.instance = null;
        const injector = new R3Injector([
            ...config.providers,
            { provide: viewEngine_NgModuleRef, useValue: this },
            { provide: viewEngine_ComponentFactoryResolver, useValue: this.componentFactoryResolver },
        ], config.parent || getNullInjector(), config.debugName, new Set(['environment']));
        this.injector = injector;
        if (config.runEnvironmentInitializers) {
            injector.resolveInjectorInitializers();
        }
    }
    destroy() {
        this.injector.destroy();
    }
    onDestroy(callback) {
        this.injector.onDestroy(callback);
    }
}
/**
 * Create a new environment injector.
 *
 * Learn more about environment injectors in
 * [this guide](guide/standalone-components#environment-injectors).
 *
 * @param providers An array of providers.
 * @param parent A parent environment injector.
 * @param debugName An optional name for this injector instance, which will be used in error
 *     messages.
 *
 * @publicApi
 */
export function createEnvironmentInjector(providers, parent, debugName = null) {
    const adapter = new EnvironmentNgModuleRefAdapter({ providers, parent, debugName, runEnvironmentInitializers: true });
    return adapter.injector;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfbW9kdWxlX3JlZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3JlbmRlcjMvbmdfbW9kdWxlX3JlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsc0NBQXNDLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUc3RSxPQUFPLEVBQXNCLGVBQWUsRUFBRSxVQUFVLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUVuRixPQUFPLEVBQUMsd0JBQXdCLElBQUksbUNBQW1DLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUNySCxPQUFPLEVBQXNCLGVBQWUsSUFBSSwwQkFBMEIsRUFBRSxXQUFXLElBQUksc0JBQXNCLEVBQUMsTUFBTSw2QkFBNkIsQ0FBQztBQUN0SixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRTVDLE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDNUMsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRWhEOzs7Ozs7Ozs7R0FTRztBQUNILE1BQU0sVUFBVSxjQUFjLENBQzFCLFFBQWlCLEVBQUUsY0FBeUI7SUFDOUMsT0FBTyxJQUFJLFdBQVcsQ0FBSSxRQUFRLEVBQUUsY0FBYyxJQUFJLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNsRSxDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FBRyxjQUFjLENBQUM7QUFDaEQsTUFBTSxPQUFPLFdBQWUsU0FBUSxzQkFBeUI7SUFpQjNELFlBQ0ksWUFBcUIsRUFBUyxPQUFzQixFQUFFLG1CQUFxQztRQUM3RixL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ICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Y3JlYXRlSW5qZWN0b3JXaXRob3V0SW5qZWN0b3JJbnN0YW5jZXN9IGZyb20gJy4uL2RpL2NyZWF0ZV9pbmplY3Rvcic7XG5pbXBvcnQge0luamVjdG9yfSBmcm9tICcuLi9kaS9pbmplY3Rvcic7XG5pbXBvcnQge0Vudmlyb25tZW50UHJvdmlkZXJzLCBQcm92aWRlciwgU3RhdGljUHJvdmlkZXJ9IGZyb20gJy4uL2RpL2ludGVyZmFjZS9wcm92aWRlcic7XG5pbXBvcnQge0Vudmlyb25tZW50SW5qZWN0b3IsIGdldE51bGxJbmplY3RvciwgUjNJbmplY3Rvcn0gZnJvbSAnLi4vZGkvcjNfaW5qZWN0b3InO1xuaW1wb3J0IHtUeXBlfSBmcm9tICcuLi9pbnRlcmZhY2UvdHlwZSc7XG5pbXBvcnQge0NvbXBvbmVudEZhY3RvcnlSZXNvbHZlciBhcyB2aWV3RW5naW5lX0NvbXBvbmVudEZhY3RvcnlSZXNvbHZlcn0gZnJvbSAnLi4vbGlua2VyL2NvbXBvbmVudF9mYWN0b3J5X3Jlc29sdmVyJztcbmltcG9ydCB7SW50ZXJuYWxOZ01vZHVsZVJlZiwgTmdNb2R1bGVGYWN0b3J5IGFzIHZpZXdFbmdpbmVfTmdNb2R1bGVGYWN0b3J5LCBOZ01vZHVsZVJlZiBhcyB2aWV3RW5naW5lX05nTW9kdWxlUmVmfSBmcm9tICcuLi9saW5rZXIvbmdfbW9kdWxlX2ZhY3RvcnknO1xuaW1wb3J0IHthc3NlcnREZWZpbmVkfSBmcm9tICcuLi91dGlsL2Fzc2VydCc7XG5pbXBvcnQge3N0cmluZ2lmeX0gZnJvbSAnLi4vdXRpbC9zdHJpbmdpZnknO1xuXG5pbXBvcnQge0NvbXBvbmVudEZhY3RvcnlSZXNvbHZlcn0gZnJvbSAnLi9jb21wb25lbnRfcmVmJztcbmltcG9ydCB7Z2V0TmdNb2R1bGVEZWZ9IGZyb20gJy4vZGVmaW5pdGlvbic7XG5pbXBvcnQge21heWJlVW53cmFwRm59IGZyb20gJy4vdXRpbC9taXNjX3V0aWxzJztcblxuLyoqXG4gKiBSZXR1cm5zIGEgbmV3IE5nTW9kdWxlUmVmIGluc3RhbmNlIGJhc2VkIG9uIHRoZSBOZ01vZHVsZSBjbGFzcyBhbmQgcGFyZW50IGluamVjdG9yIHByb3ZpZGVkLlxuICpcbiAqIEBwYXJhbSBuZ01vZHVsZSBOZ01vZHVsZSBjbGFzcy5cbiAqIEBwYXJhbSBwYXJlbnRJbmplY3RvciBPcHRpb25hbCBpbmplY3RvciBpbnN0YW5jZSB0byB1c2UgYXMgYSBwYXJlbnQgZm9yIHRoZSBtb2R1bGUgaW5qZWN0b3IuIElmXG4gKiAgICAgbm90IHByb3ZpZGVkLCBgTnVsbEluamVjdG9yYCB3aWxsIGJlIHVzZWQgaW5zdGVhZC5cbiAqIEByZXR1cm5zIE5nTW9kdWxlUmVmIHRoYXQgcmVwcmVzZW50cyBhbiBOZ01vZHVsZSBpbnN0YW5jZS5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVOZ01vZHVsZTxUPihcbiAgICBuZ01vZHVsZTogVHlwZTxUPiwgcGFyZW50SW5qZWN0b3I/OiBJbmplY3Rvcik6IHZpZXdFbmdpbmVfTmdNb2R1bGVSZWY8VD4ge1xuICByZXR1cm4gbmV3IE5nTW9kdWxlUmVmPFQ+KG5nTW9kdWxlLCBwYXJlbnRJbmplY3RvciA/PyBudWxsLCBbXSk7XG59XG5cbi8qKlxuICogVGhlIGBjcmVhdGVOZ01vZHVsZWAgZnVuY3Rpb24gYWxpYXMgZm9yIGJhY2t3YXJkcy1jb21wYXRpYmlsaXR5LlxuICogUGxlYXNlIGF2b2lkIHVzaW5nIGl0IGRpcmVjdGx5IGFuZCB1c2UgYGNyZWF0ZU5nTW9kdWxlYCBpbnN0ZWFkLlxuICpcbiAqIEBkZXByZWNhdGVkIFVzZSBgY3JlYXRlTmdNb2R1bGVgIGluc3RlYWQuXG4gKi9cbmV4cG9ydCBjb25zdCBjcmVhdGVOZ01vZHVsZVJlZiA9IGNyZWF0ZU5nTW9kdWxlO1xuZXhwb3J0IGNsYXNzIE5nTW9kdWxlUmVmPFQ+IGV4dGVuZHMgdmlld0VuZ2luZV9OZ01vZHVsZVJlZjxUPiBpbXBsZW1lbnRzIEludGVybmFsTmdNb2R1bGVSZWY8VD4ge1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cmVxdWlyZS1pbnRlcm5hbC13aXRoLXVuZGVyc2NvcmVcbiAgX2Jvb3RzdHJhcENvbXBvbmVudHM6IFR5cGU8YW55PltdID0gW107XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpyZXF1aXJlLWludGVybmFsLXdpdGgtdW5kZXJzY29yZVxuICBfcjNJbmplY3RvcjogUjNJbmplY3RvcjtcbiAgb3ZlcnJpZGUgaW5zdGFuY2U6IFQ7XG4gIGRlc3Ryb3lDYnM6ICgoKSA9PiB2b2lkKVtdfG51bGwgPSBbXTtcblxuICAvLyBXaGVuIGJvb3RzdHJhcHBpbmcgYSBtb2R1bGUgd2UgaGF2ZSBhIGRlcGVuZGVuY3kgZ3JhcGggdGhhdCBsb29rcyBsaWtlIHRoaXM6XG4gIC8vIEFwcGxpY2F0aW9uUmVmIC0+IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciAtPiBOZ01vZHVsZVJlZi4gVGhlIHByb2JsZW0gaXMgdGhhdCBpZiB0aGVcbiAgLy8gbW9kdWxlIGJlaW5nIHJlc29sdmVkIHRyaWVzIHRvIGluamVjdCB0aGUgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBpdCdsbCBjcmVhdGUgYVxuICAvLyBjaXJjdWxhciBkZXBlbmRlbmN5IHdoaWNoIHdpbGwgcmVzdWx0IGluIGEgcnVudGltZSBlcnJvciwgYmVjYXVzZSB0aGUgaW5qZWN0b3IgZG9lc24ndFxuICAvLyBleGlzdCB5ZXQuIFdlIHdvcmsgYXJvdW5kIHRoZSBpc3N1ZSBieSBjcmVhdGluZyB0aGUgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyIG91cnNlbHZlc1xuICAvLyBhbmQgcHJvdmlkaW5nIGl0LCByYXRoZXIgdGhhbiBsZXR0aW5nIHRoZSBpbmplY3RvciByZXNvbHZlIGl0LlxuICBvdmVycmlkZSByZWFkb25seSBjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciA9XG4gICAgICBuZXcgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyKHRoaXMpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgbmdNb2R1bGVUeXBlOiBUeXBlPFQ+LCBwdWJsaWMgX3BhcmVudDogSW5qZWN0b3J8bnVsbCwgYWRkaXRpb25hbFByb3ZpZGVyczogU3RhdGljUHJvdmlkZXJbXSkge1xuICAgIHN1cGVyKCk7XG4gICAgY29uc3QgbmdNb2R1bGVEZWYgPSBnZXROZ01vZHVsZURlZihuZ01vZHVsZVR5cGUpO1xuICAgIG5nRGV2TW9kZSAmJlxuICAgICAgICBhc3NlcnREZWZpbmVkKFxuICAgICAgICAgICAgbmdNb2R1bGVEZWYsXG4gICAgICAgICAgICBgTmdNb2R1bGUgJyR7c3RyaW5naWZ5KG5nTW9kdWxlVHlwZSl9JyBpcyBub3QgYSBzdWJ0eXBlIG9mICdOZ01vZHVsZVR5cGUnLmApO1xuXG4gICAgdGhpcy5fYm9vdHN0cmFwQ29tcG9uZW50cyA9IG1heWJlVW53cmFwRm4obmdNb2R1bGVEZWYhLmJvb3RzdHJhcCk7XG4gICAgdGhpcy5fcjNJbmplY3RvciA9IGNyZWF0ZUluamVjdG9yV2l0aG91dEluamVjdG9ySW5zdGFuY2VzKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgbmdNb2R1bGVUeXBlLCBfcGFyZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cHJvdmlkZTogdmlld0VuZ2luZV9OZ01vZHVsZVJlZiwgdXNlVmFsdWU6IHRoaXN9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvdmlkZTogdmlld0VuZ2luZV9Db21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlVmFsdWU6IHRoaXMuY29tcG9uZW50RmFjdG9yeVJlc29sdmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmFkZGl0aW9uYWxQcm92aWRlcnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmdpZnkobmdNb2R1bGVUeXBlKSwgbmV3IFNldChbJ2Vudmlyb25tZW50J10pKSBhcyBSM0luamVjdG9yO1xuXG4gICAgLy8gV2UgbmVlZCB0byByZXNvbHZlIHRoZSBpbmplY3RvciB0eXBlcyBzZXBhcmF0ZWx5IGZyb20gdGhlIGluamVjdG9yIGNyZWF0aW9uLCBiZWNhdXNlXG4gICAgLy8gdGhlIG1vZHVsZSBtaWdodCBiZSB0cnlpbmcgdG8gdXNlIHRoaXMgcmVmIGluIGl0cyBjb25zdHJ1Y3RvciBmb3IgREkgd2hpY2ggd2lsbCBjYXVzZSBhXG4gICAgLy8gY2lyY3VsYXIgZXJyb3IgdGhhdCB3aWxsIGV2ZW50dWFsbHkgZXJyb3Igb3V0LCBiZWNhdXNlIHRoZSBpbmplY3RvciBpc24ndCBjcmVhdGVkIHlldC5cbiAgICB0aGlzLl9yM0luamVjdG9yLnJlc29sdmVJbmplY3RvckluaXRpYWxpemVycygpO1xuICAgIHRoaXMuaW5zdGFuY2UgPSB0aGlzLl9yM0luamVjdG9yLmdldChuZ01vZHVsZVR5cGUpO1xuICB9XG5cbiAgb3ZlcnJpZGUgZ2V0IGluamVjdG9yKCk6IEVudmlyb25tZW50SW5qZWN0b3Ige1xuICAgIHJldHVybiB0aGlzLl9yM0luamVjdG9yO1xuICB9XG5cbiAgb3ZlcnJpZGUgZGVzdHJveSgpOiB2b2lkIHtcbiAgICBuZ0Rldk1vZGUgJiYgYXNzZXJ0RGVmaW5lZCh0aGlzLmRlc3Ryb3lDYnMsICdOZ01vZHVsZSBhbHJlYWR5IGRlc3Ryb3llZCcpO1xuICAgIGNvbnN0IGluamVjdG9yID0gdGhpcy5fcjNJbmplY3RvcjtcbiAgICAhaW5qZWN0b3IuZGVzdHJveWVkICYmIGluamVjdG9yLmRlc3Ryb3koKTtcbiAgICB0aGlzLmRlc3Ryb3lDYnMhLmZvckVhY2goZm4gPT4gZm4oKSk7XG4gICAgdGhpcy5kZXN0cm95Q2JzID0gbnVsbDtcbiAgfVxuICBvdmVycmlkZSBvbkRlc3Ryb3koY2FsbGJhY2s6ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICBuZ0Rldk1vZGUgJiYgYXNzZXJ0RGVmaW5lZCh0aGlzLmRlc3Ryb3lDYnMsICdOZ01vZHVsZSBhbHJlYWR5IGRlc3Ryb3llZCcpO1xuICAgIHRoaXMuZGVzdHJveUNicyEucHVzaChjYWxsYmFjayk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE5nTW9kdWxlRmFjdG9yeTxUPiBleHRlbmRzIHZpZXdFbmdpbmVfTmdNb2R1bGVGYWN0b3J5PFQ+IHtcbiAgY29uc3RydWN0b3IocHVibGljIG1vZHVsZVR5cGU6IFR5cGU8VD4pIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgb3ZlcnJpZGUgY3JlYXRlKHBhcmVudEluamVjdG9yOiBJbmplY3RvcnxudWxsKTogdmlld0VuZ2luZV9OZ01vZHVsZVJlZjxUPiB7XG4gICAgcmV0dXJuIG5ldyBOZ01vZHVsZVJlZih0aGlzLm1vZHVsZVR5cGUsIHBhcmVudEluamVjdG9yLCBbXSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU5nTW9kdWxlUmVmV2l0aFByb3ZpZGVyczxUPihcbiAgICBtb2R1bGVUeXBlOiBUeXBlPFQ+LCBwYXJlbnRJbmplY3RvcjogSW5qZWN0b3J8bnVsbCxcbiAgICBhZGRpdGlvbmFsUHJvdmlkZXJzOiBTdGF0aWNQcm92aWRlcltdKTogSW50ZXJuYWxOZ01vZHVsZVJlZjxUPiB7XG4gIHJldHVybiBuZXcgTmdNb2R1bGVSZWYobW9kdWxlVHlwZSwgcGFyZW50SW5qZWN0b3IsIGFkZGl0aW9uYWxQcm92aWRlcnMpO1xufVxuXG5leHBvcnQgY2xhc3MgRW52aXJvbm1lbnROZ01vZHVsZVJlZkFkYXB0ZXIgZXh0ZW5kcyB2aWV3RW5naW5lX05nTW9kdWxlUmVmPG51bGw+IHtcbiAgb3ZlcnJpZGUgcmVhZG9ubHkgaW5qZWN0b3I6IFIzSW5qZWN0b3I7XG4gIG92ZXJyaWRlIHJlYWRvbmx5IGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyID1cbiAgICAgIG5ldyBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIodGhpcyk7XG4gIG92ZXJyaWRlIHJlYWRvbmx5IGluc3RhbmNlID0gbnVsbDtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IHtcbiAgICBwcm92aWRlcnM6IEFycmF5PFByb3ZpZGVyfEVudmlyb25tZW50UHJvdmlkZXJzPixcbiAgICBwYXJlbnQ6IEVudmlyb25tZW50SW5qZWN0b3J8bnVsbCxcbiAgICBkZWJ1Z05hbWU6IHN0cmluZ3xudWxsLFxuICAgIHJ1bkVudmlyb25tZW50SW5pdGlhbGl6ZXJzOiBib29sZWFuXG4gIH0pIHtcbiAgICBzdXBlcigpO1xuICAgIGNvbnN0IGluamVjdG9yID0gbmV3IFIzSW5qZWN0b3IoXG4gICAgICAgIFtcbiAgICAgICAgICAuLi5jb25maWcucHJvdmlkZXJzLFxuICAgICAgICAgIHtwcm92aWRlOiB2aWV3RW5naW5lX05nTW9kdWxlUmVmLCB1c2VWYWx1ZTogdGhpc30sXG4gICAgICAgICAge3Byb3ZpZGU6IHZpZXdFbmdpbmVfQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCB1c2VWYWx1ZTogdGhpcy5jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXJ9LFxuICAgICAgICBdLFxuICAgICAgICBjb25maWcucGFyZW50IHx8IGdldE51bGxJbmplY3RvcigpLCBjb25maWcuZGVidWdOYW1lLCBuZXcgU2V0KFsnZW52aXJvbm1lbnQnXSkpO1xuICAgIHRoaXMuaW5qZWN0b3IgPSBpbmplY3RvcjtcbiAgICBpZiAoY29uZmlnLnJ1bkVudmlyb25tZW50SW5pdGlhbGl6ZXJzKSB7XG4gICAgICBpbmplY3Rvci5yZXNvbHZlSW5qZWN0b3JJbml0aWFsaXplcnMoKTtcbiAgICB9XG4gIH1cblxuICBvdmVycmlkZSBkZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuaW5qZWN0b3IuZGVzdHJveSgpO1xuICB9XG5cbiAgb3ZlcnJpZGUgb25EZXN0cm95KGNhbGxiYWNrOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5pbmplY3Rvci5vbkRlc3Ryb3koY2FsbGJhY2spO1xuICB9XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgbmV3IGVudmlyb25tZW50IGluamVjdG9yLlxuICpcbiAqIExlYXJuIG1vcmUgYWJvdXQgZW52aXJvbm1lbnQgaW5qZWN0b3JzIGluXG4gKiBbdGhpcyBndWlkZV0oZ3VpZGUvc3RhbmRhbG9uZS1jb21wb25lbnRzI2Vudmlyb25tZW50LWluamVjdG9ycykuXG4gKlxuICogQHBhcmFtIHByb3ZpZGVycyBBbiBhcnJheSBvZiBwcm92aWRlcnMuXG4gKiBAcGFyYW0gcGFyZW50IEEgcGFyZW50IGVudmlyb25tZW50IGluamVjdG9yLlxuICogQHBhcmFtIGRlYnVnTmFtZSBBbiBvcHRpb25hbCBuYW1lIGZvciB0aGlzIGluamVjdG9yIGluc3RhbmNlLCB3aGljaCB3aWxsIGJlIHVzZWQgaW4gZXJyb3JcbiAqICAgICBtZXNzYWdlcy5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbnZpcm9ubWVudEluamVjdG9yKFxuICAgIHByb3ZpZGVyczogQXJyYXk8UHJvdmlkZXJ8RW52aXJvbm1lbnRQcm92aWRlcnM+LCBwYXJlbnQ6IEVudmlyb25tZW50SW5qZWN0b3IsXG4gICAgZGVidWdOYW1lOiBzdHJpbmd8bnVsbCA9IG51bGwpOiBFbnZpcm9ubWVudEluamVjdG9yIHtcbiAgY29uc3QgYWRhcHRlciA9IG5ldyBFbnZpcm9ubWVudE5nTW9kdWxlUmVmQWRhcHRlcihcbiAgICAgIHtwcm92aWRlcnMsIHBhcmVudCwgZGVidWdOYW1lLCBydW5FbnZpcm9ubWVudEluaXRpYWxpemVyczogdHJ1ZX0pO1xuICByZXR1cm4gYWRhcHRlci5pbmplY3Rvcjtcbn1cbiJdfQ==