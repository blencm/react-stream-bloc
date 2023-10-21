# `react-stream-bloc`

The `react-stream-bloc` package contains only the functionality necessary to define Bloc models in JavaScript. Typically used in user interface components.

[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT)

## Install

Using npm:

```sh
npm install react-stream-bloc
```

## Usage

## Stream

### Step 1

As you can see now, increase() and decrease() methods are called directly within the UI component. However, output data is handle by a stream builder.

```javascript
import { Fragment } from "react";

import { StreamBuilder } from "react-stream-bloc";

const Counter = ({ bloc }) => (
  <Fragment>
    <button onClick={() => bloc.increase()}>+</button>
    <button onClick={() => bloc.decrease()}>-</button>
    <lable size="large" color="olive">
      Count:
      <StreamBuilder
        initialData={0}
        stream={bloc.counter}
        builder={(snapshot) => <p>{snapshot.data}</p>}
      />
    </lable>
  </Fragment>
);

export default Counter;
```

### Step 2

In the app.js file, the BLoC is initialized using the CounterBloc class. Thus, the Counter component is used by passing the BLoC as a prop.

```javascript
import React, { Component } from "react";
import Counter from "./components/Counter";
import CounterBloc from "./blocs/CounterBloc";

const bloc = new CounterBloc();

class App extends Component {
  componentWillUnmount() {
    bloc.dispose();
  }
  render() {
    return (
      <div>
        <Counter bloc={bloc} />
      </div>
    );
  }
}
export default App;
```
