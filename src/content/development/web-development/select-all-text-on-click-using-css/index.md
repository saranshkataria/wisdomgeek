---
title: 'Select all text on click using CSS'
description: 'When a user has to select some text on a website, they have to drag and hold their mouse, or use double-click it. Sometimes, there are some samples that we know that the user is going to copy for sure. A use case for this can be code samples. The&#46;&#46;&#46;'
pubDate: 'Oct 22, 2021'
heroImage: './hero.png'
categories: ["Web Development"]
---

When a user has to select some text on a website, they have to drag and hold their mouse, or use double-click it. Sometimes, there are some samples that we know that the user is going to copy for sure. A use case for this can be code samples. The user-select CSS property can help do exactly just that.

```
.select-all-text {
    user-select: all;
    -moz-user-select: all;
    -webkit-user-select: all;
}
```

And if you were to click the above, it would select the full text on click.

You can also provide a none value to the user-select property to disable selection altogether:

```
user-select: none;
```

And that is it. A short and sweet way to select all text on click using CSS.
