import pegjs from 'pegjs';
import { AsyncFlowParser } from '../src/AsyncFlowParser';

describe('pegjsのテスト', () => {
  describe('使い方のテスト', () => {
    it('成功するサンプルの実行', () => {
      const parser: pegjs.Parser = pegjs.generate('start = ("a" / "b")+');
      expect(parser.parse('abba')).toEqual(['a', 'b', 'b', 'a']);
    });

    it('失敗するサンプルの実行', () => {
      const parser: pegjs.Parser = pegjs.generate('start = (\'a\' / \'b\')+');
      expect(() => {
        parser.parse('abcd');
      }).toThrow();
    });
  });

  describe('AsyncFlowParserのテスト', () => {
    describe('構文チェックのテスト', () => {
      let parser: pegjs.Parser;
      beforeAll(() => {
        parser = new AsyncFlowParser().parser();
      });

      it('var_defの変数宣言のテスト', () => {
        expect(() => {
          parser.parse('var A = a');
        }).not.toThrow();
        expect(() => {
          parser.parse('var *B = a');
        }).not.toThrow();
        expect(() => {
          parser.parse('var $ = $');
        }).not.toThrow();
        expect(() => {
          parser.parse('var AAA = _');
        }).not.toThrow();
        expect(() => {
          parser.parse('var a_10_A_$ = test');
        }).not.toThrow();
        expect(() => {
          parser.parse('0');
        }).toThrow();
        expect(() => {
          parser.parse('var a');
        }).toThrow();
        expect(() => {
          parser.parse('var _ = ');
        }).toThrow();
      });

      it('var_def_numberの変数宣言のテスト', () => {
        expect(() => {
          parser.parse('var A = 10');
        }).not.toThrow();
      });

      it('フロー宣言のテスト', () => {
        expect(() => {
          parser.parse('A.c -> B');
        }).not.toThrow();
        expect(() => {
          parser.parse('A.c->B');
        }).not.toThrow();
        expect(() => {
          parser.parse('A.t -> B');
        }).not.toThrow();
        expect(() => {
          parser.parse('A.$ -> B');
        }).not.toThrow();
        expect(() => {
          parser.parse('A -> B');
        }).toThrow();
        expect(() => {
          parser.parse('A->B.c');
        }).toThrow();
        expect(() => {
          parser.parse('A.c->');
        }).toThrow();
        expect(() => {
          parser.parse('->B');
        }).toThrow();
      });

      it('空行のテスト', () => {
        expect(() => {
          parser.parse('\n');
        }).not.toThrow();
        expect(() => {
          parser.parse('  \n  \n');
        }).not.toThrow();
      });

      it('変数宣言ブロックのテスト', () => {
        expect(() => {
          parser.parse('var A = a\nvar B = b');
        }).not.toThrow();
        expect(() => {
          parser.parse('var A = a\n  var B = b');
        }).not.toThrow();
      });

      it('フロー宣言ブロックのテスト', () => {
        expect(() => {
          parser.parse('A.c -> B\nB.t -> C');
        }).not.toThrow();
        expect(() => {
          parser.parse('A.c -> B\n  B.t -> C');
        }).not.toThrow();
      });

      it('コメントのテスト', () => {
        expect(() => {
          parser.parse('#comment');
        }).not.toThrow();
        expect(() => {
          parser.parse('#comment1\n#comment2');
        }).not.toThrow();
        expect(() => {
          parser.parse('var A = a #comment');
        }).not.toThrow();
        expect(() => {
          parser.parse('A.c -> B #comment');
        }).not.toThrow();
      });

      it('統合テスト', () => {
        const source: string = `
var A = a
var B = b
var C = c
var D = D #使わない

#ここからフロー定義
a.c -> b
b.c -> c #テスト用
`;
        expect(() => {
          parser.parse(source);
        }).not.toThrow();
      });
    });

    describe('構文解析木のテスト', () => {
      let parser: pegjs.Parser;
      beforeAll(() => {
        parser = new AsyncFlowParser().parser();
      });

      it('変数宣言のテスト', () => {
        const A: Object = {
          node_type: 'var_def',
          detail: {
            var_name: 'A',
            js_obj: 'a',
            init: false
          }
        };

        const B: Object = {
          node_type: 'var_def',
          detail: {
            var_name: 'B',
            js_obj: 'c',
            init: false
          }
        };

        const C: Object = {
          node_type: 'var_def',
          detail: {
            var_name: 'C',
            js_obj: 'c',
            init: true
          }
        };

        expect(parser.parse('var A = a')).toEqual({
          node_type: 'operation_block',
          detail: {
            list: [A]
          }
        });

        expect(parser.parse('var B = c')).toEqual({
          node_type: 'operation_block',
          detail: {
            list: [B]
          }
        });

        expect(parser.parse('var *C = c')).toEqual({
          node_type: 'operation_block',
          detail: {
            list: [C]
          }
        });
      });

      it('フロー宣言のテスト', () => {
        const flow: Object = {
          node_type: 'flow_def',
          detail: {
            from_var: {
              node_type: 'publisher',
              detail: {
                val: {
                  node_type: 'val',
                  detail: {
                    name: 'A'
                  }
                },
                content: 'c'
              }
            },
            to_var: {
              node_type: 'val',
              detail: {
                name: 'B'
              }
            }
          }
        };
        expect(parser.parse('A.c -> B')).toEqual({
          node_type: 'operation_block',
          detail: {
            list: [flow]
          }
        });
      });

      it('複数文のテスト', () => {
        const A: Object = {
          node_type: 'var_def',
          detail: {
            var_name: 'A',
            js_obj: 'a',
            init: false
          }
        };
        const B: Object = {
          node_type: 'var_def',
          detail: {
            var_name: 'B',
            js_obj: 'b',
            init: false
          }
        };

        expect(parser.parse('var A = a\n')).toEqual({
          node_type: 'operation_block',
          detail: {
            list: [A]
          }
        });

        expect(parser.parse('var A = a\nvar B = b\n')).toEqual({
          node_type: 'operation_block',
          detail: {
            list: [A, B]
          }
        });

        expect(parser.parse('var A = a\nvar B = b')).toEqual({
          node_type: 'operation_block',
          detail: {
            list: [A, B]
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
