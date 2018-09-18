import { DuplicateDefinitionError, JsObjectNotFound , NotDefinedVariable } from './AsyncFlowError';

export type Locals = { [key: string]: Object };

export interface IAst {
    node_type: string;
    detail: object;
}

interface IOperationBlock {
    list: IAst[];
}

interface IVarDef {
    var_name: string;
    js_obj: string;
}

interface IPublisherDef {
    val: IVarDef;
    content: string;
}

interface IFlowDef {
    from_var: IAst;
    to_var: IAst;
}

export class AsyncFlowExecuter {
    public vals: { [key: string]: Object };

    constructor() {
        this.vals = {};
    }

    public run<T extends IAst>(locals: Locals, ast: T): void {
        if (ast.node_type === 'operation_block') {
            const block: IOperationBlock = <IOperationBlock>ast.detail;
            for (const n of block.list) {
                this.run(locals, n);
            }
        } else if (ast.node_type === 'var_def') {
            const detail: IVarDef = <IVarDef>ast.detail;
            const name: string = detail.var_name;
            const jsObj: string = detail.js_obj;

            if (this.vals[name] != null) {
                throw new DuplicateDefinitionError();
            } else {
                if (locals[jsObj] != null) {
                    this.vals[name] = locals[jsObj];
                } else {
                    throw new JsObjectNotFound();
                }
            }
        } else if (ast.node_type === 'flow_def') {
            const detail: IFlowDef = <IFlowDef>ast.detail;
            const pub = <IPublisherDef>detail.from_var.detail;
            const sub = <IVarDef>detail.to_var.detail;
            if (this.vals[pub.val.var_name] == null || this.vals[sub.var_name] == null) {
                throw new NotDefinedVariable();
            }
        }
    }
}
