/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { createInjector } from './create_injector';
import { THROW_IF_NOT_FOUND, ɵɵinject } from './injector_compatibility';
import { INJECTOR } from './injector_token';
import { ɵɵdefineInjectable } from './interface/defs';
import { NullInjector } from './null_injector';
/**
 * Concrete injectors implement this interface. Injectors are configured
 * with [providers](guide/dependency-injection-providers) that associate
 * dependencies of various types with [injection tokens](guide/dependency-injection-providers).
 *
 * @see [DI Providers](guide/dependency-injection-providers).
 * @see {@link StaticProvider}
 *
 * @usageNotes
 *
 *  The following example creates a service injector instance.
 *
 * {@example core/di/ts/provider_spec.ts region='ConstructorProvider'}
 *
 * ### Usage example
 *
 * {@example core/di/ts/injector_spec.ts region='Injector'}
 *
 * `Injector` returns itself when given `Injector` as a token:
 *
 * {@example core/di/ts/injector_spec.ts region='injectInjector'}
 *
 * @publicApi
 */
export class Injector {
    static { this.THROW_IF_NOT_FOUND = THROW_IF_NOT_FOUND; }
    static { this.NULL = ( /* @__PURE__ */new NullInjector()); }
    static create(options, parent) {
        if (Array.isArray(options)) {
            return createInjector({ name: '' }, parent, options, '');
        }
        else {
            const name = options.name ?? '';
            return createInjector({ name }, options.parent, options.providers, name);
        }
    }
    /** @nocollapse */
    static { this.ɵprov = ɵɵdefineInjectable({
        token: Injector,
        providedIn: 'any',
        factory: () => ɵɵinject(INJECTOR),
    }); }
    /**
     * @internal
     * @nocollapse
     */
    static { this.__NG_ELEMENT_ID__ = -1 /* InjectorMarkers.Injector */; }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5qZWN0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9kaS9pbmplY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFHSCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDakQsT0FBTyxFQUFDLGtCQUFrQixFQUFFLFFBQVEsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBRXRFLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUMxQyxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUdwRCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFHN0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBdUJHO0FBQ0gsTUFBTSxPQUFnQixRQUFRO2FBQ3JCLHVCQUFrQixHQUFHLGtCQUFrQixDQUFDO2FBQ3hDLFNBQUksR0FBYSxFQUFDLGVBQWdCLElBQUksWUFBWSxFQUFFLENBQUMsQ0FBQztJQWtFN0QsTUFBTSxDQUFDLE1BQU0sQ0FDVCxPQUM2RSxFQUM3RSxNQUFpQjtRQUNuQixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUMzQixPQUFPLGNBQWMsQ0FBQyxFQUFDLElBQUksRUFBRSxFQUFFLEVBQUMsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3pELENBQUM7YUFBTSxDQUFDO1lBQ04sTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7WUFDaEMsT0FBTyxjQUFjLENBQUMsRUFBQyxJQUFJLEVBQUMsRUFBRSxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDekUsQ0FBQztJQUNILENBQUM7SUFFRCxrQkFBa0I7YUFDWCxVQUFLLEdBQTZCLGtCQUFrQixDQUFDO1FBQzFELEtBQUssRUFBRSxRQUFRO1FBQ2YsVUFBVSxFQUFFLEtBQUs7UUFDakIsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7S0FDbEMsQ0FBQyxDQUFDO0lBRUg7OztPQUdHO2FBQ0ksc0JBQWlCLHFDQUE0QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5cbmltcG9ydCB7Y3JlYXRlSW5qZWN0b3J9IGZyb20gJy4vY3JlYXRlX2luamVjdG9yJztcbmltcG9ydCB7VEhST1dfSUZfTk9UX0ZPVU5ELCDJtcm1aW5qZWN0fSBmcm9tICcuL2luamVjdG9yX2NvbXBhdGliaWxpdHknO1xuaW1wb3J0IHtJbmplY3Rvck1hcmtlcnN9IGZyb20gJy4vaW5qZWN0b3JfbWFya2VyJztcbmltcG9ydCB7SU5KRUNUT1J9IGZyb20gJy4vaW5qZWN0b3JfdG9rZW4nO1xuaW1wb3J0IHvJtcm1ZGVmaW5lSW5qZWN0YWJsZX0gZnJvbSAnLi9pbnRlcmZhY2UvZGVmcyc7XG5pbXBvcnQge0luamVjdEZsYWdzLCBJbmplY3RPcHRpb25zfSBmcm9tICcuL2ludGVyZmFjZS9pbmplY3Rvcic7XG5pbXBvcnQge1Byb3ZpZGVyLCBTdGF0aWNQcm92aWRlcn0gZnJvbSAnLi9pbnRlcmZhY2UvcHJvdmlkZXInO1xuaW1wb3J0IHtOdWxsSW5qZWN0b3J9IGZyb20gJy4vbnVsbF9pbmplY3Rvcic7XG5pbXBvcnQge1Byb3ZpZGVyVG9rZW59IGZyb20gJy4vcHJvdmlkZXJfdG9rZW4nO1xuXG4vKipcbiAqIENvbmNyZXRlIGluamVjdG9ycyBpbXBsZW1lbnQgdGhpcyBpbnRlcmZhY2UuIEluamVjdG9ycyBhcmUgY29uZmlndXJlZFxuICogd2l0aCBbcHJvdmlkZXJzXShndWlkZS9kZXBlbmRlbmN5LWluamVjdGlvbi1wcm92aWRlcnMpIHRoYXQgYXNzb2NpYXRlXG4gKiBkZXBlbmRlbmNpZXMgb2YgdmFyaW91cyB0eXBlcyB3aXRoIFtpbmplY3Rpb24gdG9rZW5zXShndWlkZS9kZXBlbmRlbmN5LWluamVjdGlvbi1wcm92aWRlcnMpLlxuICpcbiAqIEBzZWUgW0RJIFByb3ZpZGVyc10oZ3VpZGUvZGVwZW5kZW5jeS1pbmplY3Rpb24tcHJvdmlkZXJzKS5cbiAqIEBzZWUge0BsaW5rIFN0YXRpY1Byb3ZpZGVyfVxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBjcmVhdGVzIGEgc2VydmljZSBpbmplY3RvciBpbnN0YW5jZS5cbiAqXG4gKiB7QGV4YW1wbGUgY29yZS9kaS90cy9wcm92aWRlcl9zcGVjLnRzIHJlZ2lvbj0nQ29uc3RydWN0b3JQcm92aWRlcid9XG4gKlxuICogIyMjIFVzYWdlIGV4YW1wbGVcbiAqXG4gKiB7QGV4YW1wbGUgY29yZS9kaS90cy9pbmplY3Rvcl9zcGVjLnRzIHJlZ2lvbj0nSW5qZWN0b3InfVxuICpcbiAqIGBJbmplY3RvcmAgcmV0dXJucyBpdHNlbGYgd2hlbiBnaXZlbiBgSW5qZWN0b3JgIGFzIGEgdG9rZW46XG4gKlxuICoge0BleGFtcGxlIGNvcmUvZGkvdHMvaW5qZWN0b3Jfc3BlYy50cyByZWdpb249J2luamVjdEluamVjdG9yJ31cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBJbmplY3RvciB7XG4gIHN0YXRpYyBUSFJPV19JRl9OT1RfRk9VTkQgPSBUSFJPV19JRl9OT1RfRk9VTkQ7XG4gIHN0YXRpYyBOVUxMOiBJbmplY3RvciA9ICgvKiBAX19QVVJFX18gKi8gbmV3IE51bGxJbmplY3RvcigpKTtcblxuICAvKipcbiAgICogSW50ZXJuYWwgbm90ZSBvbiB0aGUgYG9wdGlvbnM/OiBJbmplY3RPcHRpb25zfEluamVjdEZsYWdzYCBvdmVycmlkZSBvZiB0aGUgYGdldGBcbiAgICogbWV0aG9kOiBjb25zaWRlciBkcm9wcGluZyB0aGUgYEluamVjdEZsYWdzYCBwYXJ0IGluIG9uZSBvZiB0aGUgbWFqb3IgdmVyc2lvbnMuXG4gICAqIEl0IGNhbiAqKm5vdCoqIGJlIGRvbmUgaW4gbWlub3IvcGF0Y2gsIHNpbmNlIGl0J3MgYnJlYWtpbmcgZm9yIGN1c3RvbSBpbmplY3RvcnNcbiAgICogdGhhdCBvbmx5IGltcGxlbWVudCB0aGUgb2xkIGBJbmplY3RvckZsYWdzYCBpbnRlcmZhY2UuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgYW4gaW5zdGFuY2UgZnJvbSB0aGUgaW5qZWN0b3IgYmFzZWQgb24gdGhlIHByb3ZpZGVkIHRva2VuLlxuICAgKiBAcmV0dXJucyBUaGUgaW5zdGFuY2UgZnJvbSB0aGUgaW5qZWN0b3IgaWYgZGVmaW5lZCwgb3RoZXJ3aXNlIHRoZSBgbm90Rm91bmRWYWx1ZWAuXG4gICAqIEB0aHJvd3MgV2hlbiB0aGUgYG5vdEZvdW5kVmFsdWVgIGlzIGB1bmRlZmluZWRgIG9yIGBJbmplY3Rvci5USFJPV19JRl9OT1RfRk9VTkRgLlxuICAgKi9cbiAgYWJzdHJhY3QgZ2V0PFQ+KHRva2VuOiBQcm92aWRlclRva2VuPFQ+LCBub3RGb3VuZFZhbHVlOiB1bmRlZmluZWQsIG9wdGlvbnM6IEluamVjdE9wdGlvbnMme1xuICAgIG9wdGlvbmFsPzogZmFsc2U7XG4gIH0pOiBUO1xuICAvKipcbiAgICogUmV0cmlldmVzIGFuIGluc3RhbmNlIGZyb20gdGhlIGluamVjdG9yIGJhc2VkIG9uIHRoZSBwcm92aWRlZCB0b2tlbi5cbiAgICogQHJldHVybnMgVGhlIGluc3RhbmNlIGZyb20gdGhlIGluamVjdG9yIGlmIGRlZmluZWQsIG90aGVyd2lzZSB0aGUgYG5vdEZvdW5kVmFsdWVgLlxuICAgKiBAdGhyb3dzIFdoZW4gdGhlIGBub3RGb3VuZFZhbHVlYCBpcyBgdW5kZWZpbmVkYCBvciBgSW5qZWN0b3IuVEhST1dfSUZfTk9UX0ZPVU5EYC5cbiAgICovXG4gIGFic3RyYWN0IGdldDxUPih0b2tlbjogUHJvdmlkZXJUb2tlbjxUPiwgbm90Rm91bmRWYWx1ZTogbnVsbHx1bmRlZmluZWQsIG9wdGlvbnM6IEluamVjdE9wdGlvbnMpOiBUXG4gICAgICB8bnVsbDtcbiAgLyoqXG4gICAqIFJldHJpZXZlcyBhbiBpbnN0YW5jZSBmcm9tIHRoZSBpbmplY3RvciBiYXNlZCBvbiB0aGUgcHJvdmlkZWQgdG9rZW4uXG4gICAqIEByZXR1cm5zIFRoZSBpbnN0YW5jZSBmcm9tIHRoZSBpbmplY3RvciBpZiBkZWZpbmVkLCBvdGhlcndpc2UgdGhlIGBub3RGb3VuZFZhbHVlYC5cbiAgICogQHRocm93cyBXaGVuIHRoZSBgbm90Rm91bmRWYWx1ZWAgaXMgYHVuZGVmaW5lZGAgb3IgYEluamVjdG9yLlRIUk9XX0lGX05PVF9GT1VORGAuXG4gICAqL1xuICBhYnN0cmFjdCBnZXQ8VD4odG9rZW46IFByb3ZpZGVyVG9rZW48VD4sIG5vdEZvdW5kVmFsdWU/OiBULCBvcHRpb25zPzogSW5qZWN0T3B0aW9uc3xJbmplY3RGbGFncyk6XG4gICAgICBUO1xuICAvKipcbiAgICogUmV0cmlldmVzIGFuIGluc3RhbmNlIGZyb20gdGhlIGluamVjdG9yIGJhc2VkIG9uIHRoZSBwcm92aWRlZCB0b2tlbi5cbiAgICogQHJldHVybnMgVGhlIGluc3RhbmNlIGZyb20gdGhlIGluamVjdG9yIGlmIGRlZmluZWQsIG90aGVyd2lzZSB0aGUgYG5vdEZvdW5kVmFsdWVgLlxuICAgKiBAdGhyb3dzIFdoZW4gdGhlIGBub3RGb3VuZFZhbHVlYCBpcyBgdW5kZWZpbmVkYCBvciBgSW5qZWN0b3IuVEhST1dfSUZfTk9UX0ZPVU5EYC5cbiAgICogQGRlcHJlY2F0ZWQgdXNlIG9iamVjdC1iYXNlZCBmbGFncyAoYEluamVjdE9wdGlvbnNgKSBpbnN0ZWFkLlxuICAgKi9cbiAgYWJzdHJhY3QgZ2V0PFQ+KHRva2VuOiBQcm92aWRlclRva2VuPFQ+LCBub3RGb3VuZFZhbHVlPzogVCwgZmxhZ3M/OiBJbmplY3RGbGFncyk6IFQ7XG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCBmcm9tIHY0LjAuMCB1c2UgUHJvdmlkZXJUb2tlbjxUPlxuICAgKiBAc3VwcHJlc3Mge2R1cGxpY2F0ZX1cbiAgICovXG4gIGFic3RyYWN0IGdldCh0b2tlbjogYW55LCBub3RGb3VuZFZhbHVlPzogYW55KTogYW55O1xuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCBmcm9tIHY1IHVzZSB0aGUgbmV3IHNpZ25hdHVyZSBJbmplY3Rvci5jcmVhdGUob3B0aW9ucylcbiAgICovXG4gIHN0YXRpYyBjcmVhdGUocHJvdmlkZXJzOiBTdGF0aWNQcm92aWRlcltdLCBwYXJlbnQ/OiBJbmplY3Rvcik6IEluamVjdG9yO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGluamVjdG9yIGluc3RhbmNlIHRoYXQgcHJvdmlkZXMgb25lIG9yIG1vcmUgZGVwZW5kZW5jaWVzLFxuICAgKiBhY2NvcmRpbmcgdG8gYSBnaXZlbiB0eXBlIG9yIHR5cGVzIG9mIGBTdGF0aWNQcm92aWRlcmAuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIEFuIG9iamVjdCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAgICogKiBgcHJvdmlkZXJzYDogQW4gYXJyYXkgb2YgcHJvdmlkZXJzIG9mIHRoZSBbU3RhdGljUHJvdmlkZXIgdHlwZV0oYXBpL2NvcmUvU3RhdGljUHJvdmlkZXIpLlxuICAgKiAqIGBwYXJlbnRgOiAob3B0aW9uYWwpIEEgcGFyZW50IGluamVjdG9yLlxuICAgKiAqIGBuYW1lYDogKG9wdGlvbmFsKSBBIGRldmVsb3Blci1kZWZpbmVkIGlkZW50aWZ5aW5nIG5hbWUgZm9yIHRoZSBuZXcgaW5qZWN0b3IuXG4gICAqXG4gICAqIEByZXR1cm5zIFRoZSBuZXcgaW5qZWN0b3IgaW5zdGFuY2UuXG4gICAqXG4gICAqL1xuICBzdGF0aWMgY3JlYXRlKG9wdGlvbnM6XG4gICAgICAgICAgICAgICAgICAgIHtwcm92aWRlcnM6IEFycmF5PFByb3ZpZGVyfFN0YXRpY1Byb3ZpZGVyPiwgcGFyZW50PzogSW5qZWN0b3IsIG5hbWU/OiBzdHJpbmd9KTpcbiAgICAgIEluamVjdG9yO1xuXG5cbiAgc3RhdGljIGNyZWF0ZShcbiAgICAgIG9wdGlvbnM6IFN0YXRpY1Byb3ZpZGVyW118XG4gICAgICB7cHJvdmlkZXJzOiBBcnJheTxQcm92aWRlcnxTdGF0aWNQcm92aWRlcj4sIHBhcmVudD86IEluamVjdG9yLCBuYW1lPzogc3RyaW5nfSxcbiAgICAgIHBhcmVudD86IEluamVjdG9yKTogSW5qZWN0b3Ige1xuICAgIGlmIChBcnJheS5pc0FycmF5KG9wdGlvbnMpKSB7XG4gICAgICByZXR1cm4gY3JlYXRlSW5qZWN0b3Ioe25hbWU6ICcnfSwgcGFyZW50LCBvcHRpb25zLCAnJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG5hbWUgPSBvcHRpb25zLm5hbWUgPz8gJyc7XG4gICAgICByZXR1cm4gY3JlYXRlSW5qZWN0b3Ioe25hbWV9LCBvcHRpb25zLnBhcmVudCwgb3B0aW9ucy5wcm92aWRlcnMsIG5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAbm9jb2xsYXBzZSAqL1xuICBzdGF0aWMgybVwcm92ID0gLyoqIEBwdXJlT3JCcmVha015Q29kZSAqLyDJtcm1ZGVmaW5lSW5qZWN0YWJsZSh7XG4gICAgdG9rZW46IEluamVjdG9yLFxuICAgIHByb3ZpZGVkSW46ICdhbnknLFxuICAgIGZhY3Rvcnk6ICgpID0+IMm1ybVpbmplY3QoSU5KRUNUT1IpLFxuICB9KTtcblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqIEBub2NvbGxhcHNlXG4gICAqL1xuICBzdGF0aWMgX19OR19FTEVNRU5UX0lEX18gPSBJbmplY3Rvck1hcmtlcnMuSW5qZWN0b3I7XG59XG4iXX0=