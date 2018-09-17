import {EventEmitter} from 'events';
import {IContent} from './IContent';
import {ISubscriber} from './ISubscriber';

export class SimpleSubscriber<V, R> implements ISubscriber<V> {
    private emitter: EventEmitter;
    private eventName: string;

    constructor(f: (v: V) => R) {
        this.emitter = new EventEmitter();
        this.eventName = 'eventName';
        this.emitter.on(this.eventName,
                        f
        );
    }

    public emit(v: V): void {
        setImmediate(() => this.emitter.emit(this.eventName, v));
    }

    public subscribe(content: IContent<V>): void {
        content.register(this);
    }
}
