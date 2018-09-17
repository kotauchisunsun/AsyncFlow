import {EventEmitter} from 'events';
import {IContent} from './IContent';
import {ISubscriber} from './ISubscriber';

export class SimpleSubscriber<V, R> implements ISubscriber<V> {
    private emitter: EventEmitter;
    private event_name: string;

    constructor(f: (v: V) => R) {
        this.emitter = new EventEmitter();
        this.event_name = 'event_name';
        this.emitter.on(this.event_name,
                        f
        );
    }

    public emit(v: V): void {
        setImmediate(() => this.emitter.emit(this.event_name, v));
    }

    public subscribe(content: IContent<V>): void {
        content.register(this);
    }
}
