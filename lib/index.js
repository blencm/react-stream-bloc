"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Bloc: () => Bloc_default,
  BlocBuilder: () => BlocBuilder_default,
  StreamBuilder: () => StreamBuilder_default,
  createContext: () => createContext2
});
module.exports = __toCommonJS(src_exports);

// src/core/bloc/Bloc.ts
var Bloc = class {
  internalState;
  listeners = [];
  constructor(initalState) {
    this.internalState = initalState;
  }
  get state() {
    return this.internalState;
  }
  changeState(state) {
    debugger;
    this.internalState = state;
    if (this.listeners.length > 0) {
      this.listeners.forEach((listener) => listener(this.state));
    }
  }
  subscribe(listener) {
    this.listeners.push(listener);
  }
  unsubscribe(listener) {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }
};
var Bloc_default = Bloc;

// src/core/bloc/BlocBuilder.tsx
var React = __toESM(require("react"));
var BlocBuilder = ({
  bloc,
  builder
}) => {
  const [state, setState] = React.useState(bloc.state);
  React.useEffect(() => {
    const stateSubscription = (state2) => {
      setState(state2);
    };
    bloc.subscribe(stateSubscription);
    return () => bloc.unsubscribe(stateSubscription);
  }, [bloc]);
  return builder(state);
};
var BlocBuilder_default = BlocBuilder;

// src/core/stream/StreamBuilder.ts
var React2 = __toESM(require("react"));
var import_rxjs = require("rxjs");
var StreamBuilder = class extends React2.Component {
  subscription;
  constructor(props) {
    super(props);
    this.state = {
      snapshot: {
        data: void 0,
        state: 0 /* none */
      }
    };
    this.subscription = import_rxjs.Subscription.EMPTY;
  }
  componentDidMount() {
    this.subscription = this.props.stream.subscribe(
      (snapshot) => this.setState({
        snapshot: { data: snapshot, state: 2 /* active */ }
      })
    );
  }
  componentWillUnmount() {
    this.subscription.unsubscribe();
  }
  render() {
    return this.props.builder(this.state.snapshot);
  }
};
var StreamBuilder_default = StreamBuilder;

// src/core/context/Context.tsx
var React3 = __toESM(require("react"));
function createContext2() {
  const context = React3.createContext(void 0);
  function useContext2() {
    const ctx = React3.useContext(context);
    if (!ctx)
      throw new Error("context must be inside a Provider with a value");
    return ctx;
  }
  return [context, useContext2];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Bloc,
  BlocBuilder,
  StreamBuilder,
  createContext
});
