---
title: 'Using the useCallback React hook'
description: 'The useCallback React hook is a useful hook that can help in optimizing the rendering performance of our functional React components. It is used to memoize functions which means it caches the return value of a function given a set of input parameters. The syntax As we can see, the&#46;&#46;&#46;'
pubDate: 'Jan 28, 2021'
updatedDate: 'Oct 10, 2023'
heroImage: './hero.png'
categories: ["React"]
categoryHierarchy: ["Development","Web Development","React"]
---

The useCallback React hook is a useful hook that can help in optimizing the rendering performance of our functional React components. It is used to memoize functions which means it caches the return value of a function given a set of input parameters.

## The syntax

```
const memoizedCallback = useCallback(
  () => {
    functionToBeMemoized(arg);
  },
  [arg],
);
```

As we can see, the useCallback React hook takes in an inline function and its dependencies as parameters and returns a memoized version of the function. The returned memoized function changes only when one of the passed dependencies has changed. Therefore it is guaranteed to have the same reference value if the input arguments are the same.

This is useful when we want to pass callbacks as props to children components and want to optimize the components to avoid re-rendering since React relies on reference equality of props. A memoized function will have the same reference for a given set of parameters, thus avoiding re-rendering.

Before we get into the applications of the useCallback React hook, we should know that React itself is fairly fast and we should avoid any premature optimizations and only use this hook when we need to.

As with the [useEffect](https://www.wisdomgeek.com/development/web-development/react/understanding-the-useref-react-hook/) dependencies, if we pass in an empty array of dependencies, the memoized function is computed only once. It will store the same reference throughout the lifecycle of the component then.

## Using the useCallback React hook

Let us consider a component that has a lot of computation involved and is expensive to re-render:

```
const ExpensiveToComputeComponent = () => {
 // expensive computation
};
```

If this component were taking in a handler function as a prop, and the parent component was providing in the handler to it:

```
const App = () => {
  const handler = () => {
  // do something
  };
  return ExpensiveToComputeComponent handler = {handler} />;
}
const ExpensiveToComputeComponent = ({handler}) => {
 // expensive computation
};
```

Any time the App is re-rendered, then the expensive to compute component would get re-rendered as well. This would happen because of the callback function that we are providing in the form of handler. The reference to it would change every time the App is re-rendered.

Even if we used [React.memo](https://www.wisdomgeek.com/development/web-development/react/using-react-memo-in-react-16-6/) to memoize the expensive component:

```
const ExpensiveToComputeComponent = React.memo(({handler}) => {
 // expensive computation
});
```

The result will be the same. The re-render happens because the handler function is changing and memo will not change that. To keep the handler callback function the same, we will need to use the useCallback React hook.

```
const App = () => {
  const handler = useCallback(() => {
  // do something
  }, [dependencies]);
  return ExpensiveToComputeComponent handler = {handler} />;
}
```

It is also important to note that if the dependencies are also dynamic (reference types), then the return value of the useCallback React hook will also be dynamic. So we either want to have them as value types, or again use useCallback on them. Though it is recommended to avoid the nesting of callbacks and there are better ways to handle this. It is also recommended to install the [eslint-plugin-react-hooks plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) to avoid such problems and enforce best practices.

To conclude, the useCallback React hook is useful in memoizing functions. It is useful to obtain performance gains but should be used wisely. We should use the profiler before getting into optimizing. As we have seen, it shines when combined with the React memo API.

If you have any queries, or have any suggestions about what we should cover next, drop a comment below and let us know!
