import {SimpleSubscriber}  from '../src/simple_subscriber'
import {RelayContent} from '../src/relay_content'
import {Subscriber} from '../src/subscriber'

describe('RelayContentのテスト', () => {
    it( 'RelayContentから1を受け取る', () => {
        jest.useFakeTimers();
        expect.assertions(1);
        const data = 1;
        const content = new RelayContent<number,Subscriber<number>>();
        const sub = new SimpleSubscriber<number,void>( (x) => {
            expect(x).toBe(data);
        });

        content.register(sub);
        content.publish(data)
        jest.runAllTimers();
    });
});
