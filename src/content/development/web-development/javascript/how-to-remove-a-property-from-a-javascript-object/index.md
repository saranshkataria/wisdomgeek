---
title: 'How to remove a property from a JavaScript object'
description: 'There are two ways to remove a property from a JavaScript object: one is the mutable way of doing it by using the delete operator.'
pubDate: 'Aug 29, 2021'
updatedDate: 'Oct 10, 2023'
heroImage: './hero.jpg'
author: 'Saransh Kataria'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
tags: [{ name: "es2015", slug: "es2015" }, { name: "es6", slug: "es6" }, { name: "javascript", slug: "javascript" }, { name: "webdev", slug: "webdev" }]
---

There are two ways to remove a property from a JavaScript object: one is the mutable way of doing it by using the delete operator. And the second one is the immutable way of doing it by using [object restructuring](/development/web-development/javascript/rest-and-spread-operator-three-dots-that-changed-javascript/). Let us go through each of these:

## 1\. The delete operator

delete is a JavaScript instruction that allows us to remove a property from a JavaScript object. There are a couple of ways to use it:

```javascript
delete object.property;
```

or

```javascript
delete object['property'];
```

The operator deletes the corresponding property from the object.

```javascript
let blog = {name: 'Wisdom Geek', author: 'Saransh Kataria'};
const propToBeDeleted = 'author';
delete blog[propToBeDeleted];
console.log(blog); // {name: 'Wisdom Geek'}
```

The delete operation modifies the original object. Therefore it is a mutable operation.

## 2\. Object destructuring

Using the object restructuring and rest syntax, we can destructure the object with the property to be removed and create a new copy of it. After the destructuring, a new copy of the object would be created and assigned to a new variable without the property that we chose to remove.

```javascript
const { property, ...remainingObject } = object;
```

For example:

```javascript
let blog = {name: 'Wisdom Geek', author: 'Saransh Kataria'};
const { author, ...blogRest } = blog;
console.log(blogRest) // {name: 'Wisdom Geek'};
console.log(blog); // {name: 'Wisdom Geek', author: 'Saransh Kataria'}
```

If we want to do this dynamically, we can do:

```javascript
const name = 'propertyToBeRemoved';
const { [name]: removedProperty, ...remainingObject } = object;
```

For example:

```javascript
let blog = {name: 'Wisdom Geek', author: 'Saransh Kataria'};
const name = 'author';
const { [name]: removedProperty, ...remainingObject } = blog;
console.log(removedProperty); // Saransh Kataria
console.log(remainingObject); // {name: 'Wisdom Geek'}
```

It is also possible to remove multiple properties using the same syntax.

And those are the 2 ways to remove a property from a JavaScript object. If you have any questions, feel free to drop a comment below\!
