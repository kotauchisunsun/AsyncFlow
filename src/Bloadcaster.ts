import {EventEmitter} from 'events';

export class Bloadcaster<V, S> {
    private emitter: EventEmitter;
    private eventName: string;
    private f: (s: S, v: V) => void;

    constructor(f: (s: S, v: V) => void) {
        this.emitter = new EventEmitter();
        this.eventName = 'event_name';
        this.f = f;
    }

    public register(sub: S) : void {
        this.emitter.on(this.eventName, (v: V) => {this.f(sub, v); });
    }

    public cast(v: V) : void {
        setImmediate(() =>
            this.emitter.emit(this.eventName, v)
        );
    }
}
