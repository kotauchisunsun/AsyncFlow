import {AsyncFlowParser} from 'src/asyncflow_parser';
import {AsyncFlowExecuter,DuplicateDefinitionError,jsObjectNotFound} from 'src/asyncflow_executer';

describe('AsyncFlowExecuterのテスト', () => {
    let executer;
    let parser;

    beforeEach( () => {
        executer = new AsyncFlowExecuter();
        parser = new AsyncFlowParser().parser();
    });

    describe('変数宣言に関わるテスト', () => {
        it('変数宣言',()=> {
            const locals = {
                "a" : "a"
            };
            const ast = parser.parse("var A = a");
            expect(() => {
                executer.run(
                    locals,
                    ast
                );
            }).not.toThrow();
        });

        it('多重宣言エラー', () => {
            const locals = {
                "a" : "a"
            };
            const ast = parser.parse("var A = a\nvar A = a");
            expect(() => {
                executer.run(
                    locals,
                    ast
                );
            }).toThrow(DuplicateDefinitionError);
        });

        it('js側のオブジェクトが見つからない', () => {
            const locals = {
                "a" : "a"
            };
            const ast = parser.parse("var A = b");
            expect(() => {
                executer.run(
                    locals,
                    ast
                );
            }).toThrow(jsObjectNotFound);
        });
    });
});
