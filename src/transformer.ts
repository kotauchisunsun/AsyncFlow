import {IContent} from './IContent';
import {RelayContent} from './relay_content';
import {ISubscriber} from './ISubscriber';

export class Transformer<Vin, Vout, S extends ISubscriber<Vout>> implements ISubscriber<Vin> {
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

    public subscribe(content: IContent<Vin>): void {
        content.register(this);
    }
}
