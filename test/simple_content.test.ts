import {ISubscriber} from '../src/ISubscriber';
import {SimpleContent} from '../src/SimpleContent';
import {SimpleSubscriber} from '../src/SimpleSubscriber';

describe('SimpleContentのテスト', () =>  {
    it('SimpleContentから1を受け取る', () => {
        jest.useFakeTimers();
        const data = 1;
        const sub = new SimpleSubscriber<number, void>((x) => {
            expect(x).toBe(data);
        });
        const content = new SimpleContent<number, ISubscriber<number>>(data);
        content.register(sub);
        content.publish();
        jest.runAllTimers();
    });
});
