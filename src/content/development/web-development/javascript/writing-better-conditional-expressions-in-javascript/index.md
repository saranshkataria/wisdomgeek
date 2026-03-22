---
title: 'Writing better conditional expressions in JavaScript'
description: 'Writing conditional expressions is pretty easy to do. But there is room for improvement in the way we have been doing it. And with the flexibility that JavaScript provides, we can replace conditionals with clean code by using some good practices. And it can lead to more maintainable code. Let&#46;&#46;&#46;'
pubDate: 'Mar 30, 2021'
updatedDate: 'Oct 10, 2023'
heroImage: './hero.png'
author: 'Saransh Kataria'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

Writing conditional expressions is pretty easy to do. But there is room for improvement in the way we have been doing it. And with the flexibility that JavaScript provides, we can replace conditionals with clean code by using some good practices. And it can lead to more maintainable code. Let us take a look at writing better conditional expressions in this post.

## 1. Early returns

When we start learning programming, we are taught that we should only have one return statement. While the advice is not wrong, it becomes challenging to read code if the code base is large. Even though we should follow single responsibility and other SOLID principles while writing code, early returns make the code more readable and give a clear idea of the flow of code.

Early returns provide a way of writing better conditional expressions and make the code more readable. While some people will disagree with this, but my preference is to return early if there is an invalid condition.

Instead of having:

```
if (model && model.isValid) {
  if(model.properties.isValid) {
    // valid logic
  }
  else {
    throw new Error('invalid model');
  }
}
else {
    throw new Error('invalid model');
}
```

We can do:

```
if (!model || !model.isValid || !model.properties.isValid) {
  throw new Error('invalid model');
}

// valid logic
```

It definitely will boil down to preference and at times the piece of code being written as well, but early returns definitely help in quicker glances, lesser code blocks and easier debugging.

## 2. Avoiding multiple conditionals

Multiple if else blocks can be replaced by switch statements to improve readability.

```
function onKeyPress(key) {
  if (key === 'a') {
    moveLeft();
  } else if (key === 'w') {
    moveTop( );
  } else if (key === 's') {
    moveDown( );
  } else if (key === 'd') {
    moveRight( );
  } else if (key === 'h') {
    showHelp( );
  } else if (key === 'f') {
    toggleFullScreen( );
  }
}
```

can be better written as:

```
function onKeyPress(key) {
  switch (key) {
    case ‘a':
      moveLeft();
      break;
    case ‘w':
      movelTop();
      break;
    case 'S':
      moveDown():
      break;
    case ‘d':
      moveRight();
      break;
    case ‘h':
      showHelp();
      break;
    case 'f':
      toggleFullScreen();
    break;
  }
}
```

But there is an even better way. We can use object literals/maps to rewrite it in a concise manner:

```
function onKeyPress(key) {
  const mapping = {
    a: moveLeft,
    w: movelTop,
    s: moveDown,
    d: moveRight,
    h: showHelp,
    f: toggleFullScreen,
  };
  if (Object.keys(mapping).includes(key)) {
    mapping[key]()
  }
}
```

The object literal/dictionary is the cleanest form of the implementation and also adds the benefit of being extensible by just adding key values to it.

We could have used `mapping[key] && mapping[key]()` instead of the `Object.keys` implementation but if there were some keys like `toString`, it would mess it up. So it future proofs our implementation from a potential gotcha in the future.

## 3. Use built-in Array methods

For matching more than one condition, we usually write the code as:

```
const isAnimal = animal => {
  if (animal === ‘cat’ || animal === ‘dog’
    || animal === 'lion' || animal === 'bird') {
    return true;
  }
  
  return false;
};
```

But we can use the inbuilt Array.includes() method for doing so and not have to worry about adding so many "or" conditions.

```
const isAnimal = animal => {
  const animals = [‘cat’, ‘dog’, ‘lion’, 'bird'];
  return animals.includes(animal);
};

```

Or, if we were dealing with array of objects and wanted to check properties, we could make use of the Array.some() method to check if a condition is met:

```
const isAnimal = name => {
  const animals = [
    { name: 'cat', legs: 4 },
    { name: 'dog', legs: 4 },
    { name: 'lion', legs: 4},
    { name: 'bird', legs: 2}
  ];
  return animals.some(animal => animal.name === name);
};

```

We can similarly use Array.every to check if all objects have a property or not, or Array.find() to perform some logic.

## 4. Using default values and destructuring

Making use of the latest ECMAScript features is always a good thing. And providing default values removes the need for some conditionals while initializing variables. And the same goes for making use of object destructuring too.

```
const test = (animal, legs) => {
  if (!animal) return;
  const num_legs = legs || 0; // if legs not provided, default to zero
  console.log(`${animal} has ${num_legs} legs!`);
}
```

We can use default function values to remove the condition around value initialization.

```
const test = (animal, legs = 0) => {
  if (!animal) return;
  console.log(`${animal} has ${num_legs} legs!`);
}
```

And if we were dealing with objects, we could make use of the destructuring operator. From:

```
const test = (animal) => { 
  // printing animal name if value provided
  if (animal && animal.name)  {
    console.log (animal.name);
  } else {
    console.log('unknown');
  }
}
```

can be rewritten to:

```
function test({name} = {}) { 
    console.log (name || 'unknown');
}
```

If you want to know more about the destructuring operator, you can read our post about [destructuring and spread operator](https://www.wisdomgeek.com/development/web-development/rest-and-spread-operator-three-dots-that-changed-javascript/).

We can also use the [optional chaining and nullish coalescing operators ](https://www.wisdomgeek.com/development/web-development/javascript/using-the-optional-chaining-operator-in-javascript/)for similar initialization-related conditions.

And that is all there is regarding writing better conditional expressions. Using these techniques for writing better conditional expressions, we can make our code cleaner and more readable. If you have any other suggestions on how to write better conditional expressions, feel free to drop a comment below, and we will add it to our list!
