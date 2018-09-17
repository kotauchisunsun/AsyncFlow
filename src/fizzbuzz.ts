import {IfPipe} from './IfPipe';
import {SimplePublisher} from './simple_publisher';
import {SimpleSubscriber} from './simple_subscriber';
import {Transformer} from './transformer';

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
fizzbuzzPipe.subscribe(loopPipe.trueContent);
fizzbuzzSub.subscribe(fizzbuzzPipe.trueContent);
fizzPipe.subscribe(fizzbuzzPipe.falseContent);
fizzSub.subscribe(fizzPipe.trueContent);
buzzPipe.subscribe(fizzPipe.falseContent);
buzzSub.subscribe(buzzPipe.trueContent);
numSub.subscribe(buzzPipe.falseContent);

incTrans.subscribe(loopPipe.trueContent);
loopPipe.subscribe(incTrans.content);

/*
 pub.content -> loop_swtich
 loop_switch.trueContent -> fizzbuzz_switch
 fizzbuzz_switch.trueContent -> fizzbuzz_sub
 fizzbuzz_switch.falseContent -> fizz_switch
 fizz_switch.trueContent -> fizz_sub
 fizz_switch.falseContent -> buzz_switch
 buzz_swtich.trueContent -> buzz_sub
 buzz_switch.falseContent -> num_sub
*/

pub.publish();
