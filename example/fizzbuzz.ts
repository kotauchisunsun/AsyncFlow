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

loopPipe.subscribe(pub.content);
incTrans.subscribe(loopPipe.trueContent);
loopPipe.subscribe(incTrans.content);
fizzbuzzPipe.subscribe(loopPipe.trueContent);
fizzbuzzSub.subscribe(fizzbuzzPipe.trueContent);
fizzPipe.subscribe(fizzbuzzPipe.falseContent);
fizzSub.subscribe(fizzPipe.trueContent);
buzzPipe.subscribe(fizzPipe.falseContent);
buzzSub.subscribe(buzzPipe.trueContent);
numSub.subscribe(buzzPipe.falseContent);

pub.publish();
