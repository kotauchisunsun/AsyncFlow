import {EventEmitter} from 'events';
import {Content} from './content';
import {Subscriber} from './subscriber';

export class SimpleSubscriber<V, R> implements Subscriber<V> {
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

    public subscribe(content: Content<V>): void {
        content.register(this);
    }
}
