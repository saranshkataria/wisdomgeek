---
title: 'How to cancel an HTTP fetch request'
description: 'JavaScript promises have been a huge catalyst for asynchronous coding in the language. They have vastly improved the performance and experience for web development. One shortcoming of native promises has been that we were not able to cancel an HTTP fetch request once it was initiated. But now there is&#46;&#46;&#46;'
pubDate: 'Jan 19, 2021'
heroImage: './hero.jpg'
categories: ["JavaScript"]
---

JavaScript promises have been a huge catalyst for asynchronous coding in the language. They have vastly improved the performance and experience for web development. One shortcoming of native promises has been that we were not able to cancel an HTTP fetch request once it was initiated. But now there is a way to do so.

A new controller known as AbortController has been added to the DOM Standard that allows us to use it as a signal to cancel an HTTP fetch request. It makes use of an AbortSignal property to do so.

It was added in 2017 and is supported in most of the browsers (except IE, obviously). But now that IE support is ending soon, it might be that big of a deal.

## Why do we need to cancel an HTTP fetch request?

Before we get into the how-to part, let us first see why we would need to cancel an HTTP fetch request.

When we have an application that is composed of multiple components that can be dynamically added and removed to the DOM tree, many of the components are bound to make HTTP requests. And it might so happen that one of these components gets unmounted before the fetch request is completed. This could be fairly common in slow network conditions or if the user jumps is jumping around pages.

Because the fetch request is asynchronous, it will keep executing in the background and this might lead to some bugs when it gets completed, if not handled properly.

The default fetch timeout is 300 seconds for Chrome and 90 seconds for Firefox. These are way more than what a user would want to wait in case of unreliable network conditions. Therefore we definitely would want to implement our own way to cancel an HTTP fetch request, if needed.

## AbortController and AbortSignal

The AbortController and AbortSignal API are provided by the [DOM standard](https://dom.spec.whatwg.org/#aborting-ongoing-activities), and have been kept generic so that they can be used by other web standards. To declare a controller:

```
const controller = new AbortController();
```

and for the signal:

```
const signal = controller.signal;
```

The controller only has one abort method. And when that is invoked, the signal gets notified.

```
controller.abort();
signal.addEventListener('abort', () => {
  console.log(signal.aborted); // true
});
```

## How to abort an HTTP fetch request?

The fetch API itself does not allow programmatic cancellation of requests. But it can take in AbortSignal as a parameter. Then we can abort the fetch request after a specific time duration if we want to.

```
const controller = new AbortController();
const signal = controller.signal;

fetch(url, { signal })
  .catch(err => {
    if (err.name === 'AbortError') {
      console.log('Fetch was aborted');
    }
  });

// Abort the request after 4s
// aborts the fetch with 'AbortError'
setTimeout(() => {
  controller.abort();
}, 4000);
```

We can even create our own wrapper of a fetch with a timeout call if we want to:

```
async function cancellableFetch(url, data, timeout = 4000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(url, {
    ...data,
    signal: controller.signal  
  });
  clearTimeout(timer);

  return response;
}
```

A few things to note:

- If you pass in the same signal to multiple fetch calls, it cancels all requests with that signal on abort. So we can use it if there are multiple requests that need to be aborted if one fails.

- Since controllers are not reusable, if we do not want to abort all fetches when we cancel an HTTP fetch request, we need to create a new instance of the controller to all of them.

- The request gets aborted only at the client end. The server might still process it though the client will not receive the response.

- We could have used Promise.race to achieve this functionality as well but that solution would have left the request hanging instead of aborting the request. It would have continued to consume bandwidth in the background.

And that is how you can cancel an HTTP fetch request after a timeout, or abort it programmatically. I am excited about being able to do so and hope you are too. Let me know in the comments section if you plan on using this.
