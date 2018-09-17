export interface ISubscriber<V> {
    emit(v: V): void;
}
