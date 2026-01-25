---
title: 'How to keep the screen awake using JavaScript'
description: 'Some new features in JavaScript are great to see, and the wake lock API is one of those. It allows us to interact with the host system and can help the developer instruct the operating system to keep the screen awake using JavaScript! This can be particularly useful for cases&#46;&#46;&#46;'
pubDate: 'Mar 05, 2024'
updatedDate: 'Mar 05, 2024'
heroImage: './hero.webp'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

Some new features in JavaScript are great to see, and the wake lock API is one of those. It allows us to interact with the host system and can help the developer instruct the operating system to keep the screen awake using JavaScript!

This can be particularly useful for cases where you want the user's device to not get locked due to inactivity timeouts. It can be useful for the browser to instruct the operating system that the user is engaging in an activity, such as recording something or watching a video.

The Wake lock API can then be used to prevent the screen from sleeping or being dimmed. For requesting the permission:

```
let screenLock;

try {
  screenLock = await navigator.wakeLock.request('screen');
} catch (err) {
  console.log('Error with wake lock: ', err);
}
```

If the request succeeds, the host machine will not sleep until the wake lock gets programmatically released. And that is pretty much all that is needed to keep the screen awake using JavaScript.

We wrap the code in a try-catch because the Screen Wake Lock request can be rejected if the host device is in power saver mode, or has a low battery, or the current tab is not visible.

For releasing the wake lock:

```
await screenLock.release()
```

It is also worth noting that the lock gets released automatically if the document becomes inactive (user changes tabs/windows etc.). To handle this, we could add a  `visibilitychange` event:

```
document.addEventListener('visibilitychange', async () => {
  try {
    screenLock = await navigator.wakeLock.request('screen');
  } catch (err) {
    console.log('Error with wake lock: ', err);
  }
});

```

**Note:**

A couple of things to keep in mind:

- The API is only available when the application is served over HTTPS.

- Though this API has been around for quite some time, not all browsers support it. You can check [MDN compatibility](https://developer.mozilla.org/en-US/docs/Web/API/WakeLock/request#browser_compatibility) to see which ones do. At the time of writing this article, firefox and Safari on iOS are not supported.

This is a great feature to use on devices to ensure that the device does not go to sleep.
