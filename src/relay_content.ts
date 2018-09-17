import {Bloadcaster} from './Bloadcaster';
import {Content} from './content';
import {ISubscriber} from './ISubscriber';

export class RelayContent<V, S extends ISubscriber<V>> implements Content<V> {
    private bloadcaster: Bloadcaster<V, S>;

    constructor() {
        this.bloadcaster = new Bloadcaster<V, S>((s, v) => s.emit(v));
    }

    public register(sub: S) : void {
        this.bloadcaster.register(sub);
    }

    public publish(val: V) : void {
        this.bloadcaster.cast(val);
    }
}
