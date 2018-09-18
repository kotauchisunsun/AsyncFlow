import pegjs from 'pegjs';

export class AsyncFlowParser {
  public parser(): pegjs.Parser {
    const definition: string = `

doc = blocks:operation_block* line:operation_line? {
    const objs = blocks.filter( x => x != null );
    const make_list = (objs) => {
        return {
            "node_type" : "operation_block",
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
 = "var" _ init:"*"? name:var _ "=" _ js:var {
    return {
        "node_type" : "var_def",
        "detail" : {
            "var_name" : name,
            "js_obj" : js,
            "init": (init ? true : false)
        }
    };
 }

flow_def
  = from:publisher _ "->" _ to:var {
    return {
        "node_type" : "flow_def",
        "detail" : {
            "from_var" : from,
            "to_var" : {
                "node_type" : "val",
                "detail" : {
                    "name" : to
                }
            }
        }
    }
}

comment_def
 = "#" [^\\n]*

publisher
  = name:var "." content:var {
  return {
    "node_type" : "publisher",
    "detail" : {
        "val": {
            "node_type" : "val",
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

blankline = [\\n]

_ = [ \\t]*

`;

    return pegjs.generate(definition);
  }
}
