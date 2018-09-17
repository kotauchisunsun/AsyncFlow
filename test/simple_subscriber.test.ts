import {SimpleSubscriber} from '../src/SimpleSubscriber';

describe('SimpleSubscriberのテスト', () => {
    it('SimpleSubscriberが1を受け取る', () => {
        jest.useFakeTimers();
        expect.assertions(1);
        const data = 1;
        const sub = new SimpleSubscriber<number, void>((x) => {
            expect(x).toBe(data);
        });
        sub.emit(data);
        jest.runAllTimers();
    });
});
