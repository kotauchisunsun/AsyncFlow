/**
 *
 */
import {
  AsyncFlowExecuter,
  DuplicateDefinitionError,
  JsObjectNotFound
} from 'src/AsyncFlowExecuter';
import { AsyncFlowParser } from 'src/AsyncFlowParser';

describe('AsyncFlowExecuterのテスト', () => {
  let executer: AsyncFlowExecuter;
  let parser: AsyncFlowParser;

  beforeEach(() => {
    executer = new AsyncFlowExecuter();
    parser = new AsyncFlowParser().parser();
  });

  describe('変数宣言に関わるテスト', () => {
    it('変数宣言', () => {
      const locals: Object = {
        a: 'a'
      };
      const ast: Object = parser.parse('var A = a');
      expect(() => {
        executer.run(locals, ast);
      }).not.toThrow();
    });

    it('多重宣言エラー', () => {
      const locals: Object = {
        a: 'a'
      };
      const ast: Object = parser.parse('var A = a\nvar A = a');
      expect(() => {
        executer.run(locals, ast);
      }).toThrow(DuplicateDefinitionError);
    });

    it('js側のオブジェクトが見つからない', () => {
      const locals: Object = {
        a: 'a'
      };
      const ast: Object = parser.parse('var A = b');
      expect(() => {
        executer.run(locals, ast);
      }).toThrow(JsObjectNotFound);
    });
  });
});
