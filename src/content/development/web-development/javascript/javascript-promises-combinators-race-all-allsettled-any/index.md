---
title: 'JavaScript Promise combinators: race, all, allSettled, any'
description: 'Promises have not been a new concept in the javascript community. They have existed in the ecosystem for a long time. JavaScript promises existed even before they were officially made a part of the ECMAScript spec in ES6. These initial implementations of JavaScript promise were in the form of framework&#46;&#46;&#46;'
pubDate: 'Dec 03, 2019'
updatedDate: 'Oct 15, 2023'
heroImage: './hero.jpeg'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

Promises have not been a new concept in the javascript community. They have existed in the ecosystem for a long time. JavaScript promises existed even before they were officially made a part of the ECMAScript spec in ES6. These initial implementations of JavaScript promise were in the form of framework level implementations but were standardized as part of the ES6 specification.

But for complex scenarios, it was always difficult to use the native Promise object since there was no API for handling a combination of promises. The specification for JavaScript promise has evolved a lot over the years and now we have additional support for the combinator methods on the Promise class.

The combinator methods take in an iterable object as an argument. They allow you to handle the combination of these promises according to the method's definition of handling the collection. These methods are: `Promise.all()`, `Promise.allSettled()`, `Promise.race()` and `Promise.any()`.

It is worth noting that while `Promise.all` and `Promise.race` have been a part of the specification since 2015, the other two combinator methods have not been. `Promise.allSettled` recently joined the gang (so, Edge and IE support does not exist). And `Promise.any` is at stage 3 of the process which means it is a candidate to be added soon-ish.

With the addition of the new combinator methods, javascript developers now have the flexibility to finally handle complex scenarios for multiple promise calls. And this post will cover them in detail.

If you are not up to date with the JavaScript promise specification, you can refer to [MDN ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)for documentation about them since we will not be covering the basics in this post.

## Possible states of a JavaScript promise

One thing to refresh before getting into all the JavaScript promise combinator methods is the possible states of promises. These will be important in distinguishing between the methods. So here is a brief refresher about the states of a promise object:

- “pending” – still waiting

-  “fulfilled” – promise succeeded

-  “rejected” – promise failed

-  “settled” – succeeded or failed

## The Promise.all method

The Promise.all method runs all the promises that have been passed to it lets you know if all the promises are fulfilled or if any one of them has been rejected.  If all of them are fulfilled, it returns an array with the fulfillment value of all the promises that were input to it. If any of the promises fails, it short circuits the evaluation and rejects with the rejection value of the failed promise. 

The important piece about it is the last part, that is you cannot handle partial failures. If one of the promises fails, Promse.all gets rejected.

Example outputs for the method would be:

```
let promise1 = Promise.resolve('Wisdom');
let promise2 = new Promise(function(resolve, reject) {
  setTimeout(resolve, 100, 'Geek');
});
let promise3 = Promise.reject((new Error('failed because of p3')));

Promise.all([promise1, promise2])
  .then(console.log); // ["Wisdom", "Geek"] 

Promise.all([promise1, promise2, promise3])
  .then(console.log) // Does not get called, but errors out
  .catch(error => { 
  console.error(error.message); // failed because of p3
});
```

Another important piece to note that promises themselves are not cancellable by definition (unless you are using a library that has support for it). So the promises do get executed individually, irrespective of if Promise.all gets fulfilled or rejected. The short-circuiting of Promise.all does not cancel any of the promises themself.

Potential use cases for Promise.all would be when you want to aggregate the success of multiple promises into an array when they all are successful and not get the result if even one of them fails. A potential use case will be that you are making multiple API calls to different services and you want to display a component only once after all of them have succeeded. And if any of the calls fail, you want to show an error message to the user since the data set is incomplete. In that case, Promise.all makes perfect sense.

## The Promise.allSettled method

What if you want a JavaScript promise combinator method that does not do the short-circuiting if any of the promises fails? A method that ignores failures and gives you a result of the succeeded promises? That is exactly where the Promise.allSettled method comes in.

