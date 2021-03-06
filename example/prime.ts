import {IfPipe} from '../src/IfPipe';
import {SimplePublisher} from '../src/SimplePublisher';
import {SimpleSubscriber} from '../src/SimpleSubscriber';
import {Transformer} from '../src/Transformer';

const pub = new SimplePublisher(1);
const relay = new Transformer((x: number) => x);
const inc = new Transformer((x: number) => x + 1);

relay.subscribe(pub.content);
inc.subscribe(relay.content);
relay.subscribe(inc.content);

const init = new Transformer((x: number) => [x, x]);
init.subscribe(relay.content);

const dec = new Transformer((x: number[]) => [x[0] - 1, x[1]]);
dec.subscribe(init.content);

const check = new IfPipe((x: number[]) => (x[0] > 1 && x[1] % x[0] !== 0));
check.subscribe(dec.content);
dec.subscribe(check.trueContent);

const isPrime = new IfPipe((x: number[]) => (x[0] === 1 && x[1] !== 1));
isPrime.subscribe(check.falseContent);

const sub = new SimpleSubscriber((x: number[]) => {console.log(x[1]); });
sub.subscribe(isPrime.trueContent);

pub.publish();
