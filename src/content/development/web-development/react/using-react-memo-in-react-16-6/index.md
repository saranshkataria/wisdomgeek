---
title: 'Using React.memo() in React 16.6'
description: 'React 16.6 was released a couple of days and and it brings a couple of new features. One of these is React.lazy() which is something that requires a separate post in itself along with React Suspense. The other one, which we will talk about in this post is React.memo(). What&#46;&#46;&#46;'
pubDate: 'Oct 26, 2018'
updatedDate: 'Oct 15, 2023'
heroImage: './hero.png'
author: 'Saransh Kataria'
categories: ["React"]
categoryHierarchy: ["Development","Web Development","React"]
---

React 16.6 was released a couple of days and and it brings a couple of new features.

One of these is React.lazy() which is something that requires a separate post in itself along with React Suspense.

The other one, which we will talk about in this post is React.memo().

## What is React.memo()?

It is similar in functionality to PureComponent which helps us have a finer control over the rendering of our component. The only difference is that React.memo() brings that to functional components whereas PureComponent was applicable to classes only.

The default behavior of a component declared using React.memo is that it renders only if the props have changed. It does a shallow comparison of the props to check that but there is an option to override that as well.

## Why is it called memo?

Memoization is a technique in which we cache the result of a function call if we know that it is going to be excessively used. This is generally applied to expensive functional calls but since we are doing something similar with respect to memoization when deciding whether to render the component or not, it makes sense to call it React.memo().  Here's Dan Abramov giving a similar logic on twitter:

Memoized component. There was a lot of feedback on the RFC which we agree with — "pure" naming is confusing because memoization (which is what memo does) has nothing to do with function "purity".

&mdash; danabra.mov (@dan_abramov) [October 24, 2018](https://twitter.com/dan_abramov/status/1054889086484328448?ref_src=twsrc%5Etfw)

## How do I use it?

```
const reactMemoComponent = React.memo((props) => { 
/* renders only if props changed */ 
});
```

This helps boost the performance by avoiding re-rendering if not needed.

Since React.memo is a higher order component, you can wrap existing functional components using it as well.

```
const existingComponent= (props) => { /* component definition */ };
const memoizedComponent = React.memo(existingComponent);
```

If you want to use your own comparison function instead of the default shallow comparison  function, React.memo provides that functionality as well. You can pass in your own comparison function as a second argument to the method to do so. This method needs to return a boolean value to conditionally evaluate if the component should re-render or not.

```
const customReactMemoComponent = React.memo((props) => { /* definition */ }, (prevProps, newProps) => {
// custom comparison logic
});
```

## Demo

I have created a very small [demo](https://github.com/saranshkataria/React-memo-demo) for this using create-react-app. There is a greeting component which displays a welcome text message. The App component's state is being changed every one second, forcing it to re-render every second. As a result the Greeting component also gets re-rendered every second since it is present in the App component.

On creating a memoized component using React.memo() from the Greeting component, it gets rendered only once even though the App component is still being rendered every second.

This can be verified from the console logs, which show the log only once for the Memo component and multiple ones for the Greeting component:

![React-memo-demo](./react-memo-demo-2.png)

And that is all you need to know about the new React.memo. Go ahead and start creating functional pure components! No need for classes anymore

Let us know your thoughts in the comments section and if you think this is a valuable addition to the react API.
