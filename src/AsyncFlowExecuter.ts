interface Iast {
  type: string;
  detail: object;
}

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

  public run<T extends Iast>(locals: { [key: string]: Object }, ast: T): void {
    if (ast.type === 'operation_block') {
      interface IoperationBlock {
        list: Iast[];
      }
      const block: IoperationBlock = <IoperationBlock>ast.detail;
      block.list.forEach((n: Iast) => this.run(locals, n));
    } else if (ast.type === 'var_def') {
      interface IvarDef {
        var_name: string;
        js_obj: string;
      }

      const t: IvarDef = <IvarDef>ast.detail;
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
