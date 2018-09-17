import {Bloadcaster} from './Bloadcaster';
import {IContent} from './IContent';
import {ISubscriber} from './ISubscriber';

export class SimpleContent<V, S extends ISubscriber<V>> implements IContent<V> {
    private val: V;
    private bloadcaster: Bloadcaster<V, S>;

    constructor(val: V) {
        this.val = val;
        this.bloadcaster = new Bloadcaster<V, S>((s, v) => {s.emit(v); });
    }

    public register(sub: S) : void {
        this.bloadcaster.register(sub);
    }

    public publish() : void {
        this.bloadcaster.cast(this.val);
    }
}
