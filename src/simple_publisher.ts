import {SimpleContent} from './simple_content';
import {Subscriber} from './subscriber';

export class SimplePublisher<V, S extends Subscriber<V>> {
    public content: SimpleContent<V, S>;

    constructor(v: V) {
        this.content = new SimpleContent<V, S>(v);
    }

    public publish() : void {
        this.content.publish();
    }
}
