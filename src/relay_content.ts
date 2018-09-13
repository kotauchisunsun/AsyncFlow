import {Bloadcaster} from './bloadcaster'
import {Content} from './content'
import {Subscriber} from './subscriber'

export class RelayContent<V,S extends Subscriber<V>> implements Content {
    bloadcaster: Bloadcaster<V,S>;

    constructor() {
        this.bloadcaster = new Bloadcaster<V,S>( (s,v) => s.emit(v) );
    }

    register(sub: S) :void{
        this.bloadcaster.register(sub);
    }

    publish(val: V) :void {
        this.bloadcaster.cast(val);
    }
};

