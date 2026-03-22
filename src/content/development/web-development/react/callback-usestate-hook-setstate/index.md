---
title: 'Provide callback to useState hook like setState'
description: 'If you have been writing class components for a while, you might be familiar with the callback functionality that the setState function provides. setState allows a second parameter to be passed to it as a callback. The callback function is invoked whenever the state of the function gets updated. But,&#46;&#46;&#46;'
pubDate: 'Dec 15, 2020'
updatedDate: 'Oct 10, 2023'
heroImage: './hero.jpg'
author: 'Saransh Kataria'
categories: ["React"]
categoryHierarchy: ["Development","Web Development","React"]
---

If you have been writing class components for a while, you might be familiar with the callback functionality that the setState function provides. setState allows a second parameter to be passed to it as a callback. The callback function is invoked whenever the state of the function gets updated. 

```
this.setState(newState, callbackFunction)
```

But, this callback mechanism does not exist with functional components.

```
const [state, setState] = useState();
setState(newState, callbackFunction)

```

The callback function would not be invoked in this case, and it would throw a warning instead. It recommends using useEffect instead. Before jumping into the implementation using useEffect, let us first examine why we need the callback in the first place.

## Why do we need a callback?

useState and setState both are asynchronous.

They do not update the state immediately but have queues that are used to update the state object. This is done to improve the performance of the rendering of React components.

Even though they are asynchronous, the useState and setState functions do not return promises. Therefore we cannot attach a then handler to it or use async/await to get the updated state values. And if we have some state variables that need to be updated according to another state variable, we cannot rely on the updated state variable synchronously.

The state update usually happens on the next render, but even that can vary. Batching updates is up to react, and there is nothing we can do to change that.

Considering the following example:

```
export default function useProgressPercentage() {
  const [percentage, setPercentage] = useState(0);
  const [completedRequests, setCompletedRequests] = useState(0);
  const [totalRequests, setTotalRequests] = useState(1);

  const incrementCompletedRequestCount = () => {
    setCompletedRequests((completedRequests) => completedRequests + 1);
    setPercentage(
        Number(((completedRequests / totalRequests) * 100).toFixed(2))
      );
  };
  const incrementDataLoadRequestCount = () => {
    setTotalRequests((totalRequests) => totalRequests + 1);
    setPercentage(
        Number(((completedRequests / totalRequests) * 100).toFixed(2))
      );
  };

  return [
    percentage,
    incrementCompletedRequestCount,
    incrementDataLoadRequestCount,
  ];
}
```

We want to update the percentage indicator whenever the total requests or the completed requests get updated. However, the above implementation will not work correctly because of the asynchronous manner of useState. The completed requests and total requests would return the older values whenever we call the increment functions.

```
const [percentage, 
  incrementCompletedRequestCount,
  incrementDataLoadRequestCount] = useProgressPercentage();

console.log(percentage); // 0
incrementDataLoadRequestCount();
console.log(percentage); // still 0 if re-render has not happened
```

## How do we implement the callback functionality like setState with useState then?

In React functional components, a callback function for anything can be implemented using the useEffect hook. We will be using the same to provide callback functionality to our useState hook to make it function similar to setState.

We will be making use of the dependency array of the useEffect to achieve this. If you are not familiar with it, we recommend reading our post on [useEffect react hook](https://www.wisdomgeek.com/development/web-development/react/react-hooks-and-local-storage-lets-build-a-todo-app/).

```
const [state, setState] = useState();
useEffect(() => {callbackFunction()}, [state])
```

As soon as the state is updated, it will trigger the useEffect hook. The useEffect hook will only be invoked when state changes because of the dependency array. And we can call our callback function inside that hook and get the functionality we wanted to achieve.

**Note:** If you want the changes performed in the callback function to be reflected in the component's rendered output, you would want to use useLayoutEffect instead of the useEffect react hook.

Therefore, our percentage hook can be updated as follows:

```
export default function useProgressPercentage() {
  const [percentage, setPercentage] = useState(0);
  const [completedRequests, setCompletedRequests] = useState(0);
  const [totalRequests, setTotalRequests] = useState(1);

  useEffect(() => {
      setPercentage(
        Number(((completedRequests / totalRequests) * 100).toFixed(2))
      );
  }, [completedRequests, totalRequests]);

  const incrementCompletedRequestCount = () => {
    setCompletedRequests((completedRequests) => completedRequests + 1);
  };
  const incrementDataLoadRequestCount = () => {
    setTotalRequests((totalRequests) => totalRequests + 1);
  };

  return [
    percentage,
    incrementCompletedRequestCount,
    incrementDataLoadRequestCount,
  ];
}
```

Thus, we have our implementation of providing a callback to the useState react hook, just like we do for setState in a class component. If you want to learn more about [react hooks](https://www.wisdomgeek.com/tag/react-hooks/), do check out our various posts about them. If there is some topic that you would like us to write about, do drop a comment below and let us know.
