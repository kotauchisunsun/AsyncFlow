import {Bloadcaster} from './bloadcaster'
import {Subscriber} from './subscriber'
import {SimpleSubscriber}  from './simple_subscriber'
import {SimpleContent} from './simple_content'
import {SimplePublisher} from './simple_publisher'
import {RelayContent} from './relay_content'
import {Transformer} from './transformer'
import {IfPipe} from './if_pipe'

const f1 = () => {
    const data = 1;

    const sub = new SimpleSubscriber<number,void>( (x) => {
        console.log(x);
    });

    const bload = new Bloadcaster<number,Subscriber<number>>(
        (sub,val) => sub.emit(val)
    );
    bload.register(sub);
    bload.cast(data);
};

f1();

const f2 = () => {
    const data = 2;
    const sub = new SimpleSubscriber<number,void>( (x) => {
        console.log(x);
    });
    const content = new SimpleContent<number,Subscriber<number>>(data);
    content.register(sub);
    content.publish();
};

f2();

const f3 = () => {
    const data = 3;
    const pub = new SimplePublisher<number,Subscriber<number>>(data);
    const sub = new SimpleSubscriber<number,void>( (x) => {
        console.log(x);
    });

    sub.subscribe(pub.content);
    pub.publish();
};

f3();

const f4 = () => {
    const data = 4;
    const content = new RelayContent<number,Subscriber<number>>();
    const sub = new SimpleSubscriber<number,void>( (x) => {
        console.log(x);
    });

    content.register(sub);
    content.publish(data)
};

f4();

const f5 = () => {
    const data = 5;
    const trans = new Transformer<number,number,Subscriber<number>>( (x:number) => x );
    const sub = new SimpleSubscriber<number,void>( (x) => {
        console.log(x);
    });

    sub.subscribe(trans.content);
    trans.emit(data);
};

f5();

const f6 = () => {
    const data = 6;
    const pub = new SimplePublisher<number,Subscriber<number>>(data);
    const trans = new Transformer<number,number,Subscriber<number>>( (x:number) => x );
    const sub = new SimpleSubscriber<number,void>( (x:number) => {
        console.log(x);
    });

    trans.subscribe(pub.content);
    sub.subscribe(trans.content);
    pub.publish();
};

f6();

const f7 = () => {
    const data = 7;
    const pipe = new IfPipe<number,Subscriber<number>>( (x:number) => x>5);
    const sub = new SimpleSubscriber<number,void>( (x) => {
        console.log(x)
    });
    sub.subscribe(pipe.true_content);
    pipe.emit(data);
};

f7();

const f8 = () => {
    const pub = new SimplePublisher<boolean,Subscriber<boolean>>(true);
    const pipe = new IfPipe<boolean,Subscriber<boolean>>( (x:boolean) => x);
    const sub = new SimpleSubscriber<boolean,void>( (x:boolean) => {
        console.log("call!"+x);
    });

    pipe.subscribe(pub.content);
    sub.subscribe(pipe.true_content);
    pub.publish();
};

f8();

const f9 = () => {
    const pub = new SimplePublisher<number,Subscriber<number>>(1);
    const pipe = new IfPipe<number,Subscriber<number>>( (x:number) => x < 5 );
    const sub = new SimpleSubscriber<number,void>( (x:number) => {
        console.log("last!"+x)
    });
    const trans = new Transformer<number,number,Subscriber<number>>( (x:number) => x + 1);
    pipe.subscribe(pub.content);
    trans.subscribe(pipe.true_content);
    sub.subscribe(pipe.true_content);
    pipe.subscribe(trans.content);
    pub.publish();
};

f9();
