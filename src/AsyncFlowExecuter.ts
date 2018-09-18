import { DuplicateDefinitionError, InvalidAttribute , JsObjectNotFound, NotDefinedVariable} from './AsyncFlowError';

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
    init: boolean;
}

interface IFlowValDetailDef {
    name: string;
}

interface IFlowValDef {
    node_type: string;
    detail: IFlowValDetailDef;
}

interface IFlowFromDetailDef {
    val: IFlowValDef;
    content: string;
}

interface IFlowFromVal {
    node_type: string;
    detail: IFlowFromDetailDef;
}

interface IFlowToVal {
    node_type: string;
    detail: IFlowValDetailDef;
}

interface IFlowDetail {
    from_var: IFlowFromVal;
    to_var: IFlowToVal;
}

interface IPublisher {
    publish(): void;
}

export class AsyncFlowExecuter {
    private vals: { [key: string]: Object };
    private init: IPublisher[];

    constructor() {
        this.vals = {};
        this.init = [];
    }

    public run<T extends IAst>(locals: Locals, ast: T): void {
        this.executeDeclare(locals, ast);
        for (const obj of this.init) {
            obj.publish();
        }
    }

    public executeDeclare<T extends IAst>(locals: Locals, ast: T): void {
        if (ast.node_type === 'operation_block') {
            const block: IOperationBlock = <IOperationBlock>ast.detail;
            for (const n of block.list) {
                this.executeDeclare(locals, n);
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
                    if (detail.init) {
                        this.init.push(<IPublisher>locals[jsObj]);
                    }
                } else {
                    throw new JsObjectNotFound();
                }
            }
        } else if (ast.node_type === 'flow_def') {
            const detail = <IFlowDetail>ast.detail;
            const pubName = detail.from_var.detail.val.detail.name;
            const subName = detail.to_var.detail.name;
            if (this.vals[pubName] == null || this.vals[subName] == null) {
                throw new NotDefinedVariable();
            }

            const pubContent = detail.from_var.detail.content;
            interface IhasContent {
                content: Object;
                trueContent: Object;
                falseContent: Object;
            }
            interface ISubscribe {
                subscribe(obj: Object): void;
            }
            const hasContentObj = <IhasContent>this.vals[pubName];
            const subscribeObj = <ISubscribe>this.vals[subName];

            if (subscribeObj.subscribe === undefined) {
                throw new InvalidAttribute();
            }

            if (pubContent === 'c') {
                if (hasContentObj.content === undefined) {
                    throw new InvalidAttribute();
                }
                subscribeObj.subscribe(hasContentObj.content);
            } else if (pubContent === 't') {
                if (hasContentObj.trueContent === undefined) {
                    throw new InvalidAttribute();
                }
                subscribeObj.subscribe(hasContentObj.trueContent);
            } else if (pubContent === 'f') {
                if (hasContentObj.falseContent === undefined) {
                    throw new InvalidAttribute();
                }
                subscribeObj.subscribe(hasContentObj.falseContent);
            } else {
                throw new InvalidAttribute();
            }
        }
    }
}
