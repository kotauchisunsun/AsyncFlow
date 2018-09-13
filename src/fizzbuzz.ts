import {IfPipe} from './if_pipe';
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
fizzbuzz_pipe.subscribe(loop_pipe.true_content);
fizzbuzz_sub.subscribe(fizzbuzz_pipe.true_content);
fizz_pipe.subscribe(fizzbuzz_pipe.false_content);
fizz_sub.subscribe(fizz_pipe.true_content);
buzz_pipe.subscribe(fizz_pipe.false_content);
buzz_sub.subscribe(buzz_pipe.true_content);
num_sub.subscribe(buzz_pipe.false_content);

inc_trans.subscribe(loop_pipe.true_content);
loop_pipe.subscribe(inc_trans.content);

/*
 pub.content -> loop_swtich
 loop_switch.true_content -> fizzbuzz_switch
 fizzbuzz_switch.true_content -> fizzbuzz_sub
 fizzbuzz_switch.false_content -> fizz_switch
 fizz_switch.true_content -> fizz_sub
 fizz_switch.false_content -> buzz_switch
 buzz_swtich.true_content -> buzz_sub
 buzz_switch.false_content -> num_sub
*/

pub.publish();
