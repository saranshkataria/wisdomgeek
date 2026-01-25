---
title: 'Using GroupBy on an array of objects in JavaScript'
description: 'Array grouping is a fairly common operation in any project. Until recently, we had to either write our own implementation or use third-party libraries when wanting to GroupBy on an array of objects in JavaScript. That will soon no longer be needed since a native implementation has been introduced in&#46;&#46;&#46;'
pubDate: 'Dec 29, 2021'
updatedDate: 'Oct 10, 2023'
heroImage: './hero.png'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

Array grouping is a fairly common operation in any project. Until recently, we had to either write our own implementation or use third-party libraries when wanting to GroupBy on an array of objects in JavaScript.

That will soon no longer be needed since a native implementation has been introduced in the form of Array.prototype.groupBy. And it is in [stage 3](https://github.com/tc39/proposal-array-grouping) now!

To start using it today, we can use the polyfill provided by [core-js](https://github.com/zloirock/core-js#array-grouping).

## Using reduce

The reduce method allows us to achieve group by in JavaScript:

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

If you want to read more about how the reduce functionality works, we previously wrote a post about [group by in JavaScript](https://www.wisdomgeek.com/development/web-development/javascript/how-to-groupby-using-reduce-in-javascript/) that you can read.

## Array.prototype.groupBy

Array.groupBy returns an object where each property has the key as the value returned by the arrow function and value as an array of objects matching the criteria.[](https://dmitripavlutin.com/javascript-array-group/#2-arraygroupbytomap)

```
const groupedObject = array.groupBy((item, index, array) => {
  // ...
  return groupNameAsString;
});

```

The callback must return a string which would be the group name (JavaScript objects need to have keys as names or Symbols can be used as well).

## Examples

Let us assume we have the following array of objects:

```
const people = [
   { name: 'Saransh', age: 21 },
   { name: 'Wisdom', age: 20 },
   { name: 'Geek', age: 20 }
];
```

And we want to group them by their age:

```
const groupByAge = people.groupBy(person => {
  return person.age;
});

console.log(groupByAge); 

// {
//   '20': [
//     { name: 'Wisdom', age: 20 },
//     { name: 'Geek', age: 20 },
//   ],
//   '21': [
//     { name: 'Saransh', age: 21 },
//   ]
// }
```

An example of grouping a simple array of numbers into odd and even numbers:

```
const array = [1, 2, 3, 4, 5];

const oddEvenGroups = array.groupBy((num, index, array) => {
  return num % 2 === 0 ? 'even': 'odd';
});

console.log(oddEvenGroups);

// { odd: [1, 3, 5], even: [2, 4] }
```

## Array.prototype.*groupByToMap*

There are instances where you want a Map instead of a plain JavaScript object. The major benefit is that the keys are then not forced to be strings. The keys of the Map can be of any data type.

groupByToMap works exactly like the groupBy method, the only difference is that it returns a Map.

```
const groupByAge = people.groupByToMap(person => {
  return person.age;
});

console.log(groupByAge); 

// Map([
//   [20, [
//     { name: 'Wisdom', age: 20 }, 
//     { name: 'Geek', age: 20 },
//   ]],
//   [21, [
//     { name: 'Saransh', age: 21 }
//   ]
// ])
```

And that is it! 

**Note:** The TypeScript definitions for these methods have not been written yet. Follow this [issue](https://github.com/microsoft/TypeScript/issues/47171) for further updates on it.

That is as simple as it gets in terms of implementation and this should land in ES2022 soon and hopefully, the TypeScript definitions are done soon too.
