---
title: 'Why does React state need a new object/array?'
description: 'If you have been using React for a while, you are familiar with how state update works. There are a lot of internal optimizations that React makes for faster rendering. One of the implementation details of the React internals is that it checks whether the given state object has actually&#46;&#46;&#46;'
pubDate: 'May 25, 2021'
updatedDate: 'Oct 10, 2023'
heroImage: './hero.png'
categories: ["React"]
categoryHierarchy: ["Development","Web Development","React"]
---

If you have been using React for a while, you are familiar with how state update works. There are a lot of internal optimizations that React makes for faster rendering. One of the implementation details of the React internals is that it checks whether the given state object has actually changed or not. But the behavior of assigning a new object/array trips up newcomers. Let us understand why React needs a new copy of an object/array when assigning state.

## Object.is() in JavaScript

`Object.is()` is a comparison operator in JavaScript. It is attached to Object.prototype and can be used to compare JavaScript values, both object as well as primitive values.

For an object:

```
const author1 = {name: "Saransh Kataria"};
const author2 = {name: "Saransh Kataria"};

Object.is(author1, author2); // false
```

Since objects are stored by reference, the comparison returns false.

## How is this relevant with respect to React?

React uses Object.is() for comparison of the previous and next states to determine whether or not to update the DOM. The relevant part for that case is:

```
const author1 = {name: "Saransh Kataria"};
author1.name = "Wisdom Geek";

Object.is(author1, author1); // true
```

Since we are mutating the same object and it's properties, the comparison will always return true.

Therefore, when we do:

```
const [author, setAuthor] = useState({name:"Saransh Kataria")};

const updateName = () => {
  author.name = "Wisdom Geek";
  setAuthor(author)
}
```

In the update name function, we are updating the author object. And send the updated object to setAuthor. This will not update the UI even though we have updated the author object.

## Why is the User Interface not updated?

As we saw previously, changing a property on an object does not change the reference of that object. React uses Object.is() under the hood to determine whether the state was updated or not when we invoke the setter function.

Since the object reference did not change, Object.is() returns false even though we updated some properties. Therefore, React does not feel the need to update the UI because nothing has changed according to it.

To get it to work correctly, we must pass in a new reference to the useState function. And for doing that, we need to create a new object. Once we do that, Object.is() will return true because the references will not be the same, and we will trigger a re-render.

```
const updateName = () => {
  setAuthor(prevState => {...prevState, name: "Wisdom Geek"});
}
```

This uses the spread syntax and the callback function to update the state. We return a new object which does not have any properties that are directly referenced from the initial object. And we also update the property that we wanted to update.

The same logic applies to arrays as well since they are reference types as well.

## Conclusion

I hope that that explanation demystifies React internals and gives a better idea about the implementation detail of state management in React. If you have any questions, feel free to drop a comment below!
