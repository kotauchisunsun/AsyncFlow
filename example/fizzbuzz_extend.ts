import {
    AsyncFlowExecuter,
    IAst,
    Locals
} from '../src/AsyncFlowExecuter';
import { AsyncFlowParser } from '../src/AsyncFlowParser';
import {IfPipe} from '../src/IfPipe';
import {SimplePublisher} from '../src/SimplePublisher';
import {SimpleSubscriber} from '../src/SimpleSubscriber';
import {Transformer} from '../src/Transformer';

const pub = new SimplePublisher(1);
const loopPipe = new IfPipe((x: number): boolean => x < 100);
const fizzPipe = new IfPipe((x: number): boolean => x % 3 === 0);
const buzzPipe = new IfPipe((x: number): boolean => x % 5 === 0);
const fizzbuzzPipe = new IfPipe((x: number): boolean => x % 15 === 0);

const numSub = new SimpleSubscriber<number, void>((x: number): void => {
    console.log(x);
});
const fizzSub = new SimpleSubscriber<number, void>((x: number): void => {
    console.log('fizz', x);
});
const buzzSub = new SimpleSubscriber<number, void>((x: number): void => {
    console.log('buzz', x);
});
const fizzbuzzSub = new SimpleSubscriber<number, void>((x: number): void => {
    console.log('fizzbuzz', x);
});
const incTrans = new Transformer((x: number): number => x + 1);

const parser = new AsyncFlowParser().parser();
const executer = new AsyncFlowExecuter();
const locals: Locals = {
    pub: pub,
    loopPipe: loopPipe,
    fizzPipe: fizzPipe,
    buzzPipe: buzzPipe,
    fizzbuzzPipe: fizzbuzzPipe,
    numSub: numSub,
    fizzSub: fizzSub,
    buzzSub: buzzSub,
    fizzbuzzSub: fizzbuzzSub,
    incTrans: incTrans
};
const ast: IAst = <IAst>parser.parse(`
var *pub = pub
var loopPipe = loopPipe
var fizzPipe = fizzPipe
var buzzPipe = buzzPipe
var fizzbuzzPipe = fizzbuzzPipe
var numSub = numSub
var fizzSub = fizzSub
var buzzSub = buzzSub
var fizzbuzzSub = fizzbuzzSub
var incTrans = incTrans

pub.c -> loopPipe
loopPipe.t -> incTrans
incTrans.c -> loopPipe
loopPipe.t -> fizzbuzzPipe
fizzbuzzPipe.t -> fizzbuzzSub
fizzbuzzPipe.f -> fizzPipe
fizzPipe.t -> fizzSub
fizzPipe.f -> buzzPipe
buzzPipe.t -> buzzSub
buzzPipe.f -> numSub
`);

executer.run(locals, ast);
