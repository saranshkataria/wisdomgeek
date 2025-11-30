---
title: 'Understanding the useRef React hook'
description: 'Continuing our React hooks series, we will learn about the useRef React hook in this blog post. The useRef React hook is useful in the following two situations: Before we see these advantages of the hook, let us first understand what the hook is and what it does. What is&#46;&#46;&#46;'
pubDate: 'Jan 21, 2021'
heroImage: './hero.jpg'
categories: ["React"]
categoryHierarchy: ["Development","Web Development","React"]
---

Continuing our [React hooks](https://www.wisdomgeek.com/tag/react-hooks/) series, we will learn about the useRef React hook in this blog post.

The useRef React hook is useful in the following two situations:

1. $1

2. $1

Before we see these advantages of the hook, let us first understand what the hook is and what it does.

## What is the useRef react hook?

The useRef React hook is a function that returns a mutable ref object. Refs are a way to access DOM nodes in React.

```
const refContainer = useRef(initialValue);
```

The .current property of the object returned by the useRef React hook is initialized to the initial value that we pass in the hook. The returned object persists throughout the lifetime of the component.

In other words, useRef can be used as a container where we can store a mutable value.

To mutate the value of the object, we can assign the new value to the current property:

```
const App = () => {
   const myRef = useRef("initial value")

   // updating ref 
   myRef.current = "updated value" 

  // myRef now will be {current: "updated value"} 
}
```

If we pass in a ref object to a DOM node using `<div ref={myRef} />`, the .current property of the reference will be set to that node. And whenever the node changes, the returned reference variable will get updated as well.

When assigning to a DOM node, we usually do so in JSX. So the initial value that we provide to the useRef React hook during declaration would be null.

Or if we do not use a DOM node but any other JavaScript value, then that value will be persisted across re-renders. Thus, it is a handy way of keeping around a mutable value. It is pretty much similar to an instance field in a class when used in this way.

But why not create an object with a .current property ({current: ... }) ourselves then? The only difference would be that the one created using the useRef React hook will return the same object on every render. That would not be the case if we created it ourselves.

It is also important to note that useRef does not have a notifier attached to it. Nothing happens when the value is changed. It would be better to use the useState hook if we wanted that functionality. If we wanted to execute some code whenever a ref is attached/removed to a DOM node, we could use the callback ref.

## Accessing DOM nodes or React elements

Let us start getting into the scenarios where the useRef React hook is useful. Someone familiar with React would already know that we use Refs for accessing DOM nodes or React elements. And as we discussed above, useRef allows us to do the same as well.

For focusing on an element on clicking a button, we can create a component:

```
const InputTextWithFocusButton= () => {
   const inputEl = useRef()

   const onButtonClick = () => {
      inputEl.current.focus()
   }

   return (
      
         input ref={inputEl} type="text" />
         button onClick={onButtonClick}>Focus on Input Textbutton>
      
   )
}
```

Thus we are able to access child DOM nodes and use the useRef React hook to have access to it.

**Note: **The same functionality could have been achieved by using the createRef API as well:

```
const InputTextWithFocusButton= () => {
   const inputEl = createRef()

   const onButtonClick = () => {
      inputEl.current.focus()
   }

   return (
      
         input ref={inputEl} type="text" />
         button onClick={onButtonClick}>Focus on Input Textbutton>
      
   )
}
```

Then why do we need the useRef React hook?

The key lies in persistence. useRef's return object persists throughout the lifetime of the component, whereas createRef does not. If the component were to re-render, the object created by useRef would be persisted. The one created using createRef would point to a new object.

If you want to look at another example of this in a practical example, you can check our previous post on [detecting a click outside a React component using the useRef hook](https://www.wisdomgeek.com/development/web-development/react/detecting-click-outside-component-using-react-hooks/).

Another thing to remember is to avoid using useRef everywhere we need to interact with DOM nodes. Just because we can does not mean that we should be doing it. Using useRef is discouraged unless it is needed. The best practices around state exist for a reason.

## Storing a mutable variable

Since the useRef React hook returns a JavaScript object, it is not limited to storing DOM nodes. We can use it to store any variables that we want to be persisted across re-renders.

Let us create a component that shows the number of times that it was re-rendered.

Would this declaration work?

```
const RerenderCounter = () => {
  let count = 0;
  count++;

  return (span>{count}span>);
}
```

Since we are initializing the count inside the component itself, it will be re-initialized on every re-render. So the component will always render 1 as the output.

We need a reference to a variable that is preserved across re-renders. Therefore, useRef to the rescue:

```
const RerenderCounter = () => {
  const count = useRef(0);
  useEffect(() => {
    // Every time the component has been re-rendered,
    // the counter is incremented
    counter.current = counter.current + 1;
  }); 
  return (span>{count}span>);
}
```

This implementation will preserve the count variable across re-renders. Since the value is preserved, we will be getting the reference to the same variable on every render. Thus we will be incrementing the count on every re-render. Hence, we will get the actual count of the times the component gets re-rendered.

We could have updated the counter inside the function instead of using useEffect, but the React docs recommend modifying refs in event handlers or effects. This is because all side-effects in a functional component should be done in the layout phase or in the commit phase of the lifecycle to avoid surprises.

For another practical example of this functionality, you can check our post where we [create redux-like middlewares using the useReducer](https://www.wisdomgeek.com/development/web-development/react/use-redux-like-middleware-for-usereducer-in-react/) hook. We store the previous state of the component using the useRef hook and updating it every time we update the state using the [useReducer hook](https://www.wisdomgeek.com/development/web-development/react/understanding-the-usereducer-hook-in-react/).

We hope this post helps you get a deeper understanding of the useRef React hook, and now you know when and when not to reach out for it. Do let us know in the comments section if you have any queries.
