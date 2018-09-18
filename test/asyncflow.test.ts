import {
    AsyncFlowExecuter,
    IAst,
    Locals
} from '../src/AsyncFlowExecuter';
import { AsyncFlowParser } from '../src/AsyncFlowParser';
import {IfPipe} from '../src/IfPipe';
import {ISubscriber} from '../src/ISubscriber';
import {SimplePublisher} from '../src/SimplePublisher';
import {SimpleSubscriber} from '../src/SimpleSubscriber';
import {Transformer} from '../src/Transformer';

describe ('asyncflowのテスト', () => {
    it('ループ処理で1,2,3,4を生成する', () => {
        jest.useFakeTimers();
        expect.assertions(4);
        const pub = new SimplePublisher<number, ISubscriber<number>>(1);
        const pipe = new IfPipe<number, ISubscriber<number>>((x: number) => x < 5);
        const sub = new SimpleSubscriber<number, void>((x: number) => {
            expect([1, 2, 3, 4].includes(x)).toBeTruthy();
        });
        const trans = new Transformer<number, number, ISubscriber<number>>((x: number) => x + 1);
        pipe.subscribe(pub.content);
        trans.subscribe(pipe.trueContent);
        sub.subscribe(pipe.trueContent);
        pipe.subscribe(trans.content);
        pub.publish();
        jest.runAllTimers();
    });

    it('拡張構文によるテスト', () => {
        jest.useFakeTimers();
        expect.assertions(4);
        const pub = new SimplePublisher(1);
        const pipe = new IfPipe((x: number) => x < 5);
        const sub1 = new SimpleSubscriber((x: number) => {
            expect([1, 2, 3, 4].includes(x)).toBeTruthy();
        });
        const trans = new Transformer((x: number) => x + 1);
        const locals: Locals = {
            pub: pub,
            pipe: pipe,
            sub1: sub1,
            trans: trans
        };
        const parser = new AsyncFlowParser().parser();
        const executer = new AsyncFlowExecuter();
        const ast: IAst = <IAst>parser.parse(`
var *pub = pub
var pipe = pipe
var sub1 = sub1
var trans = trans
pub.c -> pipe
pipe.t -> trans
pipe.t -> sub1
trans.c -> pipe
`);
        executer.run(locals, ast);
        jest.runAllTimers();
    });
});
