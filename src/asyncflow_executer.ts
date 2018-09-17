export class DuplicateDefinitionError implements Error {
  name: string;
  message: string;

  constructor(){
    this.name = "DuplicateDefinitionError";
    this.message = "変数が多重定義されています";
  }

  toString() {
      return this.name + ': ' + this.message;
    }
};

export class jsObjectNotFound implements Error {
  name: string;
  message: string;

  constructor(){
    this.name = "jsObjectNotFound";
    this.message = "jsのオブジェクトが見つかりません。";
  }

  toString() {
      return this.name + ': ' + this.message;
    }
};

export class AsyncFlowExecuter{
    vals: any

    constructor() {
        this.vals = {};
    }

    public run(locals:any, ast:any): void {
        if(ast["type"]=="operation_block") {
            ast["detail"]["list"].forEach( (n:any) => this.run(locals,n) );
        } else if(ast["type"]=="var_def"){
            const name = ast["detail"]["var_name"];
            const js_obj = ast["detail"]["js_obj"];

            if(this.vals[name]) {
                throw new DuplicateDefinitionError();
            } else {
                if (locals[js_obj]){
                    this.vals[name] = locals[js_obj];
                } else {
                    throw new jsObjectNotFound();
                }
            }
        }
    }  
};


