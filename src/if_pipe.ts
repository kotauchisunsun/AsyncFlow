import {RelayContent} from './relay_content'
import {Subscriber} from './subscriber'
import {Content} from './content'

export class IfPipe<V,S extends Subscriber<V>> implements Subscriber<V> {
    true_content: RelayContent<V,S>;
    false_content: RelayContent<V,S>;
    f:(v:V) => boolean

    constructor(f:(v:V) => boolean) {
        this.true_content = new RelayContent<V,S>();
        this.false_content = new RelayContent<V,S>();

        this.f = f;
    }

    emit(v:V) :void {
        const self = this;
        setImmediate( 
            () => {
                if(self.f(v)){
                    self.true_content.publish(v);
                } else {
                    self.false_content.publish(v);
                }
            }
        );
    }

    subscribe(content: Content): void {
        content.register(this);
    }
};
