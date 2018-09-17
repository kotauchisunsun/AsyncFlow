import {IContent} from './IContent';
import {ISubscriber} from './ISubscriber';
import {RelayContent} from './RelayContent';

export class Transformer<Vin, Vout, S extends ISubscriber<Vout>> implements ISubscriber<Vin> {
    public content: RelayContent<Vout, S>;
    private f: (v: Vin) => Vout;

    constructor(f: (v: Vin) => Vout) {
        this.f = f;
        this.content = new RelayContent<Vout, S>();
    }

    public emit(v: Vin) : void {
        setImmediate(() => {
            this.content.publish(this.f(v));
        });
    }

    public subscribe(content: IContent<Vin>): void {
        content.register(this);
    }
}
