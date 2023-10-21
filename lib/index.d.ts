import * as React from 'react';
import { ReactNode } from 'react';
import { Observable } from 'rxjs';

type Subscription<S> = (state: S) => void;

declare abstract class Bloc<S> {
    private internalState;
    private listeners;
    constructor(initalState: S);
    get state(): S;
    changeState(state: S): void;
    subscribe(listener: Subscription<S>): void;
    unsubscribe(listener: Subscription<S>): void;
}

interface BlocBuilderProps<B extends Bloc<S>, S> {
    bloc: B;
    builder: (state: S) => JSX.Element;
}
interface BlocBuilderProps<B extends Bloc<S>, S> {
    bloc: B;
    builder: (state: S) => JSX.Element;
}

declare const BlocBuilder: <B extends Bloc<S>, S>({ bloc, builder, }: BlocBuilderProps<B, S>) => JSX.Element;

declare enum ConnectionState {
    none = 0,
    waiting = 1,
    active = 2,
    done = 3
}

type Snapshot<T> = ActiveSnapshot<T> | NoneSnapshot<T> | DoneSnapshot<T>;

interface ActiveSnapshot<T> {
    state: ConnectionState.active;
    data: T;
}
interface NoneSnapshot<T> {
    state: ConnectionState.none;
    data: undefined;
}
interface DoneSnapshot<T> {
    state: ConnectionState.done;
    data: undefined;
}
interface StreamBuilderProps<T> {
    stream: Observable<T>;
    builder: (snapshot: Snapshot<T>) => ReactNode;
}
interface StreamBuilderState<T> {
    snapshot: Snapshot<T>;
}

declare class StreamBuilder<T> extends React.Component<StreamBuilderProps<T>, StreamBuilderState<T>> {
    private subscription;
    constructor(props: StreamBuilderProps<T>);
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): React.ReactNode;
}

declare function createContext<T>(): readonly [React.Context<T | undefined>, () => NonNullable<T>];

export { Bloc, BlocBuilder, StreamBuilder, createContext };
