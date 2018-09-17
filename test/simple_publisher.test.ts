import {SimpleSubscriber}  from '../src/SimpleSubscriber'
import {SimplePublisher} from '../src/SimplePublisher'
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
