# `react-stream-bloc`

The `react-stream-bloc` package contains only the functionality necessary to define Bloc models in JavaScript. Typically used in user interface components.

[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT)

## Install

Using npm:

```sh
npm install react-stream-bloc
```

## Usage example BlocBuilder

This UseState.ts file is where we add our states and their variables to handle events in the Bloc.

```javascript
interface InitialState {
  filter?: string;
}

interface LoadingState {
  type: "Loading";
}

interface LoadedState {
  type: "Loaded";
  data?: Array<User>;
}

interface ErrorState {
  type: "Error";
  message?: string;
}

export interface User {
  id: string;
  name: string;
}

export type UserState = (LoadingState | LoadedState | ErrorState) &
  InitialState;

export const UserInitialState: UserState = {
  type: "Loading",
};
```

Create UserBloc.ts, add any functions that update states.

```javascript
export class UserBloc extends Bloc<UserState> {
  private users: User[] = [];

  constructor(private data: User[]) {
    super(UserInitialState);
    this.loadCart()
  }

  private loadCart() {
    this.changeState(this.mapUserState(this.data));
  }

  addUser(data: User) {
    const exists = this.users.find((i) => i.id === data.id);

    if (exists) {
      const newUsers = this.users.map((oldUser) => {
        if (oldUser.id === data.id) {
          return { ...oldUser, data };
        } else {
          return oldUser;
        }
      });

      this.changeState(this.mapUserState(newUsers));
    } else {
      const newUsers = [...this.users, data];

      this.changeState(this.mapUserState(newUsers));
    }
  }

  updateUser(data: User) {
    const newUsers = this.users.map((oldUser) => {
      if (oldUser.id === data.id) {
        return { ...oldUser, data };
      } else {
        return oldUser;
      }
    });

    this.changeState(this.mapUserState(newUsers));
  }

  removeUser(data: User) {
    const newUsers = this.users.filter((i) => i.id !== data.id);
    this.changeState(this.mapUserState(newUsers));
  }

  mapUserState(users: Array<User>): UserState {
    this.users = users;

    return {
      type: "Loaded",
      data: users,
    };
  }
}
```

Create DependenciesProvider.ts, add the data you want to initialize and implement a class or function.

```javascript
import { UserBloc } from "./UserBloc";

export function provideUserBloc(): UserBloc {
  const bloc = new UserBloc([]); //Init your values
  return bloc;
}
```

UserContent.tsx is a component function.

This file is a child that will be listening or sending values using the UserBloc, all children that are listening will update the data sent or received.

```javascript
import * as React from "react";
import { BlocBuilder } from "react-stream-bloc";
import { useUserBloc } from "./App";
import { UserState, User } from "./UserState";
import { v4 as uuidv4 } from "uuid";

const UserContent = () => {
  const bloc = useUserBloc();
  const [name, setName] = React.useState < string > "";

  const handleAdd = () => {
    if (name) {
      const user: User = {
        id: uuidv4(),
        name: name,
      };

      bloc.addUser(user);
      setName("");
    }
  };

  return (
    <div style={{ margin: 30 }}>
      <div style={{ display: "flex" }}>
        <input
          type="text"
          value={name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setName(event.target.value)
          }
          style={{ marginRight: 20 }}
        />
        <button onClick={handleAdd}>Add user</button>
      </div>

      <BlocBuilder
        bloc={bloc}
        builder={(state: UserState) => {
          switch (state.type) {
            case "Loading": {
              return <div>Loading content</div>;
            }
            case "Error": {
              return <div>Error content</div>;
            }
            case "Loaded": {
              return (
                <div style={{ alignItems: "center" }}>
                  {state.data.length > 0 ? (
                    <div>
                      {state.data.map((item, index) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            padding: 5,
                          }}
                        >
                          <span>{item.name}</span>
                          <button
                            style={{
                              color: "white",
                              backgroundColor: "red",
                              border: 0,
                              marginLeft: 20,
                            }}
                            onClick={() => bloc.removeUser(item)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>Empty</>
                  )}
                </div>
              );
            }
          }
        }}
      />
    </div>
  );
};

export default UserContent;
```

In App.tsx add BlocProvider, you can add multiple providers in a list and initialize the value of DependenciesProvider.

```javascript
import * as React from "react";
import { BlocProvider, createContext } from "react-stream-bloc";
import { UserBloc } from "./UserBloc";
import { providerUserBloc } from "./DependenciesProvider";
import UserContent from "./Content";

const [userContext, userUse] = createContext<UserBloc>();

export const useUserBloc = userUse;

const App = () => {
  return (
    <BlocProvider
      providers={[
        <userContext.Provider value={providerUserBloc()} />,
        //<anyContext.Provider value={providerAnyBloc()} /> --- Add multiple providers
      ]}
    >
      <UserContent />
    </BlocProvider>
  );
};

export default App;
```

## Usage example StreamBuilder

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

## Contributing

Contributions are always welcome!

### Individuals

<a href="https://www.paypal.com/donate/?hosted_button_id=HF7VE43FW43NE"><img src="https://pics.paypal.com/00/s/NTY1NGQ2NjItZmUzZi00YzU3LTg0NzItYTcyZGJjZTFlYTFm/file.PNG?width=890"></a>

## Authors

- [@blencm](https://www.github.com/blencm)
