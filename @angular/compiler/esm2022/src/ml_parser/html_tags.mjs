/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DomElementSchemaRegistry } from '../schema/dom_element_schema_registry';
import { getNsPrefix, TagContentType } from './tags';
export class HtmlTagDefinition {
    constructor({ closedByChildren, implicitNamespacePrefix, contentType = TagContentType.PARSABLE_DATA, closedByParent = false, isVoid = false, ignoreFirstLf = false, preventNamespaceInheritance = false, canSelfClose = false, } = {}) {
        this.closedByChildren = {};
        this.closedByParent = false;
        if (closedByChildren && closedByChildren.length > 0) {
            closedByChildren.forEach(tagName => this.closedByChildren[tagName] = true);
        }
        this.isVoid = isVoid;
        this.closedByParent = closedByParent || isVoid;
        this.implicitNamespacePrefix = implicitNamespacePrefix || null;
        this.contentType = contentType;
        this.ignoreFirstLf = ignoreFirstLf;
        this.preventNamespaceInheritance = preventNamespaceInheritance;
        this.canSelfClose = canSelfClose ?? isVoid;
    }
    isClosedByChild(name) {
        return this.isVoid || name.toLowerCase() in this.closedByChildren;
    }
    getContentType(prefix) {
        if (typeof this.contentType === 'object') {
            const overrideType = prefix === undefined ? undefined : this.contentType[prefix];
            return overrideType ?? this.contentType.default;
        }
        return this.contentType;
    }
}
let DEFAULT_TAG_DEFINITION;
// see https://www.w3.org/TR/html51/syntax.html#optional-tags
// This implementation does not fully conform to the HTML5 spec.
let TAG_DEFINITIONS;
export function getHtmlTagDefinition(tagName) {
    if (!TAG_DEFINITIONS) {
        DEFAULT_TAG_DEFINITION = new HtmlTagDefinition({ canSelfClose: true });
        TAG_DEFINITIONS = Object.assign(Object.create(null), {
            'base': new HtmlTagDefinition({ isVoid: true }),
            'meta': new HtmlTagDefinition({ isVoid: true }),
            'area': new HtmlTagDefinition({ isVoid: true }),
            'embed': new HtmlTagDefinition({ isVoid: true }),
            'link': new HtmlTagDefinition({ isVoid: true }),
            'img': new HtmlTagDefinition({ isVoid: true }),
            'input': new HtmlTagDefinition({ isVoid: true }),
            'param': new HtmlTagDefinition({ isVoid: true }),
            'hr': new HtmlTagDefinition({ isVoid: true }),
            'br': new HtmlTagDefinition({ isVoid: true }),
            'source': new HtmlTagDefinition({ isVoid: true }),
            'track': new HtmlTagDefinition({ isVoid: true }),
            'wbr': new HtmlTagDefinition({ isVoid: true }),
            'p': new HtmlTagDefinition({
                closedByChildren: [
                    'address', 'article', 'aside', 'blockquote', 'div', 'dl', 'fieldset',
                    'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5',
                    'h6', 'header', 'hgroup', 'hr', 'main', 'nav', 'ol',
                    'p', 'pre', 'section', 'table', 'ul'
                ],
                closedByParent: true
            }),
            'thead': new HtmlTagDefinition({ closedByChildren: ['tbody', 'tfoot'] }),
            'tbody': new HtmlTagDefinition({ closedByChildren: ['tbody', 'tfoot'], closedByParent: true }),
            'tfoot': new HtmlTagDefinition({ closedByChildren: ['tbody'], closedByParent: true }),
            'tr': new HtmlTagDefinition({ closedByChildren: ['tr'], closedByParent: true }),
            'td': new HtmlTagDefinition({ closedByChildren: ['td', 'th'], closedByParent: true }),
            'th': new HtmlTagDefinition({ closedByChildren: ['td', 'th'], closedByParent: true }),
            'col': new HtmlTagDefinition({ isVoid: true }),
            'svg': new HtmlTagDefinition({ implicitNamespacePrefix: 'svg' }),
            'foreignObject': new HtmlTagDefinition({
                // Usually the implicit namespace here would be redundant since it will be inherited from
                // the parent `svg`, but we have to do it for `foreignObject`, because the way the parser
                // works is that the parent node of an end tag is its own start tag which means that
                // the `preventNamespaceInheritance` on `foreignObject` would have it default to the
                // implicit namespace which is `html`, unless specified otherwise.
                implicitNamespacePrefix: 'svg',
                // We want to prevent children of foreignObject from inheriting its namespace, because
                // the point of the element is to allow nodes from other namespaces to be inserted.
                preventNamespaceInheritance: true,
            }),
            'math': new HtmlTagDefinition({ implicitNamespacePrefix: 'math' }),
            'li': new HtmlTagDefinition({ closedByChildren: ['li'], closedByParent: true }),
            'dt': new HtmlTagDefinition({ closedByChildren: ['dt', 'dd'] }),
            'dd': new HtmlTagDefinition({ closedByChildren: ['dt', 'dd'], closedByParent: true }),
            'rb': new HtmlTagDefinition({ closedByChildren: ['rb', 'rt', 'rtc', 'rp'], closedByParent: true }),
            'rt': new HtmlTagDefinition({ closedByChildren: ['rb', 'rt', 'rtc', 'rp'], closedByParent: true }),
            'rtc': new HtmlTagDefinition({ closedByChildren: ['rb', 'rtc', 'rp'], closedByParent: true }),
            'rp': new HtmlTagDefinition({ closedByChildren: ['rb', 'rt', 'rtc', 'rp'], closedByParent: true }),
            'optgroup': new HtmlTagDefinition({ closedByChildren: ['optgroup'], closedByParent: true }),
            'option': new HtmlTagDefinition({ closedByChildren: ['option', 'optgroup'], closedByParent: true }),
            'pre': new HtmlTagDefinition({ ignoreFirstLf: true }),
            'listing': new HtmlTagDefinition({ ignoreFirstLf: true }),
            'style': new HtmlTagDefinition({ contentType: TagContentType.RAW_TEXT }),
            'script': new HtmlTagDefinition({ contentType: TagContentType.RAW_TEXT }),
            'title': new HtmlTagDefinition({
                // The browser supports two separate `title` tags which have to use
                // a different content type: `HTMLTitleElement` and `SVGTitleElement`
                contentType: { default: TagContentType.ESCAPABLE_RAW_TEXT, svg: TagContentType.PARSABLE_DATA }
            }),
            'textarea': new HtmlTagDefinition({ contentType: TagContentType.ESCAPABLE_RAW_TEXT, ignoreFirstLf: true }),
        });
        new DomElementSchemaRegistry().allKnownElementNames().forEach(knownTagName => {
            if (!TAG_DEFINITIONS[knownTagName] && getNsPrefix(knownTagName) === null) {
                TAG_DEFINITIONS[knownTagName] = new HtmlTagDefinition({ canSelfClose: false });
            }
        });
    }
    // We have to make both a case-sensitive and a case-insensitive lookup, because
    // HTML tag names are case insensitive, whereas some SVG tags are case sensitive.
    return TAG_DEFINITIONS[tagName] ?? TAG_DEFINITIONS[tagName.toLowerCase()] ??
        DEFAULT_TAG_DEFINITION;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbF90YWdzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL21sX3BhcnNlci9odG1sX3RhZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0sdUNBQXVDLENBQUM7QUFFL0UsT0FBTyxFQUFDLFdBQVcsRUFBRSxjQUFjLEVBQWdCLE1BQU0sUUFBUSxDQUFDO0FBRWxFLE1BQU0sT0FBTyxpQkFBaUI7SUFZNUIsWUFBWSxFQUNWLGdCQUFnQixFQUNoQix1QkFBdUIsRUFDdkIsV0FBVyxHQUFHLGNBQWMsQ0FBQyxhQUFhLEVBQzFDLGNBQWMsR0FBRyxLQUFLLEVBQ3RCLE1BQU0sR0FBRyxLQUFLLEVBQ2QsYUFBYSxHQUFHLEtBQUssRUFDckIsMkJBQTJCLEdBQUcsS0FBSyxFQUNuQyxZQUFZLEdBQUcsS0FBSyxNQVVsQixFQUFFO1FBN0JFLHFCQUFnQixHQUE2QixFQUFFLENBQUM7UUFJeEQsbUJBQWMsR0FBRyxLQUFLLENBQUM7UUEwQnJCLElBQUksZ0JBQWdCLElBQUksZ0JBQWdCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ3BELGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUM3RSxDQUFDO1FBQ0QsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLElBQUksTUFBTSxDQUFDO1FBQy9DLElBQUksQ0FBQyx1QkFBdUIsR0FBRyx1QkFBdUIsSUFBSSxJQUFJLENBQUM7UUFDL0QsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENB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QUFFO1lBQzNFLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLElBQUksV0FBVyxDQUFDLFlBQVksQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO2dCQUN6RSxlQUFlLENBQUMsWUFBWSxDQUFDLEdBQUcsSUFBSSxpQkFBaUIsQ0FBQyxFQUFDLFlBQVksRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1lBQy9FLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDRCwrRUFBK0U7SUFDL0UsaUZBQWlGO0lBQ2pGLE9BQU8sZUFBZSxDQUFDLE9BQU8sQ0FBQyxJQUFJLGVBQWUsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckUsc0JBQXNCLENBQUM7QUFDN0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RvbUVsZW1lbnRTY2hlbWFSZWdpc3RyeX0gZnJvbSAnLi4vc2NoZW1hL2RvbV9lbGVtZW50X3NjaGVtYV9yZWdpc3RyeSc7XG5cbmltcG9ydCB7Z2V0TnNQcmVmaXgsIFRhZ0NvbnRlbnRUeXBlLCBUYWdEZWZpbml0aW9ufSBmcm9tICcuL3RhZ3MnO1xuXG5leHBvcnQgY2xhc3MgSHRtbFRhZ0RlZmluaXRpb24gaW1wbGVtZW50cyBUYWdEZWZpbml0aW9uIHtcbiAgcHJpdmF0ZSBjbG9zZWRCeUNoaWxkcmVuOiB7W2tleTogc3RyaW5nXTogYm9vbGVhbn0gPSB7fTtcbiAgcHJpdmF0ZSBjb250ZW50VHlwZTogVGFnQ29udGVudFR5cGV8XG4gICAgICB7ZGVmYXVsdDogVGFnQ29udGVudFR5cGUsIFtuYW1lc3BhY2U6IHN0cmluZ106IFRhZ0NvbnRlbnRUeXBlfTtcblxuICBjbG9zZWRCeVBhcmVudCA9IGZhbHNlO1xuICBpbXBsaWNpdE5hbWVzcGFjZVByZWZpeDogc3RyaW5nfG51bGw7XG4gIGlzVm9pZDogYm9vbGVhbjtcbiAgaWdub3JlRmlyc3RMZjogYm9vbGVhbjtcbiAgY2FuU2VsZkNsb3NlOiBib29sZWFuO1xuICBwcmV2ZW50TmFtZXNwYWNlSW5oZXJpdGFuY2U6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3Ioe1xuICAgIGNsb3NlZEJ5Q2hpbGRyZW4sXG4gICAgaW1wbGljaXROYW1lc3BhY2VQcmVmaXgsXG4gICAgY29udGVudFR5cGUgPSBUYWdDb250ZW50VHlwZS5QQVJTQUJMRV9EQVRBLFxuICAgIGNsb3NlZEJ5UGFyZW50ID0gZmFsc2UsXG4gICAgaXNWb2lkID0gZmFsc2UsXG4gICAgaWdub3JlRmlyc3RMZiA9IGZhbHNlLFxuICAgIHByZXZlbnROYW1lc3BhY2VJbmhlcml0YW5jZSA9IGZhbHNlLFxuICAgIGNhblNlbGZDbG9zZSA9IGZhbHNlLFxuICB9OiB7XG4gICAgY2xvc2VkQnlDaGlsZHJlbj86IHN0cmluZ1tdLFxuICAgIGNsb3NlZEJ5UGFyZW50PzogYm9vbGVhbixcbiAgICBpbXBsaWNpdE5hbWVzcGFjZVByZWZpeD86IHN0cmluZyxcbiAgICBjb250ZW50VHlwZT86IFRhZ0NvbnRlbnRUeXBlfHtkZWZhdWx0OiBUYWdDb250ZW50VHlwZSwgW25hbWVzcGFjZTogc3RyaW5nXTogVGFnQ29udGVudFR5cGV9LFxuICAgIGlzVm9pZD86IGJvb2xlYW4sXG4gICAgaWdub3JlRmlyc3RMZj86IGJvb2xlYW4sXG4gICAgcHJldmVudE5hbWVzcGFjZUluaGVyaXRhbmNlPzogYm9vbGVhbixcbiAgICBjYW5TZWxmQ2xvc2U/OiBib29sZWFuXG4gIH0gPSB7fSkge1xuICAgIGlmIChjbG9zZWRCeUNoaWxkcmVuICYmIGNsb3NlZEJ5Q2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgY2xvc2VkQnlDaGlsZHJlbi5mb3JFYWNoKHRhZ05hbWUgPT4gdGhpcy5jbG9zZWRCeUNoaWxkcmVuW3RhZ05hbWVdID0gdHJ1ZSk7XG4gICAgfVxuICAgIHRoaXMuaXNWb2lkID0gaXNWb2lkO1xuICAgIHRoaXMuY2xvc2VkQnlQYXJlbnQgPSBjbG9zZWRCeVBhcmVudCB8fCBpc1ZvaWQ7XG4gICAgdGhpcy5pbXBsaWNpdE5hbWVzcGFjZVByZWZpeCA9IGltcGxpY2l0TmFtZXNwYWNlUHJlZml4IHx8IG51bGw7XG4gICAgdGhpcy5jb250ZW50VHlwZSA9IGNvbnRlbnRUeXBlO1xuICAgIHRoaXMuaWdub3JlRmlyc3RMZiA9IGlnbm9yZUZpcnN0TGY7XG4gICAgdGhpcy5wcmV2ZW50TmFtZXNwYWNlSW5oZXJpdGFuY2UgPSBwcmV2ZW50TmFtZXNwYWNlSW5oZXJpdGFuY2U7XG4gICAgdGhpcy5jYW5TZWxmQ2xvc2UgPSBjYW5TZWxmQ2xvc2UgPz8gaXNWb2lkO1xuICB9XG5cbiAgaXNDbG9zZWRCeUNoaWxkKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmlzVm9pZCB8fCBuYW1lLnRvTG93ZXJDYXNlKCkgaW4gdGhpcy5jbG9zZWRCeUNoaWxkcmVuO1xuICB9XG5cbiAgZ2V0Q29udGVudFR5cGUocHJlZml4Pzogc3RyaW5nKTogVGFnQ29udGVudFR5cGUge1xuICAgIGlmICh0eXBlb2YgdGhpcy5jb250ZW50VHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGNvbnN0IG92ZXJyaWRlVHlwZSA9IHByZWZpeCA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogdGhpcy5jb250ZW50VHlwZVtwcmVmaXhdO1xuICAgICAgcmV0dXJuIG92ZXJyaWRlVHlwZSA/PyB0aGlzLmNvbnRlbnRUeXBlLmRlZmF1bHQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvbnRlbnRUeXBlO1xuICB9XG59XG5cbmxldCBERUZBVUxUX1RBR19ERUZJTklUSU9OITogSHRtbFRhZ0RlZmluaXRpb247XG5cbi8vIHNlZSBodHRwczovL3d3dy53My5vcmcvVFIvaHRtbDUxL3N5bnRheC5odG1sI29wdGlvbmFsLXRhZ3Ncbi8vIFRoaXMgaW1wbGVtZW50YXRpb24gZG9lcyBub3QgZnVsbHkgY29uZm9ybSB0byB0aGUgSFRNTDUgc3BlYy5cbmxldCBUQUdfREVGSU5JVElPTlMhOiB7W2tleTogc3RyaW5nXTogSHRtbFRhZ0RlZmluaXRpb259O1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SHRtbFRhZ0RlZmluaXRpb24odGFnTmFtZTogc3RyaW5nKTogSHRtbFRhZ0RlZmluaXRpb24ge1xuICBpZiAoIVRBR19ERUZJTklUSU9OUykge1xuICAgIERFRkFVTFRfVEFHX0RFRklOSVRJT04gPSBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2NhblNlbGZDbG9zZTogdHJ1ZX0pO1xuICAgIFRBR19ERUZJTklUSU9OUyA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShudWxsKSwge1xuICAgICAgJ2Jhc2UnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2lzVm9pZDogdHJ1ZX0pLFxuICAgICAgJ21ldGEnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2lzVm9pZDogdHJ1ZX0pLFxuICAgICAgJ2FyZWEnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2lzVm9pZDogdHJ1ZX0pLFxuICAgICAgJ2VtYmVkJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtpc1ZvaWQ6IHRydWV9KSxcbiAgICAgICdsaW5rJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtpc1ZvaWQ6IHRydWV9KSxcbiAgICAgICdpbWcnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2lzVm9pZDogdHJ1ZX0pLFxuICAgICAgJ2lucHV0JzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtpc1ZvaWQ6IHRydWV9KSxcbiAgICAgICdwYXJhbSc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7aXNWb2lkOiB0cnVlfSksXG4gICAgICAnaHInOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2lzVm9pZDogdHJ1ZX0pLFxuICAgICAgJ2JyJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtpc1ZvaWQ6IHRydWV9KSxcbiAgICAgICdzb3VyY2UnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2lzVm9pZDogdHJ1ZX0pLFxuICAgICAgJ3RyYWNrJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtpc1ZvaWQ6IHRydWV9KSxcbiAgICAgICd3YnInOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2lzVm9pZDogdHJ1ZX0pLFxuICAgICAgJ3AnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe1xuICAgICAgICBjbG9zZWRCeUNoaWxkcmVuOiBbXG4gICAgICAgICAgJ2FkZHJlc3MnLCAnYXJ0aWNsZScsICdhc2lkZScsICAgJ2Jsb2NrcXVvdGUnLCAnZGl2JywgICdkbCcsICAnZmllbGRzZXQnLFxuICAgICAgICAgICdmb290ZXInLCAgJ2Zvcm0nLCAgICAnaDEnLCAgICAgICdoMicsICAgICAgICAgJ2gzJywgICAnaDQnLCAgJ2g1JyxcbiAgICAgICAgICAnaDYnLCAgICAgICdoZWFkZXInLCAgJ2hncm91cCcsICAnaHInLCAgICAgICAgICdtYWluJywgJ25hdicsICdvbCcsXG4gICAgICAgICAgJ3AnLCAgICAgICAncHJlJywgICAgICdzZWN0aW9uJywgJ3RhYmxlJywgICAgICAndWwnXG4gICAgICAgIF0sXG4gICAgICAgIGNsb3NlZEJ5UGFyZW50OiB0cnVlXG4gICAgICB9KSxcbiAgICAgICd0aGVhZCc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7Y2xvc2VkQnlDaGlsZHJlbjogWyd0Ym9keScsICd0Zm9vdCddfSksXG4gICAgICAndGJvZHknOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2Nsb3NlZEJ5Q2hpbGRyZW46IFsndGJvZHknLCAndGZvb3QnXSwgY2xvc2VkQnlQYXJlbnQ6IHRydWV9KSxcbiAgICAgICd0Zm9vdCc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7Y2xvc2VkQnlDaGlsZHJlbjogWyd0Ym9keSddLCBjbG9zZWRCeVBhcmVudDogdHJ1ZX0pLFxuICAgICAgJ3RyJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtjbG9zZWRCeUNoaWxkcmVuOiBbJ3RyJ10sIGNsb3NlZEJ5UGFyZW50OiB0cnVlfSksXG4gICAgICAndGQnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2Nsb3NlZEJ5Q2hpbGRyZW46IFsndGQnLCAndGgnXSwgY2xvc2VkQnlQYXJlbnQ6IHRydWV9KSxcbiAgICAgICd0aCc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7Y2xvc2VkQnlDaGlsZHJlbjogWyd0ZCcsICd0aCddLCBjbG9zZWRCeVBhcmVudDogdHJ1ZX0pLFxuICAgICAgJ2NvbCc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7aXNWb2lkOiB0cnVlfSksXG4gICAgICAnc3ZnJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtpbXBsaWNpdE5hbWVzcGFjZVByZWZpeDogJ3N2Zyd9KSxcbiAgICAgICdmb3JlaWduT2JqZWN0JzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtcbiAgICAgICAgLy8gVXN1YWxseSB0aGUgaW1wbGljaXQgbmFtZXNwYWNlIGhlcmUgd291bGQgYmUgcmVkdW5kYW50IHNpbmNlIGl0IHdpbGwgYmUgaW5oZXJpdGVkIGZyb21cbiAgICAgICAgLy8gdGhlIHBhcmVudCBgc3ZnYCwgYnV0IHdlIGhhdmUgdG8gZG8gaXQgZm9yIGBmb3JlaWduT2JqZWN0YCwgYmVjYXVzZSB0aGUgd2F5IHRoZSBwYXJzZXJcbiAgICAgICAgLy8gd29ya3MgaXMgdGhhdCB0aGUgcGFyZW50IG5vZGUgb2YgYW4gZW5kIHRhZyBpcyBpdHMgb3duIHN0YXJ0IHRhZyB3aGljaCBtZWFucyB0aGF0XG4gICAgICAgIC8vIHRoZSBgcHJldmVudE5hbWVzcGFjZUluaGVyaXRhbmNlYCBvbiBgZm9yZWlnbk9iamVjdGAgd291bGQgaGF2ZSBpdCBkZWZhdWx0IHRvIHRoZVxuICAgICAgICAvLyBpbXBsaWNpdCBuYW1lc3BhY2Ugd2hpY2ggaXMgYGh0bWxgLCB1bmxlc3Mgc3BlY2lmaWVkIG90aGVyd2lzZS5cbiAgICAgICAgaW1wbGljaXROYW1lc3BhY2VQcmVmaXg6ICdzdmcnLFxuICAgICAgICAvLyBXZSB3YW50IHRvIHByZXZlbnQgY2hpbGRyZW4gb2YgZm9yZWlnbk9iamVjdCBmcm9tIGluaGVyaXRpbmcgaXRzIG5hbWVzcGFjZSwgYmVjYXVzZVxuICAgICAgICAvLyB0aGUgcG9pbnQgb2YgdGhlIGVsZW1lbnQgaXMgdG8gYWxsb3cgbm9kZXMgZnJvbSBvdGhlciBuYW1lc3BhY2VzIHRvIGJlIGluc2VydGVkLlxuICAgICAgICBwcmV2ZW50TmFtZXNwYWNlSW5oZXJpdGFuY2U6IHRydWUsXG4gICAgICB9KSxcbiAgICAgICdtYXRoJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtpbXBsaWNpdE5hbWVzcGFjZVByZWZpeDogJ21hdGgnfSksXG4gICAgICAnbGknOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2Nsb3NlZEJ5Q2hpbGRyZW46IFsnbGknXSwgY2xvc2VkQnlQYXJlbnQ6IHRydWV9KSxcbiAgICAgICdkdCc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7Y2xvc2VkQnlDaGlsZHJlbjogWydkdCcsICdkZCddfSksXG4gICAgICAnZGQnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2Nsb3NlZEJ5Q2hpbGRyZW46IFsnZHQnLCAnZGQnXSwgY2xvc2VkQnlQYXJlbnQ6IHRydWV9KSxcbiAgICAgICdyYic6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbihcbiAgICAgICAgICB7Y2xvc2VkQnlDaGlsZHJlbjogWydyYicsICdydCcsICdydGMnLCAncnAnXSwgY2xvc2VkQnlQYXJlbnQ6IHRydWV9KSxcbiAgICAgICdydCc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbihcbiAgICAgICAgICB7Y2xvc2VkQnlDaGlsZHJlbjogWydyYicsICdydCcsICdydGMnLCAncnAnXSwgY2xvc2VkQnlQYXJlbnQ6IHRydWV9KSxcbiAgICAgICdydGMnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2Nsb3NlZEJ5Q2hpbGRyZW46IFsncmInLCAncnRjJywgJ3JwJ10sIGNsb3NlZEJ5UGFyZW50OiB0cnVlfSksXG4gICAgICAncnAnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oXG4gICAgICAgICAge2Nsb3NlZEJ5Q2hpbGRyZW46IFsncmInLCAncnQnLCAncnRjJywgJ3JwJ10sIGNsb3NlZEJ5UGFyZW50OiB0cnVlfSksXG4gICAgICAnb3B0Z3JvdXAnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2Nsb3NlZEJ5Q2hpbGRyZW46IFsnb3B0Z3JvdXAnXSwgY2xvc2VkQnlQYXJlbnQ6IHRydWV9KSxcbiAgICAgICdvcHRpb24nOlxuICAgICAgICAgIG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7Y2xvc2VkQnlDaGlsZHJlbjogWydvcHRpb24nLCAnb3B0Z3JvdXAnXSwgY2xvc2VkQnlQYXJlbnQ6IHRydWV9KSxcbiAgICAgICdwcmUnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2lnbm9yZUZpcnN0TGY6IHRydWV9KSxcbiAgICAgICdsaXN0aW5nJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtpZ25vcmVGaXJzdExmOiB0cnVlfSksXG4gICAgICAnc3R5bGUnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2NvbnRlbnRUeXBlOiBUYWdDb250ZW50VHlwZS5SQVdfVEVYVH0pLFxuICAgICAgJ3NjcmlwdCc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7Y29udGVudFR5cGU6IFRhZ0NvbnRlbnRUeXBlLlJBV19URVhUfSksXG4gICAgICAndGl0bGUnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe1xuICAgICAgICAvLyBUaGUgYnJvd3NlciBzdXBwb3J0cyB0d28gc2VwYXJhdGUgYHRpdGxlYCB0YWdzIHdoaWNoIGhhdmUgdG8gdXNlXG4gICAgICAgIC8vIGEgZGlmZmVyZW50IGNvbnRlbnQgdHlwZTogYEhUTUxUaXRsZUVsZW1lbnRgIGFuZCBgU1ZHVGl0bGVFbGVtZW50YFxuICAgICAgICBjb250ZW50VHlwZToge2RlZmF1bHQ6IFRhZ0NvbnRlbnRUeXBlLkVTQ0FQQUJMRV9SQVdfVEVYVCwgc3ZnOiBUYWdDb250ZW50VHlwZS5QQVJTQUJMRV9EQVRBfVxuICAgICAgfSksXG4gICAgICAndGV4dGFyZWEnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oXG4gICAgICAgICAge2NvbnRlbnRUeXBlOiBUYWdDb250ZW50VHlwZS5FU0NBUEFCTEVfUkFXX1RFWFQsIGlnbm9yZUZpcnN0TGY6IHRydWV9KSxcbiAgICB9KTtcblxuICAgIG5ldyBEb21FbGVtZW50U2NoZW1hUmVnaXN0cnkoKS5hbGxLbm93bkVsZW1lbnROYW1lcygpLmZvckVhY2goa25vd25UYWdOYW1lID0+IHtcbiAgICAgIGlmICghVEFHX0RFRklOSVRJT05TW2tub3duVGFnTmFtZV0gJiYgZ2V0TnNQcmVmaXgoa25vd25UYWdOYW1lKSA9PT0gbnVsbCkge1xuICAgICAgICBUQUdfREVGSU5JVElPTlNba25vd25UYWdOYW1lXSA9IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7Y2FuU2VsZkNsb3NlOiBmYWxzZX0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIC8vIFdlIGhhdmUgdG8gbWFrZSBib3RoIGEgY2FzZS1zZW5zaXRpdmUgYW5kIGEgY2FzZS1pbnNlbnNpdGl2ZSBsb29rdXAsIGJlY2F1c2VcbiAgLy8gSFRNTCB0YWcgbmFtZXMgYXJlIGNhc2UgaW5zZW5zaXRpdmUsIHdoZXJlYXMgc29tZSBTVkcgdGFncyBhcmUgY2FzZSBzZW5zaXRpdmUuXG4gIHJldHVybiBUQUdfREVGSU5JVElPTlNbdGFnTmFtZV0gPz8gVEFHX0RFRklOSVRJT05TW3RhZ05hbWUudG9Mb3dlckNhc2UoKV0gPz9cbiAgICAgIERFRkFVTFRfVEFHX0RFRklOSVRJT047XG59XG4iXX0=