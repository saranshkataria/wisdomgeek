---
title: 'How to write your own custom React hooks'
description: 'If you have been using react for a while, chances are you have come across the need to extract some logic into a reusable function. And with React hooks coming into the picture, doing this has become a walk in the park. We can write our own custom react hooks&#46;&#46;&#46;'
pubDate: 'Jan 12, 2021'
updatedDate: 'Oct 10, 2023'
heroImage: './hero.png'
author: 'Saransh Kataria'
categories: ["React"]
categoryHierarchy: ["Development","Web Development","React"]
---

If you have been using react for a while, chances are you have come across the need to extract some logic into a reusable function. And with React hooks coming into the picture, doing this has become a walk in the park. We can write our own custom react hooks to abstract complex logic in a function and reuse it across components.

## What is a custom React Hook?

A custom React hook is really a function that runs inside of a component. It can run other hooks or other functions inside it. These functions/hooks can be recursive too. It makes patterns like render props and higher-order components unnecessary. It is a powerful tool to have in your arsenal when writing functional components and it provides us with the following advantages:

- Build your own hook/logic

- Provide the ability to hook into React specific functionalities such as lifecycle and state

- Portable logic

- Rapid iterations

With hooks and custom react hooks in the application, we can start relying on our components to be responsible for the user interface and hooks being the piece that handles business logic.

If you have not dived into React hooks yet, we recommend checking out our previous posts about [react hooks](https://www.wisdomgeek.com/tag/react-hooks/) before diving into this one.

One thing to know before getting started with custom React hooks is that the function has a naming convention. The logic inside does not matter, but the function must be prefixed with the word "use".

It is also a good idea to check out the rules of hooks [post](https://reactjs.org/docs/hooks-rules.html) in the react docs before working with custom hooks.

This post is about understanding and writing custom react hooks, and not about what all is possible using them. The sky is the limit and a lot of the open-source community has already developed an insane number of hooks. Though they might be useful for our applications, we should know how to write our own custom React hooks since our business case related hooks would not exist.

## What are we going to make?

Even though we understand that custom React hooks unleash a level of composition that is above and beyond anything we have seen before, we will build a basic custom react hook for this post. We will abstract our logic to store data in the local storage of the browser. We will also add this custom hook that we make to our [local storage and react hooks](https://www.wisdomgeek.com/development/web-development/react/react-hooks-and-local-storage-lets-build-a-todo-app/) example.

We will take a key as input to the hook, which will act as the key for storing the value in the local storage of the browser. We will also take in a default value for the variable that we will be creating. The hook will return a variable to the consumer and a setter to this variable as well. And anytime this variable is changed, the hook will be responsible for updating its value in local storage as well.

Thus, our hook would have the following definition:

```
export const useLocalStorage = (key, defaultValue) => {
  // logic to be added
  return [value, setValue]
}
```

For returning a variable that is tracked by react, we can make use of the [useState react hook](https://www.wisdomgeek.com/development/web-development/react/react-hooks-and-local-storage-lets-build-a-todo-app/). Also, since we always have values in local storage as strings, we will use JSON strings to store the values and parse them on retrieval.

```
export const useLocalStorage = (key, defaultValue) => {
  const storedValue = JSON.parse(localStorage.getItem(key));
  const [value, setValue] = useState(storedValue || defaultValue);
  return [value, setValue]l
}
```

This takes care of returning a variable which will be tracked using react state. But we also need to update the value of the variable in local storage on every update. We will make use of the useEffect hook in our custom React hook to do so.

```
export const useLocalStorage = (key, defaultValue) => {
  const storedValue = JSON.parse(localStorage.getItem(key));
  const [value, setValue] = useState(storedValue || defaultValue);

   useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}
```

And that is sufficient for our very own custom React hook! The updated value will be reflected in local storage whenever the value changes. Whenever the hook is initialized, the value will be set to the default value if it does not exist. We will add the key to the effect's dependencies for the sake of completeness, even though it will not get updated during the lifetime of the hook.

## Using the custom react hook in our application

We can now swap the following code in our application:

```
const App = () => {
  const [items, setItems] = useState([]);
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
```

with:

```
const App = () => {
  const [items, setItems] = useLocalStorage('items', []);
  const removeItem = (itemToBeDeleted) => {
    setItems(items.filter((item) => itemToBeDeleted !== item));
  };

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
```

And it should still be working as it was before. But now we have the logic to store in the local storage abstracted in a custom React hook. And we can use this hook across multiple components wherever we wish to save to local storage.

It is important to note that custom hooks are isolated. If you use the same hook in two components, they will not share state. Therefore, we have a truly reusable piece of code that can be used across multiple components.

After reading this post, I hope you understand custom hooks in React better. Now, go ahead and start creating your own. The sky is the limit! Do leave a comment below sharing what hooks are you planning to create.
