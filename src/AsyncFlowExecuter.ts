export interface IAst {
  node_type: string;
  detail: object;
}

export type Locals = { [key: string]: Object };

export class DuplicateDefinitionError implements Error {
  public name: string;
  public message: string;

  constructor() {
    this.name = 'DuplicateDefinitionError';
    this.message = '変数が多重定義されています';
  }

  public toString(): string {
    return `${this.name}:${this.message}`;
  }
}

export class JsObjectNotFound implements Error {
  public name: string;
  public message: string;

  constructor() {
    this.name = 'JsObjectNotFound';
    this.message = 'jsのオブジェクトが見つかりません。';
  }

  public toString(): string {
    return `${this.name}:${this.message}`;
  }
}

export class AsyncFlowExecuter {
  public vals: { [key: string]: Object };

  constructor() {
    this.vals = {};
  }

  public run<T extends IAst>(locals: Locals, ast: T): void {
    if (ast.node_type === 'operation_block') {
      interface IOperationBlock {
        list: IAst[];
      }
      const block: IOperationBlock = <IOperationBlock>ast.detail;
      for (const n of block.list) {
        this.run(locals, n);
      }
    } else if (ast.node_type === 'var_def') {
      interface IVarDef {
        var_name: string;
        js_obj: string;
      }

      const t: IVarDef = <IVarDef>ast.detail;
      const name: string = t.var_name;
      const jsObj: string = t.js_obj;

      if (this.vals[name] != null) {
        throw new DuplicateDefinitionError();
      } else {
        if (locals[jsObj] != null) {
          this.vals[name] = locals[jsObj];
        } else {
          throw new JsObjectNotFound();
        }
      }
    }
  }
}
