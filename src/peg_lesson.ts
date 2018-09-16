const peg = require("pegjs");

export class MyParser{
    parser() {
        const definition = String.raw`

doc = operation_block* operation_line

operation_block
 = operation_line blankline

operation_line
 = _ operation_def? _ comment_def?

operation_def
  = var_def / flow_def

var_def
 = "var" _ name:var _ "=" _ js:var {}

flow_def
  = from:publisher _ "->" _ to:var {}

comment_def
 = "#" [^\n]*

publisher
  = name:var "." content:var {} 

var 
  = head:[a-zA-Z$_] other:[a-zA-Z0-9$_]* { return head+other.join(''); }

blankline = [\n]

_ = [ \t]*

`;
        return peg.generate(definition);
    }
};
