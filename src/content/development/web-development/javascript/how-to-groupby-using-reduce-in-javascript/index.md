---
title: 'How to groupby using reduce in JavaScript'
description: 'The groupBy method is one of the reasons people use lodash in their project. In this blog post, we will write our own version of groupBy using reduce and vanilla JavaScript. What groupBy does? groupBy works on an array of items, and it groups these items together into an object&#46;&#46;&#46;'
pubDate: 'Oct 01, 2020'
updatedDate: 'Oct 11, 2023'
heroImage: './hero.png'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

The groupBy method is one of the reasons people use [lodash](https://lodash.com/) in their project. In this blog post, we will write our own version of groupBy using reduce and vanilla JavaScript.

## What groupBy does?

groupBy works on an array of items, and it groups these items together into an object based on some criterion. Let us assume we have the following blog posts:

```
let posts = [
  {
    author: 'saransh',
    title: 'Learning context API and the useContext React hook',
  },
  {
    author: 'pranshu',
    title: 'Machine Learning Misconceptions That Software Developers Have',
  },
  {
    author: 'saransh',
    title: 'Understanding the useReducer hook in React',
  },
];

```

We want our groupBy function to return an object which has all posts written by me (Saransh) and other authors too. That is we want to group posts by author names. Thus:

```
groupBy(posts, 'author');
```

will give us the output:

```
{
  "saransh": [
    {
      "author": "saransh",
      "title": "Learning context API and the useContext React hook"
    },
    {
      "author": "saransh",
      "title": "Understanding the useReducer hook in React"
    }
  ],
  "pranshu": [
    {
      "author": "pranshu",
      "title": "Machine Learning Misconceptions That Software Developers Have"
    }
  ]
}
```

Now that we understand what groupBy does, let us get to implementing it.

## A vanilla JS implementation of groupBy

We will be making use of the array.reduce method for our implementation. The reduce method takes in an array and returns a single value, which is what we want for our groupBy method.

Here is what we already know: We will be taking an input array and a key as an input and returning an object as the output. And we will be using the reduce function to iterate over the input array. Since the output will be an object, we will start with an empty object as our accumulator and then keep adding properties to it as we iterate over the input array. Thus, a skeleton of all this would look like:

```
const groupBy = (input, key) => {
  return input.reduce((acc, currentValue) => {
    // TODO: implement method
 }, {}); // empty object is the initial value for result object
};
```

Now, we need to initialize an empty array for each distinct key value if it does not exist. We can do this in two ways:

```
let groupKey = currentValue[key];
if(!acc[groupKey]) {
  acc[groupKey] = [];
}
```

And then we need to add the current value to this array and move on to the next iteration of the reduce by returning the object that we just created.

Thus, our groupBy function is completed, and we get our final definition:

```
const groupBy = (input, key) => {
  return input.reduce((acc, currentValue) => {
    let groupKey = currentValue[key];
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(currentValue);
    return acc;
  }, {});
};
```

Note: The latest version has an Array.prototype.groupBy method which can be used to [groupby in js](https://www.wisdomgeek.com/development/web-development/javascript/using-groupby-on-an-array-of-objects-in-javascript/). We can use that with a polyfill using [core-js](https://github.com/zloirock/core-js#array-grouping) if we want to.

And that is all we need to do to implement our own groupBy function. We hope this post helped you learn a bit more about how to use reduce and also create your own groupBy function so that you don't need to rely on Lodash anymore.
