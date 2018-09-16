const peg = require("pegjs");

export class MyParser{
    parser() {
        const definition = String.raw`

doc = block_definition* line_definition

block_definition
  = blank_block / var_def_block / flow_def_block / comment_def_block

line_definition
  = _ flow_def? var_def? _ comment_def?

flow_def_block
  = _ flow_def _ comment_def? blankline

var_def_block
  = _ var_def _ comment_def? blankline

comment_def_block
  = _ comment_def blankline

blank_block
  = _ blankline

flow_def
  = from:publisher _ "->" _ to:var { return "[" + from + "]" + " -> " + "[" + to + "]" }

var_def
 = "var" _ name:var _ "=" _ js:var { return name + ":" + js }

comment_def
 = "#" [^\n]*

publisher
  = name:var "." content:var { return name + "." + content} 

var 
  = head:[a-zA-Z$_] other:[a-zA-Z0-9$_]* { return head+other.join(''); }

blankline = [\n]

_ = [ \t]*

`;
        return peg.generate(definition);
    }
};
