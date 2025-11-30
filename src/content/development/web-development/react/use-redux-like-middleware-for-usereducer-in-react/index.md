---
title: 'Use redux-like middleware for useReducer in React'
description: 'If you have used Redux before, you would be aware of the concept of middlewares. Now that useReducer has become a commonly used react hook, we might want to replicate the idea of middleware for the useReducer hook as well. If you do not know about middlewares, middlewares are functions&#46;&#46;&#46;'
pubDate: 'Jan 14, 2021'
heroImage: './hero.png'
categories: ["React"]
---

If you have used Redux before, you would be aware of the concept of middlewares. Now that useReducer has become a commonly used react hook, we might want to replicate the idea of middleware for the useReducer hook as well.

If you do not know about middlewares, middlewares are functions that run either before or after a state transition has taken place by the reducer. It enables us to opt-in for features such as logging, crash reporting, making asynchronous API requests, etc.

In this post, we will be creating a middleware for useReducer react hook. If you want to read more about the hook and reducers in general, refer to our previous post about the [useReducer React hook](https://www.wisdomgeek.com/development/web-development/react/understanding-the-usereducer-hook-in-react/).

## Possible approaches for creating the middleware for useReducer

We can implement the middleware functionality in one of two ways:

1. Writing an applyMiddleware function similar to redux. This function will take in the first parameter as the reducer, and we pass the middlewares as an array in the second parameter.
This would look something like this:

```
const useMyReducer = applyMiddleware(useReducer, [logging, thunks, ...]);
```

You can read more about this approach as part of this GitHub [issue](https://github.com/streamich/react-use/issues/164).  The final implementation can be found [here](https://github.com/streamich/react-use/blob/master/src/createReducer.ts).

2. We can create a [custom react hook](https://www.wisdomgeek.com/development/web-development/react/how-to-write-your-own-custom-react-hooks/) which internally implements useReducer and gives us the functionality of passing in the middlewares as a parameter.

We will be talking about the second approach in this blog post. The first approach is acceptable too. But my opinion is that if we are thinking in terms of hooks, we should move forward with respect to hooks instead of holding on to redux patterns.

## Single middleware for useReducer

Let us first define what this custom react hook that we will be building will look like. We will start with a single middleware. Later, we will move our way up to multiple middlewares by making our implementation generic.

Our middleware for useReducer will take in a reducer as a parameter, along with the initial state. It will also take a middleware as another parameter. Therefore, our hook will be of the form:

```
const useReducerWithMiddleware = (reducer,
  initialState,
  middleware,
) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  // TODO: middleware logic 
  return [state, dispatch];
};
```

For the invocation of the middleware function, calling it inside the hook after the useReducer declaration will not be adequate. We want the middleware function to be called every time dispatch is called. Therefore, we need to return a modified function instead of directly returning dispatch.

We can solve this by using higher-order functions. We will enhance the dispatch function by creating a higher-order function around it. We will then return the higher-order function from our hook.

```
const useReducerWithMiddleware = (reducer,
  initialState,
  middleware,
) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const dispatchUsingMiddleware = (action) => {
    middleware(action);
    dispatch(action);
  }
  return [state, dispatchUsingMiddleware];
};
```

Since we are returning the extended dispatch function from our custom hook, we ensure that the middleware is called whenever the caller calls our custom middleware for useReducer hook.

We can even add other information such as state to the middleware call.

```
const useReducerWithMiddleware = (reducer,
  initialState,
  middleware,
) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const dispatchUsingMiddleware = (action) => {
    middleware(action, state);
    dispatch(action);
  }
  return [state, dispatchUsingMiddleware];
};
```

## Multiple middlewares for useReducer

Let us expand on our previous implementation of middleware for useReducer to accept multiple middleware functions as an array.

Since all the middleware functions should be invoked before invoking dispatch, we will iterate through them all. Then, we will call dispatch.

```
const useReducerWithMiddleware = (reducer,
  initialState,
  middlewares,
) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const dispatchUsingMiddleware = (action) => {
    middlewares.map((middleware) => middleware(action, state));
    dispatch(action);
  }
  return [state, dispatchUsingMiddleware];
};
```

If we were doing some asynchronous middlewares, we would have to adapt this logic to use async/await. But we will keep that part out of scope for this post.

But what if we want middlewares that get executed after the state has transitioned, aka the after the dispatch call?

## Middlewares after state change

If you think that we will create another input array for middlewares to be executed after the dispatch, you are absolutely correct!

However, if you thought about calling these functions right after the dispatch call, like:

```
const useReducerWithMiddleware = (reducer,
  initialState,
  middlewares,
  afterDispatchMiddleWares
) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const dispatchUsingMiddleware = (action) => {
    middlewares.map((middleware) => middleware(action, state));
    dispatch(action);
    afterDispatchMiddleWares.map((middleware) => middleware(action, state));
  }
  return [state, dispatchUsingMiddleware];
};
```

Then sadly, this would not work.

Could you think of a reason why?

It is because dispatch updates the state asynchronously.

What could be done instead?

We can wait for the state to be updated and have a callback function afterwards to handle this. We can use the [useEffect hook](https://www.wisdomgeek.com/development/web-development/react/react-hooks-and-local-storage-lets-build-a-todo-app/) to achieve this.

```
const useReducerWithMiddleware = (reducer,
  initialState,
  middlewares,
  afterDispatchMiddleWares
) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    afterDispatchMiddleWares.map((middleware) => middleware(action, state));
  }, [afterDispatchMiddleWares]);

  const dispatchUsingMiddleware = (action) => {
    middlewares.map((middleware) => middleware(action, state));
    dispatch(action);
  }
  return [state, dispatchUsingMiddleware];
};
```

But we do not have access to the action inside useEffect anymore. So we will need to use a ref instance variable by making use of the [useRef hook](https://www.wisdomgeek.com/development/web-development/react/understanding-the-useref-react-hook/). We will write the value of the action to the ref variable before calling dispatch. And then its value will be available to us inside the effect.

```
const useReducerWithMiddleware = (reducer,
  initialState,
  middlewares,
  afterDispatchMiddleWares
) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const currentRef = useRef();
  useEffect(() => {
    if (!currentRef.current) return;
    afterDispatchMiddleWares.map((middleware) => middleware(currentRef.current, state));
  }, [afterDispatchMiddleWares, state]);

  const dispatchUsingMiddleware = (action) => {
    middlewares.map((middleware) => middleware(action, state));
    currentRef.current = action;
    dispatch(action);
  }
  return [state, dispatchUsingMiddleware];
};
```

And that completes our implementation for applying middlewares using useReducer. We can now run middlewares before and after state transitions happen in React hooks.

## An example of using the middlewares

Let us build a basic increment counter reducer which only increments the count value. For simplicity, our reducer will always increment the count irrespective of what action is passed in. We will add two middlewares to our reducer. One will log the state before the action, and the other will log the state after it.

```
import useReducerWithMiddleware from "./useReducerWithMiddleware";

export default function App() {
  let reducer = (state) => {
    return { count: state.count + 1 };
  };
  const logPreviousState = (action, state) => {
    console.log(`count before ${action}: ${state.count}`);
  };
  const logFutureState = (action, state) => {
    console.log(`count after ${action}: ${state.count}`);
  };
  const [state, dispatch] = useReducerWithMiddleware(
    reducer,
    { count: 0 },
    [logPreviousState],
    [logFutureState]
  );
  return (
    div className="App">
      span>{state.count}span>
      button onClick={() => dispatch("increment")}>Increment Countbutton>
    div>
  );
}
```

Now, once we run the application and click the increment button a couple of times, we will get the console output:

```
count before inc: 0 
count after inc: 1 
count before inc: 1 
count after inc: 2 ​
```

And thus, we have added logging as a middleware to our useReducer function!

Let us know in the comments if you have any queries.
