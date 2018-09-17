import {Subscriber} from '../src/subscriber'
import {SimpleSubscriber}  from '../src/simple_subscriber'
import {SimplePublisher} from '../src/simple_publisher'
import {IfPipe} from '../src/if_pipe'

describe ('asyncflowのテスト', () => {
    it( 'IfPipeからtrueを受け取る', () => {
        jest.useFakeTimers();
        expect.assertions(1);
        const pipe = new IfPipe<boolean,Subscriber<boolean>>( (x:boolean) => x);
        const sub = new SimpleSubscriber<boolean,void>( (x:boolean) => {
            expect(x).toBeTruthy();
        });
        sub.subscribe(pipe.true_content);
        pipe.emit(true);
        jest.runAllTimers();
    });

    it( 'IfPipeからfalseを受け取る', () => {
        jest.useFakeTimers();
        expect.assertions(1);
        const pipe = new IfPipe<boolean,Subscriber<boolean>>( (x:boolean) => x);
        const sub = new SimpleSubscriber<boolean,void>( (x:boolean) => {
            expect(x).toBeFalsy();
        });
        sub.subscribe(pipe.false_content);
        pipe.emit(false);
        jest.runAllTimers();
    });

    it( 'PublishからIfPipeを経て、trueを受け取る', () => {
        jest.useFakeTimers()
        expect.assertions(1);
        const pub = new SimplePublisher<boolean,Subscriber<boolean>>(true);
        const pipe = new IfPipe<boolean,Subscriber<boolean>>( (x:boolean) => x);
        const sub = new SimpleSubscriber<boolean,void>( (x:boolean) => {
            expect(x).toBe(true);
        });

        pipe.subscribe(pub.content);
        sub.subscribe(pipe.true_content);
        pub.publish();
        jest.runAllTimers();
    });
});
