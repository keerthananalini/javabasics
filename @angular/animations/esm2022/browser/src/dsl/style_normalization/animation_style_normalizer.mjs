/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export class AnimationStyleNormalizer {
}
export class NoopAnimationStyleNormalizer {
    normalizePropertyName(propertyName, errors) {
        return propertyName;
    }
    normalizeStyleValue(userProvidedProperty, normalizedProperty, value, errors) {
        return value;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX3N0eWxlX25vcm1hbGl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9hbmltYXRpb25zL2Jyb3dzZXIvc3JjL2RzbC9zdHlsZV9ub3JtYWxpemF0aW9uL2FuaW1hdGlvbl9zdHlsZV9ub3JtYWxpemVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE1BQU0sT0FBZ0Isd0JBQXdCO0NBUTdDO0FBRUQsTUFBTSxPQUFPLDRCQUE0QjtJQUN2QyxxQkFBcUIsQ0FBQyxZQUFvQixFQUFFLE1BQWU7UUFDekQsT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQztJQUVELG1CQUFtQixDQUNqQixvQkFBNEIsRUFDNUIsa0JBQTBCLEVBQzFCLEtBQXNCLEVBQ3RCLE1BQWU7UUFFZixPQUFZLEtBQUssQ0FBQztJQUNwQixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFuaW1hdGlvblN0eWxlTm9ybWFsaXplciB7XG4gIGFic3RyYWN0IG5vcm1hbGl6ZVByb3BlcnR5TmFtZShwcm9wZXJ0eU5hbWU6IHN0cmluZywgZXJyb3JzOiBFcnJvcltdKTogc3RyaW5nO1xuICBhYnN0cmFjdCBub3JtYWxpemVTdHlsZVZhbHVlKFxuICAgIHVzZXJQcm92aWRlZFByb3BlcnR5OiBzdHJpbmcsXG4gICAgbm9ybWFsaXplZFByb3BlcnR5OiBzdHJpbmcsXG4gICAgdmFsdWU6IHN0cmluZyB8IG51bWJlcixcbiAgICBlcnJvcnM6IEVycm9yW10sXG4gICk6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIE5vb3BBbmltYXRpb25TdHlsZU5vcm1hbGl6ZXIge1xuICBub3JtYWxpemVQcm9wZXJ0eU5hbWUocHJvcGVydHlOYW1lOiBzdHJpbmcsIGVycm9yczogRXJyb3JbXSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHByb3BlcnR5TmFtZTtcbiAgfVxuXG4gIG5vcm1hbGl6ZVN0eWxlVmFsdWUoXG4gICAgdXNlclByb3ZpZGVkUHJvcGVydHk6IHN0cmluZyxcbiAgICBub3JtYWxpemVkUHJvcGVydHk6IHN0cmluZyxcbiAgICB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyLFxuICAgIGVycm9yczogRXJyb3JbXSxcbiAgKTogc3RyaW5nIHtcbiAgICByZXR1cm4gPGFueT52YWx1ZTtcbiAgfVxufVxuIl19