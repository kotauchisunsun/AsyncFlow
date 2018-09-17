import {Content} from './content';
import {RelayContent} from './relay_content';
import {Subscriber} from './subscriber';

export class Transformer<Vin, Vout, S extends Subscriber<Vout>> implements Subscriber<Vin> {
    public content: RelayContent<Vout, S>;
    private f: (v: Vin) => Vout;

    constructor(f: (v: Vin) => Vout) {
        this.f = f;
        this.content = new RelayContent<Vout, S>();
    }

    public emit(v: Vin) : void {
        const self = this;
        setImmediate(() =>
            self.content.publish(self.f(v))
        );
    }

    public subscribe(content: Content<Vin>): void {
        content.register(this);
    }
}
