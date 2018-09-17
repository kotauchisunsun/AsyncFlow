import {ISubscriber} from './ISubscriber';
export interface Content<V> {
    register(sub: ISubscriber<V>) : void;
}
