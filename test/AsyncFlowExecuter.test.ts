import pegjs from 'pegjs';
import { DuplicateDefinitionError, InvalidAttribute , JsObjectNotFound , NotDefinedVariable } from '../src/AsyncFlowError';
import {
  AsyncFlowExecuter,
  IAst,
  Locals
} from '../src/AsyncFlowExecuter';
import { AsyncFlowParser } from '../src/AsyncFlowParser';

describe('AsyncFlowExecuterのテスト', () => {
  let executer: AsyncFlowExecuter;
  let parser: pegjs.Parser;

  beforeEach(() => {
    executer = new AsyncFlowExecuter();
    parser = new AsyncFlowParser().parser();
  });

  describe('変数宣言に関わるテスト', () => {
    it('変数宣言', () => {
      const locals: Locals = {
        a: 'a'
      };
      const ast: IAst = <IAst>parser.parse('var A = a');
      expect(() => {
        executer.run(locals, ast);
      }).not.toThrow();
    });

    it('多重宣言エラー', () => {
      const locals: Locals = {
        a: 'a'
      };
      const ast: IAst = <IAst>parser.parse('var A = a\nvar A = a');
      expect(() => {
        executer.run(locals, ast);
      }).toThrow(DuplicateDefinitionError);
    });

    it('js側のオブジェクトが見つからない', () => {
      const locals: Locals = {
        a: 'a'
      };
      const ast: IAst = <IAst>parser.parse('var A = b');
      expect(() => {
        executer.run(locals, ast);
      }).toThrow(JsObjectNotFound);
    });

    it('複数の宣言', () => {
      const locals: Locals = {
        a: 'a'
      };
      const ast: IAst = <IAst>parser.parse('var A = a\nvar B = a');
      expect(() => {
        executer.run(locals, ast);
      }).not.toThrow();
    });
  });

  describe('フロー宣言のテスト', () => {
    describe('非宣言の変数が使われていた場合', () => {
      it('fromの変数が宣言されていない場合', () => {
        const locals: Locals = { b : 'b'};
        const ast: IAst = <IAst>parser.parse('var B = b\nA.c->B');
        expect(() => {
          executer.run(locals, ast);
        }).toThrow(NotDefinedVariable);
      });

      it('toの変数が宣言されていない場合', () => {
        const locals: Locals = { a : 'a'};
        const ast: IAst = <IAst>parser.parse('var A = a\nA.c->B');
        expect(() => {
          executer.run(locals, ast);
        }).toThrow(NotDefinedVariable);
      });

      it('両方の変数が宣言されていない場合', () => {
        const locals: Locals = {};
        const ast: IAst = <IAst>parser.parse('A.c->B');
        expect(() => {
          executer.run(locals, ast);
        }).toThrow(NotDefinedVariable);
      });

      it('両方の変数が宣言されている場合', () => {
        const locals: Locals = { a: 'a', b: 'b'};
        const ast: IAst = <IAst>parser.parse('var A=a\nvar B=b\nA.c->B');
        expect(() => {
          executer.run(locals, ast);
        }).not.toThrow(NotDefinedVariable);
      });
    });

    describe('属性アクセスのテスト', () => {
      it('規定外の属性の場合', () => {
        const locals: Locals = { a: {d: 1} , b: {subscribe: 's'} };
        const ast: IAst = <IAst>parser.parse('var A = a\nvar B=b\nA.d->B');
        expect(() => {
          executer.run(locals, ast);
        }).toThrow(InvalidAttribute);
      });

      it('jsObj側にcontent属性が存在しない場合', () => {
        const locals: Locals = { a: {d: 1} , b: {subscribe: 's'} };
        const ast: IAst = <IAst>parser.parse('var A = a\nvar B=b\nA.c->B');
        expect(() => {
          executer.run(locals, ast);
        }).toThrow();
      });

      it('jsObj側にtrueContent属性が存在しない場合', () => {
        const locals: Locals = { a: {d: 1} , b: {subscribe: 's'} };
        const ast: IAst = <IAst>parser.parse('var A = a\nvar B=b\nA.t->B');
        expect(() => {
          executer.run(locals, ast);
        }).toThrow();
      });

      it('jsObj側にfalseContent属性が存在しない場合', () => {
        const locals: Locals = { a: {d: 1} , b: {subscribe: 's'} };
        const ast: IAst = <IAst>parser.parse('var A = a\nvar B=b\nA.f->B');
        expect(() => {
          executer.run(locals, ast);
        }).toThrow();
      });

      it('subscribe属性が存在しない場合', () => {
        const locals: Locals = { a: {d: 1} , b: 'b' };
        const ast: IAst = <IAst>parser.parse('var A = a\nvar B=b\nA.c->B');
        expect(() => {
          executer.run(locals, ast);
        }).toThrow();
      });
    });
  });
});
