import {IContent} from './IContent';
import {ISubscriber} from './ISubscriber';
import {RelayContent} from './RelayContent';

export class IfPipe<V, S extends ISubscriber<V>> implements ISubscriber<V> {
    public trueContent: RelayContent<V, S>;
    public falseContent: RelayContent<V, S>;
    private f: (v: V) => boolean;

    constructor(f: (v: V) => boolean) {
        this.trueContent = new RelayContent<V, S>();
        this.falseContent = new RelayContent<V, S>();

        this.f = f;
    }

    public emit(v: V) : void {
        setImmediate(
            () => {
                if (this.f(v)) {
                    this.trueContent.publish(v);
                } else {
                    this.falseContent.publish(v);
                }
            }
        );
    }

    public subscribe(content: IContent<V>): void {
        content.register(this);
    }
}
