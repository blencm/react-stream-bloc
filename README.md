# `react-stream-bloc`

The `react-stream-bloc` package contains only the functionality necessary to define Bloc models in JavaScript and TypeScript. Typically used in user interface components.

[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT)

## Install

Using npm:

```sh
npm install react-stream-bloc
```

## Documentation

The basic idea behind the Bloc pattern is simple. Business logic will be isolated from UI components. First, they will use an observer to send events to the Bloc. The Bloc will then notify UI components via observables after processing the request.

### Adaptability for updating the application's logic

The impact on the application is minimal when the business logic is separated from the UI components. You may alter the business logic whenever you want without impacting the UI components.

### Repurpose logic

Because the business logic is in one location, UI components may reuse logic without duplicating code, increasing the app's simplicity.

### Scalability

Application needs may evolve over time, and business logic may expand. In such cases, developers can even construct many BloCs to keep the codebase clear.



## Usage example BlocBuilder

<a href="https://codesandbox.io/s/react-stream-bloc-example-qk3kjy"><img src="https://uploads.codesandbox.io/uploads/user/193b58fe-97f6-4cde-9078-6bb2dc49b95d/WT71-CodeSandbox.png"></a>

Create a state file and add your variables as you like.

```javascript
export interface User {
  id: string;
  name: string;
}

export type UserState = {
  loading: boolean;
  adding?: boolean;
  data: User[];
  message?: string;
};

export const UserInitialState: UserState = {
  loading: false,
  data: [],
};
```

Create a Bloc class file and add your functions, to change state always add `this.changeState(...)`

```javascript
import { Bloc } from "react-stream-bloc";
import axios from "axios";

axios.defaults.baseURL = 'http://localhost:4000/api/';

export class UserBloc extends Bloc<UserState> {
  private users: User[] = [];

  constructor() {
    super(UserInitialState);
  }

  async getUsers() {
    this.changeState(...this.state, loading: true);

    await axios.get("users")
      .then((response) => {
        this.changeState(this.mapToLoadedState(response.data));
      })
      .catch((err) => {
        this.changeState(...this.state, loading: false, message: err.toString());
      });
  }

  async addUser(data: User){
    this.changeState(...this.state, adding: true);
        await axios.post("user", data)
      .then((response) => {
        if(response.status === 200){
          const user = response.data as User;
          const newUsers = [user].concat(this.users);
          this.changeState(this.mapToLoadedState(newUsers));
        }else{
          this.changeState(...this.state, adding: false);
        }
      })
      .catch((err) => {
        this.changeState(...this.state, adding: false, message: err.toString());
      });
  }

  mapToLoadedState(users: User[]): UserState {
    this.users = users;
    return {
      loading: false,
      adding: false,
      data: this.users,
    };
  }
}
```

Create a dependency provider file, here you initialize the data when your application is opened. If you want to extend the data initialization of a class or function, Easily insert it into your Bloc file.

```javascript
export function provideUserBloc() {
  const bloc = new UserBloc();
  return bloc;
}
```

Create a provider file.

```javascript
import { createContext } from "react-stream-bloc";

const [userContext, useUser] = createContext<UserBloc>();

const useUserBloc = useUser;
export { userContext, useUserBloc };
```

### Implementing UI components.

This file is a child that will be listening or sending values using the Bloc, all children that are listening will update the data sent or received.

```javascript
import { BlocBuilder } from "react-stream-bloc";

export const UserContent = () => {
  const bloc = useUserBloc();

  const handleAdd = () => {
    const user: User = {
      id: "id",
      name: "Stream Bloc",
    };
    bloc.addUser(user);
  };

  return (
    <div style={{ margin: 30 }}>
      <BlocBuilder
        bloc={bloc}
        builder={(state: UserState) =>
          <div>
          <button onClick={state.adding ? null : handleAdd}>{state.adding ? 'Loading...' : 'Add'}</button>
          {state.loading ? <div> Loading... </div> : <div> {content} </div>}
          </div>
        }
      />
    </div>
  );
};
```

In App add BlocProvider, you can add multiple providers in a list and initialize the value of DependenciesProvider.

```javascript
import { BlocProvider } from "react-stream-bloc";
import { userContext } from "./UserProvider";

const App = () => {
  return (
    <BlocProvider
      providers={[<userContext.Provider value={providerUserBloc()} />]}
    >
      <UserContent />
    </BlocProvider>
  );
};

export default App;
```

## Authors

- [@blencm](https://www.github.com/blencm)
