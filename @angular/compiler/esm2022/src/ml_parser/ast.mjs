/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export class NodeWithI18n {
    constructor(sourceSpan, i18n) {
        this.sourceSpan = sourceSpan;
        this.i18n = i18n;
    }
}
export class Text extends NodeWithI18n {
    constructor(value, sourceSpan, tokens, i18n) {
        super(sourceSpan, i18n);
        this.value = value;
        this.tokens = tokens;
    }
    visit(visitor, context) {
        return visitor.visitText(this, context);
    }
}
export class Expansion extends NodeWithI18n {
    constructor(switchValue, type, cases, sourceSpan, switchValueSourceSpan, i18n) {
        super(sourceSpan, i18n);
        this.switchValue = switchValue;
        this.type = type;
        this.cases = cases;
        this.switchValueSourceSpan = switchValueSourceSpan;
    }
    visit(visitor, context) {
        return visitor.visitExpansion(this, context);
    }
}
export class ExpansionCase {
    constructor(value, expression, sourceSpan, valueSourceSpan, expSourceSpan) {
        this.value = value;
        this.expression = expression;
        this.sourceSpan = sourceSpan;
        this.valueSourceSpan = valueSourceSpan;
        this.expSourceSpan = expSourceSpan;
    }
    visit(visitor, context) {
        return visitor.visitExpansionCase(this, context);
    }
}
export class Attribute extends NodeWithI18n {
    constructor(name, value, sourceSpan, keySpan, valueSpan, valueTokens, i18n) {
        super(sourceSpan, i18n);
        this.name = name;
        this.value = value;
        this.keySpan = keySpan;
        this.valueSpan = valueSpan;
        this.valueTokens = valueTokens;
    }
    visit(visitor, context) {
        return visitor.visitAttribute(this, context);
    }
}
export class Element extends NodeWithI18n {
    constructor(name, attrs, children, sourceSpan, startSourceSpan, endSourceSpan = null, i18n) {
        super(sourceSpan, i18n);
        this.name = name;
        this.attrs = attrs;
        this.children = children;
        this.startSourceSpan = startSourceSpan;
        this.endSourceSpan = endSourceSpan;
    }
    visit(visitor, context) {
        return visitor.visitElement(this, context);
    }
}
export class Comment {
    constructor(value, sourceSpan) {
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    visit(visitor, context) {
        return visitor.visitComment(this, context);
    }
}
export class Block extends NodeWithI18n {
    constructor(name, parameters, children, sourceSpan, nameSpan, startSourceSpan, endSourceSpan = null, i18n) {
        super(sourceSpan, i18n);
        this.name = name;
        this.parameters = parameters;
        this.children = children;
        this.nameSpan = nameSpan;
        this.startSourceSpan = startSourceSpan;
        this.endSourceSpan = endSourceSpan;
    }
    visit(visitor, context) {
        return visitor.visitBlock(this, context);
    }
}
export class BlockParameter {
    constructor(expression, sourceSpan) {
        this.expression = expression;
        this.sourceSpan = sourceSpan;
    }
    visit(visitor, context) {
        return visitor.visitBlockParameter(this, context);
    }
}
export function visitAll(visitor, nodes, context = null) {
    const result = [];
    const visit = visitor.visit ?
        (ast) => visitor.visit(ast, context) || ast.visit(visitor, context) :
        (ast) => ast.visit(visitor, context);
    nodes.forEach(ast => {
        const astResult = visit(ast);
        if (astResult) {
            result.push(astResult);
        }
    });
    return result;
}
export class RecursiveVisitor {
    constructor() { }
    visitElement(ast, context) {
        this.visitChildren(context, visit => {
            visit(ast.attrs);
            visit(ast.children);
        });
    }
    visitAttribute(ast, context) { }
    visitText(ast, context) { }
    visitComment(ast, context) { }
    visitExpansion(ast, context) {
        return this.visitChildren(context, visit => {
            visit(ast.cases);
        });
    }
    visitExpansionCase(ast, context) { }
    visitBlock(block, context) {
        this.visitChildren(context, visit => {
            visit(block.parameters);
            visit(block.children);
        });
    }
    visitBlockParameter(ast, context) { }
    visitChildren(context, cb) {
        let results = [];
        let t = this;
        function visit(children) {
            if (children)
                results.push(visitAll(t, children, context));
        }
        cb(visit);
        return Array.prototype.concat.apply([], results);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL21sX3BhcnNlci9hc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBY0gsTUFBTSxPQUFnQixZQUFZO0lBQ2hDLFlBQW1CLFVBQTJCLEVBQVMsSUFBZTtRQUFuRCxlQUFVLEdBQVYsVUFBVSxDQUFpQjtRQUFTLFNBQUksR0FBSixJQUFJLENBQVc7SUFBRyxDQUFDO0NBRTNFO0FBRUQsTUFBTSxPQUFPLElBQUssU0FBUSxZQUFZO0lBQ3BDLFlBQ1csS0FBYSxFQUFFLFVBQTJCLEVBQVMsTUFBK0IsRUFDekYsSUFBZTtRQUNqQixLQUFLLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRmYsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUFzQyxXQUFNLEdBQU4sTUFBTSxDQUF5QjtJQUc3RixDQUFDO0lBQ1EsS0FBSyxDQUFDLE9BQWdCLEVBQUUsT0FBWTtRQUMzQyxPQUFPLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzFDLENBQUM7Q0FDRjtBQUVELE1BQU0sT0FBTyxTQUFVLFNBQVEsWUFBWTtJQUN6QyxZQUNXLFdBQW1CLEVBQVMsSUFBWSxFQUFTLEtBQXNCLEVBQzlFLFVBQTJCLEVBQVMscUJBQXNDLEVBQUUsSUFBZTtRQUM3RixLQUFLLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRmYsZ0JBQVcsR0FBWCxXQUFXLENBQVE7UUFBUyxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQVMsVUFBSyxHQUFMLEtBQUssQ0FBaUI7UUFDMUMsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUFpQjtJQUU5RSxDQUFDO0lBQ1EsS0FBSyxDQUFDLE9BQWdCLEVBQUUsT0FBWTtRQUMzQyxPQUFPLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE9BQU8s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RCxDQUFDO1FBQ0QsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ1YsT0FBTyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ25ELENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0kxOG5NZXRhfSBmcm9tICcuLi9pMThuL2kxOG5fYXN0JztcbmltcG9ydCB7UGFyc2VTb3VyY2VTcGFufSBmcm9tICcuLi9wYXJzZV91dGlsJztcblxuaW1wb3J0IHtJbnRlcnBvbGF0ZWRBdHRyaWJ1dGVUb2tlbiwgSW50ZXJwb2xhdGVkVGV4dFRva2VufSBmcm9tICcuL3Rva2Vucyc7XG5cbmludGVyZmFjZSBCYXNlTm9kZSB7XG4gIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3BhbjtcbiAgdmlzaXQodmlzaXRvcjogVmlzaXRvciwgY29udGV4dDogYW55KTogYW55O1xufVxuXG5leHBvcnQgdHlwZSBOb2RlID0gQXR0cmlidXRlfENvbW1lbnR8RWxlbWVudHxFeHBhbnNpb258RXhwYW5zaW9uQ2FzZXxUZXh0fEJsb2NrfEJsb2NrUGFyYW1ldGVyO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTm9kZVdpdGhJMThuIGltcGxlbWVudHMgQmFzZU5vZGUge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuLCBwdWJsaWMgaTE4bj86IEkxOG5NZXRhKSB7fVxuICBhYnN0cmFjdCB2aXNpdCh2aXNpdG9yOiBWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnk7XG59XG5cbmV4cG9ydCBjbGFzcyBUZXh0IGV4dGVuZHMgTm9kZVdpdGhJMThuIHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwdWJsaWMgdmFsdWU6IHN0cmluZywgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuLCBwdWJsaWMgdG9rZW5zOiBJbnRlcnBvbGF0ZWRUZXh0VG9rZW5bXSxcbiAgICAgIGkxOG4/OiBJMThuTWV0YSkge1xuICAgIHN1cGVyKHNvdXJjZVNwYW4sIGkxOG4pO1xuICB9XG4gIG92ZXJyaWRlIHZpc2l0KHZpc2l0b3I6IFZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRUZXh0KHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBFeHBhbnNpb24gZXh0ZW5kcyBOb2RlV2l0aEkxOG4ge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyBzd2l0Y2hWYWx1ZTogc3RyaW5nLCBwdWJsaWMgdHlwZTogc3RyaW5nLCBwdWJsaWMgY2FzZXM6IEV4cGFuc2lvbkNhc2VbXSxcbiAgICAgIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3BhbiwgcHVibGljIHN3aXRjaFZhbHVlU291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuLCBpMThuPzogSTE4bk1ldGEpIHtcbiAgICBzdXBlcihzb3VyY2VTcGFuLCBpMThuKTtcbiAgfVxuICBvdmVycmlkZSB2aXNpdCh2aXNpdG9yOiBWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RXhwYW5zaW9uKHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBFeHBhbnNpb25DYXNlIGltcGxlbWVudHMgQmFzZU5vZGUge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nLCBwdWJsaWMgZXhwcmVzc2lvbjogTm9kZVtdLCBwdWJsaWMgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuLFxuICAgICAgcHVibGljIHZhbHVlU291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuLCBwdWJsaWMgZXhwU291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuKSB7fVxuXG4gIHZpc2l0KHZpc2l0b3I6IFZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRFeHBhbnNpb25DYXNlKHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBdHRyaWJ1dGUgZXh0ZW5kcyBOb2RlV2l0aEkxOG4ge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyBuYW1lOiBzdHJpbmcsIHB1YmxpYyB2YWx1ZTogc3RyaW5nLCBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4sXG4gICAgICByZWFkb25seSBrZXlTcGFuOiBQYXJzZVNvdXJjZVNwYW58dW5kZWZpbmVkLCBwdWJsaWMgdmFsdWVTcGFuOiBQYXJzZVNvdXJjZVNwYW58dW5kZWZpbmVkLFxuICAgICAgcHVibGljIHZhbHVlVG9rZW5zOiBJbnRlcnBvbGF0ZWRBdHRyaWJ1dGVUb2tlbltdfHVuZGVmaW5lZCwgaTE4bjogSTE4bk1ldGF8dW5kZWZpbmVkKSB7XG4gICAgc3VwZXIoc291cmNlU3BhbiwgaTE4bik7XG4gIH1cbiAgb3ZlcnJpZGUgdmlzaXQodmlzaXRvcjogVmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdEF0dHJpYnV0ZSh0aGlzLCBjb250ZXh0KTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRWxlbWVudCBleHRlbmRzIE5vZGVXaXRoSTE4biB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHVibGljIG5hbWU6IHN0cmluZywgcHVibGljIGF0dHJzOiBBdHRyaWJ1dGVbXSwgcHVibGljIGNoaWxkcmVuOiBOb2RlW10sXG4gICAgICBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4sIHB1YmxpYyBzdGFydFNvdXJjZVNwYW46IFBhcnNlU291cmNlU3BhbixcbiAgICAgIHB1YmxpYyBlbmRTb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW58bnVsbCA9IG51bGwsIGkxOG4/OiBJMThuTWV0YSkge1xuICAgIHN1cGVyKHNvdXJjZVNwYW4sIGkxOG4pO1xuICB9XG4gIG92ZXJyaWRlIHZpc2l0KHZpc2l0b3I6IFZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRFbGVtZW50KHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDb21tZW50IGltcGxlbWVudHMgQmFzZU5vZGUge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdmFsdWU6IHN0cmluZ3xudWxsLCBwdWJsaWMgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuKSB7fVxuICB2aXNpdCh2aXNpdG9yOiBWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0Q29tbWVudCh0aGlzLCBjb250ZXh0KTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQmxvY2sgZXh0ZW5kcyBOb2RlV2l0aEkxOG4ge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyBuYW1lOiBzdHJpbmcsIHB1YmxpYyBwYXJhbWV0ZXJzOiBCbG9ja1BhcmFtZXRlcltdLCBwdWJsaWMgY2hpbGRyZW46IE5vZGVbXSxcbiAgICAgIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3BhbiwgcHVibGljIG5hbWVTcGFuOiBQYXJzZVNvdXJjZVNwYW4sXG4gICAgICBwdWJsaWMgc3RhcnRTb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4sIHB1YmxpYyBlbmRTb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW58bnVsbCA9IG51bGwsXG4gICAgICBpMThuPzogSTE4bk1ldGEpIHtcbiAgICBzdXBlcihzb3VyY2VTcGFuLCBpMThuKTtcbiAgfVxuXG4gIG92ZXJyaWRlIHZpc2l0KHZpc2l0b3I6IFZpc2l0b3IsIGNvbnRleHQ6IGFueSkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0QmxvY2sodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEJsb2NrUGFyYW1ldGVyIGltcGxlbWVudHMgQmFzZU5vZGUge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgZXhwcmVzc2lvbjogc3RyaW5nLCBwdWJsaWMgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuKSB7fVxuXG4gIHZpc2l0KHZpc2l0b3I6IFZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRCbG9ja1BhcmFtZXRlcih0aGlzLCBjb250ZXh0KTtcbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFZpc2l0b3Ige1xuICAvLyBSZXR1cm5pbmcgYSB0cnV0aHkgdmFsdWUgZnJvbSBgdmlzaXQoKWAgd2lsbCBwcmV2ZW50IGB2aXNpdEFsbCgpYCBmcm9tIHRoZSBjYWxsIHRvIHRoZSB0eXBlZFxuICAvLyBtZXRob2QgYW5kIHJlc3VsdCByZXR1cm5lZCB3aWxsIGJlY29tZSB0aGUgcmVzdWx0IGluY2x1ZGVkIGluIGB2aXNpdEFsbCgpYHMgcmVzdWx0IGFycmF5LlxuICB2aXNpdD8obm9kZTogTm9kZSwgY29udGV4dDogYW55KTogYW55O1xuXG4gIHZpc2l0RWxlbWVudChlbGVtZW50OiBFbGVtZW50LCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0QXR0cmlidXRlKGF0dHJpYnV0ZTogQXR0cmlidXRlLCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0VGV4dCh0ZXh0OiBUZXh0LCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0Q29tbWVudChjb21tZW50OiBDb21tZW50LCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0RXhwYW5zaW9uKGV4cGFuc2lvbjogRXhwYW5zaW9uLCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0RXhwYW5zaW9uQ2FzZShleHBhbnNpb25DYXNlOiBFeHBhbnNpb25DYXNlLCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0QmxvY2soYmxvY2s6IEJsb2NrLCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0QmxvY2tQYXJhbWV0ZXIocGFyYW1ldGVyOiBCbG9ja1BhcmFtZXRlciwgY29udGV4dDogYW55KTogYW55O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmlzaXRBbGwodmlzaXRvcjogVmlzaXRvciwgbm9kZXM6IE5vZGVbXSwgY29udGV4dDogYW55ID0gbnVsbCk6IGFueVtdIHtcbiAgY29uc3QgcmVzdWx0OiBhbnlbXSA9IFtdO1xuXG4gIGNvbnN0IHZpc2l0ID0gdmlzaXRvci52aXNpdCA/XG4gICAgICAoYXN0OiBOb2RlKSA9PiB2aXNpdG9yLnZpc2l0IShhc3QsIGNvbnRleHQpIHx8IGFzdC52aXNpdCh2aXNpdG9yLCBjb250ZXh0KSA6XG4gICAgICAoYXN0OiBOb2RlKSA9PiBhc3QudmlzaXQodmlzaXRvciwgY29udGV4dCk7XG4gIG5vZGVzLmZvckVhY2goYXN0ID0+IHtcbiAgICBjb25zdCBhc3RSZXN1bHQgPSB2aXNpdChhc3QpO1xuICAgIGlmIChhc3RSZXN1bHQpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGFzdFJlc3VsdCk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGNsYXNzIFJlY3Vyc2l2ZVZpc2l0b3IgaW1wbGVtZW50cyBWaXNpdG9yIHtcbiAgY29uc3RydWN0b3IoKSB7fVxuXG4gIHZpc2l0RWxlbWVudChhc3Q6IEVsZW1lbnQsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgdGhpcy52aXNpdENoaWxkcmVuKGNvbnRleHQsIHZpc2l0ID0+IHtcbiAgICAgIHZpc2l0KGFzdC5hdHRycyk7XG4gICAgICB2aXNpdChhc3QuY2hpbGRyZW4pO1xuICAgIH0pO1xuICB9XG5cbiAgdmlzaXRBdHRyaWJ1dGUoYXN0OiBBdHRyaWJ1dGUsIGNvbnRleHQ6IGFueSk6IGFueSB7fVxuICB2aXNpdFRleHQoYXN0OiBUZXh0LCBjb250ZXh0OiBhbnkpOiBhbnkge31cbiAgdmlzaXRDb21tZW50KGFzdDogQ29tbWVudCwgY29udGV4dDogYW55KTogYW55IHt9XG5cbiAgdmlzaXRFeHBhbnNpb24oYXN0OiBFeHBhbnNpb24sIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRDaGlsZHJlbihjb250ZXh0LCB2aXNpdCA9PiB7XG4gICAgICB2aXNpdChhc3QuY2FzZXMpO1xuICAgIH0pO1xuICB9XG5cbiAgdmlzaXRFeHBhbnNpb25DYXNlKGFzdDogRXhwYW5zaW9uQ2FzZSwgY29udGV4dDogYW55KTogYW55IHt9XG5cbiAgdmlzaXRCbG9jayhibG9jazogQmxvY2ssIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgdGhpcy52aXNpdENoaWxkcmVuKGNvbnRleHQsIHZpc2l0ID0+IHtcbiAgICAgIHZpc2l0KGJsb2NrLnBhcmFtZXRlcnMpO1xuICAgICAgdmlzaXQoYmxvY2suY2hpbGRyZW4pO1xuICAgIH0pO1xuICB9XG5cbiAgdmlzaXRCbG9ja1BhcmFtZXRlcihhc3Q6IEJsb2NrUGFyYW1ldGVyLCBjb250ZXh0OiBhbnkpOiBhbnkge31cblxuICBwcml2YXRlIHZpc2l0Q2hpbGRyZW48VCBleHRlbmRzIE5vZGU+KFxuICAgICAgY29udGV4dDogYW55LCBjYjogKHZpc2l0OiAoPFYgZXh0ZW5kcyBOb2RlPihjaGlsZHJlbjogVltdfHVuZGVmaW5lZCkgPT4gdm9pZCkpID0+IHZvaWQpIHtcbiAgICBsZXQgcmVzdWx0czogYW55W11bXSA9IFtdO1xuICAgIGxldCB0ID0gdGhpcztcbiAgICBmdW5jdGlvbiB2aXNpdDxUIGV4dGVuZHMgTm9kZT4oY2hpbGRyZW46IFRbXXx1bmRlZmluZWQpIHtcbiAgICAgIGlmIChjaGlsZHJlbikgcmVzdWx0cy5wdXNoKHZpc2l0QWxsKHQsIGNoaWxkcmVuLCBjb250ZXh0KSk7XG4gICAgfVxuICAgIGNiKHZpc2l0KTtcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLmNvbmNhdC5hcHBseShbXSwgcmVzdWx0cyk7XG4gIH1cbn1cbiJdfQ==