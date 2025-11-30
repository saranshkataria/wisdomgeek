---
title: 'Detecting element causing CSS overflow'
description: 'CSS overflows are an annoyance that keep showing up once in a while and are really hard to debug. Unwanted and unexpected scrollbars can lead to hours of inspecting the DOM to figure out what element is causing the issue and clicking random elements in the Chrome dev tools until&#46;&#46;&#46;'
pubDate: 'Oct 13, 2021'
heroImage: './hero.png'
categories: ["Web Development"]
categoryHierarchy: ["Development","Web Development"]
---

CSS overflows are an annoyance that keep showing up once in a while and are really hard to debug. Unwanted and unexpected scrollbars can lead to hours of inspecting the DOM to figure out what element is causing the issue and clicking random elements in the Chrome dev tools until you find the culprit.

A simple programmatic way of figuring out what is causing the issue can be:

```
document.querySelectorAll('*').forEach(elem => {
  if (elem.offsetWidth > document.documentElement.offsetWidth) {
      console.log('Problem child: ', elem);
  }
});
```

This will log all the elements that have an offset width greater than the document's width. And then you get to decide what you want to do with all these elements that are wider than the viewport.
