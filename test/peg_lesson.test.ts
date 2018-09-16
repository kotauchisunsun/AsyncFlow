const peg = require("pegjs");
import {MyParser} from 'src/peg_lesson';

describe('pegjsのテスト', () => {
    describe('使い方のテスト',() => {
        it('成功するサンプルの実行', () => {
            const parser = peg.generate("start = ('a' / 'b')+");
            expect(parser.parse("abba")).toEqual(["a", "b", "b", "a"]);
        });

        it('失敗するサンプルの実行', () => {
            const parser = peg.generate("start = ('a' / 'b')+");
            expect(() => {parser.parse("abcd")}).toThrow(peg.SyntaxError);
        });
    });

    describe('MyParserのテスト',() => {
        describe('構文チェックのテスト', () => {
            let parser;
            beforeAll( () => {
                parser = new MyParser().parser();
            });

            it('変数宣言のテスト', () => {
                expect(() => {parser.parse("var A = a")}).not.toThrow(peg.SyntaxError);
                expect(() => {parser.parse("var $ = $")}).not.toThrow(peg.SyntaxError);
                expect(() => {parser.parse("var AAA = _")}).not.toThrow(peg.SyntaxError);
                expect(() => {parser.parse("var a_10_A_$ = test")}).not.toThrow(peg.SyntaxError);
                expect(() => {parser.parse("0")}).toThrow(peg.SyntaxError);
                expect(() => {parser.parse("var a")}).toThrow(peg.SyntaxError);
                expect(() => {parser.parse("var _ = ")}).toThrow(peg.SyntaxError);
                expect(() => {parser.parse("var b = 0")}).toThrow(peg.SyntaxError);
            });

            it('フロー宣言のテスト', () => {
                expect(() => {parser.parse("A.c -> B")}).not.toThrow(peg.SyntaxError);
                expect(() => {parser.parse("A.c->B")}).not.toThrow(peg.SyntaxError);
                expect(() => {parser.parse("A.t -> B")}).not.toThrow(peg.SyntaxError);
                expect(() => {parser.parse("A.$ -> B")}).not.toThrow(peg.SyntaxError);
                expect(() => {parser.parse("A -> B")}).toThrow(peg.SyntaxError);
                expect(() => {parser.parse("A->B.c")}).toThrow(peg.SyntaxError);
                expect(() => {parser.parse("A.c->")}).toThrow(peg.SyntaxError);
                expect(() => {parser.parse("->B")}).toThrow(peg.SyntaxError);
            });

            it('空行のテスト', () => {
                expect(() => {parser.parse("\n")}).not.toThrow(peg.SyntaxError);
                expect(() => {parser.parse("  \n  \n")}).not.toThrow(peg.SyntaxError);
            });

            it('変数宣言ブロックのテスト', () => {
                expect(() => {parser.parse("var A = a\nvar B = b")}).not.toThrow(peg.SyntaxError);
                expect(() => {parser.parse("var A = a\n  var B = b")}).not.toThrow(peg.SyntaxError);
            });

            it('フロー宣言ブロックのテスト', () => {
                expect(() => {parser.parse("A.c -> B\nB.t -> C")}).not.toThrow(peg.SyntaxError);
                expect(() => {parser.parse("A.c -> B\n  B.t -> C")}).not.toThrow(peg.SyntaxError);
            });

            it('コメントのテスト', () => {
                expect(() => {parser.parse("#comment")}).not.toThrow(peg.SyntaxError);
                expect(() => {parser.parse("#comment1\n#comment2")}).not.toThrow(peg.SyntaxError);
                expect(() => {parser.parse("var A = a #comment")}).not.toThrow(peg.SyntaxError);
                expect(() => {parser.parse("A.c -> B #comment")}).not.toThrow(peg.SyntaxError);
            });

            it('統合テスト', () => {
                const source = `
var A = a
var B = b
var C = c
var D = D #使わない

#ここからフロー定義
a.c -> b
b.c -> c #テスト用
`
                expect(() => {parser.parse(source)}).not.toThrow(peg.SyntaxError);
            });
        });

        describe("構文解析木のテスト", () => {
            let parser;
            beforeAll( () => {
                parser = new MyParser().parser();
            });

            it('変数宣言のテスト', () => {
                const A = {
                    "type" : "var_def",
                    "detail" : {
                        "var_name" : "A",
                        "js_obj" : "a"
                    }
                };

                const B = {
                    "type" : "var_def",
                    "detail" : {
                        "var_name" : "B",
                        "js_obj" : "c"
                    }
                };


                expect(parser.parse("var A = a")).toEqual({
                    "type" : "operation_block",
                    "detail" : {
                        "list" : [A]
                    }
                });

                expect(parser.parse("var B = c")).toEqual({
                    "type" : "operation_block",
                    "detail" : {
                        "list" : [B]
                    }
                });
            });

            it('フロー宣言のテスト', () => {
                const flow = {
                    "type" : "flow_def",
                    "detail" : {
                        "from" : {
                            "type" : "publisher",
                            "detail" : {
                                "val" : {
                                    "type" : "val",
                                    "detail" : {
                                        "name" : "A"
                                    }
                                },
                                "content" : "c"
                            }
                        },
                        "to" : {
                            "type" : "val",
                            "detail" : {
                                "name" : "B"
                            }
                        }
                    }
                };
                expect(parser.parse("A.c -> B")).toEqual({
                    "type" : "operation_block",
                    "detail" : {
                        "list" : [flow]
                    }
                });
            });

            it('複数文のテスト', () => {
                const A = {
                    "type" : "var_def",
                    "detail" : {
                        "var_name" : "A",
                        "js_obj" : "a"
                    }
                };
                const B = {
                    "type" : "var_def",
                    "detail" : {
                        "var_name" : "B",
                        "js_obj" : "b"
                    }
                };

                expect(parser.parse("var A = a\n")).toEqual({
                    "type" : "operation_block",
                    "detail" : {
                        "list" : [ A ]  
                    }
                });

                expect(parser.parse("var A = a\nvar B = b\n")).toEqual({
                    "type" : "operation_block",
                    "detail" : {
                        "list" : [ A , B]  
                    }
                });

                expect(parser.parse("var A = a\nvar B = b")).toEqual({
                    "type" : "operation_block",
                    "detail" : {
                        "list" : [ A , B]  
                    }
                });
            });

            /*
            it('統合テスト', () => {
                const parser = new MyParser().parser();
                const source = `
var A = a
var B = b
var C = c
var D = D #使わない

#ここからフロー定義
a.c -> b
b.c -> c #テスト用
`
                const data = parser.parse(source);
                console.log(JSON.stringify(data, null , "  "));
            });
            */
        });
    });
});
