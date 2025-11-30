---
title: 'Automatic batching in React 18 helps avoid re-rendering'
description: 'Remember the earlier versions of React that used to batch multiple state updates inside event handlers such as click or change to avoid multiple re-renders? React 18 has added automatic batching for all use cases to improve that performance optimization even further. With React 18, state updates in event handlers,&#46;&#46;&#46;'
pubDate: 'Jan 13, 2022'
heroImage: './hero.jpeg'
categories: ["React"]
---

Remember the earlier versions of React that used to batch multiple state updates inside event handlers such as click or change to avoid multiple re-renders? React 18 has added automatic batching for all use cases to improve that performance optimization even further.

With React 18, state updates in event handlers, promises, time outs, native handlers are also batched by default.

## What is batching?

For people who do not know about batching, let us discuss that first. If a function is applying multiple updates to the state of a component, react batches or combines them into one state update and a single render on the browser.

Let us say we had the following function:

```
const handleClick = () => {
  setCount(count + 1);
  setTotalCount(totalCount+1);
}
```

React would then batch the two state updates into a single render.

Note: this used to work even in previous versions of React (since it is inside an event handler).

## Automatic batching

From React 18, there is a new root API, called createRoot. This allows us to use the concurrent features that were introduced in React 18.

### createRoot

As mentioned, above, this is only available from React 18 onwards. So the project needs to be using that.

After that, we need to replace our ReactDOM.render method from

```
ReactDOM.render(App />, document.getElementById("root"));
```

to

```
ReactDOM.createRoot(rootNode).render(App />);
```

And this enables batch updates automatically.

## Examples

In all the following examples, the multiple calls to set state would be batched at once. This avoids re-rendering with partial states after a render.

## Event handlers

```
const App = () => {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  const handleClick = () => {
    setCount(count + 1);
    setFlag(!flag);
  };

  return (
    div>
      button onClick={handleClick}>Click here!button>
      h1>{count}h1>
      h1>{`${flag}`}h1>
    div>
  );
};
```

### fetch call

```
const handleClick = () => {
  fetch("URL").then(() => {
    setCount(count + 1);
    setFlag(!flag);
  });
};
```

### **setTimeout**

```
const handleClick = () => {
  setTimeout(() => {
    setCount(count + 1);
    setFlag(!flag);
  }, 1000);
};
```

### Native event handlers

```
const el = document.getElementById("button");
el.addEventListener("click", () => {
  setCount(count + 1);
  setFlag(!flag);
});
```

## Avoiding batching

There are going to be cases where we do not want React to batch update the state. We can make use of the flushSync API from react-dom.

```
import { flushSync } from 'react-dom'; 

function handleClick() {
  flushSync(() => {
    setCounter(c => c + 1);
  });
  // React has updated the DOM by now
  flushSync(() => {
    setFlag(f => !f);
  });
}
```

For more information, you can always head to the discussion on [Github](https://github.com/reactwg/react-18/discussions/21). Or leave a comment below if you have any questions!
