import {Content} from './content';
import {RelayContent} from './relay_content';
import {Subscriber} from './subscriber';

export class IfPipe<V, S extends Subscriber<V>> implements Subscriber<V> {
    public true_content: RelayContent<V, S>;
    public false_content: RelayContent<V, S>;
    private f: (v: V) => boolean;

    constructor(f: (v: V) => boolean) {
        this.true_content = new RelayContent<V, S>();
        this.false_content = new RelayContent<V, S>();

        this.f = f;
    }

    public emit(v: V) : void {
        const self = this;
        setImmediate(
            () => {
                if (self.f(v)) {
                    self.true_content.publish(v);
                } else {
                    self.false_content.publish(v);
                }
            }
        );
    }

    public subscribe(content: Content<V>): void {
        content.register(this);
    }
}
