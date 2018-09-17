import {ISubscriber} from './ISubscriber';
export interface IContent<V> {
    register(sub: ISubscriber<V>) : void;
}
