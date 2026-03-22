---
title: 'Using async/await in ExpressJs'
description: 'If you have not been living under a rock for the past few years, you probably have heard of async/await. It has been one of the interesting additions to EcmaScript. It makes control flow easier to understand and read and also allows to write concise, maintainable code. If you need&#46;&#46;&#46;'
pubDate: 'Aug 06, 2020'
updatedDate: 'Oct 11, 2023'
heroImage: './hero.jpeg'
author: 'Saransh Kataria'
categories: ["Web Development"]
categoryHierarchy: ["Development","Web Development"]
---

If you have not been living under a rock for the past few years, you probably have heard of async/await. It has been one of the interesting additions to EcmaScript. It makes control flow easier to understand and read and also allows to write concise, maintainable code. If you need a refresher on async/await, you can refer to the [MDN article](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) about it. We are going to be more focused on using async/await in ExpressJs in this post.

## Using async/await in ExpressJs controllers

Node 8+ supports async/await out of the box and you can start using them right away in your node/express application. So if we had a method like this in our controller:

```
app.post('/test', (req, res) => {
  // Call async function here
})
```

We can convert this into a function that uses async/await in Express by first marking the handler as an async function. Then we can call await inside of the request handler.

```
app.post('/test', async (req, res) => {
  const result = await asyncFunction(req.body);
  res.json(result);
})

```

## What about error handling?

If the above function would have worked and you already knew about async/await syntax, this blog post would have been a waste of your time. What would happen if asyncFunction above throws an error? If you do not handle anything in there, express will throw a UnhandledPromiseRejection error and the client would not know what happened.

To handle an error in the asynchronous function, it needs to be wrapped in a try-catch block.

```
app.post('/test', async (req, res) => {
  try {
    const result = await asyncFunction(req.body);
    res.json(result);
  catch (error){
    console.log(error);
  }
})

```

This will handle the error, but express still does not know that an error has occurred. So the error needs to be passed to express using the next method.

```
app.post('/test', async (req, res) => {
  try {
    const result = await asyncFunction(req.body);
    res.json(result);
  catch (error){
    console.log(error);
    next(error);
  }
})

```

## What happens if there are more than 2 async functions?

If there are 2 asynchronous functions that need to be invoked, the first thing that would come to mind would be:

```
app.post('/test', async (req, res) => {
  try {
    await asyncFunction1(req.body);
  }
  catch (error){
    next(error);
  }
  try {
    await asyncFunction2(req.body);
  }
  catch (error){
    next(error);
  }
})

```

But this is not needed. If the first function throws an error, the request would be returned to the error handler immediately. The second function will not be invoked anyway. Since only one of these will throw an error, we can refactor it as:

```
app.post('/test', async (req, res) => {
  try {
    await asyncFunction1(req.body);
    await asyncFunction2(req.body);
  }
  catch (error){
    next(error);
  }
})

```

## Can we refactor this code even more?

Writing try/catch blocks in every request handler would not be a great way of writing code. Whenever you see duplication, you know things are getting more complicated than they should be.

A simpler way to do this would be to convert the above code into a promise:

```
app.post('/test', async (req, res) => {
  let runAsync = () => {
    await asyncFunction1(req.body);
    await asyncFunction2(req.body);
  }
  runAsync().catch(next);
})

```

And the logical next step is to abstract the catch mechanism into a different method of it's own.

```
function runAsyncWrapper (callback) {
  return function (req, res, next) {
    callback(req, res, next)
      .catch(next)
  }
}

app.post('/test', runAsyncWrapper(async (req, res) => {
    await asyncFunction1(req.body);
    await asyncFunction2(req.body);
}));

```

Now you can keep using the wrapper function and writing async/await in ExpressJs just like you would anywhere else, without worrying about other things.

You can also use packages like [express-async-handler](https://www.npmjs.com/package/express-async-handler) and [@awaitjs/express](https://www.npmjs.com/package/@awaitjs/express) to do the same thing if you do not like writing the wrapper function yourself. The packages do the same thing but in a robust way, they ensure that next is always the last argument being passed.

And that is it! Start using async/await in express as if it's nobody's business.
