import {IfPipe} from './IfPipe';
import {SimplePublisher} from './simple_publisher';
import {SimpleSubscriber}  from './simple_subscriber';
import {Transformer} from './transformer';

const pub = new SimplePublisher(1);
const loop_pipe = new IfPipe((x: number) => x < 100);
const fizz_pipe = new IfPipe((x: number) => x % 3 == 0);
const buzz_pipe = new IfPipe((x: number) => x % 5 == 0);
const fizzbuzz_pipe = new IfPipe((x: number) => x % 15 == 0);

const num_sub = new SimpleSubscriber<number, void>((x: number) => {
    console.log(x);
});
const fizz_sub = new SimpleSubscriber<number, void>((x: number) => {
    console.log('fizz', x);
});
const buzz_sub = new SimpleSubscriber<number, void>((x: number) => {
    console.log('buzz', x);
});
const fizzbuzz_sub = new SimpleSubscriber<number, void>((x: number) => {
    console.log('fizzbuzz', x);
});
const inc_trans = new Transformer((x: number) => x + 1);

loop_pipe.subscribe(pub.content);
fizzbuzz_pipe.subscribe(loop_pipe.trueContent);
fizzbuzz_sub.subscribe(fizzbuzz_pipe.trueContent);
fizz_pipe.subscribe(fizzbuzz_pipe.falseContent);
fizz_sub.subscribe(fizz_pipe.trueContent);
buzz_pipe.subscribe(fizz_pipe.falseContent);
buzz_sub.subscribe(buzz_pipe.trueContent);
num_sub.subscribe(buzz_pipe.falseContent);

inc_trans.subscribe(loop_pipe.trueContent);
loop_pipe.subscribe(inc_trans.content);

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
