---
title: 'Deep copying in JavaScript using structuredClone'
description: 'For as long as anyone can remember, deep copying in JavaScript was not a built-in feature and we had to resort to libraries or workarounds to create a deep copy of a JavaScript value. That has changed now. The platform now offers a built-in function that does deep copying for&#46;&#46;&#46;'
pubDate: 'Aug 23, 2022'
updatedDate: 'Oct 10, 2023'
heroImage: './hero.webp'
author: 'Saransh Kataria'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

For as long as anyone can remember, deep copying in JavaScript was not a built-in feature and we had to resort to libraries or workarounds to create a deep copy of a JavaScript value.

That has changed now.

The platform now offers a built-in function that does deep copying for us: structuredClone()

## Shallow copying

Before getting into deep copying, let us discuss what shallow copy is. The default behavior of copying in JavaScript is to shallow copy. That means that whenever we create a copy of something, changes to nested values in the original value will be reflected in the copied object as well.

```
let ingredients_list = ["noodles",{"list":["eggs","flour","water"]}];
let ingredients_list_copy = Array.from(ingredients_list);
ingredients_list_copy[1].list = ["rice flour","water"]

console.log(ingredients_list[1].list);
```

Even if we use the spread operator, it only goes one level deep. Deeply nested properties are still shallow copied.

```
const arr = [1, 2, 3];
const arr2 = [...arr]; // like arr.slice()

arr2.push(4);
//  arr2 becomes [1, 2, 3, 4]
//  arr remains unaffected because it is not deeply nested

const oldObj = {a: {b: 10}, c: 2};
const newObj = {...oldObj};

oldObj.a.b = 2; 
console.log(newObj.a.b);
// 2
// newObj `b` value gets updated as it is allocated at the same address

```

This happens because non-primitive types in JavaScript are handled as references by default. The act of copying them is merely the act of copying the reference to the underlying object. They get allocated the same memory address under the hood. This results in a shallow copy every time a non-primitive object is copied.

## Deep copying

Deep copying is the opposite of shallow copying. All the nested properties are copied on an individual basis and whenever a nested property is found, the copying happens recursively, creating an actual copy of that property as well. This results in the copied object not sharing anything with the original object.

Until now, people either relied on Lodash's [cloneDeep()](https://lodash.com/docs/#cloneDeep) method to achieve deep copying, or the most common hack was:

```
const myDeepCopy = JSON.parse(JSON.stringify(myOriginal));
```

In fact, its popularity made the V8 engine [optimize](https://v8.dev/blog/cost-of-javascript-2019#json) JSON.parse for making the above statement execute faster.

While it works amazingly well, there are a couple of shortcomings of that method:

- It cannot handle objects that have recursive data structures, it throws an error when working with trees or linked lists

- It discards functions

- It does not work with built-in types like Map, Set, Date, Regexp, or ArrayBuffer. It throws an error if it encounters one of these as a value

## Deep copying in JavaScript using structuredClone

The HTML spec was updated to expose a function called structuredClone() that creates deep copies of JavaScript values. The entire API is a single line:

```
const myDeepCopy = structuredClone(myOriginal);
```

And it does exactly what you would assume it to do!

There are a couple of limitations, though:

- Functions are still quietly discarded

- Some values are not clonable, like Error and DOM nodes

- An objects prototype chain is discarded as well, so for class instances, a plain instance of the class will be returned

But considering that it is a part of the HTML spec now, I guess we can rely on using structuredClone for deep copying in JavaScript until we run into one of the above limitations for some special use cases.

We no longer need to reach out to other libraries or our good old friend JSON.parse for deep copying in JavaScript!
