import {ISubscriber} from './ISubscriber';
import {SimpleContent} from './SimpleContent';

export class SimplePublisher<V, S extends ISubscriber<V>> {
    public content: SimpleContent<V, S>;

    constructor(v: V) {
        this.content = new SimpleContent<V, S>(v);
    }

    public publish() : void {
        this.content.publish();
    }
}
