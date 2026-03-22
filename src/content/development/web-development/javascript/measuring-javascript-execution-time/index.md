---
title: 'Measuring JavaScript execution time'
description: 'When it comes to performance of applications, measuring performance becomes important. For anything to be optimized, it must be measured first, optimized, and measured again to capture gains. Measuring JavaScript execution time thus becomes one of these steps. Modern browsers and the Node.js platform provide various API''s to measure code&#46;&#46;&#46;'
pubDate: 'Jul 01, 2021'
updatedDate: 'Oct 10, 2023'
heroImage: './hero.jpg'
author: 'Saransh Kataria'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

When it comes to performance of applications, measuring performance becomes important. For anything to be optimized, it must be measured first, optimized, and measured again to capture gains. Measuring JavaScript execution time thus becomes one of these steps.

Modern browsers and the Node.js platform provide various API's to measure code execution time.

We will be discussing a few ways of measuring JavaScript execution time in this post.

## 1. Date object

The easiest way to track execution time is to use a date object. Using `Date.now()` that returns the total number of milliseconds elapsed since the Unix epoch, we can store the value before and after the execution of the function to be measured and then get the difference of the two.

```
const start = Date.now();
 
await functionToBeMeasured(); 

const end = Date.now();
console.log(`Execution time: ${end - start} ms`);
```

## 2. Console time

Another easy solution is to use a console timer. The `console.time()` method starts a timer with a label. And a subsequent call to the `console.timeEnd()` method with the same label will output the time elapsed since the method was started.

```
console.time('Execution Time');
 
await functionToBeMeasured(); 

console.timeEnd('Execution Time');
```

## 3. Performance timers

Console timers do not provide high accuracy. If we want accuracy in 1-millisecond increments, we can use high-resolution timers like `performance.now()`. It also avoids some synchronization issues with the system clock.

```
const start = performance.now();
 
await functionToBeMeasured(); 

const end = performance.now();

console.log(`Execution time: ${end - start} ms`);
```

**Note:** If measuring in Node, `process.hrtime.bigint()` returns accuracy in nanoseconds.

This covers the ways of measuring JavaScript execution time. If we run into a scenario wherein we want to start measuring JavaScript execution time for multiple functions, we can make use of the Performance API and [Performance Observer](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver). They provide markers to track multiple entries and measure them independently.

## Measuring JavaScript execution time in Unit tests

To ensure the execution of a function is fast enough, it can be made a part of our unit tests. Many frameworks (Jest, Jasmine, etc.) allow the setting of a timeout for the execution of a test. The timeout feature can then be used to fail a test if the method takes longer to execute.

With Jasmine:

```
describe('testing time duration', () => {
  it('does not take longer than 5 seconds', async () => {
    await functionToBeMeasured();
  }, 5000);
});
```

And those are all the different ways of measuring JavaScript execution time.
