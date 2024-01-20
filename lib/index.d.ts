import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactElementLike } from 'prop-types';
import * as React from 'react';
import { Observable } from 'rxjs';

interface BlocProviderProps {
    children: React.ReactNode;
    providers: ReactElementLike[];
}

declare function BlocProvider({ providers, children }: BlocProviderProps): react_jsx_runtime.JSX.Element;

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

interface AuthProps {
    /**
     * Define when the cookie will be removed. Value can be a Number
     * which will be interpreted as days from time of creation or a
     * Date instance. If omitted, the cookie becomes a session cookie.
     */
    expires?: number | Date | undefined;
    /**
     * Define the path where the cookie is available. Defaults to '/'
     */
    path?: string | undefined;
    /**
     * Define the domain where the cookie is available. Defaults to
     * the domain of the page where the cookie was created.
     */
    domain?: string | undefined;
    /**
     * A Boolean indicating if the cookie transmission requires a
     * secure protocol (https). Defaults to false.
     */
    secure?: boolean | undefined;
    /**
     * Asserts that a cookie must not be sent with cross-origin requests,
     * providing some protection against cross-site request forgery
     * attacks (CSRF)
     */
    sameSite?: "strict" | "Strict" | "lax" | "Lax" | "none" | "None" | undefined;
    /**
     * An attribute which will be serialized, conformably to RFC 6265
     * section 5.2.
     */
    [property: string]: any;
}

declare const auth: (key: string) => string | undefined;
declare const setAuth: (key: string, data: string, options?: AuthProps) => string | undefined;
declare const removeAuth: (key: string, options?: AuthProps) => boolean;
declare const getStore: (key: string, session?: boolean) => any;
declare const setStore: (key: string, data: any, session?: boolean) => boolean;
declare const removeStore: (key: string, session?: boolean) => boolean;
declare const clearStore: (session?: boolean) => boolean;

interface BlocBuilderProps<B extends Bloc<S>, S> {
    bloc: B;
    builder: (state: S) => React.JSX.Element;
}
declare const BlocBuilder: <B extends Bloc<S>, S>({ bloc, builder, }: BlocBuilderProps<B, S>) => React.JSX.Element;

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
    builder: (snapshot: Snapshot<T>) => React.ReactNode;
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

export { Bloc, BlocBuilder, BlocProvider, StreamBuilder, auth, clearStore, createContext, getStore, removeAuth, removeStore, setAuth, setStore };
