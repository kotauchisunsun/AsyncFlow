import {SimpleSubscriber}  from 'src/simple_subscriber'
import {SimpleContent} from 'src/simple_content'
import {Subscriber} from 'src/subscriber'

describe('SimpleContentのテスト', () =>  {
    it( 'SimpleContentから1を受け取る', () => {
        jest.useFakeTimers();
        const data = 1;
        const sub = new SimpleSubscriber<number,void>( (x) => {
            expect(x).toBe(data);
        });
        const content = new SimpleContent<number,Subscriber<number>>(data);
        content.register(sub);
        content.publish();
        jest.runAllTimers();
    });
});
