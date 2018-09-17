import {Subscriber} from './subscriber';
export interface Content<V> {
    register(sub: Subscriber<V>) : void;
}
