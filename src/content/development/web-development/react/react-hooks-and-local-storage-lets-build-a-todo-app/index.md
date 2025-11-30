---
title: 'React Hooks and Local Storage: Let&#8217;s build a ToDo app'
description: 'React hooks have been around for quite some time. They have been widely adopted by the React community since then and have started becoming the defacto for newer React applications. A react hook allows developers to hook into React features. React hooks allow building components by using functions instead of&#46;&#46;&#46;'
pubDate: 'Aug 25, 2020'
heroImage: './hero.jpg'
categories: ["React"]
---

React hooks have been around for quite some time. They have been widely adopted by the React community since then and have started becoming the defacto for newer React applications.

A react hook allows developers to hook into React features. React hooks allow building components by using functions instead of classes. They also give us the ability to have state in functional components. As well as they provide a way to have life-cycle methods inside functional components.

In this post, we will learn about two hooks (useState and useEffect) by building a ToDo application. These are the two most basic hooks along with useContext which will be a different blog post of its own. Some basic understanding of React is required to follow along with this coding tutorial. Let's start writing some code!

## Initial setup before getting into React Hooks

We will be using Create React App to build this simple application. Assuming we have bootstrapped a new application using either of the commands:

```
npx create-react-app todo-list-react-hooks-demo
```

or

```
yarn create react-app todo-list-react-hooks-demo
```

We can then open the directory, and then start working in here. Before getting started with the hooks part of the application, let us have the skeleton for the To-Do application in place. We will be having two different sections on the page. The top one will be for displaying the existing items in the to-do list and the bottom one will be to add items to the above list. Let us start with the top section and create it without any hooks related functionality.

### Item component

We will create an Item component that will be used to display the item. This will be a presentational component which takes the item as a prop and display it.

```
import React from 'react';

const Item = ({ item }) => {
  return (
    div>
      span>{item}span>
    div>
  );
};

export { Item as default };
```

### ItemList component

We will also create an ItemList component that will contain a list of all the items that we have in the application. This will take the items as a prop and display them as an unordered list. It will make use of the Item component that we created before for displaying individual elements.

```
import React from 'react';
import Item from './Item';

const ItemList = ({ items }) => {
  return (
    div className="items-container">
      ul>
        {items.map((item) => (
          li>
            Item key={item} item={item} />
          li>
        ))}
      ul>
    div>
  );
};

export { ItemList as default };
```

Now that we have those setup, all we need is to hook them up in the Application component and pass the items as props to the ItemList.

### App component

For the initial setup, we will assume we have a list of items as an array. We will make this dynamic in the next section.

```
import React from 'react';
import ItemList from './ItemList';

const App = () => {
  const items = ["item 1", "item 2"]
  return (
    div className="App">
      header className="App-header">
        To Do items
        ItemList items={items} />
      header>
    div>
  );
}
```

These should complete our initial setup of the application. If we run `yarn start` at this point, we will see an unordered list containing item 1 and item 2 on the screen. The App component is where we will have all our state-related information. It is our smart component with information about the application state. Now that we have the boilerplate ready, it is time to hook things in!

## First React hook: useState

The first hook that we will be looking into is the useState hook. As the name suggests, it allows us to hook state into our functional component.

As opposed to state in class components, useState by default works with primitive values. It can work with object values as well but is preferred only when the properties in the object are related to one another. Otherwise, we can use primitives directly and create multiple react hooks for multiple variables if needed.

For using this hook, we need to import it from the react library. We can then initialize it like this:

```
const [state, setState] = useState(initialState);
```

The initial value is what we want to assign to the variable and passing it to the useState function will return an array. The first value in this array will be the current value of the state object that will get created (initialState in this case). And the second value in the array will be a setter function that allows us to modify this state variable. We can technically name this anything we want since these are just variables, but following conventions is always a good practice.

**Note:** React hooks always need to be declared at the top of a function. This also helps preserve state in between all rendering that is happening for the component.

Now that we have an understanding of the useState React hook, we can use it in our ToDo application. We will replace the initialization of items to:

```
const [items, setItems] = useState(['item 1', 'item 2']);

```

This will have no impact in terms of what we would see on the application, but we now have the items in a state variable instead of it being a plain variable before. We also have a setter function that we will use to update these items as we build on this functionality.

