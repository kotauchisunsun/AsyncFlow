import {RelayContent} from './relay_content'
import {Subscriber} from './subscriber'
import {Content} from './content'

export class Transformer<Vin,Vout,S extends Subscriber<Vout>> implements Subscriber<Vin> {
    content: RelayContent<Vout,S>;
    f:(v:Vin) => Vout

    constructor(f:(v:Vin) => Vout) {
        this.f = f;
        this.content = new RelayContent<Vout,S>();
    }

    emit(v:Vin) :void {
        const self = this;
        setImmediate( () => 
            self.content.publish(self.f(v))
        );
    }

    subscribe(content: Content): void {
        content.register(this);
    }
};
