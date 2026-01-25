---
title: 'JSON.parse(): Fixing &#8216;SyntaxError: &#8220;[object Object]&#8221; is not valid JSON&#8217;'
description: 'SyntaxError: "[object Object]" is not valid JSON: usually happens when the value being passed to JSON.parse is not a string value. Let''s see how we can fix it. Scenario 1: The value is already an object Since the value being passed to JSON.parse is already an object, we don''t need&#46;&#46;&#46;'
pubDate: 'Oct 22, 2023'
updatedDate: 'Oct 22, 2023'
heroImage: './hero.png'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

SyntaxError: "[object Object]" is not valid JSON: usually happens when the value being passed to JSON.parse is not a string value.

Let's see how we can fix it.

## Scenario 1: The value is already an object

```
const object = JSON.parse({ website: "https://wisdomgeek.com" });
// Uncaught SyntaxError: "[object Object]" is not valid JSON
```

Since the value being passed to JSON.parse is already an object, we don't need to parse it again. It can simply be a definition of the object.

```
const object = { website: "https://wisdomgeek.com" };
```

## Scenario 2: The object needs to be converted to a string using `JSON.stringify` first

There might be cases where we want to parse an object value. In those cases, to avoid the &#8216;SyntaxError: "[object Object]" is not valid JSON' error, we need to convert the object to a string first.

```
const object = JSON.parse(JSON.stringify({ website: "https://wisdomgeek.com" }));
```

The above example is very naive and should not be used. But it can be helpful if there is something else that is happening in between the conversion, like converting the object to a string to store it in local storage and then retrieving it later.

**Note:** This is also a common technique to [create a deep copy of a JavaScript object](https://www.wisdomgeek.com/development/web-development/javascript/deep-copying-in-javascript-using-structuredclone/).

## Troubleshooting other scenarios

If you are still stuck, you might want to check the type of variable being passed to JSON.parse:

```
// let us assume this is initialized somewhere else
const object = { website: "https://wisdomgeek.com" };

const parsedObject = JSON.parse(object);
// Uncaught SyntaxError: "[object Object]" is not valid JSON

console.log(typeof object); // 👉️ "object"
// we need to pass a string
```

This will also help you if you forgot to wait for a promise to be resolved when fetching JSON from third-party sources.

```
const response = await fetch("https://dummyjson.com/products/1");
const text = response.text(); 
const parsedData = JSON.parse(text);

// Uncaught SyntaxError: "[object Object]" is not valid JSON
```

If we check the type of jsonData:

```
console.log(typeof jsonData);
// object
```

We can identify the issue and add a promise.then or an await to fix it.

```
const response = await fetch("https://dummyjson.com/products/1");
const text = await response.text(); 
const parsedData = JSON.parse(text);

// {id: "1", .... }
```

If the value being passed is a string and we still are getting an error, the string might not be a valid JSON:

```
// let us assume this is initialized somewhere else
const objectString = '{ "https://wisdomgeek.com" }';

const parsedObject = JSON.parse(object);
// Uncaught SyntaxError: Expected ':' after property name in JSON at position 27
```

In this case, you need to fix the string being passed into the JSON.parse method. You can use a JSON validator like [this](https://jsonlint.com/) one to check if the JSON is valid or not.
