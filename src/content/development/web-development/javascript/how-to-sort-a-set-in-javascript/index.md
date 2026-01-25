---
title: 'How to sort a Set in JavaScript'
description: 'ES6 introduced the set data structure in JavaScript. But sets are not ordered abstract data structures. So there is no .sort() property available on them. To sort a Set in JavaScript, we need to convert it into an array first. Since arrays are sortable, we will then sort them, and&#46;&#46;&#46;'
pubDate: 'Nov 26, 2022'
updatedDate: 'Oct 10, 2023'
heroImage: './hero.png'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

ES6 introduced the set data structure in JavaScript. But sets are not ordered abstract data structures. So there is no .sort() property available on them. To sort a Set in JavaScript, we need to convert it into an array first.

Since arrays are sortable, we will then sort them, and then convert the array back to a Set after we are done. At some point, the spec might add a sort method to Set() that does all of this by default, but for now, there are no alternatives.

Here is what it looks like code-wise:

```
const numbers = new Set([5, 4, 1]);

const sortedNumbersArray = Array.from(numbers).sort((a, b) => a - b);
const sortedNumbersSet = new Set(sortedNumbersArray);

console.log(sortedNumbersSet); //  {1, 4, 5}
```

Instead of the Array.from method, we can use [destructuring (aka the spread operator) ](https://www.wisdomgeek.com/development/web-development/javascript/rest-and-spread-operator-three-dots-that-changed-javascript/)to create the array too:

```
const strings = new Set(['x', 'z', 'y']);

const sortedStringsArray = [...strings].sort();

const sortedStringsSet = new Set(sortedStringsArray);
console.log(sortedStringsSet); // {'x', 'y', 'z'}
```

## Wrapping up

While converting a Set to an Array and then back is not an efficient solution, that is the best option currently to sort a Set in JavaScript. The EcmaScript standard does not have an OrderedSet data structure and that might change in the future, but until then, hope this solution helps.
