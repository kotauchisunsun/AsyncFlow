export interface Subscriber<V> {
    emit(v: V): void;
}
