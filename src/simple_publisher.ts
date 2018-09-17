import {SimpleContent} from './simple_content';
import {ISubscriber} from './ISubscriber';

export class SimplePublisher<V, S extends ISubscriber<V>> {
    public content: SimpleContent<V, S>;

    constructor(v: V) {
        this.content = new SimpleContent<V, S>(v);
    }

    public publish() : void {
        this.content.publish();
    }
}
