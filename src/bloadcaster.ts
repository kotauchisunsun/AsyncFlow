import {EventEmitter} from 'events';

export class Bloadcaster<V, S> {
    private emitter: EventEmitter;
    private event_name: string;
    private f: (s: S, v: V) => void;

    constructor(f: (s: S, v: V) => void) {
        this.emitter = new EventEmitter();
        this.event_name = 'event_name';
        this.f = f;
    }

    public register(sub: S) : void {
        this.emitter.on(this.event_name, (v: V) => this.f(sub, v));
    }

    public cast(v: V) : void {
        setImmediate(() =>
            this.emitter.emit(this.event_name, v)
        );
    }
}
