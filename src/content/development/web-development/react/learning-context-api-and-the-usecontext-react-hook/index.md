---
title: 'Learning context API and the useContext React hook'
description: 'In this react hooks series, we have already explored the react hooks useState, useEffect, and useReducer. The next react hook we will look into is the useContext hook. As we saw while building our sample application, we had to lift the state up to our root component in order to&#46;&#46;&#46;'
pubDate: 'Sep 15, 2020'
updatedDate: 'Oct 11, 2023'
heroImage: './hero.jpg'
author: 'Saransh Kataria'
categories: ["React"]
categoryHierarchy: ["Development","Web Development","React"]
---

In this react hooks series, we have already explored the react hooks [useState, useEffect](https://www.wisdomgeek.com/development/web-development/react/react-hooks-and-local-storage-lets-build-a-todo-app/), and [useReducer](https://www.wisdomgeek.com/development/web-development/react/understanding-the-usereducer-hook-in-react/). The next react hook we will look into is the useContext hook.

As we saw while building our sample application, we had to lift the state up to our root component in order to be able to share it among multiple children components. We then passed in the corresponding state objects to the children components as props to have shared state and a single source of truth at the parent level.

This problem was initially solved by using third-party libraries for state management such as Redux. But in React 16.3, the React team introduced an official context API.

## The React context API

Now that context API is built directly into the react library, we can use this context API to avoid the problem of passing data down through multiple layers of components. The context API makes it possible to pass data through components without having the need to pass props down manually through every level of the component tree.

Thus context is useful when the same data is needed by many components at different levels of a React application. It is worth noting that it makes component reuse a bit more difficult, so it should be used sparingly.

Context lets you broadcast data and changes to that data to components that have subscribed to it.

### Context Object

To start using the API, we need to create a context object:

```
const MyContext = React.createContext(defaultValue);
```

This object will be our source of values to components that subscribe to it. Whenever React is going to render a component that has subscribed to a context object, it will read it's value from the nearest Provider above it in the tree.

### Context Provider

Every context object comes with a Provider component which, as the name suggests, provides the value of the context object to all children components. It also allows the consuming components to subscribe to changes in the context value. It can be declared as:

```
MyContext.Provider value={/* some value */}>
```

A provider can be connected to more than one consumers and providers can be nested as well. They might override values deeper in the tree since the subscribers consume values from the nearest provider.

### The useContext react hook

Now that we have a provider, we can start consuming the assigned value.

```
const value = useContext(MyContext);
```

Making use of the useContext hook, we subscribe to the context object and any changes that are made to it. The value that we receive from the useContext hook will always be equal to the value being passed from the nearest provider in the tree. If there is no provider above the component, the value will be equal to the default value that was passed to createContext().

All subscribers/consumers of a provider are re-rendered whenever the value prop of the provider is changed.

Now that we understand the context API, let us get into using it with hooks.

## Putting it all into place in our sample To-Do list application

If you have not been following along our sample to-do list application, you can find the code that we have built [here](https://github.com/saranshkataria/todo-list-react-hooks-demo/tree/d2f2c98c1b9918eac8a909a3d8153497ff289156). We will now start hooking in the context API to pass the items using the context API instead of passing them as props from the App component. We will use the useContext hook for doing so, but we first need to create the context object.

So, we will create a new context folder and in it, we will add an items context file:

```
import React from 'react';

const ItemsContext = React.createContext();

export { ItemsContext as default };
```

Next, we will hop into our App component to create a provider for the context object that we created.

The render function part of the component changes from:

```
return (
    div className="App">
      header className="App-header">
        To Do items
        ItemList items={items} removeItem={removeItem} />
        AddItemForm addItem={addItem} />
      header>
    div>
  );
```

to:

```
return (
    ItemsContext.Provider>
      div className="App">
        header className="App-header">
          To Do items
          ItemList items={items} removeItem={removeItem} />
          AddItemForm addItem={addItem} />
        header>
      div>
    ItemsContext.Provider>
  );
```

### What do we want to share using the context API?

We need to provide the value to the provider now. But what do we want to share among components? That is up to us. In this instance, we want to share the items so that components that need it can access it. And we also want to share the items dispatch function as well, so that components that need to change the components data can do so.

Doing so will remove the need for all the props that we are passing from the App component right now.

Thus, we will create an object with those two properties on it, which will also be the default value for our context object. Thus, the initialization of the context object changes to:

```
const ItemsContext = React.createContext({
  items: [],
  itemsDispatch: () => {},
});
```

and the provider gets the value as:

```
ItemsContext.Provider value={{ items, itemsDispatch }}>
```

With this in place, we do not need to pass in any props to the ItemList and AddItem components. It is now upto them to extract what they need from the context API using the useContext hook.

### Refactoring the ItemList component

The item list component no longer needs items as a prop. We can refactor it to get the items using the useContext react hook. We will refactor this first, and then see if we can also remove the removeItem prop later.

Since we will be using the useContext hook, we will need to import that in the ItemList component as well as the items context that we had created since useContext needs that too.

```
const ItemList = ({ items, removeItem }) => {
  return (
    div className="items-container">
      ul>
        {items.map((item) => (
          li>
            Item key={item} item={item} removeItem={removeItem} />
          li>
        ))}
      ul>
    div>
  );
};
```

will be changed to:

```
const ItemList = ({ removeItem }) => {
  const { items } = useContext(ItemsContext);

  return (
    div className="items-container">
      ul>
        {items.map((item) => (
          li>
            Item key={item} item={item} removeItem={removeItem} />
          li>
        ))}
      ul>
    div>
  );
};
```

### Removing the remove item prop

Notice that the remove item function is eventually calling the dispatch function in our application. And we have already added that function to the context object. So we can remove that prop as well, and refactor our Item component too.

```
const Item = ({ item, removeItem }) => {
  return (
    div>
      span>{item}span>
      button onClick={() => removeItem(item)}>Xbutton>
    div>
  );
};
```

Can now be changed to:

```
const Item = ({ item }) => {
  const { itemsDispatch } = useContext(ItemsContext);

  return (
    div>
      span>{item}span>
      button
        onClick={() =>
          itemsDispatch({ type: 'REMOVE_ITEM', itemToBeDeleted: item })
        }
      >
        X
      button>
    div>
  );
};
```

You can see all the changes until now [here](https://github.com/saranshkataria/todo-list-react-hooks-demo/commit/8a0eee1191050fa1754f96d0a283d21b282a6bc8) and the code until now [here](https://github.com/saranshkataria/todo-list-react-hooks-demo/tree/8a0eee1191050fa1754f96d0a283d21b282a6bc8).

Now that we have combined our useContext with useReducer, we have created our own mini version of Redux. We are sharing our dispatch function and the application data in our store just like we do with Redux. This does not make Redux obsolete and there are use cases for using it. But for smaller applications, useContext and useReducer are sufficient to get the job done without relying on any third-party packages.

### Refactoring the AddItemForm component

This will be fairly similar to what we did above for the ItemList component. If you are interested, you can see the changes for this component [here](https://github.com/saranshkataria/todo-list-react-hooks-demo/commit/8a0eee1191050fa1754f96d0a283d21b282a6bc8).

Once we are done, we will see that we are no longer passing any props to our children components at all. We rely on useContext to get state from the context API and solve our initial problem of passing props down.

The final code for this application can be found on [GitHub](https://github.com/saranshkataria/todo-list-react-hooks-demo). If you have any questions, feel free to drop a comment below. If there is any other hook you want us to cover next, let us know.
