import {Bloadcaster} from './bloadcaster'
import {Content} from './content'
import {Subscriber} from './subscriber'

export class SimpleContent<V,S extends Subscriber<V>> implements Content {
    val: V;
    bloadcaster: Bloadcaster<V,S>;

    constructor(val:V) {
        this.val = val;
        this.bloadcaster = new Bloadcaster<V,S>( (s,v) => s.emit(v) );
    }

    register(sub: S) :void{
        this.bloadcaster.register(sub);
    }

    publish() :void {
        this.bloadcaster.cast(this.val);
    }
};

