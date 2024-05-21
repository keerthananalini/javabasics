import * as o from '../output/output_ast';
import { Identifiers as R3 } from '../render3/r3_identifiers';
import { typeWithParameters } from './util';
export var R3FactoryDelegateType;
(function (R3FactoryDelegateType) {
    R3FactoryDelegateType[R3FactoryDelegateType["Class"] = 0] = "Class";
    R3FactoryDelegateType[R3FactoryDelegateType["Function"] = 1] = "Function";
})(R3FactoryDelegateType || (R3FactoryDelegateType = {}));
export var FactoryTarget;
(function (FactoryTarget) {
    FactoryTarget[FactoryTarget["Directive"] = 0] = "Directive";
    FactoryTarget[FactoryTarget["Component"] = 1] = "Component";
    FactoryTarget[FactoryTarget["Injectable"] = 2] = "Injectable";
    FactoryTarget[FactoryTarget["Pipe"] = 3] = "Pipe";
    FactoryTarget[FactoryTarget["NgModule"] = 4] = "NgModule";
})(FactoryTarget || (FactoryTarget = {}));
/**
 * Construct a factory function expression for the given `R3FactoryMetadata`.
 */
export function compileFactoryFunction(meta) {
    const t = o.variable('t');
    let baseFactoryVar = null;
    // The type to instantiate via constructor invocation. If there is no delegated factory, meaning
    // this type is always created by constructor invocation, then this is the type-to-create
    // parameter provided by the user (t) if specified, or the current type if not. If there is a
    // delegated factory (which is used to create the current type) then this is only the type-to-
    // create parameter (t).
    const typeForCtor = !isDelegatedFactoryMetadata(meta) ?
        new o.BinaryOperatorExpr(o.BinaryOperator.Or, t, meta.type.value) :
        t;
    let ctorExpr = null;
    if (meta.deps !== null) {
        // There is a constructor (either explicitly or implicitly defined).
        if (meta.deps !== 'invalid') {
            ctorExpr = new o.InstantiateExpr(typeForCtor, injectDependencies(meta.deps, meta.target));
        }
    }
    else {
        // There is no constructor, use the base class' factory to construct typeForCtor.
        baseFactoryVar = o.variable(`ɵ${meta.name}_BaseFactory`);
        ctorExpr = baseFactoryVar.callFn([typeForCtor]);
    }
    const body = [];
    let retExpr = null;
    function makeConditionalFactory(nonCtorExpr) {
        const r = o.variable('r');
        body.push(r.set(o.NULL_EXPR).toDeclStmt());
        const ctorStmt = ctorExpr !== null ? r.set(ctorExpr).toStmt() :
            o.importExpr(R3.invalidFactory).callFn([]).toStmt();
        body.push(o.ifStmt(t, [ctorStmt], [r.set(nonCtorExpr).toStmt()]));
        return r;
    }
    if (isDelegatedFactoryMetadata(meta)) {
        // This type is created with a delegated factory. If a type parameter is not specified, call
        // the factory instead.
        const delegateArgs = injectDependencies(meta.delegateDeps, meta.target);
        // Either call `new delegate(...)` or `delegate(...)` depending on meta.delegateType.
        const factoryExpr = new (meta.delegateType === R3FactoryDelegateType.Class ?
            o.InstantiateExpr :
            o.InvokeFunctionExpr)(meta.delegate, delegateArgs);
        retExpr = makeConditionalFactory(factoryExpr);
    }
    else if (isExpressionFactoryMetadata(meta)) {
        // TODO(alxhub): decide whether to lower the value here or in the caller
        retExpr = makeConditionalFactory(meta.expression);
    }
    else {
        retExpr = ctorExpr;
    }
    if (retExpr === null) {
        // The expression cannot be formed so render an `ɵɵinvalidFactory()` call.
        body.push(o.importExpr(R3.invalidFactory).callFn([]).toStmt());
    }
    else if (baseFactoryVar !== null) {
        // This factory uses a base factory, so call `ɵɵgetInheritedFactory()` to compute it.
        const getInheritedFactoryCall = o.importExpr(R3.getInheritedFactory).callFn([meta.type.value]);
        // Memoize the base factoryFn: `baseFactory || (baseFactory = ɵɵgetInheritedFactory(...))`
        const baseFactory = new o.BinaryOperatorExpr(o.BinaryOperator.Or, baseFactoryVar, baseFactoryVar.set(getInheritedFactoryCall));
        body.push(new o.ReturnStatement(baseFactory.callFn([typeForCtor])));
    }
    else {
        // This is straightforward factory, just return it.
        body.push(new o.ReturnStatement(retExpr));
    }
    let factoryFn = o.fn([new o.FnParam('t', o.DYNAMIC_TYPE)], body, o.INFERRED_TYPE, undefined, `${meta.name}_Factory`);
    if (baseFactoryVar !== null) {
        // There is a base factory variable so wrap its declaration along with the factory function into
        // an IIFE.
        factoryFn = o.arrowFn([], [
            new o.DeclareVarStmt(baseFactoryVar.name), new o.ReturnStatement(factoryFn)
        ]).callFn([], /* sourceSpan */ undefined, /* pure */ true);
    }
    return {
        expression: factoryFn,
        statements: [],
        type: createFactoryType(meta),
    };
}
export function createFactoryType(meta) {
    const ctorDepsType = meta.deps !== null && meta.deps !== 'invalid' ? createCtorDepsType(meta.deps) : o.NONE_TYPE;
    return o.expressionType(o.importExpr(R3.FactoryDeclaration, [typeWithParameters(meta.type.type, meta.typeArgumentCount), ctorDepsType]));
}
function injectDependencies(deps, target) {
    return deps.map((dep, index) => compileInjectDependency(dep, target, index));
}
function compileInjectDependency(dep, target, index) {
    // Interpret the dependency according to its resolved type.
    if (dep.token === null) {
        return o.importExpr(R3.invalidFactoryDep).callFn([o.literal(index)]);
    }
    else if (dep.attributeNameType === null) {
        // Build up the injection flags according to the metadata.
        const flags = 0 /* InjectFlags.Default */ | (dep.self ? 2 /* InjectFlags.Self */ : 0) |
            (dep.skipSelf ? 4 /* InjectFlags.SkipSelf */ : 0) | (dep.host ? 1 /* InjectFlags.Host */ : 0) |
            (dep.optional ? 8 /* InjectFlags.Optional */ : 0) |
            (target === FactoryTarget.Pipe ? 16 /* InjectFlags.ForPipe */ : 0);
        // If this dependency is optional or otherwise has non-default flags, then additional
        // parameters describing how to inject the dependency must be passed to the inject function
        // that's being used.
        let flagsParam = (flags !== 0 /* InjectFlags.Default */ || dep.optional) ? o.literal(flags) : null;
        // Build up the arguments to the injectFn call.
        const injectArgs = [dep.token];
        if (flagsParam) {
            injectArgs.push(flagsParam);
        }
        const injectFn = getInjectFn(target);
        return o.importExpr(injectFn).callFn(injectArgs);
    }
    else {
        // The `dep.attributeTypeName` value is defined, which indicates that this is an `@Attribute()`
        // type dependency. For the generated JS we still want to use the `dep.token` value in case the
        // name given for the attribute is not a string literal. For example given `@Attribute(foo())`,
        // we want to generate `ɵɵinjectAttribute(foo())`.
        //
        // The `dep.attributeTypeName` is only actually used (in `createCtorDepType()`) to generate
        // typings.
        return o.importExpr(R3.injectAttribute).callFn([dep.token]);
    }
}
function createCtorDepsType(deps) {
    let hasTypes = false;
    const attributeTypes = deps.map(dep => {
        const type = createCtorDepType(dep);
        if (type !== null) {
            hasTypes = true;
            return type;
        }
        else {
            return o.literal(null);
        }
    });
    if (hasTypes) {
        return o.expressionType(o.literalArr(attributeTypes));
    }
    else {
        return o.NONE_TYPE;
    }
}
function createCtorDepType(dep) {
    const entries = [];
    if (dep.attributeNameType !== null) {
        entries.push({ key: 'attribute', value: dep.attributeNameType, quoted: false });
    }
    if (dep.optional) {
        entries.push({ key: 'optional', value: o.literal(true), quoted: false });
    }
    if (dep.host) {
        entries.push({ key: 'host', value: o.literal(true), quoted: false });
    }
    if (dep.self) {
        entries.push({ key: 'self', value: o.literal(true), quoted: false });
    }
    if (dep.skipSelf) {
        entries.push({ key: 'skipSelf', value: o.literal(true), quoted: false });
    }
    return entries.length > 0 ? o.literalMap(entries) : null;
}
export function isDelegatedFactoryMetadata(meta) {
    return meta.delegateType !== undefined;
}
export function isExpressionFactoryMetadata(meta) {
    return meta.expression !== undefined;
}
function getInjectFn(target) {
    switch (target) {
        case FactoryTarget.Component:
        case FactoryTarget.Directive:
        case FactoryTarget.Pipe:
            return R3.directiveInject;
        case FactoryTarget.NgModule:
        case FactoryTarget.Injectable:
        default:
            return R3.inject;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicjNfZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9yZW5kZXIzL3IzX2ZhY3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUUEsT0FBTyxLQUFLLENBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUMxQyxPQUFPLEVBQUMsV0FBVyxJQUFJLEVBQUUsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBRTVELE9BQU8sRUFBb0Msa0JBQWtCLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFvQzdFLE1BQU0sQ0FBTixJQUFZLHFCQUdYO0FBSEQsV0FBWSxxQkFBcUI7SUFDL0IsbUVBQVMsQ0FBQTtJQUNULHlFQUFZLENBQUE7QUFDZCxDQUFDLEVBSFcscUJBQXFCLEtBQXJCLHFCQUFxQixRQUdoQztBQWVELE1BQU0sQ0FBTixJQUFZLGFBTVg7QUFORCxXQUFZLGFBQWE7SUFDdkIsMkRBQWEsQ0FBQTtJQUNiLDJEQUFhLENBQUE7SUFDYiw2REFBYyxDQUFBO0lBQ2QsaURBQVEsQ0FBQTtJQUNSLHlEQUFZLENBQUE7QUFDZCxDQUFDLEVBTlcsYUFBYSxLQUFiLGFBQWEsUUFNeEI7QUFxQ0Q7O0dBRUc7QUFDSCxNQUFNLFVBQVUsc0JBQXNCLENBQUMsSUFBdUI7SUFDNUQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMxQixJQUFJLGNBQWMsR0FBdUIsSUFBSSxDQUFDO0lBRTlDLGdHQUFnRztJQUNoRyx5RkFBeUY7SUFDekYsNkZBQTZGO0lBQzdGLDhGQUE4RjtJQUM5Rix3QkFBd0I7SUFDeEIsTUFBTSxXQUFXLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ25ELElBQUksQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLENB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QU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDM0QsQ0FBQztBQUVELE1BQU0sVUFBVSwwQkFBMEIsQ0FBQyxJQUF1QjtJQUVoRSxPQUFRLElBQVksQ0FBQyxZQUFZLEtBQUssU0FBUyxDQUFDO0FBQ2xELENBQUM7QUFFRCxNQUFNLFVBQVUsMkJBQTJCLENBQUMsSUFBdUI7SUFFakUsT0FBUSxJQUFZLENBQUMsVUFBVSxLQUFLLFNBQVMsQ0FBQztBQUNoRCxDQUFDO0FBRUQsU0FBUyxXQUFXLENBQUMsTUFBcUI7SUFDeEMsUUFBUSxNQUFNLEVBQUUsQ0FBQztRQUNmLEtBQUssYUFBYSxDQUFDLFNBQVMsQ0FBQztRQUM3QixLQUFLLGFBQWEsQ0FBQyxTQUFTLENBQUM7UUFDN0IsS0FBSyxhQUFhLENBQUMsSUFBSTtZQUNyQixPQUFPLEVBQUUsQ0FBQyxlQUFlLENBQUM7UUFDNUIsS0FBSyxhQUFhLENBQUMsUUFBUSxDQUFDO1FBQzVCLEtBQUssYUFBYSxDQUFDLFVBQVUsQ0FBQztRQUM5QjtZQUNFLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQztJQUNyQixDQUFDO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtJbmplY3RGbGFnc30gZnJvbSAnLi4vY29yZSc7XG5pbXBvcnQgKiBhcyBvIGZyb20gJy4uL291dHB1dC9vdXRwdXRfYXN0JztcbmltcG9ydCB7SWRlbnRpZmllcnMgYXMgUjN9IGZyb20gJy4uL3JlbmRlcjMvcjNfaWRlbnRpZmllcnMnO1xuXG5pbXBvcnQge1IzQ29tcGlsZWRFeHByZXNzaW9uLCBSM1JlZmVyZW5jZSwgdHlwZVdpdGhQYXJhbWV0ZXJzfSBmcm9tICcuL3V0aWwnO1xuXG5cbi8qKlxuICogTWV0YWRhdGEgcmVxdWlyZWQgYnkgdGhlIGZhY3RvcnkgZ2VuZXJhdG9yIHRvIGdlbmVyYXRlIGEgYGZhY3RvcnlgIGZ1bmN0aW9uIGZvciBhIHR5cGUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUjNDb25zdHJ1Y3RvckZhY3RvcnlNZXRhZGF0YSB7XG4gIC8qKlxuICAgKiBTdHJpbmcgbmFtZSBvZiB0aGUgdHlwZSBiZWluZyBnZW5lcmF0ZWQgKHVzZWQgdG8gbmFtZSB0aGUgZmFjdG9yeSBmdW5jdGlvbikuXG4gICAqL1xuICBuYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEFuIGV4cHJlc3Npb24gcmVwcmVzZW50aW5nIHRoZSBpbnRlcmZhY2UgdHlwZSBiZWluZyBjb25zdHJ1Y3RlZC5cbiAgICovXG4gIHR5cGU6IFIzUmVmZXJlbmNlO1xuXG4gIC8qKiBOdW1iZXIgb2YgYXJndW1lbnRzIGZvciB0aGUgYHR5cGVgLiAqL1xuICB0eXBlQXJndW1lbnRDb3VudDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBSZWdhcmRsZXNzIG9mIHdoZXRoZXIgYGZuT3JDbGFzc2AgaXMgYSBjb25zdHJ1Y3RvciBmdW5jdGlvbiBvciBhIHVzZXItZGVmaW5lZCBmYWN0b3J5LCBpdFxuICAgKiBtYXkgaGF2ZSAwIG9yIG1vcmUgcGFyYW1ldGVycywgd2hpY2ggd2lsbCBiZSBpbmplY3RlZCBhY2NvcmRpbmcgdG8gdGhlIGBSM0RlcGVuZGVuY3lNZXRhZGF0YWBcbiAgICogZm9yIHRob3NlIHBhcmFtZXRlcnMuIElmIHRoaXMgaXMgYG51bGxgLCB0aGVuIHRoZSB0eXBlJ3MgY29uc3RydWN0b3IgaXMgbm9uZXhpc3RlbnQgYW5kIHdpbGxcbiAgICogYmUgaW5oZXJpdGVkIGZyb20gYGZuT3JDbGFzc2Agd2hpY2ggaXMgaW50ZXJwcmV0ZWQgYXMgdGhlIGN1cnJlbnQgdHlwZS4gSWYgdGhpcyBpcyBgJ2ludmFsaWQnYCxcbiAgICogdGhlbiBvbmUgb3IgbW9yZSBvZiB0aGUgcGFyYW1ldGVycyB3YXNuJ3QgcmVzb2x2YWJsZSBhbmQgYW55IGF0dGVtcHQgdG8gdXNlIHRoZXNlIGRlcHMgd2lsbFxuICAgKiByZXN1bHQgaW4gYSBydW50aW1lIGVycm9yLlxuICAgKi9cbiAgZGVwczogUjNEZXBlbmRlbmN5TWV0YWRhdGFbXXwnaW52YWxpZCd8bnVsbDtcblxuICAvKipcbiAgICogVHlwZSBvZiB0aGUgdGFyZ2V0IGJlaW5nIGNyZWF0ZWQgYnkgdGhlIGZhY3RvcnkuXG4gICAqL1xuICB0YXJnZXQ6IEZhY3RvcnlUYXJnZXQ7XG59XG5cbmV4cG9ydCBlbnVtIFIzRmFjdG9yeURlbGVnYXRlVHlwZSB7XG4gIENsYXNzID0gMCxcbiAgRnVuY3Rpb24gPSAxLFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFIzRGVsZWdhdGVkRm5PckNsYXNzTWV0YWRhdGEgZXh0ZW5kcyBSM0NvbnN0cnVjdG9yRmFjdG9yeU1ldGFkYXRhIHtcbiAgZGVsZWdhdGU6IG8uRXhwcmVzc2lvbjtcbiAgZGVsZWdhdGVUeXBlOiBSM0ZhY3RvcnlEZWxlZ2F0ZVR5cGU7XG4gIGRlbGVnYXRlRGVwczogUjNEZXBlbmRlbmN5TWV0YWRhdGFbXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSM0V4cHJlc3Npb25GYWN0b3J5TWV0YWRhdGEgZXh0ZW5kcyBSM0NvbnN0cnVjdG9yRmFjdG9yeU1ldGFkYXRhIHtcbiAgZXhwcmVzc2lvbjogby5FeHByZXNzaW9uO1xufVxuXG5leHBvcnQgdHlwZSBSM0ZhY3RvcnlNZXRhZGF0YSA9XG4gICAgUjNDb25zdHJ1Y3RvckZhY3RvcnlNZXRhZGF0YXxSM0RlbGVnYXRlZEZuT3JDbGFzc01ldGFkYXRhfFIzRXhwcmVzc2lvbkZhY3RvcnlNZXRhZGF0YTtcblxuZXhwb3J0IGVudW0gRmFjdG9yeVRhcmdldCB7XG4gIERpcmVjdGl2ZSA9IDAsXG4gIENvbXBvbmVudCA9IDEsXG4gIEluamVjdGFibGUgPSAyLFxuICBQaXBlID0gMyxcbiAgTmdNb2R1bGUgPSA0LFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFIzRGVwZW5kZW5jeU1ldGFkYXRhIHtcbiAgLyoqXG4gICAqIEFuIGV4cHJlc3Npb24gcmVwcmVzZW50aW5nIHRoZSB0b2tlbiBvciB2YWx1ZSB0byBiZSBpbmplY3RlZC5cbiAgICogT3IgYG51bGxgIGlmIHRoZSBkZXBlbmRlbmN5IGNvdWxkIG5vdCBiZSByZXNvbHZlZCAtIG1ha2luZyBpdCBpbnZhbGlkLlxuICAgKi9cbiAgdG9rZW46IG8uRXhwcmVzc2lvbnxudWxsO1xuXG4gIC8qKlxuICAgKiBJZiBhbiBAQXR0cmlidXRlIGRlY29yYXRvciBpcyBwcmVzZW50LCB0aGlzIGlzIHRoZSBsaXRlcmFsIHR5cGUgb2YgdGhlIGF0dHJpYnV0ZSBuYW1lLCBvclxuICAgKiB0aGUgdW5rbm93biB0eXBlIGlmIG5vIGxpdGVyYWwgdHlwZSBpcyBhdmFpbGFibGUgKGUuZy4gdGhlIGF0dHJpYnV0ZSBuYW1lIGlzIGFuIGV4cHJlc3Npb24pLlxuICAgKiBPdGhlcndpc2UgaXQgaXMgbnVsbDtcbiAgICovXG4gIGF0dHJpYnV0ZU5hbWVUeXBlOiBvLkV4cHJlc3Npb258bnVsbDtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZGVwZW5kZW5jeSBoYXMgYW4gQEhvc3QgcXVhbGlmaWVyLlxuICAgKi9cbiAgaG9zdDogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZGVwZW5kZW5jeSBoYXMgYW4gQE9wdGlvbmFsIHF1YWxpZmllci5cbiAgICovXG4gIG9wdGlvbmFsOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBkZXBlbmRlbmN5IGhhcyBhbiBAU2VsZiBxdWFsaWZpZXIuXG4gICAqL1xuICBzZWxmOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBkZXBlbmRlbmN5IGhhcyBhbiBAU2tpcFNlbGYgcXVhbGlmaWVyLlxuICAgKi9cbiAgc2tpcFNlbGY6IGJvb2xlYW47XG59XG5cbi8qKlxuICogQ29uc3RydWN0IGEgZmFjdG9yeSBmdW5jdGlvbiBleHByZXNzaW9uIGZvciB0aGUgZ2l2ZW4gYFIzRmFjdG9yeU1ldGFkYXRhYC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGVGYWN0b3J5RnVuY3Rpb24obWV0YTogUjNGYWN0b3J5TWV0YWRhdGEpOiBSM0NvbXBpbGVkRXhwcmVzc2lvbiB7XG4gIGNvbnN0IHQgPSBvLnZhcmlhYmxlKCd0Jyk7XG4gIGxldCBiYXNlRmFjdG9yeVZhcjogby5SZWFkVmFyRXhwcnxudWxsID0gbnVsbDtcblxuICAvLyBUaGUgdHlwZSB0byBpbnN0YW50aWF0ZSB2aWEgY29uc3RydWN0b3IgaW52b2NhdGlvbi4gSWYgdGhlcmUgaXMgbm8gZGVsZWdhdGVkIGZhY3RvcnksIG1lYW5pbmdcbiAgLy8gdGhpcyB0eXBlIGlzIGFsd2F5cyBjcmVhdGVkIGJ5IGNvbnN0cnVjdG9yIGludm9jYXRpb24sIHRoZW4gdGhpcyBpcyB0aGUgdHlwZS10by1jcmVhdGVcbiAgLy8gcGFyYW1ldGVyIHByb3ZpZGVkIGJ5IHRoZSB1c2VyICh0KSBpZiBzcGVjaWZpZWQsIG9yIHRoZSBjdXJyZW50IHR5cGUgaWYgbm90LiBJZiB0aGVyZSBpcyBhXG4gIC8vIGRlbGVnYXRlZCBmYWN0b3J5ICh3aGljaCBpcyB1c2VkIHRvIGNyZWF0ZSB0aGUgY3VycmVudCB0eXBlKSB0aGVuIHRoaXMgaXMgb25seSB0aGUgdHlwZS10by1cbiAgLy8gY3JlYXRlIHBhcmFtZXRlciAodCkuXG4gIGNvbnN0IHR5cGVGb3JDdG9yID0gIWlzRGVsZWdhdGVkRmFjdG9yeU1ldGFkYXRhKG1ldGEpID9cbiAgICAgIG5ldyBvLkJpbmFyeU9wZXJhdG9yRXhwcihvLkJpbmFyeU9wZXJhdG9yLk9yLCB0LCBtZXRhLnR5cGUudmFsdWUpIDpcbiAgICAgIHQ7XG5cbiAgbGV0IGN0b3JFeHByOiBvLkV4cHJlc3Npb258bnVsbCA9IG51bGw7XG4gIGlmIChtZXRhLmRlcHMgIT09IG51bGwpIHtcbiAgICAvLyBUaGVyZSBpcyBhIGNvbnN0cnVjdG9yIChlaXRoZXIgZXhwbGljaXRseSBvciBpbXBsaWNpdGx5IGRlZmluZWQpLlxuICAgIGlmIChtZXRhLmRlcHMgIT09ICdpbnZhbGlkJykge1xuICAgICAgY3RvckV4cHIgPSBuZXcgby5JbnN0YW50aWF0ZUV4cHIodHlwZUZvckN0b3IsIGluamVjdERlcGVuZGVuY2llcyhtZXRhLmRlcHMsIG1ldGEudGFyZ2V0KSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIFRoZXJlIGlzIG5vIGNvbnN0cnVjdG9yLCB1c2UgdGhlIGJhc2UgY2xhc3MnIGZhY3RvcnkgdG8gY29uc3RydWN0IHR5cGVGb3JDdG9yLlxuICAgIGJhc2VGYWN0b3J5VmFyID0gby52YXJpYWJsZShgybUke21ldGEubmFtZX1fQmFzZUZhY3RvcnlgKTtcbiAgICBjdG9yRXhwciA9IGJhc2VGYWN0b3J5VmFyLmNhbGxGbihbdHlwZUZvckN0b3JdKTtcbiAgfVxuXG4gIGNvbnN0IGJvZHk6IG8uU3RhdGVtZW50W10gPSBbXTtcbiAgbGV0IHJldEV4cHI6IG8uRXhwcmVzc2lvbnxudWxsID0gbnVsbDtcblxuICBmdW5jdGlvbiBtYWtlQ29uZGl0aW9uYWxGYWN0b3J5KG5vbkN0b3JFeHByOiBvLkV4cHJlc3Npb24pOiBvLlJlYWRWYXJFeHByIHtcbiAgICBjb25zdCByID0gby52YXJpYWJsZSgncicpO1xuICAgIGJvZHkucHVzaChyLnNldChvLk5VTExfRVhQUikudG9EZWNsU3RtdCgpKTtcbiAgICBjb25zdCBjdG9yU3RtdCA9IGN0b3JFeHByICE9PSBudWxsID8gci5zZXQoY3RvckV4cHIpLnRvU3RtdCgpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgby5pbXBvcnRFeHByKFIzLmludmFsaWRGYWN0b3J5KS5jYWxsRm4oW10pLnRvU3RtdCgpO1xuICAgIGJvZHkucHVzaChvLmlmU3RtdCh0LCBbY3RvclN0bXRdLCBbci5zZXQobm9uQ3RvckV4cHIpLnRvU3RtdCgpXSkpO1xuICAgIHJldHVybiByO1xuICB9XG5cbiAgaWYgKGlzRGVsZWdhdGVkRmFjdG9yeU1ldGFkYXRhKG1ldGEpKSB7XG4gICAgLy8gVGhpcyB0eXBlIGlzIGNyZWF0ZWQgd2l0aCBhIGRlbGVnYXRlZCBmYWN0b3J5LiBJZiBhIHR5cGUgcGFyYW1ldGVyIGlzIG5vdCBzcGVjaWZpZWQsIGNhbGxcbiAgICAvLyB0aGUgZmFjdG9yeSBpbnN0ZWFkLlxuICAgIGNvbnN0IGRlbGVnYXRlQXJncyA9IGluamVjdERlcGVuZGVuY2llcyhtZXRhLmRlbGVnYXRlRGVwcywgbWV0YS50YXJnZXQpO1xuICAgIC8vIEVpdGhlciBjYWxsIGBuZXcgZGVsZWdhdGUoLi4uKWAgb3IgYGRlbGVnYXRlKC4uLilgIGRlcGVuZGluZyBvbiBtZXRhLmRlbGVnYXRlVHlwZS5cbiAgICBjb25zdCBmYWN0b3J5RXhwciA9IG5ldyAoXG4gICAgICAgIG1ldGEuZGVsZWdhdGVUeXBlID09PSBSM0ZhY3RvcnlEZWxlZ2F0ZVR5cGUuQ2xhc3MgP1xuICAgICAgICAgICAgby5JbnN0YW50aWF0ZUV4cHIgOlxuICAgICAgICAgICAgby5JbnZva2VGdW5jdGlvbkV4cHIpKG1ldGEuZGVsZWdhdGUsIGRlbGVnYXRlQXJncyk7XG4gICAgcmV0RXhwciA9IG1ha2VDb25kaXRpb25hbEZhY3RvcnkoZmFjdG9yeUV4cHIpO1xuICB9IGVsc2UgaWYgKGlzRXhwcmVzc2lvbkZhY3RvcnlNZXRhZGF0YShtZXRhKSkge1xuICAgIC8vIFRPRE8oYWx4aHViKTogZGVjaWRlIHdoZXRoZXIgdG8gbG93ZXIgdGhlIHZhbHVlIGhlcmUgb3IgaW4gdGhlIGNhbGxlclxuICAgIHJldEV4cHIgPSBtYWtlQ29uZGl0aW9uYWxGYWN0b3J5KG1ldGEuZXhwcmVzc2lvbik7XG4gIH0gZWxzZSB7XG4gICAgcmV0RXhwciA9IGN0b3JFeHByO1xuICB9XG5cblxuICBpZiAocmV0RXhwciA9PT0gbnVsbCkge1xuICAgIC8vIFRoZSBleHByZXNzaW9uIGNhbm5vdCBiZSBmb3JtZWQgc28gcmVuZGVyIGFuIGDJtcm1aW52YWxpZEZhY3RvcnkoKWAgY2FsbC5cbiAgICBib2R5LnB1c2goby5pbXBvcnRFeHByKFIzLmludmFsaWRGYWN0b3J5KS5jYWxsRm4oW10pLnRvU3RtdCgpKTtcbiAgfSBlbHNlIGlmIChiYXNlRmFjdG9yeVZhciAhPT0gbnVsbCkge1xuICAgIC8vIFRoaXMgZmFjdG9yeSB1c2VzIGEgYmFzZSBmYWN0b3J5LCBzbyBjYWxsIGDJtcm1Z2V0SW5oZXJpdGVkRmFjdG9yeSgpYCB0byBjb21wdXRlIGl0LlxuICAgIGNvbnN0IGdldEluaGVyaXRlZEZhY3RvcnlDYWxsID0gby5pbXBvcnRFeHByKFIzLmdldEluaGVyaXRlZEZhY3RvcnkpLmNhbGxGbihbbWV0YS50eXBlLnZhbHVlXSk7XG4gICAgLy8gTWVtb2l6ZSB0aGUgYmFzZSBmYWN0b3J5Rm46IGBiYXNlRmFjdG9yeSB8fCAoYmFzZUZhY3RvcnkgPSDJtcm1Z2V0SW5oZXJpdGVkRmFjdG9yeSguLi4pKWBcbiAgICBjb25zdCBiYXNlRmFjdG9yeSA9IG5ldyBvLkJpbmFyeU9wZXJhdG9yRXhwcihcbiAgICAgICAgby5CaW5hcnlPcGVyYXRvci5PciwgYmFzZUZhY3RvcnlWYXIsIGJhc2VGYWN0b3J5VmFyLnNldChnZXRJbmhlcml0ZWRGYWN0b3J5Q2FsbCkpO1xuICAgIGJvZHkucHVzaChuZXcgby5SZXR1cm5TdGF0ZW1lbnQoYmFzZUZhY3RvcnkuY2FsbEZuKFt0eXBlRm9yQ3Rvcl0pKSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gVGhpcyBpcyBzdHJhaWdodGZvcndhcmQgZmFjdG9yeSwganVzdCByZXR1cm4gaXQuXG4gICAgYm9keS5wdXNoKG5ldyBvLlJldHVyblN0YXRlbWVudChyZXRFeHByKSk7XG4gIH1cblxuICBsZXQgZmFjdG9yeUZuOiBvLkV4cHJlc3Npb24gPSBvLmZuKFxuICAgICAgW25ldyBvLkZuUGFyYW0oJ3QnLCBvLkRZTkFNSUNfVFlQRSldLCBib2R5LCBvLklORkVSUkVEX1RZUEUsIHVuZGVmaW5lZCxcbiAgICAgIGAke21ldGEubmFtZX1fRmFjdG9yeWApO1xuXG4gIGlmIChiYXNlRmFjdG9yeVZhciAhPT0gbnVsbCkge1xuICAgIC8vIFRoZXJlIGlzIGEgYmFzZSBmYWN0b3J5IHZhcmlhYmxlIHNvIHdyYXAgaXRzIGRlY2xhcmF0aW9uIGFsb25nIHdpdGggdGhlIGZhY3RvcnkgZnVuY3Rpb24gaW50b1xuICAgIC8vIGFuIElJRkUuXG4gICAgZmFjdG9yeUZuID0gby5hcnJvd0ZuKFtdLCBbXG4gICAgICAgICAgICAgICAgICAgbmV3IG8uRGVjbGFyZVZhclN0bXQoYmFzZUZhY3RvcnlWYXIubmFtZSEpLCBuZXcgby5SZXR1cm5TdGF0ZW1lbnQoZmFjdG9yeUZuKVxuICAgICAgICAgICAgICAgICBdKS5jYWxsRm4oW10sIC8qIHNvdXJjZVNwYW4gKi8gdW5kZWZpbmVkLCAvKiBwdXJlICovIHRydWUpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBleHByZXNzaW9uOiBmYWN0b3J5Rm4sXG4gICAgc3RhdGVtZW50czogW10sXG4gICAgdHlwZTogY3JlYXRlRmFjdG9yeVR5cGUobWV0YSksXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVGYWN0b3J5VHlwZShtZXRhOiBSM0ZhY3RvcnlNZXRhZGF0YSkge1xuICBjb25zdCBjdG9yRGVwc1R5cGUgPVxuICAgICAgbWV0YS5kZXBzICE9PSBudWxsICYmIG1ldGEuZGVwcyAhPT0gJ2ludmFsaWQnID8gY3JlYXRlQ3RvckRlcHNUeXBlKG1ldGEuZGVwcykgOiBvLk5PTkVfVFlQRTtcbiAgcmV0dXJuIG8uZXhwcmVzc2lvblR5cGUoby5pbXBvcnRFeHByKFxuICAgICAgUjMuRmFjdG9yeURlY2xhcmF0aW9uLFxuICAgICAgW3R5cGVXaXRoUGFyYW1ldGVycyhtZXRhLnR5cGUudHlwZSwgbWV0YS50eXBlQXJndW1lbnRDb3VudCksIGN0b3JEZXBzVHlwZV0pKTtcbn1cblxuZnVuY3Rpb24gaW5qZWN0RGVwZW5kZW5jaWVzKGRlcHM6IFIzRGVwZW5kZW5jeU1ldGFkYXRhW10sIHRhcmdldDogRmFjdG9yeVRhcmdldCk6IG8uRXhwcmVzc2lvbltdIHtcbiAgcmV0dXJuIGRlcHMubWFwKChkZXAsIGluZGV4KSA9PiBjb21waWxlSW5qZWN0RGVwZW5kZW5jeShkZXAsIHRhcmdldCwgaW5kZXgpKTtcbn1cblxuZnVuY3Rpb24gY29tcGlsZUluamVjdERlcGVuZGVuY3koXG4gICAgZGVwOiBSM0RlcGVuZGVuY3lNZXRhZGF0YSwgdGFyZ2V0OiBGYWN0b3J5VGFyZ2V0LCBpbmRleDogbnVtYmVyKTogby5FeHByZXNzaW9uIHtcbiAgLy8gSW50ZXJwcmV0IHRoZSBkZXBlbmRlbmN5IGFjY29yZGluZyB0byBpdHMgcmVzb2x2ZWQgdHlwZS5cbiAgaWYgKGRlcC50b2tlbiA9PT0gbnVsbCkge1xuICAgIHJldHVybiBvLmltcG9ydEV4cHIoUjMuaW52YWxpZEZhY3RvcnlEZXApLmNhbGxGbihbby5saXRlcmFsKGluZGV4KV0pO1xuICB9IGVsc2UgaWYgKGRlcC5hdHRyaWJ1dGVOYW1lVHlwZSA9PT0gbnVsbCkge1xuICAgIC8vIEJ1aWxkIHVwIHRoZSBpbmplY3Rpb24gZmxhZ3MgYWNjb3JkaW5nIHRvIHRoZSBtZXRhZGF0YS5cbiAgICBjb25zdCBmbGFncyA9IEluamVjdEZsYWdzLkRlZmF1bHQgfCAoZGVwLnNlbGYgPyBJbmplY3RGbGFncy5TZWxmIDogMCkgfFxuICAgICAgICAoZGVwLnNraXBTZWxmID8gSW5qZWN0RmxhZ3MuU2tpcFNlbGYgOiAwKSB8IChkZXAuaG9zdCA/IEluamVjdEZsYWdzLkhvc3QgOiAwKSB8XG4gICAgICAgIChkZXAub3B0aW9uYWwgPyBJbmplY3RGbGFncy5PcHRpb25hbCA6IDApIHxcbiAgICAgICAgKHRhcmdldCA9PT0gRmFjdG9yeVRhcmdldC5QaXBlID8gSW5qZWN0RmxhZ3MuRm9yUGlwZSA6IDApO1xuXG4gICAgLy8gSWYgdGhpcyBkZXBlbmRlbmN5IGlzIG9wdGlvbmFsIG9yIG90aGVyd2lzZSBoYXMgbm9uLWRlZmF1bHQgZmxhZ3MsIHRoZW4gYWRkaXRpb25hbFxuICAgIC8vIHBhcmFtZXRlcnMgZGVzY3JpYmluZyBob3cgdG8gaW5qZWN0IHRoZSBkZXBlbmRlbmN5IG11c3QgYmUgcGFzc2VkIHRvIHRoZSBpbmplY3QgZnVuY3Rpb25cbiAgICAvLyB0aGF0J3MgYmVpbmcgdXNlZC5cbiAgICBsZXQgZmxhZ3NQYXJhbTogby5MaXRlcmFsRXhwcnxudWxsID1cbiAgICAgICAgKGZsYWdzICE9PSBJbmplY3RGbGFncy5EZWZhdWx0IHx8IGRlcC5vcHRpb25hbCkgPyBvLmxpdGVyYWwoZmxhZ3MpIDogbnVsbDtcblxuICAgIC8vIEJ1aWxkIHVwIHRoZSBhcmd1bWVudHMgdG8gdGhlIGluamVjdEZuIGNhbGwuXG4gICAgY29uc3QgaW5qZWN0QXJncyA9IFtkZXAudG9rZW5dO1xuICAgIGlmIChmbGFnc1BhcmFtKSB7XG4gICAgICBpbmplY3RBcmdzLnB1c2goZmxhZ3NQYXJhbSk7XG4gICAgfVxuICAgIGNvbnN0IGluamVjdEZuID0gZ2V0SW5qZWN0Rm4odGFyZ2V0KTtcbiAgICByZXR1cm4gby5pbXBvcnRFeHByKGluamVjdEZuKS5jYWxsRm4oaW5qZWN0QXJncyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gVGhlIGBkZXAuYXR0cmlidXRlVHlwZU5hbWVgIHZhbHVlIGlzIGRlZmluZWQsIHdoaWNoIGluZGljYXRlcyB0aGF0IHRoaXMgaXMgYW4gYEBBdHRyaWJ1dGUoKWBcbiAgICAvLyB0eXBlIGRlcGVuZGVuY3kuIEZvciB0aGUgZ2VuZXJhdGVkIEpTIHdlIHN0aWxsIHdhbnQgdG8gdXNlIHRoZSBgZGVwLnRva2VuYCB2YWx1ZSBpbiBjYXNlIHRoZVxuICAgIC8vIG5hbWUgZ2l2ZW4gZm9yIHRoZSBhdHRyaWJ1dGUgaXMgbm90IGEgc3RyaW5nIGxpdGVyYWwuIEZvciBleGFtcGxlIGdpdmVuIGBAQXR0cmlidXRlKGZvbygpKWAsXG4gICAgLy8gd2Ugd2FudCB0byBnZW5lcmF0ZSBgybXJtWluamVjdEF0dHJpYnV0ZShmb28oKSlgLlxuICAgIC8vXG4gICAgLy8gVGhlIGBkZXAuYXR0cmlidXRlVHlwZU5hbWVgIGlzIG9ubHkgYWN0dWFsbHkgdXNlZCAoaW4gYGNyZWF0ZUN0b3JEZXBUeXBlKClgKSB0byBnZW5lcmF0ZVxuICAgIC8vIHR5cGluZ3MuXG4gICAgcmV0dXJuIG8uaW1wb3J0RXhwcihSMy5pbmplY3RBdHRyaWJ1dGUpLmNhbGxGbihbZGVwLnRva2VuXSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlQ3RvckRlcHNUeXBlKGRlcHM6IFIzRGVwZW5kZW5jeU1ldGFkYXRhW10pOiBvLlR5cGUge1xuICBsZXQgaGFzVHlwZXMgPSBmYWxzZTtcbiAgY29uc3QgYXR0cmlidXRlVHlwZXMgPSBkZXBzLm1hcChkZXAgPT4ge1xuICAgIGNvbnN0IHR5cGUgPSBjcmVhdGVDdG9yRGVwVHlwZShkZXApO1xuICAgIGlmICh0eXBlICE9PSBudWxsKSB7XG4gICAgICBoYXNUeXBlcyA9IHRydWU7XG4gICAgICByZXR1cm4gdHlwZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG8ubGl0ZXJhbChudWxsKTtcbiAgICB9XG4gIH0pO1xuXG4gIGlmIChoYXNUeXBlcykge1xuICAgIHJldHVybiBvLmV4cHJlc3Npb25UeXBlKG8ubGl0ZXJhbEFycihhdHRyaWJ1dGVUeXBlcykpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBvLk5PTkVfVFlQRTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVDdG9yRGVwVHlwZShkZXA6IFIzRGVwZW5kZW5jeU1ldGFkYXRhKTogby5MaXRlcmFsTWFwRXhwcnxudWxsIHtcbiAgY29uc3QgZW50cmllczoge2tleTogc3RyaW5nLCBxdW90ZWQ6IGJvb2xlYW4sIHZhbHVlOiBvLkV4cHJlc3Npb259W10gPSBbXTtcblxuICBpZiAoZGVwLmF0dHJpYnV0ZU5hbWVUeXBlICE9PSBudWxsKSB7XG4gICAgZW50cmllcy5wdXNoKHtrZXk6ICdhdHRyaWJ1dGUnLCB2YWx1ZTogZGVwLmF0dHJpYnV0ZU5hbWVUeXBlLCBxdW90ZWQ6IGZhbHNlfSk7XG4gIH1cbiAgaWYgKGRlcC5vcHRpb25hbCkge1xuICAgIGVudHJpZXMucHVzaCh7a2V5OiAnb3B0aW9uYWwnLCB2YWx1ZTogby5saXRlcmFsKHRydWUpLCBxdW90ZWQ6IGZhbHNlfSk7XG4gIH1cbiAgaWYgKGRlcC5ob3N0KSB7XG4gICAgZW50cmllcy5wdXNoKHtrZXk6ICdob3N0JywgdmFsdWU6IG8ubGl0ZXJhbCh0cnVlKSwgcXVvdGVkOiBmYWxzZX0pO1xuICB9XG4gIGlmIChkZXAuc2VsZikge1xuICAgIGVudHJpZXMucHVzaCh7a2V5OiAnc2VsZicsIHZhbHVlOiBvLmxpdGVyYWwodHJ1ZSksIHF1b3RlZDogZmFsc2V9KTtcbiAgfVxuICBpZiAoZGVwLnNraXBTZWxmKSB7XG4gICAgZW50cmllcy5wdXNoKHtrZXk6ICdza2lwU2VsZicsIHZhbHVlOiBvLmxpdGVyYWwodHJ1ZSksIHF1b3RlZDogZmFsc2V9KTtcbiAgfVxuXG4gIHJldHVybiBlbnRyaWVzLmxlbmd0aCA+IDAgPyBvLmxpdGVyYWxNYXAoZW50cmllcykgOiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNEZWxlZ2F0ZWRGYWN0b3J5TWV0YWRhdGEobWV0YTogUjNGYWN0b3J5TWV0YWRhdGEpOlxuICAgIG1ldGEgaXMgUjNEZWxlZ2F0ZWRGbk9yQ2xhc3NNZXRhZGF0YSB7XG4gIHJldHVybiAobWV0YSBhcyBhbnkpLmRlbGVnYXRlVHlwZSAhPT0gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNFeHByZXNzaW9uRmFjdG9yeU1ldGFkYXRhKG1ldGE6IFIzRmFjdG9yeU1ldGFkYXRhKTpcbiAgICBtZXRhIGlzIFIzRXhwcmVzc2lvbkZhY3RvcnlNZXRhZGF0YSB7XG4gIHJldHVybiAobWV0YSBhcyBhbnkpLmV4cHJlc3Npb24gIT09IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gZ2V0SW5qZWN0Rm4odGFyZ2V0OiBGYWN0b3J5VGFyZ2V0KTogby5FeHRlcm5hbFJlZmVyZW5jZSB7XG4gIHN3aXRjaCAodGFyZ2V0KSB7XG4gICAgY2FzZSBGYWN0b3J5VGFyZ2V0LkNvbXBvbmVudDpcbiAgICBjYXNlIEZhY3RvcnlUYXJnZXQuRGlyZWN0aXZlOlxuICAgIGNhc2UgRmFjdG9yeVRhcmdldC5QaXBlOlxuICAgICAgcmV0dXJuIFIzLmRpcmVjdGl2ZUluamVjdDtcbiAgICBjYXNlIEZhY3RvcnlUYXJnZXQuTmdNb2R1bGU6XG4gICAgY2FzZSBGYWN0b3J5VGFyZ2V0LkluamVjdGFibGU6XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBSMy5pbmplY3Q7XG4gIH1cbn1cbiJdfQ==