import {ISubscriber} from '../src/ISubscriber';
import {SimplePublisher} from '../src/SimplePublisher';
import {SimpleSubscriber} from '../src/SimpleSubscriber';
import {Transformer} from '../src/Transformer';

describe('Transformerのテスト', () => {
    it('Transformerから1を受け取る', () => {
        jest.useFakeTimers();
        expect.assertions(1);
        const data = 5;
        const trans = new Transformer<number, number, ISubscriber<number>>((x: number) => x);
        const sub = new SimpleSubscriber<number, void>((x) => {
            expect(x).toBe(data);
        });

        sub.subscribe(trans.content);
        trans.emit(data);
        jest.runAllTimers();
    });

    it('Transformerに2を入力し、3倍して、6を受け取る', () => {
        jest.useFakeTimers();
        expect.assertions(1);
        const trans = new Transformer<number, number, ISubscriber<number>>((x: number) => x * 3);
        const sub = new SimpleSubscriber<number, void>((x: number) => {
            expect(x).toBe(6);
        });

        sub.subscribe(trans.content);
        trans.emit(2);
        jest.runAllTimers();
    });

    it('PublisherからTransformerを経て1を受け取る', () => {
        jest.useFakeTimers();
        expect.assertions(1);
        const data = 1;
        const pub = new SimplePublisher<number, ISubscriber<number>>(data);
        const trans = new Transformer<number, number, ISubscriber<number>>((x: number) => x);
        const sub = new SimpleSubscriber<number, void>((x: number) => {
            expect(x).toBe(data);
        });

        trans.subscribe(pub.content);
        sub.subscribe(trans.content);
        pub.publish();
        jest.runAllTimers();
    });
});
