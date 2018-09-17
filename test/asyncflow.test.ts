import {ISubscriber} from '../src/ISubscriber'
import {SimpleSubscriber}  from '../src/simple_subscriber'
import {SimplePublisher} from '../src/SimplePublisher'
import {Transformer} from '../src/transformer'
import {IfPipe} from '../src/IfPipe'

describe ('asyncflowのテスト', () => {
    it( 'ループ処理で1,2,3,4を生成する', () => {
        jest.useFakeTimers()
        expect.assertions(4);
        const pub = new SimplePublisher<number,ISubscriber<number>>(1);
        const pipe = new IfPipe<number,ISubscriber<number>>( (x:number) => x < 5 );
        const sub = new SimpleSubscriber<number,void>( (x:number) => {
            expect([1,2,3,4].includes(x)).toBeTruthy()
        });
        const trans = new Transformer<number,number,ISubscriber<number>>( (x:number) => x + 1);
        pipe.subscribe(pub.content);
        trans.subscribe(pipe.trueContent);
        sub.subscribe(pipe.trueContent);
        pipe.subscribe(trans.content);
        pub.publish();
        jest.runAllTimers();
    });
});
