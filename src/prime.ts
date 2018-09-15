import {IfPipe} from './if_pipe';
import {SimplePublisher} from './simple_publisher';
import {SimpleSubscriber}  from './simple_subscriber';
import {Transformer} from './transformer';

const pub = new SimplePublisher(1);
const relay = new Transformer( (x:number) => x); 
const inc = new Transformer( (x:number) => x+1);

relay.subscribe(pub.content);
inc.subscribe(relay.content);
relay.subscribe(inc.content);

const init = new Transformer( (x:number) => [x,x]);
init.subscribe(relay.content);

const dec = new Transformer( (x:number[]) => [x[0]-1,x[1]]);
dec.subscribe(init.content);

const check = new IfPipe( (x:number[]) => (x[0]>1 && x[1] % x[0] != 0));
check.subscribe(dec.content);
dec.subscribe(check.true_content)

const is_prime = new IfPipe( (x:number[]) => (x[0]==1 && x[1]!=1))
is_prime.subscribe(check.false_content);

const sub = new SimpleSubscriber( (x:number[]) => console.log(x[1]));
sub.subscribe(is_prime.true_content);

pub.publish();
