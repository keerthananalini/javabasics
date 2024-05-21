import * as o from '../../../output/output_ast';
import { ParseSourceSpan } from '../../../parse_util';
import { serializeIcuNode } from './icu_serializer';
import { formatI18nPlaceholderName } from './util';
export function createLocalizeStatements(variable, message, params) {
    const { messageParts, placeHolders } = serializeI18nMessageForLocalize(message);
    const sourceSpan = getSourceSpan(message);
    const expressions = placeHolders.map(ph => params[ph.text]);
    const localizedString = o.localizedString(message, messageParts, placeHolders, expressions, sourceSpan);
    const variableInitialization = variable.set(localizedString);
    return [new o.ExpressionStatement(variableInitialization)];
}
/**
 * This visitor walks over an i18n tree, capturing literal strings and placeholders.
 *
 * The result can be used for generating the `$localize` tagged template literals.
 */
class LocalizeSerializerVisitor {
    constructor(placeholderToMessage, pieces) {
        this.placeholderToMessage = placeholderToMessage;
        this.pieces = pieces;
    }
    visitText(text) {
        if (this.pieces[this.pieces.length - 1] instanceof o.LiteralPiece) {
            // Two literal pieces in a row means that there was some comment node in-between.
            this.pieces[this.pieces.length - 1].text += text.value;
        }
        else {
            const sourceSpan = new ParseSourceSpan(text.sourceSpan.fullStart, text.sourceSpan.end, text.sourceSpan.fullStart, text.sourceSpan.details);
            this.pieces.push(new o.LiteralPiece(text.value, sourceSpan));
        }
    }
    visitContainer(container) {
        container.children.forEach(child => child.visit(this));
    }
    visitIcu(icu) {
        this.pieces.push(new o.LiteralPiece(serializeIcuNode(icu), icu.sourceSpan));
    }
    visitTagPlaceholder(ph) {
        this.pieces.push(this.createPlaceholderPiece(ph.startName, ph.startSourceSpan ?? ph.sourceSpan));
        if (!ph.isVoid) {
            ph.children.forEach(child => child.visit(this));
            this.pieces.push(this.createPlaceholderPiece(ph.closeName, ph.endSourceSpan ?? ph.sourceSpan));
        }
    }
    visitPlaceholder(ph) {
        this.pieces.push(this.createPlaceholderPiece(ph.name, ph.sourceSpan));
    }
    visitBlockPlaceholder(ph) {
        this.pieces.push(this.createPlaceholderPiece(ph.startName, ph.startSourceSpan ?? ph.sourceSpan));
        ph.children.forEach(child => child.visit(this));
        this.pieces.push(this.createPlaceholderPiece(ph.closeName, ph.endSourceSpan ?? ph.sourceSpan));
    }
    visitIcuPlaceholder(ph) {
        this.pieces.push(this.createPlaceholderPiece(ph.name, ph.sourceSpan, this.placeholderToMessage[ph.name]));
    }
    createPlaceholderPiece(name, sourceSpan, associatedMessage) {
        return new o.PlaceholderPiece(formatI18nPlaceholderName(name, /* useCamelCase */ false), sourceSpan, associatedMessage);
    }
}
/**
 * Serialize an i18n message into two arrays: messageParts and placeholders.
 *
 * These arrays will be used to generate `$localize` tagged template literals.
 *
 * @param message The message to be serialized.
 * @returns an object containing the messageParts and placeholders.
 */
export function serializeI18nMessageForLocalize(message) {
    const pieces = [];
    const serializerVisitor = new LocalizeSerializerVisitor(message.placeholderToMessage, pieces);
    message.nodes.forEach(node => node.visit(serializerVisitor));
    return processMessagePieces(pieces);
}
function getSourceSpan(message) {
    const startNode = message.nodes[0];
    const endNode = message.nodes[message.nodes.length - 1];
    return new ParseSourceSpan(startNode.sourceSpan.fullStart, endNode.sourceSpan.end, startNode.sourceSpan.fullStart, startNode.sourceSpan.details);
}
/**
 * Convert the list of serialized MessagePieces into two arrays.
 *
 * One contains the literal string pieces and the other the placeholders that will be replaced by
 * expressions when rendering `$localize` tagged template literals.
 *
 * @param pieces The pieces to process.
 * @returns an object containing the messageParts and placeholders.
 */
