---
title: 'Using the optional chaining operator in JavaScript'
description: 'Every now and then, you come across a JavaScript feature that vastly changes the way you write it. Destructuring, arrow functions, modules have been some of those features for me. Optional chaining is going to be the next one on that list for me. Optional Chaining is in stage 4&#46;&#46;&#46;'
pubDate: 'Mar 18, 2021'
updatedDate: 'Oct 10, 2023'
heroImage: './hero.jpg'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

Every now and then, you come across a JavaScript feature that vastly changes the way you write it. Destructuring, arrow functions, modules have been some of those features for me. Optional chaining is going to be the next one on that list for me.

Optional Chaining is in stage 4 of the ES2020 proposal, therefore should be added to the specification. It changes the way properties inside an object are accessed, especially the deeply nested ones. It is also available as a feature in TypeScript 3.7+.

## The challenge

I am pretty sure you have run into null and undefined properties in JavaScript. The dynamic nature of the language makes it impossible not to run into them. And especially when dealing with nested objects, the following piece of code is a common occurrence:

```
if (data && data.children && data.children[0] && data.children[0].name) {
    // I have a name!
}
```

The above piece of code was for an API response and I had to parse the JSON to make sure the name existed. But similar situations can be encountered when objects have optional properties or there are some configuration objects with some values that are mapped on the fly.

While that is what makes the language flexible, it increases the headache for the developer and a lot of boundary conditions need to be checked for. That is boilerplate code which everyone wants to avoid.

## The optional chaining operator

The optional chaining operator makes life so much easier for developers. It checks nested properties for us without having to search down the ladder explicitly.

All you have to do is use the "?" operator after the property that you want to check for nullish values. You are free to use the operator as many times in an expression as you want to, and it will do an early return if any of the items are undefined.

For static properties the usage is:

```
object?.property
```

And for dynamic properties, it is changed to:

```
object?.[expression] 
```

The above piece of code can be reduced to:

```
let name = data?.children?.[0]?.name;
```

And then if we have:

```
let data;
console.log(data?.children?.[0]?.name) // undefined

data  = {children: [{name:'Saransh Kataria'}]}
console.log(data?.children?.[0]?.name) // Saransh Kataria
```

And it becomes as simple as that!

Since the operator short circuits as soon as a nullish values, it can also be used to conditionally invoke methods or apply conditional logic too.

```
const conditionalProperty = null;
let index = 0;

console.log(conditionalProperty?.[index++]); // undefined
console.log(index);  // 0
```

Similarly with methods:

```
object.runsOnlyIfMethodExists?.()
```

## Using with nullish coalescing

The [nullish coalescing](https://github.com/tc39/proposal-nullish-coalescing) proposal provides a way to handle undefined or null values and provide default values for the expression. You can use the "??" operator to provide a default value for an expression.

```
console.log(undefined ?? 'Wisdom Geek'); // Wisdom Geek
```

And thus the nullish coalescing operator can be used in conjunction with the optional chaining operator to provide default values if the property does not exist.

```
let name = data?.children?.[0]?.name ?? 'magic!';
console.log(name); // magic!
```

And that is it, folks! The optional chaining operator allows easy access to nested properties without writing a lot of boilerplate code. It is important to note that it is not supported in IE. So, you might want to add a [Babel plugin](https://babeljs.io/docs/en/babel-plugin-syntax-optional-chaining) if you need to support that or older versions of browsers. For Node.js you need to bump to a Node 14 LTS release for this, as it isn't supported in 12.x.

If you have any questions, feel free to drop a comment below.