Once all promises are settled, this method returns an array of objects. Each object has a status key with the value of the promise (fulfilled or rejected), and the other one will be the value if the promise is fulfilled or the reason if it got rejected.

Promise.allSettled does not get rejected if any of the promises are rejected and so the only case when it will be rejected would be when there is an error iterating over the promises. Let's look into an example:

```
Promise.allSettled([
  Promise.resolve('Wisdom'),
  Promise.reject('Geek'),
])
.then(console.log)

/*
Outputs:
[
  { status: 'fulfilled', value:  'Wisdom' },
  { status: 'rejected',  reason: 'Geek' },
]
*/
```

Promise.allSettled should become the defacto for making a lot of API calls since it does not short circuit at all and gives you all the values of all promises. It gives you a handler to perform operations when all things are done, irrespective of whether they resolved or got rejected. And it would rarely get rejected, so you do not need to worry about those catch statements as well.

The only caveat is that if one of the promises is pending, this method is not called until it gets fulfilled, which can cause error handling to be delayed for some time.

## The Promise.race method

This javascript combinator method can be useful when you want to do something as soon as any of the promises either gets resolved or rejected. The resolved promise will contain the value or the reason of the promise that got resolved or rejected first.

Let's dive into the example for this one:

```
let promise1 = new Promise((resolve, reject) => {
    setTimeout(resolve, 500, 'one');
});
let promise2 = new Promise((resolve, reject) => {
    setTimeout(resolve, 100, 'two');
});
let promise3 = new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('p3 failed')), 100);
});

Promise.race([promise1, promise2]).then(console.log);
// Both resolve, but promise2 is faster
// so output is "two"
Promise.race([promise1, promise2, promise3])
  .then(console.log)  // not called since promise3 rejects faster
  .catch(error => console.log(error.message)); // p3 failed
```

Promise.race can be used to create a pseudo version of a cancellable promise that times out after a certain time period.

```
let timeout = (timeoutLimit) => new Promise((resolve, reject) => {
    setTimeout(() => reject(), timeoutLimit);
  });
let promise1 = new Promise((resolve, reject) => {
    setTimeout(resolve, 500, 'one');
});
Promise.race([promise1, timeout(100)])
  .catch(() => console.log('request timed out'));

Promise.race([promise1, timeout(1000)])
  .then(() => console.log('did not time out'));
```

## The Promise.any method

Before we get into the implementation of this method, it is important to reiterate that this javascript promise combinator is not a part of the ECMAScript specification yet. It is at stage 3 of the proposal and will be included in the final spec soon.

This method is similar to the race method in the form that it only gets fulfilled when one of the input promises gets fulfilled. The only difference is that it does not care about rejections. It will only get rejected if all the input promises are rejected.

```
let promise1 = new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('p3 failed')), 100);
});
let promise2 = new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('p3 failed')), 300);
});
let promise3 = new Promise((resolve, reject) => {
    setTimeout(resolve, 500, 'p3 succeeded');
});

Promise.any([promise1, promise2, promise3])
  .then(console.log); // p3 succeeded
```

Even though the first two promises rejected before the third one, any will only resolve when it gets the first one that gets resolved, that is the third one. This can be useful if you are querying multiple endpoints and you wish to take the data from the one which returns the fastest.

## Concluding all JavaScript promise combinator methods

That is all the JavaScript promise combinator methods that exist as of today. Hopefully, this post gave you a good idea of the differences between them and when to use which one. To sum it all up, here is a cheat sheet:

Method Name
Short-circuit?
Fulfilled on?
Rejected on?

Promise.all
First rejected
All
Any

Promise.allSettled
N/A
Always
N/A

Promise.race
First settled
Any
Any

Promise.any
First resolved
Any
All

I hope this all helped you get a better understanding of all the JavaScript promise combinator methods, and if you have any questions, feel free to drop a comment below to start a discussion!