function processMessagePieces(pieces) {
    const messageParts = [];
    const placeHolders = [];
    if (pieces[0] instanceof o.PlaceholderPiece) {
        // The first piece was a placeholder so we need to add an initial empty message part.
        messageParts.push(createEmptyMessagePart(pieces[0].sourceSpan.start));
    }
    for (let i = 0; i < pieces.length; i++) {
        const part = pieces[i];
        if (part instanceof o.LiteralPiece) {
            messageParts.push(part);
        }
        else {
            placeHolders.push(part);
            if (pieces[i - 1] instanceof o.PlaceholderPiece) {
                // There were two placeholders in a row, so we need to add an empty message part.
                messageParts.push(createEmptyMessagePart(pieces[i - 1].sourceSpan.end));
            }
        }
    }
    if (pieces[pieces.length - 1] instanceof o.PlaceholderPiece) {
        // The last piece was a placeholder so we need to add a final empty message part.
        messageParts.push(createEmptyMessagePart(pieces[pieces.length - 1].sourceSpan.end));
    }
    return { messageParts, placeHolders };
}
function createEmptyMessagePart(location) {
    return new o.LiteralPiece('', new ParseSourceSpan(location, location));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemVfdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvcmVuZGVyMy92aWV3L2kxOG4vbG9jYWxpemVfdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUUEsT0FBTyxLQUFLLENBQUMsTUFBTSw0QkFBNEIsQ0FBQztBQUNoRCxPQUFPLEVBQWdCLGVBQWUsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBRW5FLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQ2xELE9BQU8sRUFBQyx5QkFBeUIsRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUVqRCxNQUFNLFVBQVUsd0JBQXdCLENBQ3BDLFFBQXVCLEVBQUUsT0FBcUIsRUFDOUMsTUFBc0M7SUFDeEMsTUFBTSxFQUFDLFlBQVksRUFBRSxZQUFZLEVBQUMsR0FBRywrQkFBK0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM5RSxNQUFNLFVBQVUsR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDMUMsTUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUM1RCxNQUFNLGVBQWUsR0FDakIsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDcEYsTUFBTSxzQkFBc0IsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQzdELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7QUFDN0QsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLHlCQUF5QjtJQUM3QixZQUNZLG9CQUFzRCxF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Q0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzFFLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUNELElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDNUQsaUZBQWlGO1FBQ2pGLFlBQVksQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDdEYsQ0FBQztJQUNELE9BQU8sRUFBQyxZQUFZLEVBQUUsWUFBWSxFQUFDLENBQUM7QUFDdEMsQ0FBQztBQUVELFNBQVMsc0JBQXNCLENBQUMsUUFBdUI7SUFDckQsT0FBTyxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFBRSxFQUFFLElBQUksZUFBZSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQ3pFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCAqIGFzIGkxOG4gZnJvbSAnLi4vLi4vLi4vaTE4bi9pMThuX2FzdCc7XG5pbXBvcnQgKiBhcyBvIGZyb20gJy4uLy4uLy4uL291dHB1dC9vdXRwdXRfYXN0JztcbmltcG9ydCB7UGFyc2VMb2NhdGlvbiwgUGFyc2VTb3VyY2VTcGFufSBmcm9tICcuLi8uLi8uLi9wYXJzZV91dGlsJztcblxuaW1wb3J0IHtzZXJpYWxpemVJY3VOb2RlfSBmcm9tICcuL2ljdV9zZXJpYWxpemVyJztcbmltcG9ydCB7Zm9ybWF0STE4blBsYWNlaG9sZGVyTmFtZX0gZnJvbSAnLi91dGlsJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUxvY2FsaXplU3RhdGVtZW50cyhcbiAgICB2YXJpYWJsZTogby5SZWFkVmFyRXhwciwgbWVzc2FnZTogaTE4bi5NZXNzYWdlLFxuICAgIHBhcmFtczoge1tuYW1lOiBzdHJpbmddOiBvLkV4cHJlc3Npb259KTogby5TdGF0ZW1lbnRbXSB7XG4gIGNvbnN0IHttZXNzYWdlUGFydHMsIHBsYWNlSG9sZGVyc30gPSBzZXJpYWxpemVJMThuTWVzc2FnZUZvckxvY2FsaXplKG1lc3NhZ2UpO1xuICBjb25zdCBzb3VyY2VTcGFuID0gZ2V0U291cmNlU3BhbihtZXNzYWdlKTtcbiAgY29uc3QgZXhwcmVzc2lvbnMgPSBwbGFjZUhvbGRlcnMubWFwKHBoID0+IHBhcmFtc1twaC50ZXh0XSk7XG4gIGNvbnN0IGxvY2FsaXplZFN0cmluZyA9XG4gICAgICBvLmxvY2FsaXplZFN0cmluZyhtZXNzYWdlLCBtZXNzYWdlUGFydHMsIHBsYWNlSG9sZGVycywgZXhwcmVzc2lvbnMsIHNvdXJjZVNwYW4pO1xuICBjb25zdCB2YXJpYWJsZUluaXRpYWxpemF0aW9uID0gdmFyaWFibGUuc2V0KGxvY2FsaXplZFN0cmluZyk7XG4gIHJldHVybiBbbmV3IG8uRXhwcmVzc2lvblN0YXRlbWVudCh2YXJpYWJsZUluaXRpYWxpemF0aW9uKV07XG59XG5cbi8qKlxuICogVGhpcyB2aXNpdG9yIHdhbGtzIG92ZXIgYW4gaTE4biB0cmVlLCBjYXB0dXJpbmcgbGl0ZXJhbCBzdHJpbmdzIGFuZCBwbGFjZWhvbGRlcnMuXG4gKlxuICogVGhlIHJlc3VsdCBjYW4gYmUgdXNlZCBmb3IgZ2VuZXJhdGluZyB0aGUgYCRsb2NhbGl6ZWAgdGFnZ2VkIHRlbXBsYXRlIGxpdGVyYWxzLlxuICovXG5jbGFzcyBMb2NhbGl6ZVNlcmlhbGl6ZXJWaXNpdG9yIGltcGxlbWVudHMgaTE4bi5WaXNpdG9yIHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIHBsYWNlaG9sZGVyVG9NZXNzYWdlOiB7W3BoTmFtZTogc3RyaW5nXTogaTE4bi5NZXNzYWdlfSxcbiAgICAgIHByaXZhdGUgcGllY2VzOiBvLk1lc3NhZ2VQaWVjZVtdKSB7fVxuXG4gIHZpc2l0VGV4dCh0ZXh0OiBpMThuLlRleHQpOiBhbnkge1xuICAgIGlmICh0aGlzLnBpZWNlc1t0aGlzLnBpZWNlcy5sZW5ndGggLSAxXSBpbnN0YW5jZW9mIG8uTGl0ZXJhbFBpZWNlKSB7XG4gICAgICAvLyBUd28gbGl0ZXJhbCBwaWVjZXMgaW4gYSByb3cgbWVhbnMgdGhhdCB0aGVyZSB3YXMgc29tZSBjb21tZW50IG5vZGUgaW4tYmV0d2Vlbi5cbiAgICAgIHRoaXMucGllY2VzW3RoaXMucGllY2VzLmxlbmd0aCAtIDFdLnRleHQgKz0gdGV4dC52YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgc291cmNlU3BhbiA9IG5ldyBQYXJzZVNvdXJjZVNwYW4oXG4gICAgICAgICAgdGV4dC5zb3VyY2VTcGFuLmZ1bGxTdGFydCwgdGV4dC5zb3VyY2VTcGFuLmVuZCwgdGV4dC5zb3VyY2VTcGFuLmZ1bGxTdGFydCxcbiAgICAgICAgICB0ZXh0LnNvdXJjZVNwYW4uZGV0YWlscyk7XG4gICAgICB0aGlzLnBpZWNlcy5wdXNoKG5ldyBvLkxpdGVyYWxQaWVjZSh0ZXh0LnZhbHVlLCBzb3VyY2VTcGFuKSk7XG4gICAgfVxuICB9XG5cbiAgdmlzaXRDb250YWluZXIoY29udGFpbmVyOiBpMThuLkNvbnRhaW5lcik6IGFueSB7XG4gICAgY29udGFpbmVyLmNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4gY2hpbGQudmlzaXQodGhpcykpO1xuICB9XG5cbiAgdmlzaXRJY3UoaWN1OiBpMThuLkljdSk6IGFueSB7XG4gICAgdGhpcy5waWVjZXMucHVzaChuZXcgby5MaXRlcmFsUGllY2Uoc2VyaWFsaXplSWN1Tm9kZShpY3UpLCBpY3Uuc291cmNlU3BhbikpO1xuICB9XG5cbiAgdmlzaXRUYWdQbGFjZWhvbGRlcihwaDogaTE4bi5UYWdQbGFjZWhvbGRlcik6IGFueSB7XG4gICAgdGhpcy5waWVjZXMucHVzaChcbiAgICAgICAgdGhpcy5jcmVhdGVQbGFjZWhvbGRlclBpZWNlKHBoLnN0YXJ0TmFtZSwgcGguc3RhcnRTb3VyY2VTcGFuID8/IHBoLnNvdXJjZVNwYW4pKTtcbiAgICBpZiAoIXBoLmlzVm9pZCkge1xuICAgICAgcGguY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiBjaGlsZC52aXNpdCh0aGlzKSk7XG4gICAgICB0aGlzLnBpZWNlcy5wdXNoKFxuICAgICAgICAgIHRoaXMuY3JlYXRlUGxhY2Vob2xkZXJQaWVjZShwaC5jbG9zZU5hbWUsIHBoLmVuZFNvdXJjZVNwYW4gPz8gcGguc291cmNlU3BhbikpO1xuICAgIH1cbiAgfVxuXG4gIHZpc2l0UGxhY2Vob2xkZXIocGg6IGkxOG4uUGxhY2Vob2xkZXIpOiBhbnkge1xuICAgIHRoaXMucGllY2VzLnB1c2godGhpcy5jcmVhdGVQbGFjZWhvbGRlclBpZWNlKHBoLm5hbWUsIHBoLnNvdXJjZVNwYW4pKTtcbiAgfVxuXG4gIHZpc2l0QmxvY2tQbGFjZWhvbGRlcihwaDogaTE4bi5CbG9ja1BsYWNlaG9sZGVyKTogYW55IHtcbiAgICB0aGlzLnBpZWNlcy5wdXNoKFxuICAgICAgICB0aGlzLmNyZWF0ZVBsYWNlaG9sZGVyUGllY2UocGguc3RhcnROYW1lLCBwaC5zdGFydFNvdXJjZVNwYW4gPz8gcGguc291cmNlU3BhbikpO1xuICAgIHBoLmNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4gY2hpbGQudmlzaXQodGhpcykpO1xuICAgIHRoaXMucGllY2VzLnB1c2godGhpcy5jcmVhdGVQbGFjZWhvbGRlclBpZWNlKHBoLmNsb3NlTmFtZSwgcGguZW5kU291cmNlU3BhbiA/PyBwaC5zb3VyY2VTcGFuKSk7XG4gIH1cblxuICB2aXNpdEljdVBsYWNlaG9sZGVyKHBoOiBpMThuLkljdVBsYWNlaG9sZGVyKTogYW55IHtcbiAgICB0aGlzLnBpZWNlcy5wdXNoKFxuICAgICAgICB0aGlzLmNyZWF0ZVBsYWNlaG9sZGVyUGllY2UocGgubmFtZSwgcGguc291cmNlU3BhbiwgdGhpcy5wbGFjZWhvbGRlclRvTWVzc2FnZVtwaC5uYW1lXSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVQbGFjZWhvbGRlclBpZWNlKFxuICAgICAgbmFtZTogc3RyaW5nLCBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4sXG4gICAgICBhc3NvY2lhdGVkTWVzc2FnZT86IGkxOG4uTWVzc2FnZSk6IG8uUGxhY2Vob2xkZXJQaWVjZSB7XG4gICAgcmV0dXJuIG5ldyBvLlBsYWNlaG9sZGVyUGllY2UoXG4gICAgICAgIGZvcm1hdEkxOG5QbGFjZWhvbGRlck5hbWUobmFtZSwgLyogdXNlQ2FtZWxDYXNlICovIGZhbHNlKSwgc291cmNlU3BhbiwgYXNzb2NpYXRlZE1lc3NhZ2UpO1xuICB9XG59XG5cbi8qKlxuICogU2VyaWFsaXplIGFuIGkxOG4gbWVzc2FnZSBpbnRvIHR3byBhcnJheXM6IG1lc3NhZ2VQYXJ0cyBhbmQgcGxhY2Vob2xkZXJzLlxuICpcbiAqIFRoZXNlIGFycmF5cyB3aWxsIGJlIHVzZWQgdG8gZ2VuZXJhdGUgYCRsb2NhbGl6ZWAgdGFnZ2VkIHRlbXBsYXRlIGxpdGVyYWxzLlxuICpcbiAqIEBwYXJhbSBtZXNzYWdlIFRoZSBtZXNzYWdlIHRvIGJlIHNlcmlhbGl6ZWQuXG4gKiBAcmV0dXJucyBhbiBvYmplY3QgY29udGFpbmluZyB0aGUgbWVzc2FnZVBhcnRzIGFuZCBwbGFjZWhvbGRlcnMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXJpYWxpemVJMThuTWVzc2FnZUZvckxvY2FsaXplKG1lc3NhZ2U6IGkxOG4uTWVzc2FnZSk6XG4gICAge21lc3NhZ2VQYXJ0czogby5MaXRlcmFsUGllY2VbXSwgcGxhY2VIb2xkZXJzOiBvLlBsYWNlaG9sZGVyUGllY2VbXX0ge1xuICBjb25zdCBwaWVjZXM6IG8uTWVzc2FnZVBpZWNlW10gPSBbXTtcbiAgY29uc3Qgc2VyaWFsaXplclZpc2l0b3IgPSBuZXcgTG9jYWxpemVTZXJpYWxpemVyVmlzaXRvcihtZXNzYWdlLnBsYWNlaG9sZGVyVG9NZXNzYWdlLCBwaWVjZXMpO1xuICBtZXNzYWdlLm5vZGVzLmZvckVhY2gobm9kZSA9PiBub2RlLnZpc2l0KHNlcmlhbGl6ZXJWaXNpdG9yKSk7XG4gIHJldHVybiBwcm9jZXNzTWVzc2FnZVBpZWNlcyhwaWVjZXMpO1xufVxuXG5mdW5jdGlvbiBnZXRTb3VyY2VTcGFuKG1lc3NhZ2U6IGkxOG4uTWVzc2FnZSk6IFBhcnNlU291cmNlU3BhbiB7XG4gIGNvbnN0IHN0YXJ0Tm9kZSA9IG1lc3NhZ2Uubm9kZXNbMF07XG4gIGNvbnN0IGVuZE5vZGUgPSBtZXNzYWdlLm5vZGVzW21lc3NhZ2Uubm9kZXMubGVuZ3RoIC0gMV07XG4gIHJldHVybiBuZXcgUGFyc2VTb3VyY2VTcGFuKFxuICAgICAgc3RhcnROb2RlLnNvdXJjZVNwYW4uZnVsbFN0YXJ0LCBlbmROb2RlLnNvdXJjZVNwYW4uZW5kLCBzdGFydE5vZGUuc291cmNlU3Bhbi5mdWxsU3RhcnQsXG4gICAgICBzdGFydE5vZGUuc291cmNlU3Bhbi5kZXRhaWxzKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IHRoZSBsaXN0IG9mIHNlcmlhbGl6ZWQgTWVzc2FnZVBpZWNlcyBpbnRvIHR3byBhcnJheXMuXG4gKlxuICogT25lIGNvbnRhaW5zIHRoZSBsaXRlcmFsIHN0cmluZyBwaWVjZXMgYW5kIHRoZSBvdGhlciB0aGUgcGxhY2Vob2xkZXJzIHRoYXQgd2lsbCBiZSByZXBsYWNlZCBieVxuICogZXhwcmVzc2lvbnMgd2hlbiByZW5kZXJpbmcgYCRsb2NhbGl6ZWAgdGFnZ2VkIHRlbXBsYXRlIGxpdGVyYWxzLlxuICpcbiAqIEBwYXJhbSBwaWVjZXMgVGhlIHBpZWNlcyB0byBwcm9jZXNzLlxuICogQHJldHVybnMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIG1lc3NhZ2VQYXJ0cyBhbmQgcGxhY2Vob2xkZXJzLlxuICovXG5mdW5jdGlvbiBwcm9jZXNzTWVzc2FnZVBpZWNlcyhwaWVjZXM6IG8uTWVzc2FnZVBpZWNlW10pOlxuICAgIHttZXNzYWdlUGFydHM6IG8uTGl0ZXJhbFBpZWNlW10sIHBsYWNlSG9sZGVyczogby5QbGFjZWhvbGRlclBpZWNlW119IHtcbiAgY29uc3QgbWVzc2FnZVBhcnRzOiBvLkxpdGVyYWxQaWVjZVtdID0gW107XG4gIGNvbnN0IHBsYWNlSG9sZGVyczogby5QbGFjZWhvbGRlclBpZWNlW10gPSBbXTtcblxuICBpZiAocGllY2VzWzBdIGluc3RhbmNlb2Ygby5QbGFjZWhvbGRlclBpZWNlKSB7XG4gICAgLy8gVGhlIGZpcnN0IHBpZWNlIHdhcyBhIHBsYWNlaG9sZGVyIHNvIHdlIG5lZWQgdG8gYWRkIGFuIGluaXRpYWwgZW1wdHkgbWVzc2FnZSBwYXJ0LlxuICAgIG1lc3NhZ2VQYXJ0cy5wdXNoKGNyZWF0ZUVtcHR5TWVzc2FnZVBhcnQocGllY2VzWzBdLnNvdXJjZVNwYW4uc3RhcnQpKTtcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGllY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgcGFydCA9IHBpZWNlc1tpXTtcbiAgICBpZiAocGFydCBpbnN0YW5jZW9mIG8uTGl0ZXJhbFBpZWNlKSB7XG4gICAgICBtZXNzYWdlUGFydHMucHVzaChwYXJ0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGxhY2VIb2xkZXJzLnB1c2gocGFydCk7XG4gICAgICBpZiAocGllY2VzW2kgLSAxXSBpbnN0YW5jZW9mIG8uUGxhY2Vob2xkZXJQaWVjZSkge1xuICAgICAgICAvLyBUaGVyZSB3ZXJlIHR3byBwbGFjZWhvbGRlcnMgaW4gYSByb3csIHNvIHdlIG5lZWQgdG8gYWRkIGFuIGVtcHR5IG1lc3NhZ2UgcGFydC5cbiAgICAgICAgbWVzc2FnZVBhcnRzLnB1c2goY3JlYXRlRW1wdHlNZXNzYWdlUGFydChwaWVjZXNbaSAtIDFdLnNvdXJjZVNwYW4uZW5kKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmIChwaWVjZXNbcGllY2VzLmxlbmd0aCAtIDFdIGluc3RhbmNlb2Ygby5QbGFjZWhvbGRlclBpZWNlKSB7XG4gICAgLy8gVGhlIGxhc3QgcGllY2Ugd2FzIGEgcGxhY2Vob2xkZXIgc28gd2UgbmVlZCB0byBhZGQgYSBmaW5hbCBlbXB0eSBtZXNzYWdlIHBhcnQuXG4gICAgbWVzc2FnZVBhcnRzLnB1c2goY3JlYXRlRW1wdHlNZXNzYWdlUGFydChwaWVjZXNbcGllY2VzLmxlbmd0aCAtIDFdLnNvdXJjZVNwYW4uZW5kKSk7XG4gIH1cbiAgcmV0dXJuIHttZXNzYWdlUGFydHMsIHBsYWNlSG9sZGVyc307XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUVtcHR5TWVzc2FnZVBhcnQobG9jYXRpb246IFBhcnNlTG9jYXRpb24pOiBvLkxpdGVyYWxQaWVjZSB7XG4gIHJldHVybiBuZXcgby5MaXRlcmFsUGllY2UoJycsIG5ldyBQYXJzZVNvdXJjZVNwYW4obG9jYXRpb24sIGxvY2F0aW9uKSk7XG59XG4iXX0=