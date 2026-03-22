---
title: 'Object initialization shorthand notations in JavaScript'
description: 'I was recently working on a project in which I was trying to use a shorthand notation for destructuring assignment of a variable. I was researching different ways of getting a specific scenario to work. And while doing that research, I found that ES2015 had added 3 new object initialization&#46;&#46;&#46;'
pubDate: 'Feb 02, 2021'
updatedDate: 'Oct 10, 2023'
heroImage: './hero.png'
author: 'Saransh Kataria'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

I was recently working on a project in which I was trying to use a shorthand notation for destructuring assignment of a variable. I was researching different ways of getting a specific scenario to work. And while doing that research, I found that ES2015 had added 3 new object initialization shorthand notations that I had not known existed. And so I decided to share these with everyone.

**Note: **As with most good things, these do not work with Internet Explorer. So if you are supporting it, these still might be good to have in your arsenal when Microsoft drops support for IE later.

## What does object initialization shorthand notations mean?

Objects initialization by default can be done using `Object.create()`, `new Object` or the literal notation by using an object initializer. The object initializer has been one of the most common ways:

```
const foo = {
  bar: 1,
  baz: 2
}
```

There are ways to make this initialization concise in specific scenarios and we are going to go through those shorthands in this post.

The 3 new object initialization shorthand notations were added to it in ES2015:

- Shorthand property names

- Shorthand method names

- Computed property names

## Shorthand property names

This one is the most widely known object initialization shorthand notation out there. Whenever the property name key on an object is the same as a variable name in scope, we can omit the property value while constructing the object.

This means code that used to be:

```
const bar = 1;
const foo: {
  bar: bar ,
  baz: 2
}
```

can now be:

```
const bar = 1;
const foo: {
  bar,
  baz: 2
}
```

## Shorthand method names

This one was a little surprising when I first saw it in the sense that I always knew about shorthand property names. But I never thought that the same could also be applied to function/method names. With shorthand method names, we can omit the function keyword completely when creating methods inside an object.

There was code that was like:

```
const bar = 1;
const foo: {
  bar,
  baz: function() {
  // logic
  }
}
```

can be shorthanded to:

```
const bar = 1;
const foo: {
  bar,
  baz() {
  // logic
  }
}
```

We have been used to this in the form of classes, and it is not a huge win, but this post is about shorthands and I like these new introductions.

## Computed Property Names

This was the most interesting shorthand of all the 3 object initialization shorthands. It allows us to have an expression to be computed as a property name on the object. Therefore we can now have dynamic keys in object names.

Have you ever done this?

```
const obj = {}, key = 'bar';
obj[key] = 'baz';
```

This is possible because JavaScript objects are dictionaries and that gives us the possibility of adding dynamic keys to them. But this was always a pain for me. Not anymore!

```
let key = 'bar';
let obj = {
  [key]: 'baz',
}
```

And it will work! The idea of being able to inject a dynamic key might seem trivial but it opens up a lot of possibilities. We can even add complex expressions in there or even use template literals:

```
let key = 'bar';
const prefix = '_prefix'
let obj = {
  [key + '_expression']: 'baz',
  [`key${prefix}`]: 'baz',
}
```

And those are the 3 object initialization shorthand notations that we had to discuss. Though these are syntactic sugar over existing methods, these are the most commonly used tasks we do while creating objects. And the small improvements add up. If you would like to get a bit more into shorthands in JavaScript, you can read more about our post on [JavaScript rest and spread operator and destructuring](https://www.wisdomgeek.com/development/web-development/rest-and-spread-operator-three-dots-that-changed-javascript/). 

Will you use any of these? Let us know in the comments below!
