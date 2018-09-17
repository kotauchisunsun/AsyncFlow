import {SimpleSubscriber}  from '../src/simple_subscriber'
import {SimplePublisher} from '../src/simple_publisher'
import {ISubscriber} from '../src/ISubscriber'

describe('SimplePublisherのテスト', () => {
    it( 'SimplePublisherから1を受け取る', () => {
        jest.useFakeTimers();
        expect.assertions(1);
        const data = 1;
        const pub = new SimplePublisher<number,ISubscriber<number>>(data);
        const sub = new SimpleSubscriber<number,void>( (x) => {
            expect(x).toBe(data);
        });
        sub.subscribe(pub.content);
        pub.publish();
        jest.runAllTimers();
    });
});
