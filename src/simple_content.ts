import {Bloadcaster} from './bloadcaster';
import {Content} from './content';
import {Subscriber} from './subscriber';

export class SimpleContent<V, S extends Subscriber<V>> implements Content {
    private val: V;
    private bloadcaster: Bloadcaster<V, S>;

    constructor(val: V) {
        this.val = val;
        this.bloadcaster = new Bloadcaster<V, S>((s, v) => s.emit(v));
    }

    public register(sub: S) : void {
        this.bloadcaster.register(sub);
    }

    public publish() : void {
        this.bloadcaster.cast(this.val);
    }
}
