/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { utf8Encode } from '../util';
// https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit
const VERSION = 3;
const JS_B64_PREFIX = '# sourceMappingURL=data:application/json;base64,';
export class SourceMapGenerator {
    constructor(file = null) {
        this.file = file;
        this.sourcesContent = new Map();
        this.lines = [];
        this.lastCol0 = 0;
        this.hasMappings = false;
    }
    // The content is `null` when the content is expected to be loaded using the URL
    addSource(url, content = null) {
        if (!this.sourcesContent.has(url)) {
            this.sourcesContent.set(url, content);
        }
        return this;
    }
    addLine() {
        this.lines.push([]);
        this.lastCol0 = 0;
        return this;
    }
    addMapping(col0, sourceUrl, sourceLine0, sourceCol0) {
        if (!this.currentLine) {
            throw new Error(`A line must be added before mappings can be added`);
        }
        if (sourceUrl != null && !this.sourcesContent.has(sourceUrl)) {
            throw new Error(`Unknown source file "${sourceUrl}"`);
        }
        if (col0 == null) {
            throw new Error(`The column in the generated code must be provided`);
        }
        if (col0 < this.lastCol0) {
            throw new Error(`Mapping should be added in output order`);
        }
        if (sourceUrl && (sourceLine0 == null || sourceCol0 == null)) {
            throw new Error(`The source location must be provided when a source url is provided`);
        }
        this.hasMappings = true;
        this.lastCol0 = col0;
        this.currentLine.push({ col0, sourceUrl, sourceLine0, sourceCol0 });
        return this;
    }
    /**
     * @internal strip this from published d.ts files due to
     * https://github.com/microsoft/TypeScript/issues/36216
     */
    get currentLine() {
        return this.lines.slice(-1)[0];
    }
    toJSON() {
        if (!this.hasMappings) {
            return null;
        }
        const sourcesIndex = new Map();
        const sources = [];
        const sourcesContent = [];
        Array.from(this.sourcesContent.keys()).forEach((url, i) => {
            sourcesIndex.set(url, i);
            sources.push(url);
            sourcesContent.push(this.sourcesContent.get(url) || null);
        });
        let mappings = '';
        let lastCol0 = 0;
        let lastSourceIndex = 0;
        let lastSourceLine0 = 0;
        let lastSourceCol0 = 0;
        this.lines.forEach(segments => {
            lastCol0 = 0;
            mappings += segments
                .map(segment => {
                // zero-based starting column of the line in the generated code
                let segAsStr = toBase64VLQ(segment.col0 - lastCol0);
                lastCol0 = segment.col0;
                if (segment.sourceUrl != null) {
                    // zero-based index into the “sources” list
                    segAsStr +=
                        toBase64VLQ(sourcesIndex.get(segment.sourceUrl) - lastSourceIndex);
                    lastSourceIndex = sourcesIndex.get(segment.sourceUrl);
                    // the zero-based starting line in the original source
                    segAsStr += toBase64VLQ(segment.sourceLine0 - lastSourceLine0);
                    lastSourceLine0 = segment.sourceLine0;
                    // the zero-based starting column in the original source
                    segAsStr += toBase64VLQ(segment.sourceCol0 - lastSourceCol0);
                    lastSourceCol0 = segment.sourceCol0;
                }
                return segAsStr;
            })
                .join(',');
            mappings += ';';
        });
        mappings = mappings.slice(0, -1);
        return {
            'file': this.file || '',
            'version': VERSION,
            'sourceRoot': '',
            'sources': sources,
            'sourcesContent': sourcesContent,
            'mappings': mappings,
        };
    }
    toJsComment() {
        return this.hasMappings ? '//' + JS_B64_PREFIX + toBase64String(JSON.stringify(this, null, 0)) :
            '';
    }
}
export function toBase64String(value) {
    let b64 = '';
    const encoded = utf8Encode(value);
    for (let i = 0; i < encoded.length;) {
        const i1 = encoded[i++];
        const i2 = i < encoded.length ? encoded[i++] : null;
        const i3 = i < encoded.length ? encoded[i++] : null;
        b64 += toBase64Digit(i1 >> 2);
        b64 += toBase64Digit(((i1 & 3) << 4) | (i2 === null ? 0 : i2 >> 4));
        b64 += i2 === null ? '=' : toBase64Digit(((i2 & 15) << 2) | (i3 === null ? 0 : i3 >> 6));
        b64 += i2 === null || i3 === null ? '=' : toBase64Digit(i3 & 63);
    }
    return b64;
}
function toBase64VLQ(value) {
    value = value < 0 ? ((-value) << 1) + 1 : value << 1;
    let out = '';
    do {
        let digit = value & 31;
        value = value >> 5;
        if (value > 0) {
            digit = digit | 32;
        }
        out += toBase64Digit(digit);
    } while (value > 0);
    return out;
}
const B64_DIGITS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function toBase64Digit(value) {
    if (value < 0 || value >= 64) {
        throw new Error(`Can only encode value in the range [0, 63]`);
    }
    return B64_DIGITS[value];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlX21hcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9vdXRwdXQvc291cmNlX21hcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBRW5DLHVGQUF1RjtBQUN2RixNQUFNLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFFbEIsTUFBTSxhQUFhLEdBQUcsa0RBQWtELENBQUM7QUFrQnpFLE1BQU0sT0FBTyxrQkFBa0I7SUFNN0IsWUFBb0IsT0FBb0IsSUFBSTtRQUF4QixTQUFJLEdBQUosSUFBSSxDQUFvQjtRQUxwQyxtQkFBYyxHQUE2QixJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ3JELFVBQUssR0FBZ0IsRUFBRSxDQUFDO1FBQ3hCLGFBQVEsR0FBVyxDQUFDLENBQUM7UUFDckIsZ0JBQVcsR0FBRyxLQUFLLENBQUM7SUFFbUIsQ0FBQztJQUVoRCxnRkFBZ0Y7SUFDaEYsU0FBUyxDQUFDLEdBQVcsRUFBRSxVQUF1QixJQUFJO1FBQ2hELElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ2xDLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN4QyxDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsT0FBTztRQUNMLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ2xCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELFVBQVUsQ0FBQyxJQUFZLEVBQUUsU0FBa0IsRUFBRSxXQUFvQixFQUFFLFVBQW1CO1FBQ3BGLElBQUksQ0FB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RSxFQUFFLENBQUM7SUFDL0IsQ0FBQztDQUNGO0FBRUQsTUFBTSxVQUFVLGNBQWMsQ0FBQyxLQUFhO0lBQzFDLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUNiLE1BQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNsQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDO1FBQ3BDLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3hCLE1BQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ3BELE1BQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ3BELEdBQUcsSUFBSSxhQUFhLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzlCLEdBQUcsSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEUsR0FBRyxJQUFJLEVBQUUsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pGLEdBQUcsSUFBSSxFQUFFLEtBQUssSUFBSSxJQUFJLEVBQUUsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRUQsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBRUQsU0FBUyxXQUFXLENBQUMsS0FBYTtJQUNoQyxLQUFLLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDO0lBRXJELElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUNiLEdBQUcsQ0FBQztRQUNGLElBQUksS0FBSyxHQUFHLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDdkIsS0FBSyxHQUFHLEtBQUssSUFBSSxDQUFDLENBQUM7UUFDbkIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDZCxLQUFLLEdBQUcsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNyQixDQUFDO1FBQ0QsR0FBRyxJQUFJLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM5QixDQUFDLFFBQVEsS0FBSyxHQUFHLENBQUMsRUFBRTtJQUVwQixPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFFRCxNQUFNLFVBQVUsR0FBRyxrRUFBa0UsQ0FBQztBQUV0RixTQUFTLGFBQWEsQ0FBQyxLQUFhO0lBQ2xDLElBQUksS0FBSyxHQUFHLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRSxFQUFFLENBQUM7UUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFRCxPQUFPLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMzQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7dXRmOEVuY29kZX0gZnJvbSAnLi4vdXRpbCc7XG5cbi8vIGh0dHBzOi8vZG9jcy5nb29nbGUuY29tL2RvY3VtZW50L2QvMVUxUkdBZWhRd1J5cFVUb3ZGMUtSbHBpT0Z6ZTBiLV8yZ2M2ZkFIMEtZMGsvZWRpdFxuY29uc3QgVkVSU0lPTiA9IDM7XG5cbmNvbnN0IEpTX0I2NF9QUkVGSVggPSAnIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsJztcblxudHlwZSBTZWdtZW50ID0ge1xuICBjb2wwOiBudW1iZXIsXG4gIHNvdXJjZVVybD86IHN0cmluZyxcbiAgc291cmNlTGluZTA/OiBudW1iZXIsXG4gIHNvdXJjZUNvbDA/OiBudW1iZXIsXG59O1xuXG5leHBvcnQgdHlwZSBTb3VyY2VNYXAgPSB7XG4gIHZlcnNpb246IG51bWJlcixcbiAgZmlsZT86IHN0cmluZyxcbiAgICAgIHNvdXJjZVJvb3Q6IHN0cmluZyxcbiAgICAgIHNvdXJjZXM6IHN0cmluZ1tdLFxuICAgICAgc291cmNlc0NvbnRlbnQ6IChzdHJpbmd8bnVsbClbXSxcbiAgICAgIG1hcHBpbmdzOiBzdHJpbmcsXG59O1xuXG5leHBvcnQgY2xhc3MgU291cmNlTWFwR2VuZXJhdG9yIHtcbiAgcHJpdmF0ZSBzb3VyY2VzQ29udGVudDogTWFwPHN0cmluZywgc3RyaW5nfG51bGw+ID0gbmV3IE1hcCgpO1xuICBwcml2YXRlIGxpbmVzOiBTZWdtZW50W11bXSA9IFtdO1xuICBwcml2YXRlIGxhc3RDb2wwOiBudW1iZXIgPSAwO1xuICBwcml2YXRlIGhhc01hcHBpbmdzID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBmaWxlOiBzdHJpbmd8bnVsbCA9IG51bGwpIHt9XG5cbiAgLy8gVGhlIGNvbnRlbnQgaXMgYG51bGxgIHdoZW4gdGhlIGNvbnRlbnQgaXMgZXhwZWN0ZWQgdG8gYmUgbG9hZGVkIHVzaW5nIHRoZSBVUkxcbiAgYWRkU291cmNlKHVybDogc3RyaW5nLCBjb250ZW50OiBzdHJpbmd8bnVsbCA9IG51bGwpOiB0aGlzIHtcbiAgICBpZiAoIXRoaXMuc291cmNlc0NvbnRlbnQuaGFzKHVybCkpIHtcbiAgICAgIHRoaXMuc291cmNlc0NvbnRlbnQuc2V0KHVybCwgY29udGVudCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgYWRkTGluZSgpOiB0aGlzIHtcbiAgICB0aGlzLmxpbmVzLnB1c2goW10pO1xuICAgIHRoaXMubGFzdENvbDAgPSAwO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgYWRkTWFwcGluZyhjb2wwOiBudW1iZXIsIHNvdXJjZVVybD86IHN0cmluZywgc291cmNlTGluZTA/OiBudW1iZXIsIHNvdXJjZUNvbDA/OiBudW1iZXIpOiB0aGlzIHtcbiAgICBpZiAoIXRoaXMuY3VycmVudExpbmUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQSBsaW5lIG11c3QgYmUgYWRkZWQgYmVmb3JlIG1hcHBpbmdzIGNhbiBiZSBhZGRlZGApO1xuICAgIH1cbiAgICBpZiAoc291cmNlVXJsICE9IG51bGwgJiYgIXRoaXMuc291cmNlc0NvbnRlbnQuaGFzKHNvdXJjZVVybCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBzb3VyY2UgZmlsZSBcIiR7c291cmNlVXJsfVwiYCk7XG4gICAgfVxuICAgIGlmIChjb2wwID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIGNvbHVtbiBpbiB0aGUgZ2VuZXJhdGVkIGNvZGUgbXVzdCBiZSBwcm92aWRlZGApO1xuICAgIH1cbiAgICBpZiAoY29sMCA8IHRoaXMubGFzdENvbDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTWFwcGluZyBzaG91bGQgYmUgYWRkZWQgaW4gb3V0cHV0IG9yZGVyYCk7XG4gICAgfVxuICAgIGlmIChzb3VyY2VVcmwgJiYgKHNvdXJjZUxpbmUwID09IG51bGwgfHwgc291cmNlQ29sMCA9PSBudWxsKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgc291cmNlIGxvY2F0aW9uIG11c3QgYmUgcHJvdmlkZWQgd2hlbiBhIHNvdXJjZSB1cmwgaXMgcHJvdmlkZWRgKTtcbiAgICB9XG5cbiAgICB0aGlzLmhhc01hcHBpbmdzID0gdHJ1ZTtcbiAgICB0aGlzLmxhc3RDb2wwID0gY29sMDtcbiAgICB0aGlzLmN1cnJlbnRMaW5lLnB1c2goe2NvbDAsIHNvdXJjZVVybCwgc291cmNlTGluZTAsIHNvdXJjZUNvbDB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWwgc3RyaXAgdGhpcyBmcm9tIHB1Ymxpc2hlZCBkLnRzIGZpbGVzIGR1ZSB0b1xuICAgKiBodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzM2MjE2XG4gICAqL1xuICBwcml2YXRlIGdldCBjdXJyZW50TGluZSgpOiBTZWdtZW50W118bnVsbCB7XG4gICAgcmV0dXJuIHRoaXMubGluZXMuc2xpY2UoLTEpWzBdO1xuICB9XG5cbiAgdG9KU09OKCk6IFNvdXJjZU1hcHxudWxsIHtcbiAgICBpZiAoIXRoaXMuaGFzTWFwcGluZ3MpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHNvdXJjZXNJbmRleCA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XG4gICAgY29uc3Qgc291cmNlczogc3RyaW5nW10gPSBbXTtcbiAgICBjb25zdCBzb3VyY2VzQ29udGVudDogKHN0cmluZ3xudWxsKVtdID0gW107XG5cbiAgICBBcnJheS5mcm9tKHRoaXMuc291cmNlc0NvbnRlbnQua2V5cygpKS5mb3JFYWNoKCh1cmw6IHN0cmluZywgaTogbnVtYmVyKSA9PiB7XG4gICAgICBzb3VyY2VzSW5kZXguc2V0KHVybCwgaSk7XG4gICAgICBzb3VyY2VzLnB1c2godXJsKTtcbiAgICAgIHNvdXJjZXNDb250ZW50LnB1c2godGhpcy5zb3VyY2VzQ29udGVudC5nZXQodXJsKSB8fCBudWxsKTtcbiAgICB9KTtcblxuICAgIGxldCBtYXBwaW5nczogc3RyaW5nID0gJyc7XG4gICAgbGV0IGxhc3RDb2wwOiBudW1iZXIgPSAwO1xuICAgIGxldCBsYXN0U291cmNlSW5kZXg6IG51bWJlciA9IDA7XG4gICAgbGV0IGxhc3RTb3VyY2VMaW5lMDogbnVtYmVyID0gMDtcbiAgICBsZXQgbGFzdFNvdXJjZUNvbDA6IG51bWJlciA9IDA7XG5cbiAgICB0aGlzLmxpbmVzLmZvckVhY2goc2VnbWVudHMgPT4ge1xuICAgICAgbGFzdENvbDAgPSAwO1xuXG4gICAgICBtYXBwaW5ncyArPSBzZWdtZW50c1xuICAgICAgICAgICAgICAgICAgICAgIC5tYXAoc2VnbWVudCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB6ZXJvLWJhc2VkIHN0YXJ0aW5nIGNvbHVtbiBvZiB0aGUgbGluZSBpbiB0aGUgZ2VuZXJhdGVkIGNvZGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzZWdBc1N0ciA9IHRvQmFzZTY0VkxRKHNlZ21lbnQuY29sMCAtIGxhc3RDb2wwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RDb2wwID0gc2VnbWVudC5jb2wwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VnbWVudC5zb3VyY2VVcmwgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB6ZXJvLWJhc2VkIGluZGV4IGludG8gdGhlIOKAnHNvdXJjZXPigJ0gbGlzdFxuICAgICAgICAgICAgICAgICAgICAgICAgICBzZWdBc1N0ciArPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9CYXNlNjRWTFEoc291cmNlc0luZGV4LmdldChzZWdtZW50LnNvdXJjZVVybCkhIC0gbGFzdFNvdXJjZUluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFNvdXJjZUluZGV4ID0gc291cmNlc0luZGV4LmdldChzZWdtZW50LnNvdXJjZVVybCkhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGUgemVyby1iYXNlZCBzdGFydGluZyBsaW5lIGluIHRoZSBvcmlnaW5hbCBzb3VyY2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc2VnQXNTdHIgKz0gdG9CYXNlNjRWTFEoc2VnbWVudC5zb3VyY2VMaW5lMCEgLSBsYXN0U291cmNlTGluZTApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0U291cmNlTGluZTAgPSBzZWdtZW50LnNvdXJjZUxpbmUwITtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIHplcm8tYmFzZWQgc3RhcnRpbmcgY29sdW1uIGluIHRoZSBvcmlnaW5hbCBzb3VyY2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc2VnQXNTdHIgKz0gdG9CYXNlNjRWTFEoc2VnbWVudC5zb3VyY2VDb2wwISAtIGxhc3RTb3VyY2VDb2wwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFNvdXJjZUNvbDAgPSBzZWdtZW50LnNvdXJjZUNvbDAhO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VnQXNTdHI7XG4gICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAuam9pbignLCcpO1xuICAgICAgbWFwcGluZ3MgKz0gJzsnO1xuICAgIH0pO1xuXG4gICAgbWFwcGluZ3MgPSBtYXBwaW5ncy5zbGljZSgwLCAtMSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgJ2ZpbGUnOiB0aGlzLmZpbGUgfHwgJycsXG4gICAgICAndmVyc2lvbic6IFZFUlNJT04sXG4gICAgICAnc291cmNlUm9vdCc6ICcnLFxuICAgICAgJ3NvdXJjZXMnOiBzb3VyY2VzLFxuICAgICAgJ3NvdXJjZXNDb250ZW50Jzogc291cmNlc0NvbnRlbnQsXG4gICAgICAnbWFwcGluZ3MnOiBtYXBwaW5ncyxcbiAgICB9O1xuICB9XG5cbiAgdG9Kc0NvbW1lbnQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5oYXNNYXBwaW5ncyA/ICcvLycgKyBKU19CNjRfUFJFRklYICsgdG9CYXNlNjRTdHJpbmcoSlNPTi5zdHJpbmdpZnkodGhpcywgbnVsbCwgMCkpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcnO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0Jhc2U2NFN0cmluZyh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgbGV0IGI2NCA9ICcnO1xuICBjb25zdCBlbmNvZGVkID0gdXRmOEVuY29kZSh2YWx1ZSk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZW5jb2RlZC5sZW5ndGg7KSB7XG4gICAgY29uc3QgaTEgPSBlbmNvZGVkW2krK107XG4gICAgY29uc3QgaTIgPSBpIDwgZW5jb2RlZC5sZW5ndGggPyBlbmNvZGVkW2krK10gOiBudWxsO1xuICAgIGNvbnN0IGkzID0gaSA8IGVuY29kZWQubGVuZ3RoID8gZW5jb2RlZFtpKytdIDogbnVsbDtcbiAgICBiNjQgKz0gdG9CYXNlNjREaWdpdChpMSA+PiAyKTtcbiAgICBiNjQgKz0gdG9CYXNlNjREaWdpdCgoKGkxICYgMykgPDwgNCkgfCAoaTIgPT09IG51bGwgPyAwIDogaTIgPj4gNCkpO1xuICAgIGI2NCArPSBpMiA9PT0gbnVsbCA/ICc9JyA6IHRvQmFzZTY0RGlnaXQoKChpMiAmIDE1KSA8PCAyKSB8IChpMyA9PT0gbnVsbCA/IDAgOiBpMyA+PiA2KSk7XG4gICAgYjY0ICs9IGkyID09PSBudWxsIHx8IGkzID09PSBudWxsID8gJz0nIDogdG9CYXNlNjREaWdpdChpMyAmIDYzKTtcbiAgfVxuXG4gIHJldHVybiBiNjQ7XG59XG5cbmZ1bmN0aW9uIHRvQmFzZTY0VkxRKHZhbHVlOiBudW1iZXIpOiBzdHJpbmcge1xuICB2YWx1ZSA9IHZhbHVlIDwgMCA/ICgoLXZhbHVlKSA8PCAxKSArIDEgOiB2YWx1ZSA8PCAxO1xuXG4gIGxldCBvdXQgPSAnJztcbiAgZG8ge1xuICAgIGxldCBkaWdpdCA9IHZhbHVlICYgMzE7XG4gICAgdmFsdWUgPSB2YWx1ZSA+PiA1O1xuICAgIGlmICh2YWx1ZSA+IDApIHtcbiAgICAgIGRpZ2l0ID0gZGlnaXQgfCAzMjtcbiAgICB9XG4gICAgb3V0ICs9IHRvQmFzZTY0RGlnaXQoZGlnaXQpO1xuICB9IHdoaWxlICh2YWx1ZSA+IDApO1xuXG4gIHJldHVybiBvdXQ7XG59XG5cbmNvbnN0IEI2NF9ESUdJVFMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7XG5cbmZ1bmN0aW9uIHRvQmFzZTY0RGlnaXQodmFsdWU6IG51bWJlcik6IHN0cmluZyB7XG4gIGlmICh2YWx1ZSA8IDAgfHwgdmFsdWUgPj0gNjQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENhbiBvbmx5IGVuY29kZSB2YWx1ZSBpbiB0aGUgcmFuZ2UgWzAsIDYzXWApO1xuICB9XG5cbiAgcmV0dXJuIEI2NF9ESUdJVFNbdmFsdWVdO1xufVxuIl19