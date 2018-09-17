import {
  AsyncFlowExecuter,
  DuplicateDefinitionError,
  JsObjectNotFound,
  Locals,
  Iast
} from '../src/AsyncFlowExecuter';
import { AsyncFlowParser } from '../src/AsyncFlowParser';
import pegjs from 'pegjs';

describe('AsyncFlowExecuterのテスト', () => {
  let executer: AsyncFlowExecuter;
  let parser: pegjs.Parser;

  beforeEach(() => {
    executer = new AsyncFlowExecuter();
    parser = new AsyncFlowParser().parser();
  });

  describe('変数宣言に関わるテスト', () => {
    it('変数宣言', () => {
      const locals:Locals = {
        a: 'a'
      };
      const ast: Iast = parser.parse('var A = a');
      expect(() => {
        executer.run(locals, ast);
      }).not.toThrow();
    });

    it('多重宣言エラー', () => {
      const locals: Locals = {
        a: 'a'
      };
      const ast: Iast = parser.parse('var A = a\nvar A = a');
      expect(() => {
        executer.run(locals, ast);
      }).toThrow(DuplicateDefinitionError);
    });

    it('js側のオブジェクトが見つからない', () => {
      const locals: Locals = {
        a: 'a'
      };
      const ast: Iast = parser.parse('var A = b');
      expect(() => {
        executer.run(locals, ast);
      }).toThrow(JsObjectNotFound);
    });
  });
});
