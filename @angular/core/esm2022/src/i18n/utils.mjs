/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Checks whether a TNode is considered detached, i.e. not present in the
 * translated i18n template. We should not attempt hydration for such nodes
 * and instead, use a regular "creation mode".
 */
export function isDetachedByI18n(tNode) {
    return (tNode.flags & 32 /* TNodeFlags.isDetached */) === 32 /* TNodeFlags.isDetached */;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9pMThuL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUlIOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsZ0JBQWdCLENBQUMsS0FBWTtJQUMzQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssaUNBQXdCLENBQUMsbUNBQTBCLENBQUM7QUFDekUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1ROb2RlLCBUTm9kZUZsYWdzfSBmcm9tICcuLi9yZW5kZXIzL2ludGVyZmFjZXMvbm9kZSc7XG5cbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgYSBUTm9kZSBpcyBjb25zaWRlcmVkIGRldGFjaGVkLCBpLmUuIG5vdCBwcmVzZW50IGluIHRoZVxuICogdHJhbnNsYXRlZCBpMThuIHRlbXBsYXRlLiBXZSBzaG91bGQgbm90IGF0dGVtcHQgaHlkcmF0aW9uIGZvciBzdWNoIG5vZGVzXG4gKiBhbmQgaW5zdGVhZCwgdXNlIGEgcmVndWxhciBcImNyZWF0aW9uIG1vZGVcIi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRGV0YWNoZWRCeUkxOG4odE5vZGU6IFROb2RlKSB7XG4gIHJldHVybiAodE5vZGUuZmxhZ3MgJiBUTm9kZUZsYWdzLmlzRGV0YWNoZWQpID09PSBUTm9kZUZsYWdzLmlzRGV0YWNoZWQ7XG59XG4iXX0=