The code until this point can be found [here](https://github.com/saranshkataria/todo-list-react-hooks-demo/tree/9dd440ba53f5aa8c14933968b38ae65487a8e55d).

### Add a to-do item functionality

Now that we have the items as a state variable, we can modify it in functions using the setter function. So let us create the second section of our application which allows creating to-do list items.

We will create a different component for this. This component will have a form with an input field which will allow the user to enter the content of the new item that is to be added. It will also have a button which will add the item to the list. Since we want all state to be in the parent component, we will let the parent component pass in a function as a prop. This function will be invoked whenever the user clicks on the add item button. We will also clear out the text box after adding the item to the list.

We also need a variable to store the item as the user types in the input text box. For this, we will create an item state which will be local to this component. And what better than using our new friend useState?

The AddItemForm component will then look like:

```
import React, { useState } from 'react';

const AddItemForm = ({ addItem }) => {
  const [item, setItem] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addItem(item);
    setItem('');
  };

  return (
    div>
      p>Add itemp>
      form onSubmit={handleSubmit}>
        input value={item} onChange={(e) => setItem(e.target.value)} />
        button>Add Itembutton>
      form>
    div>
  );
};

export { AddItemForm as default };
```

Now that we have the functionality to add an item, we can modify our App component to declare the addItem function and also import the AddItemForm function that we just created.

Ideally, the function to add an item should check for duplicates, but for the sake of simplicity, we will assume that there are no duplicates and just add the newly created item to our items array.

```
const addItem = (item) => {
    // assuming no duplicates for demo purposes
    setItems([...items, item]);
  };

```

We have destructured the existing items array, added the newly created item at the end of the array, and passed this new array to our setItems function that we learned about earlier. People experienced with React should find this syntax familiar. There is not a lot of React hooks related stuff happening here apart from the setter function that we already know about by now.

We can also remove the default values from the useState initialization since we have everything in place to add new items using the application now.

If you want to take a peek at the code until this point, you can browse it [here](https://github.com/saranshkataria/todo-list-react-hooks-demo/tree/9f754bfa006dbae17e4bdf7ce46fc1acd7d2f172).

### Removing an item

Similar to the adding an item functionality, we will pass a remove item function from the parent component to the item list component which will be passed down to the item component. The item component will have a delete button denoted by an "X" and whenever the user clicks it, we will invoke this function to delete the item. The updated item component will now be:

```
import React from 'react';

const Item = ({ item, removeItem }) => {
  return (
    div>
      span>{item}span>
      button onClick={() => removeItem(item)}>Xbutton>
    div>
  );
};

```

The ItemList component will have a similar change of taking the remove item prop in and passing it to the Item component. Then, we will define the remove item function in the parent component as:

```
const removeItem = (itemToBeDeleted) => {
    setItems(items.filter((item) => itemToBeDeleted !== item));
  };
```

Since we assumed items to be unique, we can use the filter method to remove that item and then pass the filtered array to setItems. Again, not much new react hooks magic happening here. Pretty standard react code.

This brings us to the end of our introduction to useState and we have a working to-do application now. We can add items, remove them, and the application UI displays all of them accordingly.

The code until this point is available [here](https://github.com/saranshkataria/todo-list-react-hooks-demo/commit/c8eaa34b48a5ac399b58c8f1cea659b1d9e23daa).

We will learn about another hook next. We will add the functionality to persist these items to local storage so that they persist after the browser is refreshed.

## The useEffect hook

The useEffect hook is somewhat similar to the life-cycle methods that we are aware of for class components. It runs after every render of the component including the initial render. Hence it can be thought of as a combination of componentDidMount, componentDidUpdate, and componentWillUnmount.

If we want to control the behavior of when the effect should run (only on initial render, or only when a particular state variable changes), we can pass in dependencies to the effect to do so. This hook also provides a clean-up option to allow cleaning up of resources before the component is destroyed.

Before getting into the details, let us see the basic syntax of the effect:

```
useEffect(didUpdate);
```

Here, didUpdate is a function that performs effects (mutations, subscriptions, timers, logging, etc.). It will get triggered after the component is rendered to the screen as well as on every subsequently completed render.

Getting back to our to-do application, let us put this in use to set the to-do data to local storage whenever we update the items in the ToDo list. In the App component, we will add:

```
useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  });
```

This sets a key-value pair in our local storage with the key being items and the value being a JSON representation of our items.

Next, when we are initializing the items in the app component, we will first check if there are any items in local storage or not. If there are, we will pass those to the setState function, else we will default to an empty array.

So the following piece of code:

```
const [items, setItems] = useState([]);
```

becomes:

```
const saveditems = JSON.parse(localStorage.getItem('items'));
const [items, setItems] = useState(saveditems || []);
```

We passed the same key (items) to localStorage.getItem as the one we had used before when we were storing them into local storage. Now, the application will check local storage first whenever the application is loaded (App component is rendered). If it finds some items in local storage, we will initialize them in our state, else we will initialize it with an empty array.

This should get our application up and running.

Since loading from local storage is a synchronous process, our code works fine. But if we were to use an asynchronous method of loading the items, we would have had to use the useEffect hook for that as well. So let us do that next.

```
const [items, setItems] = useState([]);
useEffect(() => {
    const items = JSON.parse(localStorage.getItem('items'));
    if (items) {
      setItems(items);
    }
  });
```

The above transformation seems like it should work, but it does not.

Can we think of the reason?

Since useEffect runs every time a component is rendered, and we are calling set items inside the effect, it will trigger another render of the component, which triggers useEffect again. And the cycle goes on. We have a circular reference issue here. This is where the dependencies that we discussed previously come into play.

### Conditionally firing useEffect 

The useEffect hook takes in a second argument which is an array of values that the effect depends on. This way, useEffect is only triggered again if one of these values changes.

#### Calling useEffect only when a specific value changes

Using the dependency array, we can pass in the state variable to useEffect to make it fire useEffect only when the variable's value changes.

```
useEffect(() => {
    const items = JSON.parse(localStorage.getItem('items'));
    if (items) {
      setItems(items);
    }
  }, [items]);
```

Thus, this will solve our problem of circular reference and we are good to go. But we can do better!

Since we only want the values to be loaded from local storage on the initial application render, we need something like componentDidMount.

#### Calling useEffect only once on component render

We can pass an empty array to useEffect as the second parameter to tell React to only run that effect only once. This tells React that the effect does not render on any values from prop or state and thus it gets executed only once on the initial render and never again after that.

```
useEffect(() => {
    const items = JSON.parse(localStorage.getItem('items'));
    if (items) {
      setItems(items);
    }
  }, []);
```

Thus we get to the desired result of loading from local storage only once on application load and this solves all our optimization problems too.

Now that we know about the dependency array, it will be a good practice to add it to the effect that we were using to save the items to save to local storage as well.

```
useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);
```

This also helps us understand why we did not merge the two calls in one single useEffect function. Since we have different conditions to trigger these effects on, we create multiple useEffect react hooks for them. This also helps keep all related code in a single function block and makes it more readable and maintainable.

Our App component will finally look like this:

```
import React, { useEffect, useState } from 'react';
import AddItemForm from './AddItemForm';
import './App.css';
import ItemList from './ItemList';

function App() {
  const [items, setItems] = useState([]);
  const addItem = (item) => {
    // assuming no duplicates for demo purposes
    setItems([...items, item]);
  };

  const removeItem = (itemToBeDeleted) => {
    setItems(items.filter((item) => itemToBeDeleted !== item));
  };

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('items'));
    if (items) {
      setItems(items);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);

  return (
    div className="App">
      header className="App-header">
        To Do items
        ItemList items={items} removeItem={removeItem} />
        AddItemForm addItem={addItem} />
      header>
    div>
  );
}

export default App;
```

### Cleaning up resources used in useEffect

Though this is something we will not be needing for our small application. But it is a common practice to clean up resources when a component is being unmounted. In a class-based scenario, we used the componentDidUnmount method to do so.

useEffect provides a similar functionality too. And since we will be doing all our side effects related computations inside an effect. It makes sense to have the cleanup code inside the same function as well. That makes everything reside inside a single function, increasing readability and maintainability overall.

To do so, we return a function from the function that we pass to useEffect.

```
useEffect(( {source} ) => {
  const subscription = source.subscribe();
  return () => {
    // Clean up the subscription
    subscription.unsubscribe();
  };
});

```

The clean-up function is then executed whenever the component will be removed from the UI. Thus preventing memory likes like we are used to in React applications. This also ensures cleaning up of resources in case of multiple renders of the component.

We will not be using this in our application since there is no need for it, but for completeness's sake, it was important for us to know about the existence of this cleanup part as well.

## Conclusion

And that tells us everything we need to know about the 2 most common react hooks: useState and useEffect!

You can find a completed version of the To-Do application [here](https://github.com/saranshkataria/todo-list-react-hooks-demo/tree/845eb6b2ad9d12888748efb76ff7b6b08c087f6f) if you want to refer it. The react hooks documentation has a great [reference page](https://reactjs.org/docs/hooks-reference.html) that comes in handy while working with hooks.

We talk about [useContext ](https://www.wisdomgeek.com/development/web-development/react/learning-context-api-and-the-usecontext-react-hook/)in a separate post about context API and also discuss [useReducer ](https://www.wisdomgeek.com/development/web-development/react/understanding-the-usereducer-hook-in-react/)in a different post. Feel free to check those out too.

If there are any questions, feel free to drop them in comments. And if there aren't any, and you found this post helpful, share it with other people and help them learn too!
