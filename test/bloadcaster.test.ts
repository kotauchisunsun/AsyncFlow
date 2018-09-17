import {Bloadcaster} from '../src/Bloadcaster'
import {ISubscriber} from '../src/ISubscriber'
import {SimpleSubscriber}  from '../src/simple_subscriber'

describe('BloadCasterのテスト', () => {
    it( 'BloadCasterが1を出力したとき、ISubscriberが1を受け取る.', () => {
        jest.useFakeTimers();
        expect.assertions(1);
        const data = 1;
        const sub = new SimpleSubscriber<number,void>( (x) => {
            expect(x).toBe(data);
        });
        const bload = new Bloadcaster<number,ISubscriber<number>>(
            (sub,val) => sub.emit(val)
        );
        bload.register(sub);
        bload.cast(data);
        jest.runAllTimers();
    });
});
