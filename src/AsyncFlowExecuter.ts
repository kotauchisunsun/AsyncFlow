/**
 *
 */

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
  public vals: Object;

  constructor() {
    this.vals = {};
  }

  public run(locals: Object, ast: Object): void {
    if (ast.type === 'operation_block') {
      ast.detail.list.forEach((n: Object) => this.run(locals, n));
    } else if (ast.type === 'var_def') {
      const name: string = ast.detail.var_name;
      const js_obj: string = ast.detail.js_obj;

      if (this.vals[name]) {
        throw new DuplicateDefinitionError();
      } else {
        if (locals[js_obj]) {
          this.vals[name] = locals[js_obj];
        } else {
          throw new JsObjectNotFound();
        }
      }
    }
  }
}
