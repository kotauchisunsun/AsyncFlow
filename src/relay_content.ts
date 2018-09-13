import {Bloadcaster} from './bloadcaster';
import {Content} from './content';
import {Subscriber} from './subscriber';

export class RelayContent<V, S extends Subscriber<V>> implements Content {
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
