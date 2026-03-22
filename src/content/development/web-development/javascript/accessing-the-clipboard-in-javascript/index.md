---
title: 'Accessing the clipboard in JavaScript'
description: 'Developers are probably the laziest people on the planet. And of all the things, copy-paste is our favorite keyboard shortcut. But what is better than hitting ctrl + c? Having a button do the copying for you! And that is now possible using an asynchronous version of the clipboard API&#46;&#46;&#46;'
pubDate: 'Sep 08, 2021'
updatedDate: 'Oct 10, 2023'
heroImage: './hero.png'
author: 'Saransh Kataria'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

Developers are probably the laziest people on the planet. And of all the things, copy-paste is our favorite keyboard shortcut. But what is better than hitting ctrl + c? Having a button do the copying for you! And that is now possible using an asynchronous version of the clipboard API in JavaScript.

You would have probably come across this while copying code off of a website, or an API key, or copying links from Google Drive:

![](./image-1024x198-3.png)

## The clipboard API

document.execCommand() has been available to copy text way before the clipboard API became a thing. But it was a synchronous call, did not work correctly across all browsers (permission access was not consistent either), and had some security risks associated with it.

The newer asynchronous clipboard API is supported by all browsers and is more secure (only works on HTTPS pages by default, and is not available to background tabs).

## Implementing using JavaScript

For copying to the clipboard using JavaScript:

```
// copying to clipboard
navigator.clipboard.writeText(SOME_VALUE)
    .then(() => alert("Text is now stored your cliboard!"));
```

And for copying from it:

```
// copying from clipboard
await readText = await navigator.clipboard.readText();

```

We will need more code to detect browser support and error handling. But that is the gist of the API.

Both methods are supported in all modern browsers. And that is it. I hope this was helpful and that you start using it in the relevant places.
