import {EventEmitter} from 'events';

export class Bloadcaster<V,S> {
    emitter: EventEmitter;
    event_name:string;
    f:(s:S,v:V) => any;

    constructor(f:(s:S,v:V) => any) {
        this.emitter = new EventEmitter();
        this.event_name = "event_name";
        this.f = f;
    }

    register(sub: S) :void {
        this.emitter.on(this.event_name, (v:V) => this.f(sub,v));
    }

    cast(v:V) :void {
        setImmediate( () => 
            this.emitter.emit(this.event_name, v)
        );
    }
};
