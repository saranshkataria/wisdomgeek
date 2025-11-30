---
title: 'Understanding the useReducer hook in React'
description: 'Building upon our React hooks introduction from our previous post on understanding React hooks (useState and useEffect), we will look at the useReducer hook in this post. useReducer hook can be an alternative to useState (in fact, useState uses useReducer internally). Before getting into how to use the useReducer hook,&#46;&#46;&#46;'
pubDate: 'Sep 01, 2020'
heroImage: './hero.png'
categories: ["React"]
---

Building upon our React hooks introduction from our previous post on [understanding React hooks (useState and useEffect)](https://www.wisdomgeek.com/development/web-development/react/react-hooks-and-local-storage-lets-build-a-todo-app/), we will look at the useReducer hook in this post. useReducer hook can be an alternative to useState (in fact, useState uses useReducer internally). Before getting into how to use the useReducer hook, we should understand what is meant by a reducer.

## What is a reducer?

If you are coming from a redux background, you can probably skip this section. But for those who are not, let us first understand what a reducer is and what is the need for it. Then we will dive into the useReducer hook.

The first principle that we should remember before getting into a reducer is that the state is represented as a single immutable tree. So whenever we make a change to state, it is an explicit change. Typically, we use the setState function to make changes to the state. When using redux, we will not be making these changes directly to the state. We will instead be using reducers, which are functions that determine how to change the application state. For making changes to the application state, we will call these reducers with an action to specify what happened.

Let us consider a simple counter example:

```
function Counter({initialCount}) {
  const [count, setCount] = useState(initialCount);
  return (
    
      Count: {count}
      button onClick={() => setCount(initialCount)}>Resetbutton>
      button onClick={() => setCount(prevCount => prevCount - 1)}>-button>
      button onClick={() => setCount(prevCount => prevCount + 1)}>+button>
    
  );
}
```

There are two actions that are happening here: increment and decrement. So we can abstract them out into a reducer function that takes an action as an argument:

```
function reducer(count, action) {
  switch (action) {
    case 'increment':
      return count + 1;
    case 'decrement':
      return count - 1;
  }
}
```

An action is the minimal representation of the change to application data (or state).

## Why do we need reducers?

The first question that comes to mind is, why do we need reducers or actions? Even though it is redundant in our counter example, but for larger applications, there can be a lot of state-related operations happening everywhere. So, instead of having these spread out all across our application, and inside different components, we move it all into a reducer function. The reducer function then becomes a single source of truth for all application state-related changes. Thus a reducer takes in two arguments, state, and action, and returns the new state of the application.

```
(state, action) => newState
```

And all the different actions across the application are now in a single place, and the reducer function updates state according to the action it receives. The reducer is also a pure function, that is it does not have any side-effects.

Overall, all these properties of the reducer function make it perfect for testing state changes independently and in isolation. The same input should always return the same output.

## The action in a reducer function

Even though we touched on the action above, it was a simplified version of what action looks like. Sometimes, we want to pass in a value along with the action as well. If we were to increment by 5 instead of 1, our previous example would require a different action altogether. 

Instead, a standard has been laid out for actions. The only requirement is that the action is an object that has a type property defining what the action is. Also, the value of the type property should not be undefined. It can be an object as well, but the best practice is to use a string because strings are serializable. Any additional information can be passed in as different properties.

Putting all of this together, our updated reducer would now look like:

```
const initialState = {count: 0};

function countReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}
const newState = countReducer(initialState, 'increment') // returns {count: 1}
countReducer(newState , 'decrement') // returns {count: 0}
```

With all this in place, the component does not need to know anything about updating the state. All the components need to know is that they will dispatch an action with the type of what happened, and the reducer will take care of everything else. Thus we achieve more maintainable code that adheres to the single responsibility principle.

## React's useReducer hook

Now that we have an understanding of reducer functions, we can dive into the useReducer hook implementation. As we have already seen, the useReducer hook is useful for managing complex state and state transitions.

Another benefit of the reducer is to not have to pass props manually around from parent components to child components. This is possible because all the state-related logic is defined inside the reducer function. And the child component only needs to call the reducer function with the appropriate action.

Before we start using the useReducer hook, we need to have the reducer defined. We already did that above for our counter example. Next, we can reduce the useState call with useReducer and pass the reducer to it and the initial state that we want to assign.

```
const initialState = {count: 0};
const [state, dispatch] = useReducer(reducer, initialState);
```

Like useState, useReducer returns an array of two variables. The first one refers to the current state of the application, and the second is a dispatch function that we can use to send actions to the reducer. Invoking the dispatch function would change the state of the application, depending on the action that we invoke it with. Thus our counter example would get converted into the following code using the useReducer hook:

```
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    case 'reset':
      return initialState;
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    
      Count: {state.count}
      button onClick={() => dispatch({type: 'reset'})}>Resetbutton>
      button onClick={() => dispatch({type: 'decrement'})}>-button>
      button onClick={() => dispatch({type: 'increment'})}>+button>
    
  );
}
```

It is also important to note that React guarantees that the calls to the dispatch function are stable and will not change on re-renders. Therefore we do not need to put it in the useEffect dependency list.

## Applying useReducer hook to our To-Do list application

Let us now apply the hook to our ToDo list application that we had built in the previous blog post.

We will define an items reducer as follows:

```
const itemsReducer = (state, action) => {
  switch (action.type) {
    case 'POPULATE_ITEMS':
      return action.items;
    case 'ADD_ITEM':
      return [...state, action.item];
    case 'REMOVE_ITEM':
      return state.filter((item) => item !== action.itemToBeDeleted);
    default:
      return state;
  }
};
```

The three actions correspond to fetching of data, adding an item, and removing an item. These are self-explanatory in what we are trying to do here with respect to the action type that we receive. Next, we will start making use of this reducer in our App component. We will replace useState with our useReducer hook

```
const [items, itemsDispatch] = useReducer(itemsReducer, []);
```

We can name the first (state) variable whatever we want it to be. It is better to be more explicit about what it refers o since there might be multiple reducers in an application. So we did not name it state as we did in our example before.

Now that we have access to our state variable and dispatch function, we can use them in our component. Getting into our first useEffect call:

```
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('items'));
    if (items) {
      setItems(items);
    }
  }, []);
```

We no longer have access to setItems. But we created an action POPULATE_ITEMS in our reducer to populate the items which can be used here. So we will invoke our dispatch function here instead:

```
useEffect(() => {
  const items = JSON.parse(localStorage.getItem('items'));
  if (items) {
    itemsDispatch({ type: 'POPULATE_ITEMS', items });
  }
}, []);
```

When we invoke this dispatch function, it will invoke our reducer with action type POPULATE_ITEMS.  And since we passed in the items (using the shorthand notation), the items reducer returns those items and saves them in the application state.

For the other useEffect where we were saving items to state, we do not need to do anything since we were not doing any state manipulation.

Next, we will do the same thing for the other actions that we have, that is adding an item and removing an item.

```
const addItem = (item) => {
  // setItems([...items, item]);
  // becomes:
  itemsDispatch({ type: 'ADD_ITEM', item });
}

const removeItem = (itemToBeDeleted) => {
    // setItems(items.filter((item) => itemToBeDeleted !== item));
    // becomes
    itemsDispatch({ type: 'REMOVE_ITEM', itemToBeDeleted });
  };
```

And that concludes our refactoring to use useReducer hook in our code.

You can find the code changes [here](https://github.com/saranshkataria/todo-list-react-hooks-demo/commit/d2f2c98c1b9918eac8a909a3d8153497ff289156) and the final code [here](https://github.com/saranshkataria/todo-list-react-hooks-demo/tree/d2f2c98c1b9918eac8a909a3d8153497ff289156).

We will discuss the [context API and the useContext hook](https://www.wisdomgeek.com/development/web-development/react/learning-context-api-and-the-usecontext-react-hook/) in the next post, and that will finish our to-do application. If there is something else you want us to cover, do drop a comment below to let us know!
