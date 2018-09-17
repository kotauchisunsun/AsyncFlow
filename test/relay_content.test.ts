import {SimpleSubscriber}  from '../src/SimpleSubscriber'
import {RelayContent} from '../src/RelayContent'
import {ISubscriber} from '../src/ISubscriber'

describe('RelayContentのテスト', () => {
    it( 'RelayContentから1を受け取る', () => {
        jest.useFakeTimers();
        expect.assertions(1);
        const data = 1;
        const content = new RelayContent<number,ISubscriber<number>>();
        const sub = new SimpleSubscriber<number,void>( (x) => {
            expect(x).toBe(data);
        });

        content.register(sub);
        content.publish(data)
        jest.runAllTimers();
    });
});
