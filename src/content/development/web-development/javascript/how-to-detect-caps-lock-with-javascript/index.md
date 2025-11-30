---
title: 'How to detect caps lock with JavaScript'
description: 'The need to verify and notify the user if the Caps Lock key is on is fairly common. It is particularly significant when constructing password inputs because users do not realize they are typing with their caps lock on. Let us see how to detect caps lock with JavaScript to do&#46;&#46;&#46;'
pubDate: 'Feb 11, 2024'
heroImage: './hero.png'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

The need to verify and notify the user if the Caps Lock key is on is fairly common. It is particularly significant when constructing password inputs because users do not realize they are typing with their caps lock on. Let us see how to detect caps lock with JavaScript to do so.

There is a method called `getmodifierState` that is available on `KeyboardEvent` that we can use to do so. This can be accessed inside an event listener for a keyboard-related event:

```
document.querySelector('input[type=password]')
  .addEventListener('keyup', (keyboardEvent) => {
    const isCapsLockOn = keyboardEvent.getModifierState('CapsLock');
    if (isCapsLockOn) {
        // code for notifying the user goes here
    }
});
```

And that piece of code tells us how to detect caps lock using JavaScript. We could have used the  `'keydown'` method instead of using `'keyup'` if we wanted to. But keyup has better browser support, so we prefer using that instead. Let us know in the comments if you have any questions.
