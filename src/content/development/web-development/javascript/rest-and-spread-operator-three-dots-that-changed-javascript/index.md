---
title: 'Rest and Spread operator: Three dots that changed JavaScript'
description: 'The rest and spread operator have changed the way I do a lot of things in JavaScript and I have started using the three dots for a lot of tasks I do. I have become a big fan of the syntax and I will be sharing some of the numerous&#46;&#46;&#46;'
pubDate: 'Oct 17, 2019'
heroImage: './hero.png'
categories: ["Development","JavaScript","Web Development"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

The rest and spread operator have changed the way I do a lot of things in JavaScript and I have started using the three dots for a lot of tasks I do. I have become a big fan of the syntax and I will be sharing some of the numerous applications of the spread operator in this post. But before we dive into the applications, here's a quick refresher of what these operators do:

#### **Rest parameter**

It is the process of collecting an indefinite number of arguments as an array.

For example, if we were to write a function that adds all the arguments it is passed, we can use rest parameter like this:

```
function sum(…args) {
  return args.reduce((previousTotal, current) => {
    return previousTotal + current;
  });
}

sum(1,2) // prints 3
sum(1,2,3) // prints 6
```

Using the spread operator allowed us to convert the arguments to an array and thus we could use array functions on it even though the sum function was invoked by comma-separated values.

**Note that** you could have replicated similar behavior by using the `arguments` keyword that exists but arguments provides you with an array-like object and not an array. So using array methods like `map`, `reduce` etc. is not an option there. Another downside is that it cannot be used in arrow functions since there is no concept of `this` when it comes to arrow functions.

#### **Spread operator**

It allows us to expand iterable objects into individual elements. The functionality is opposite to what we achieved with the rest parameter.

Taking the same example as above, if we were to write a function that adds all the elements of an array but we need to pass individual values as parameters, we can use the spread operator like this: 

```
function sum(x, y, z) {
  return x + y + z;
}

const numbers = [1, 2, 3];

console.log(sum(...numbers)); // prints 6
```

Instead of accessing elements individually like `numbers[0]`, `numbers[1]` and `numbers[2]`, we let the spread operator do that for us. You can apply the spread operator to all iterables such as arrays, objects, sets, maps etc. 

**Note that** even though spread operator can be applied to different data types, you cannot mix these, that is `[...{key:1}]` is still going to throw an error.

Now that you are all caught up with the operators, let's look at some practical applications of these apart from the ones that we have already mentioned.

## 1. Copying an array

This is the most common use case for spread operator. For creating a deep copy of an array, you can now simply do:

```
let copy = [...arr]
```

This will create a one level deep copy of the array. If you want a completely deep copy, you will have to use some other mechanism. What one level deep means is that the first level of references are copied as new instances on the array, but if it's a multi-nested array, then the references of the nested elements stay as is. So for the following example:

```
const original = [1, [2,3]];
const falseCopy = [...original];

falseCopy[1][0] = 1;
falseCopy[0] = 3;

console.log(original[1][0]); // would return 1 instead of 3
console.log(original[0]); //would still be 1
```

As can be seen from the example above, the first level of objects are copied as new instances but if there is nesting in the array, those get copied by references. The same goes for copying an object which is discussed later in this post, that is also a one level deep copy and not a fully deep copy.

## 2. Creating an array of unique elements

The above piece of code can be built upon by combining it with another nifty new EcmaScript feature (Sets) to remove duplicates from an array.

```
let uniqueElements = [...new Set(arr)]; 
```

Since a Set only stores unique elements, we remove the duplicates from the original array giving us an array of unique elements.

Similarly, you can convert iterable objects to arrays if you need to use the array methods. Like if you want to do filtering on a set, you can make it work like:

```
let elementsStartingWithA = &#91;...new Set(arr)].filter(e => e.startsWith('a'));
```

```
let elementsStartingWithA = [...new Set(arr)].filter(e => e.startsWith('a')); 
```

## 3. Concatenate arrays

You can apply the spread operator to multiple arrays to concatenate them to form a new array, all in one statement.

```
let concat = [...arr1, ...arr2]; 
```

## 4. Slicing an array

Spread operator can also be used to slice elements as well. If we want to remove the first element at the beginning of an array:

```
let [firstElement, ...remainingArray] = arr; 
```

If we do not care about the first element at all, we can choose not to even assign it to a variable by just using an empty comma:

```
let [, ...remainingArray] = arr; 
```

Similarly, if we wanted to remove 2 elements, we would have two commas at the beginning of that statement.

## 5. Creating a copy of an object

Applying the spread operator on objects, we can copy all properties of one object into another. It works exactly like the previous example of copying an array.

```
let copy = {...obj}
```

The spread operator creates a new object and extracts all keys and values from the first object and copies them to the newly created copy.

**Note that** the copy of the object that is created is a new object with all the original object's properties but none of its prototypal information. So if there's information on the prototype that you want to be retained (for instance if it's a class instance and you want to check later if the newer object is an instance of the class), this might not be a good idea.

## 6. Merging objects

Similar to the array example, the spread operator can be used on multiple objects to combine them into one.

```
let merge = {...obj1, ...obj2}
```

The only difference is that if both the objects have the same keys, the rightmost property has precedence and it overwrites anything else.

## 7. Conditionally adding properties to objects

This one is getting deep into the weeds but is simply an amazing application and needs to be mentioned. You can conditionally add properties to a new object that you are creating by making use of the spread operator along with short circuit evaluation:

This one is getting deep into the weeds but is simply an amazing application and needs to be mentioned. You can conditionally add properties to a new object that you are creating by making use of the spread operator along with short circuit evaluation:

```
let conditionalMerge = {...obj1, ...(condition ? obj2 : {})}}
```

We only spread the object if the condition is truthy, and hence the true and false can be replaced with conditions and only if the conditions are met, those values will get added to the resulting conditionalMerge object. For a concrete example since this is a bit nifty to wrap your head around, the following statement:

```
let conditionalMerge = {
  ...{ key1 : 1 },
  ...(true ? { key2 : 2 }: {}),
  ...(false ? { key3 : 3 }: {})
}
```

will give the output object as:

```
{
key1:1,
key2:2
}
```

This can be used for arrays as well:

```
const plugins = [
  new BasicPlugin(),
  ...env === 'production' ? [new ProductionPlugin()] : [],
];
```

## 8. Splitting a string to characters

If you use the spread operator on a string, it splits it into an array of characters. This is similar to calling the split method with an empty string as the parameter.

```
let charactersArray= [...str]
```

## 9. Destructuring and Rest Operator

You can combine destructuring with the rest operator to extract information into variables.

```
let [a, ...b] = [1, 2, 3];
console.log(a); // 1
console.log(b); // [2, 3]
```

You can even assign default values when doing destructuring to incorporate null checks inside the destructuring assignment itself.

```
const { { keyWithDefaultValue } } = {
    keyWithDefaultValue: "default value", 
    ...objectToBeCopiedFrom
}
```

And these are some of the most commonly used use cases for the rest parameter and spread operator in JavaScript. Though these might not seem to be significant ones, once you start using them in your day to day coding, you will realize that they allow you to write code that is a lot more concise and elegant.

If there are some other use cases that you think should be a part of this list, feel free to add them as a comment below. And if you found these useful, start using them and also share this post with your peers to make them aware of these.
