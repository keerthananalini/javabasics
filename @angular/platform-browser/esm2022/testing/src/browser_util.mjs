/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ɵgetDOM as getDOM } from '@angular/common';
import { NgZone } from '@angular/core';
export function dispatchEvent(element, eventType) {
    const evt = getDOM().getDefaultDocument().createEvent('Event');
    evt.initEvent(eventType, true, true);
    getDOM().dispatchEvent(element, evt);
    return evt;
}
export function createMouseEvent(eventType) {
    const evt = getDOM().getDefaultDocument().createEvent('MouseEvent');
    evt.initEvent(eventType, true, true);
    return evt;
}
export function el(html) {
    return getContent(createTemplate(html)).firstChild;
}
function getAttributeMap(element) {
    const res = new Map();
    const elAttrs = element.attributes;
    for (let i = 0; i < elAttrs.length; i++) {
        const attrib = elAttrs.item(i);
        res.set(attrib.name, attrib.value);
    }
    return res;
}
const _selfClosingTags = ['br', 'hr', 'input'];
export function stringifyElement(el) {
    let result = '';
    if (getDOM().isElementNode(el)) {
        const tagName = el.tagName.toLowerCase();
        // Opening tag
        result += `<${tagName}`;
        // Attributes in an ordered way
        const attributeMap = getAttributeMap(el);
        const sortedKeys = Array.from(attributeMap.keys()).sort();
        for (const key of sortedKeys) {
            const lowerCaseKey = key.toLowerCase();
            let attValue = attributeMap.get(key);
            if (typeof attValue !== 'string') {
                result += ` ${lowerCaseKey}`;
            }
            else {
                // Browsers order style rules differently. Order them alphabetically for consistency.
                if (lowerCaseKey === 'style') {
                    attValue = attValue.split(/; ?/).filter(s => !!s).sort().map(s => `${s};`).join(' ');
                }
                result += ` ${lowerCaseKey}="${attValue}"`;
            }
        }
        result += '>';
        // Children
        const childrenRoot = templateAwareRoot(el);
        const children = childrenRoot ? childrenRoot.childNodes : [];
        for (let j = 0; j < children.length; j++) {
            result += stringifyElement(children[j]);
        }
        // Closing tag
        if (_selfClosingTags.indexOf(tagName) == -1) {
            result += `</${tagName}>`;
        }
    }
    else if (isCommentNode(el)) {
        result += `<!--${el.nodeValue}-->`;
    }
    else {
        result += el.textContent;
    }
    return result;
}
export function createNgZone() {
    return new NgZone({ enableLongStackTrace: true, shouldCoalesceEventChangeDetection: false });
}
export function isCommentNode(node) {
    return node.nodeType === Node.COMMENT_NODE;
}
export function isTextNode(node) {
    return node.nodeType === Node.TEXT_NODE;
}
export function getContent(node) {
    if ('content' in node) {
        return node.content;
    }
    else {
        return node;
    }
}
export function templateAwareRoot(el) {
    return getDOM().isElementNode(el) && el.nodeName === 'TEMPLATE' ? getContent(el) : el;
}
export function setCookie(name, value) {
    // document.cookie is magical, assigning into it assigns/overrides one cookie value, but does
    // not clear other cookies.
    document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
}
export function hasStyle(element, styleName, styleValue) {
    const value = element.style[styleName] || '';
    return styleValue ? value == styleValue : value.length > 0;
}
export function hasClass(element, className) {
    return element.classList.contains(className);
}
export function sortedClassList(element) {
    return Array.prototype.slice.call(element.classList, 0).sort();
}
export function createTemplate(html) {
    const t = getDOM().getDefaultDocument().createElement('template');
    t.innerHTML = html;
    return t;
}
export function childNodesAsList(el) {
    const childNodes = el.childNodes;
    const res = [];
    for (let i = 0; i < childNodes.length; i++) {
        res[i] = childNodes[i];
    }
    return res;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlcl91dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tYnJvd3Nlci90ZXN0aW5nL3NyYy9icm93c2VyX3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLE9BQU8sSUFBSSxNQUFNLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUNsRCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXJDLE1BQU0sVUFBVSxhQUFhLENBQUMsT0FBWSxFQUFFLFNBQWM7SUFDeEQsTUFBTSxHQUFHLEdBQVUsTUFBTSxFQUFFLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdEUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3JDLE1BQU0sRUFBRSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDckMsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBRUQsTUFBTSxVQUFVLGdCQUFnQixDQUFDLFNBQWlCO0lBQ2hELE1BQU0sR0FBRyxHQUFlLE1BQU0sRUFBRSxDQUFDLGtCQUFrQixFQUFFLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ2hGLEdBQUcsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNyQyxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFFRCxNQUFNLFVBQVUsRUFBRSxDQUFDLElBQVk7SUFDN0IsT0FBb0IsVUFBVSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztBQUNsRSxDQUFDO0FBRUQsU0FBUyxlQUFlLENBQUMsT0FBWTtJQUNuQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsRUFBa0IsQ0FBQztJQUN0QyxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDO0lBQ25DLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDeEMsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQixHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFFRCxNQUFNLGdCQUFnQixHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztBQUMvQyxNQUFNLFVBQVUsZ0JBQWdCLENBQUMsRUFBVztJQUMxQyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFDaEIsSUFBSSxNQUFNLEVBQUUsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUMvQixNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBRXpDLGNBQWM7UUFDZCxNQUFNLElBQUksSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUV4QiwrQkFBK0I7UUFDL0IsTUFBTSxZQUFZLEdBQUcsZUFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDMUQsS0FBSyxNQUFNLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztZQUM3QixNQUFNLFlBQVksR0FBRyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDdkMsSUFBSSxRQUFRLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUVyQyxJQUFJLE9BQU8sUUFBUSxLQUFLLFFBQVEsRUFBRSxDQUFDO2dCQUNqQyxNQUFNLElBQUksSUFBSSxZQUFZLEVBQUUsQ0FBQztZQUMvQixDQUFDO2lCQUFNLENBQUM7Z0JBQ04scUZBQXFGO2dCQUNyRixJQUFJLFlBQVksS0FBSyxPQUFPLEVBQUUsQ0FBQztvQkFDN0IsUUFBUSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3ZGLENBQUM7Z0JBRUQsTUFBTSxJQUFJLElBQUksWUFBWSxLQUFLLFFBQVEsR0FBRyxDQUFDO1lBQzdDLENBQUM7UUFDSCxDQUFDO1FBQ0QsTUFBTSxJQUFJLEdBQUcsQ0FBQztRQUVkLFdBQVc7UUFDWCxNQUFNLFlBQVksR0FBRyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMzQyxNQUFNLFFBQVEsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUM3RCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3pDLE1BQU0sSUFBSSxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQyxDQUFDO1FBRUQsY0FBYztRQUNkLElBQUksZ0JBQWdCLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDNUMsTUFBTSxJQUFJLEtBQUssT0FBTyxHQUFHLENBQUM7UUFDNUIsQ0FBQztJQUNILENBQUM7U0FBTSxJQUFJLGFBQWEsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQzdCLE1BQU0sSUFBSSxPQUFPLEVBQUUsQ0FBQyxTQUFTLEtBQUssQ0FBQztJQUNyQyxDQUFDO1NBQU0sQ0FBQztRQUNOLE1BQU0sSUFBSSxFQUFFLENBQUMsV0FBVyxDQUFDO0lBQzNCLENBQUM7SUFFRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBRUQsTUFBTSxVQUFVLFlBQVk7SUFDMUIsT0FBTyxJQUFJLE1BQU0sQ0FBQyxFQUFDLG9CQUFvQixFQUFFLElBQUksRUFBRSxrQ0FBa0MsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO0FBQzdGLENBQUM7QUFFRCxNQUFNLFVBQVUsYUFBYSxDQUFDLElBQVU7SUFDdEMsT0FBTyxJQUFJLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQyxZQUFZLENBQUM7QUFDN0MsQ0FBQztBQUVELE1BQU0sVUFBVSxVQUFVLENBQUMsSUFBVTtJQUNuQyxPQUFPLElBQUksQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQztBQUMxQyxDQUFDO0FBRUQsTUFBTSxVQUFVLFVBQVUsQ0FBQyxJQUFVO0lBQ25DLElBQUksU0FBUyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ3RCLE9BQWEsSUFBSyxDQUFDLE9BQU8sQ0FBQztJQUM3QixDQUFDO1NBQU0sQ0FBQztRQUNOLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztBQUNILENBQUM7QUFFRCxNQUFNLFVBQVUsaUJBQWlCLENBQUMsRUFBUTtJQUN4QyxPQUFPLE1BQU0sRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDeEYsQ0FBQztBQUVELE1BQU0sVUFBVSxTQUFTLENBQUMsSUFBWSxFQUFFLEtBQWE7SUFDbkQsNkZBQTZGO0lBQzdGLDJCQUEyQjtJQUMzQixRQUFRLENBQUMsTUFBTSxHQUFHLGtCQUFrQixDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMvRSxDQUFDO0FBRUQsTUFBTSxVQUFVLFFBQVEsQ0FBQyxPQUFZLEVBQUUsU0FBaUIsRUFBRSxVQUF3QjtJQUNoRixNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUM3QyxPQUFPLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDN0QsQ0FBQztBQUVELE1BQU0sVUFBVSxRQUFRLENBQUMsT0FBWSxFQUFFLFNBQWlCO0lBQ3RELE9BQU8sT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDL0MsQ0FBQztBQUVELE1BQU0sVUFBVSxlQUFlLENBQUMsT0FBWTtJQUMxQyxPQUFPLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2pFLENBQUM7QUFFRCxNQUFNLFVBQVUsY0FBYyxDQUFDLElBQVM7SUFDdEMsTUFBTSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDbEUsQ0FBQyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7SUFDbkIsT0FBTyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBRUQsTUFBTSxVQUFVLGdCQUFnQixDQUFDLEVBQVE7SUFDdkMsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQztJQUNqQyxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFDZixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQzNDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUNELE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge8m1Z2V0RE9NIGFzIGdldERPTX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7Tmdab25lfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BhdGNoRXZlbnQoZWxlbWVudDogYW55LCBldmVudFR5cGU6IGFueSk6IEV2ZW50IHtcbiAgY29uc3QgZXZ0OiBFdmVudCA9IGdldERPTSgpLmdldERlZmF1bHREb2N1bWVudCgpLmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICBldnQuaW5pdEV2ZW50KGV2ZW50VHlwZSwgdHJ1ZSwgdHJ1ZSk7XG4gIGdldERPTSgpLmRpc3BhdGNoRXZlbnQoZWxlbWVudCwgZXZ0KTtcbiAgcmV0dXJuIGV2dDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1vdXNlRXZlbnQoZXZlbnRUeXBlOiBzdHJpbmcpOiBNb3VzZUV2ZW50IHtcbiAgY29uc3QgZXZ0OiBNb3VzZUV2ZW50ID0gZ2V0RE9NKCkuZ2V0RGVmYXVsdERvY3VtZW50KCkuY3JlYXRlRXZlbnQoJ01vdXNlRXZlbnQnKTtcbiAgZXZ0LmluaXRFdmVudChldmVudFR5cGUsIHRydWUsIHRydWUpO1xuICByZXR1cm4gZXZ0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZWwoaHRtbDogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xuICByZXR1cm4gPEhUTUxFbGVtZW50PmdldENvbnRlbnQoY3JlYXRlVGVtcGxhdGUoaHRtbCkpLmZpcnN0Q2hpbGQ7XG59XG5cbmZ1bmN0aW9uIGdldEF0dHJpYnV0ZU1hcChlbGVtZW50OiBhbnkpOiBNYXA8c3RyaW5nLCBzdHJpbmc+IHtcbiAgY29uc3QgcmVzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbiAgY29uc3QgZWxBdHRycyA9IGVsZW1lbnQuYXR0cmlidXRlcztcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbEF0dHJzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgYXR0cmliID0gZWxBdHRycy5pdGVtKGkpO1xuICAgIHJlcy5zZXQoYXR0cmliLm5hbWUsIGF0dHJpYi52YWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cblxuY29uc3QgX3NlbGZDbG9zaW5nVGFncyA9IFsnYnInLCAnaHInLCAnaW5wdXQnXTtcbmV4cG9ydCBmdW5jdGlvbiBzdHJpbmdpZnlFbGVtZW50KGVsOiBFbGVtZW50KTogc3RyaW5nIHtcbiAgbGV0IHJlc3VsdCA9ICcnO1xuICBpZiAoZ2V0RE9NKCkuaXNFbGVtZW50Tm9kZShlbCkpIHtcbiAgICBjb25zdCB0YWdOYW1lID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgLy8gT3BlbmluZyB0YWdcbiAgICByZXN1bHQgKz0gYDwke3RhZ05hbWV9YDtcblxuICAgIC8vIEF0dHJpYnV0ZXMgaW4gYW4gb3JkZXJlZCB3YXlcbiAgICBjb25zdCBhdHRyaWJ1dGVNYXAgPSBnZXRBdHRyaWJ1dGVNYXAoZWwpO1xuICAgIGNvbnN0IHNvcnRlZEtleXMgPSBBcnJheS5mcm9tKGF0dHJpYnV0ZU1hcC5rZXlzKCkpLnNvcnQoKTtcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBzb3J0ZWRLZXlzKSB7XG4gICAgICBjb25zdCBsb3dlckNhc2VLZXkgPSBrZXkudG9Mb3dlckNhc2UoKTtcbiAgICAgIGxldCBhdHRWYWx1ZSA9IGF0dHJpYnV0ZU1hcC5nZXQoa2V5KTtcblxuICAgICAgaWYgKHR5cGVvZiBhdHRWYWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmVzdWx0ICs9IGAgJHtsb3dlckNhc2VLZXl9YDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEJyb3dzZXJzIG9yZGVyIHN0eWxlIHJ1bGVzIGRpZmZlcmVudGx5LiBPcmRlciB0aGVtIGFscGhhYmV0aWNhbGx5IGZvciBjb25zaXN0ZW5jeS5cbiAgICAgICAgaWYgKGxvd2VyQ2FzZUtleSA9PT0gJ3N0eWxlJykge1xuICAgICAgICAgIGF0dFZhbHVlID0gYXR0VmFsdWUuc3BsaXQoLzsgPy8pLmZpbHRlcihzID0+ICEhcykuc29ydCgpLm1hcChzID0+IGAke3N9O2ApLmpvaW4oJyAnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VsdCArPSBgICR7bG93ZXJDYXNlS2V5fT1cIiR7YXR0VmFsdWV9XCJgO1xuICAgICAgfVxuICAgIH1cbiAgICByZXN1bHQgKz0gJz4nO1xuXG4gICAgLy8gQ2hpbGRyZW5cbiAgICBjb25zdCBjaGlsZHJlblJvb3QgPSB0ZW1wbGF0ZUF3YXJlUm9vdChlbCk7XG4gICAgY29uc3QgY2hpbGRyZW4gPSBjaGlsZHJlblJvb3QgPyBjaGlsZHJlblJvb3QuY2hpbGROb2RlcyA6IFtdO1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcbiAgICAgIHJlc3VsdCArPSBzdHJpbmdpZnlFbGVtZW50KGNoaWxkcmVuW2pdKTtcbiAgICB9XG5cbiAgICAvLyBDbG9zaW5nIHRhZ1xuICAgIGlmIChfc2VsZkNsb3NpbmdUYWdzLmluZGV4T2YodGFnTmFtZSkgPT0gLTEpIHtcbiAgICAgIHJlc3VsdCArPSBgPC8ke3RhZ05hbWV9PmA7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzQ29tbWVudE5vZGUoZWwpKSB7XG4gICAgcmVzdWx0ICs9IGA8IS0tJHtlbC5ub2RlVmFsdWV9LS0+YDtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgKz0gZWwudGV4dENvbnRlbnQ7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTmdab25lKCk6IE5nWm9uZSB7XG4gIHJldHVybiBuZXcgTmdab25lKHtlbmFibGVMb25nU3RhY2tUcmFjZTogdHJ1ZSwgc2hvdWxkQ29hbGVzY2VFdmVudENoYW5nZURldGVjdGlvbjogZmFsc2V9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQ29tbWVudE5vZGUobm9kZTogTm9kZSk6IGJvb2xlYW4ge1xuICByZXR1cm4gbm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5DT01NRU5UX05PREU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1RleHROb2RlKG5vZGU6IE5vZGUpOiBib29sZWFuIHtcbiAgcmV0dXJuIG5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29udGVudChub2RlOiBOb2RlKTogTm9kZSB7XG4gIGlmICgnY29udGVudCcgaW4gbm9kZSkge1xuICAgIHJldHVybiAoPGFueT5ub2RlKS5jb250ZW50O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBub2RlO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZW1wbGF0ZUF3YXJlUm9vdChlbDogTm9kZSk6IGFueSB7XG4gIHJldHVybiBnZXRET00oKS5pc0VsZW1lbnROb2RlKGVsKSAmJiBlbC5ub2RlTmFtZSA9PT0gJ1RFTVBMQVRFJyA/IGdldENvbnRlbnQoZWwpIDogZWw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRDb29raWUobmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG4gIC8vIGRvY3VtZW50LmNvb2tpZSBpcyBtYWdpY2FsLCBhc3NpZ25pbmcgaW50byBpdCBhc3NpZ25zL292ZXJyaWRlcyBvbmUgY29va2llIHZhbHVlLCBidXQgZG9lc1xuICAvLyBub3QgY2xlYXIgb3RoZXIgY29va2llcy5cbiAgZG9jdW1lbnQuY29va2llID0gZW5jb2RlVVJJQ29tcG9uZW50KG5hbWUpICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc1N0eWxlKGVsZW1lbnQ6IGFueSwgc3R5bGVOYW1lOiBzdHJpbmcsIHN0eWxlVmFsdWU/OiBzdHJpbmd8bnVsbCk6IGJvb2xlYW4ge1xuICBjb25zdCB2YWx1ZSA9IGVsZW1lbnQuc3R5bGVbc3R5bGVOYW1lXSB8fCAnJztcbiAgcmV0dXJuIHN0eWxlVmFsdWUgPyB2YWx1ZSA9PSBzdHlsZVZhbHVlIDogdmFsdWUubGVuZ3RoID4gMDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc0NsYXNzKGVsZW1lbnQ6IGFueSwgY2xhc3NOYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzb3J0ZWRDbGFzc0xpc3QoZWxlbWVudDogYW55KTogYW55W10ge1xuICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZWxlbWVudC5jbGFzc0xpc3QsIDApLnNvcnQoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRlbXBsYXRlKGh0bWw6IGFueSk6IEhUTUxFbGVtZW50IHtcbiAgY29uc3QgdCA9IGdldERPTSgpLmdldERlZmF1bHREb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gIHQuaW5uZXJIVE1MID0gaHRtbDtcbiAgcmV0dXJuIHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGlsZE5vZGVzQXNMaXN0KGVsOiBOb2RlKTogYW55W10ge1xuICBjb25zdCBjaGlsZE5vZGVzID0gZWwuY2hpbGROb2RlcztcbiAgY29uc3QgcmVzID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHJlc1tpXSA9IGNoaWxkTm9kZXNbaV07XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cbiJdfQ==