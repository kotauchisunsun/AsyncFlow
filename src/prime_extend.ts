import {
    AsyncFlowExecuter,
    IAst,
    Locals
} from '../src/AsyncFlowExecuter';
import { AsyncFlowParser } from '../src/AsyncFlowParser';
import {IfPipe} from './IfPipe';
import {SimplePublisher} from './SimplePublisher';
import {SimpleSubscriber} from './SimpleSubscriber';
import {Transformer} from './Transformer';

const pub = new SimplePublisher(1);
const relay = new Transformer((x: number) => x);
const inc = new Transformer((x: number) => x + 1);
const init = new Transformer((x: number) => [x, x]);
const dec = new Transformer((x: number[]) => [x[0] - 1, x[1]]);
const check = new IfPipe((x: number[]) => (x[0] > 1 && x[1] % x[0] !== 0));
const isPrime = new IfPipe((x: number[]) => (x[0] === 1 && x[1] !== 1));
const sub = new SimpleSubscriber((x: number[]) => {console.log(x[1]); });

const parser = new AsyncFlowParser().parser();
const executer = new AsyncFlowExecuter();
const locals: Locals = {
    pub: pub,
    relay: relay,
    inc: inc,
    init: init,
    dec: dec,
    check: check,
    isPrime: isPrime,
    sub: sub
};
const ast: IAst = <IAst>parser.parse(`
var *pub = pub
var relay = relay
var inc = inc
var init = init
var dec = dec
var check = check
var isPrime = isPrime
var sub = sub

pub.c -> relay
relay.c -> inc
inc.c -> relay
relay.c -> init
init.c -> dec
dec.c -> check
check.t -> dec
check.f -> isPrime
isPrime.t -> sub
`);

executer.run(locals, ast);
