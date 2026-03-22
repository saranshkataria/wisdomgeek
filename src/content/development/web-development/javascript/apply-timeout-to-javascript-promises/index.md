---
title: 'Apply timeout to JavaScript Promises'
description: 'JavaScript promises do not have any time associated with them. We can use a .then() function and wait until the promise is resolved or rejected. We can even await it, and either of those works if the async task finishes in a reasonable amount of time. But in the case&#46;&#46;&#46;'
pubDate: 'Jun 10, 2021'
updatedDate: 'Oct 10, 2023'
heroImage: './hero.jpeg'
author: 'Saransh Kataria'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

JavaScript promises do not have any time associated with them. We can use a .then() function and wait until the promise is resolved or rejected. We can even await it, and either of those works if the async task finishes in a reasonable amount of time. But in the case when the task is potentially taking a long time, we might want to let the user know. We want to apply timeout to JavaScript promises in such scenarios.

Fortunately, there is a [JavaScript Promise combinator function](https://www.wisdomgeek.com/development/web-development/javascript/javascript-promises-combinators-race-all-allsettled-any/) that can help us with this:

## Promise.race

Promise.race takes an array of promises and waits for the first one to finish. Whichever promise gets resolved or rejected first is returned.

For example:

```
const promise1 = new Promise((res) =>
  setTimeout(() => res("promise1"), 1000),
);

const promise2 = new Promise((res, rej) =>
  setTimeout(() => rej("promise2"), 500),
);

const result = await Promise.race([p1, p2]);
// promise2
```

The result would have been promise 2, irrespective of whether it was resolved or rejected because it finishes first.

It is also worth mentioning that the arguments of the function are Promises. It can also work with async functions.

```
const asyncFunction = async (time, name) => {
  await new Promise((res) =>
    setTimeout(res, time),
  );
  return name;
};

const result = await Promise.race([
  asyncFunction(1000, "promise1"),
  asyncFunction(500, "promise2"),
]);

// promise2

```

## Applying timeout to JavaScript Promises

Using the above knowledge, we can easily apply a timeout to JavaScript promises by using Promise.race.

We will add another promise that rejects after the time limit is reached. And whichever promise finishes first will be returned.

```
const timeout = (promise, time) => {
  return Promise.race([
    promise,
    new Promise((res, rej) =>
      setTimeout(rej, time),
    ),
  ]);
};

```

We can use this helper function to apply timeout to JavaScript promises whenever we need it:

```
// takes 100ms
const promiseFunction = async () => {
  await new Promise((res) =>
    setTimeout(res, 100),
  );
  return "promise";
};

const result = await timeout(
  promiseFunction(),
  1000,
);
// promise
// because it finishes before the timeout of 1000 ms

// timeouts in 100 ms
await timeout(fn(), 50);
// error

```

It is also worth mentioning that the Promise does not get terminated; it keeps executing, and the result of the Promise gets discarded.

## Handling the error

The error from rejection and any other errors would be indistinguishable in the above implementation. So, we can add an exception argument as an input to our timeout function, which will be used as the rejection value. We can then uniquely identify the cause of the error and write our handling logic accordingly.

We will also add a clear timeout to our timeout to do some garbage collection of the timeout object using Promise.finally().

```
const timeout = (promise, time, exceptionValue) => {
  let timer;
  return Promise.race([
    promise,
    new Promise(
      (res, rej) =>
        (timer = setTimeout(rej, time, exceptionValue)),
    ),
  ]).finally(() => clearTimeout(timer));
};
```

And that is all we need to do to add timeout to JavaScript Promises. If you have any questions, feel free to drop a comment below.
