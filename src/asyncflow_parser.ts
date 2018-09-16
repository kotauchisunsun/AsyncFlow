const peg = require("pegjs");

export class AsyncFlowParser{
    parser() {
        const definition = String.raw`

doc = blocks:operation_block* line:operation_line? {
    const objs = blocks.filter( x => x != null );
    const make_list = (objs) => {
        return {
            "type" : "operation_block",
            "detail" : {
                "list" : objs
            }
        }
    };

    if(objs.length > 0) {
        if(!line) {
            return make_list(objs);
        } else {
            return make_list(objs.concat([line]));
        } 
    } else {
        return make_list([line]);
    }
}

operation_block
 = line:operation_line blankline { return line }

operation_line
 = _ op:operation_def? _ comment_def? { 
    return op ? op : null;
}

operation_def
  = var_def / flow_def

var_def
 = "var" _ name:var _ "=" _ js:var {
    return {
        "type" : "var_def",
        "detail" : {
            "var_name" : name,
            "js_obj" : js
        }
    };
 }

flow_def
  = from:publisher _ "->" _ to:var {
    return {
        "type" : "flow_def",
        "detail" : {
            "from" : from,
            "to" : {
                "type" : "val",
                "detail" : {
                    "name" : to
                }
            }
        }
    }  
}

comment_def
 = "#" [^\n]*

publisher
  = name:var "." content:var {
  return {
    "type" : "publisher",
    "detail" : {
        "val": {
            "type" : "val",
            "detail" : {
                "name" : name
            }
        },
        "content": content
    }
  }  
}

var 
  = head:[a-zA-Z$_] other:[a-zA-Z0-9$_]* { return head+other.join(''); }

blankline = [\n]

_ = [ \t]*

`;
        return peg.generate(definition);
    }
};
