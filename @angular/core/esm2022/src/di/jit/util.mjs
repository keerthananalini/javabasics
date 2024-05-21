/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { RuntimeError } from '../../errors';
import { ReflectionCapabilities } from '../../reflection/reflection_capabilities';
import { Host, Inject, Optional, Self, SkipSelf } from '../metadata';
import { Attribute } from '../metadata_attr';
let _reflect = null;
export function getReflect() {
    return (_reflect = _reflect || new ReflectionCapabilities());
}
export function reflectDependencies(type) {
    return convertDependencies(getReflect().parameters(type));
}
export function convertDependencies(deps) {
    return deps.map(dep => reflectDependency(dep));
}
function reflectDependency(dep) {
    const meta = {
        token: null,
        attribute: null,
        host: false,
        optional: false,
        self: false,
        skipSelf: false,
    };
    if (Array.isArray(dep) && dep.length > 0) {
        for (let j = 0; j < dep.length; j++) {
            const param = dep[j];
            if (param === undefined) {
                // param may be undefined if type of dep is not set by ngtsc
                continue;
            }
            const proto = Object.getPrototypeOf(param);
            if (param instanceof Optional || proto.ngMetadataName === 'Optional') {
                meta.optional = true;
            }
            else if (param instanceof SkipSelf || proto.ngMetadataName === 'SkipSelf') {
                meta.skipSelf = true;
            }
            else if (param instanceof Self || proto.ngMetadataName === 'Self') {
                meta.self = true;
            }
            else if (param instanceof Host || proto.ngMetadataName === 'Host') {
                meta.host = true;
            }
            else if (param instanceof Inject) {
                meta.token = param.token;
            }
            else if (param instanceof Attribute) {
                if (param.attributeName === undefined) {
                    throw new RuntimeError(204 /* RuntimeErrorCode.INVALID_INJECTION_TOKEN */, ngDevMode && `Attribute name must be defined.`);
                }
                meta.attribute = param.attributeName;
            }
            else {
                meta.token = param;
            }
        }
    }
    else if (dep === undefined || (Array.isArray(dep) && dep.length === 0)) {
        meta.token = null;
    }
    else {
        meta.token = dep;
    }
    return meta;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL2RpL2ppdC91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUdILE9BQU8sRUFBQyxZQUFZLEVBQW1CLE1BQU0sY0FBYyxDQUFDO0FBRTVELE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLDBDQUEwQyxDQUFDO0FBQ2hGLE9BQU8sRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ25FLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUUzQyxJQUFJLFFBQVEsR0FBZ0MsSUFBSSxDQUFDO0FBRWpELE1BQU0sVUFBVSxVQUFVO0lBQ3hCLE9BQU8sQ0FBQyxRQUFRLEdBQUcsUUFBUSxJQUFJLElBQUksc0JBQXNCLEVBQUUsQ0FBQyxDQUFDO0FBQy9ELENBQUM7QUFFRCxNQUFNLFVBQVUsbUJBQW1CLENBQUMsSUFBZTtJQUNqRCxPQUFPLG1CQUFtQixDQUFDLFVBQVUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzVELENBQUM7QUFFRCxNQUFNLFVBQVUsbUJBQW1CLENBQUMsSUFBVztJQUM3QyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2pELENBQUM7QUFFRCxTQUFTLGlCQUFpQixDQUFDLEdBQWM7SUFDdkMsTUFBTSxJQUFJLEdBQStCO1FBQ3ZDLEtBQUssRUFBRSxJQUFJO1FBQ1gsU0FBUyxFQUFFLElBQUk7UUFDZixJQUFJLEVBQUUsS0FBSztRQUNYLFFBQVEsRUFBRSxLQUFLO1FBQ2YsSUFBSSxFQUFFLEtBQUs7UUFDWCxRQUFRLEVBQUUsS0FBSztLQUNoQixDQUFDO0lBRUYsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7UUFDekMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNwQyxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckIsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFLENBQUM7Z0JBQ3hCLDREQUE0RDtnQkFDNUQsU0FBUztZQUNYLENBQUM7WUFFRCxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRTNDLElBQUksS0FBSyxZQUFZLFFBQVEsSUFBSSxLQUFLLENBQUMsY0FBYyxLQUFLLFVBQVUsRUFBRSxDQUFDO2dCQUNyRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztZQUN2QixDQUFDO2lCQUFNLElBQUksS0FBSyxZQUFZLFFBQVEsSUFBSSxLQUFLLENBQUMsY0FBYyxLQUFLLFVBQVUsRUFBRSxDQUFDO2dCQUM1RSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztZQUN2QixDQUFDO2lCQUFNLElBQUksS0FBSyxZQUFZLElBQUksSUFBSSxLQUFLLENBQUMsY0FBYyxLQUFLLE1BQU0sRUFBRSxDQUFDO2dCQUNwRSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUNuQixDQUFDO2lCQUFNLElBQUksS0FBSyxZQUFZLElBQUksSUFBSSxLQUFLLENBQUMsY0FBYyxLQUFLLE1BQU0sRUFBRSxDQUFDO2dCQUNwRSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUNuQixDQUFDO2lCQUFNLElBQUksS0FBSyxZQUFZLE1BQU0sRUFBRSxDQUFDO2dCQUNuQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDM0IsQ0FBQztpQkFBTSxJQUFJLEtBQUssWUFBWSxTQUFTLEVBQUUsQ0FBQztnQkFDdEMsSUFBSSxLQUFLLENBQUMsYUFBYSxLQUFLLFNBQVMsRUFBRSxDQUFDO29CQUN0QyxNQUFNLElBQUksWUFBWSxxREFFbEIsU0FBUyxJQUFJLGlDQUFpQyxDQUFDLENBQUM7Z0JBQ3RELENBQUM7Z0JBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDO1lBQ3ZDLENBQUM7aUJBQU0sQ0FBQztnQkFDTixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUNyQixDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7U0FBTSxJQUFJLEdBQUcsS0FBSyxTQUFTLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUN6RSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztJQUNwQixDQUFDO1NBQU0sQ0FBQztRQUNOLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0lBQ25CLENBQUM7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtSM0RlcGVuZGVuY3lNZXRhZGF0YUZhY2FkZX0gZnJvbSAnLi4vLi4vY29tcGlsZXIvY29tcGlsZXJfZmFjYWRlJztcbmltcG9ydCB7UnVudGltZUVycm9yLCBSdW50aW1lRXJyb3JDb2RlfSBmcm9tICcuLi8uLi9lcnJvcnMnO1xuaW1wb3J0IHtUeXBlfSBmcm9tICcuLi8uLi9pbnRlcmZhY2UvdHlwZSc7XG5pbXBvcnQge1JlZmxlY3Rpb25DYXBhYmlsaXRpZXN9IGZyb20gJy4uLy4uL3JlZmxlY3Rpb24vcmVmbGVjdGlvbl9jYXBhYmlsaXRpZXMnO1xuaW1wb3J0IHtIb3N0LCBJbmplY3QsIE9wdGlvbmFsLCBTZWxmLCBTa2lwU2VsZn0gZnJvbSAnLi4vbWV0YWRhdGEnO1xuaW1wb3J0IHtBdHRyaWJ1dGV9IGZyb20gJy4uL21ldGFkYXRhX2F0dHInO1xuXG5sZXQgX3JlZmxlY3Q6IFJlZmxlY3Rpb25DYXBhYmlsaXRpZXN8bnVsbCA9IG51bGw7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRSZWZsZWN0KCk6IFJlZmxlY3Rpb25DYXBhYmlsaXRpZXMge1xuICByZXR1cm4gKF9yZWZsZWN0ID0gX3JlZmxlY3QgfHwgbmV3IFJlZmxlY3Rpb25DYXBhYmlsaXRpZXMoKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWZsZWN0RGVwZW5kZW5jaWVzKHR5cGU6IFR5cGU8YW55Pik6IFIzRGVwZW5kZW5jeU1ldGFkYXRhRmFjYWRlW10ge1xuICByZXR1cm4gY29udmVydERlcGVuZGVuY2llcyhnZXRSZWZsZWN0KCkucGFyYW1ldGVycyh0eXBlKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0RGVwZW5kZW5jaWVzKGRlcHM6IGFueVtdKTogUjNEZXBlbmRlbmN5TWV0YWRhdGFGYWNhZGVbXSB7XG4gIHJldHVybiBkZXBzLm1hcChkZXAgPT4gcmVmbGVjdERlcGVuZGVuY3koZGVwKSk7XG59XG5cbmZ1bmN0aW9uIHJlZmxlY3REZXBlbmRlbmN5KGRlcDogYW55fGFueVtdKTogUjNEZXBlbmRlbmN5TWV0YWRhdGFGYWNhZGUge1xuICBjb25zdCBtZXRhOiBSM0RlcGVuZGVuY3lNZXRhZGF0YUZhY2FkZSA9IHtcbiAgICB0b2tlbjogbnVsbCxcbiAgICBhdHRyaWJ1dGU6IG51bGwsXG4gICAgaG9zdDogZmFsc2UsXG4gICAgb3B0aW9uYWw6IGZhbHNlLFxuICAgIHNlbGY6IGZhbHNlLFxuICAgIHNraXBTZWxmOiBmYWxzZSxcbiAgfTtcblxuICBpZiAoQXJyYXkuaXNBcnJheShkZXApICYmIGRlcC5sZW5ndGggPiAwKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBkZXAubGVuZ3RoOyBqKyspIHtcbiAgICAgIGNvbnN0IHBhcmFtID0gZGVwW2pdO1xuICAgICAgaWYgKHBhcmFtID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gcGFyYW0gbWF5IGJlIHVuZGVmaW5lZCBpZiB0eXBlIG9mIGRlcCBpcyBub3Qgc2V0IGJ5IG5ndHNjXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihwYXJhbSk7XG5cbiAgICAgIGlmIChwYXJhbSBpbnN0YW5jZW9mIE9wdGlvbmFsIHx8IHByb3RvLm5nTWV0YWRhdGFOYW1lID09PSAnT3B0aW9uYWwnKSB7XG4gICAgICAgIG1ldGEub3B0aW9uYWwgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChwYXJhbSBpbnN0YW5jZW9mIFNraXBTZWxmIHx8IHByb3RvLm5nTWV0YWRhdGFOYW1lID09PSAnU2tpcFNlbGYnKSB7XG4gICAgICAgIG1ldGEuc2tpcFNlbGYgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChwYXJhbSBpbnN0YW5jZW9mIFNlbGYgfHwgcHJvdG8ubmdNZXRhZGF0YU5hbWUgPT09ICdTZWxmJykge1xuICAgICAgICBtZXRhLnNlbGYgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChwYXJhbSBpbnN0YW5jZW9mIEhvc3QgfHwgcHJvdG8ubmdNZXRhZGF0YU5hbWUgPT09ICdIb3N0Jykge1xuICAgICAgICBtZXRhLmhvc3QgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChwYXJhbSBpbnN0YW5jZW9mIEluamVjdCkge1xuICAgICAgICBtZXRhLnRva2VuID0gcGFyYW0udG9rZW47XG4gICAgICB9IGVsc2UgaWYgKHBhcmFtIGluc3RhbmNlb2YgQXR0cmlidXRlKSB7XG4gICAgICAgIGlmIChwYXJhbS5hdHRyaWJ1dGVOYW1lID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFxuICAgICAgICAgICAgICBSdW50aW1lRXJyb3JDb2RlLklOVkFMSURfSU5KRUNUSU9OX1RPS0VOLFxuICAgICAgICAgICAgICBuZ0Rldk1vZGUgJiYgYEF0dHJpYnV0ZSBuYW1lIG11c3QgYmUgZGVmaW5lZC5gKTtcbiAgICAgICAgfVxuICAgICAgICBtZXRhLmF0dHJpYnV0ZSA9IHBhcmFtLmF0dHJpYnV0ZU5hbWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtZXRhLnRva2VuID0gcGFyYW07XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKGRlcCA9PT0gdW5kZWZpbmVkIHx8IChBcnJheS5pc0FycmF5KGRlcCkgJiYgZGVwLmxlbmd0aCA9PT0gMCkpIHtcbiAgICBtZXRhLnRva2VuID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICBtZXRhLnRva2VuID0gZGVwO1xuICB9XG4gIHJldHVybiBtZXRhO1xufVxuIl19