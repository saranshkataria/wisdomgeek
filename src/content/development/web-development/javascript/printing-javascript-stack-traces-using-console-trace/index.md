---
title: 'Printing JavaScript stack traces using console.trace'
description: 'The console object in JavaScript has a lot more useful functions than the most frequently used console.log method. Debugging errors and finding execution flow can be a lot easier by making use of the console.trace method. It allows us to print the current stack trace where the method was called.&#46;&#46;&#46;'
pubDate: 'Jan 26, 2022'
updatedDate: 'Oct 10, 2023'
heroImage: './hero.png'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

The console object in JavaScript has a lot more useful functions than the most frequently used console.log method. Debugging errors and finding execution flow can be a lot easier by making use of the console.trace method. It allows us to print the current stack trace where the method was called.

## Usage

Writing console.trace() prints file names and line numbers of the call stack that exists when the method was invoked.

```
const stackTraceExample = () => {
  const nestedFunction = () => {
    console.trace();
  }

  nestedFunction();
}

stackTraceExample();
```

will print

```
nestedFunction @ VM56:3
stackTraceExample @ VM56:6
(anonymous) @ VM56:9
```

We can even pass arguments to the method:

```
const anotherExample = () => {
  console.trace('My log statement');
}

anotherExample();

/*
VM111:2 My log statement
anotherExample @ VM111:2
(anonymous) @ VM111:5
*/
```

Another thing to know as that the same trace is available on an error object as well.

```
const error = new Error('foo');
console.log(error.stack);
```

The links in the console are clickable and we can navigate to individual files if we wanted to read the source code. This makes debugging quicker and easier. If you have any questions, feel free to drop them as a comment below.
