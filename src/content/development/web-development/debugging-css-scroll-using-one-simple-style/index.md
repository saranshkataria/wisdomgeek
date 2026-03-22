---
title: 'Debugging CSS scroll using one simple style'
description: 'I have been doing a lot of complicated front-end work off lately and that always brings me back to the class conundrum of which element was adding a horizontal/vertical scroll to my page/elements. Debugging CSS scroll is a pain that I have felt too many times now and I always&#46;&#46;&#46;'
pubDate: 'Nov 18, 2022'
updatedDate: 'Oct 10, 2023'
heroImage: './hero.webp'
author: 'Saransh Kataria'
categories: ["Web Development"]
categoryHierarchy: ["Development","Web Development"]
---

I have been doing a lot of complicated front-end work off lately and that always brings me back to the class conundrum of which element was adding a horizontal/vertical scroll to my page/elements. Debugging CSS scroll is a pain that I have felt too many times now and I always fall back to this one line that helps me.

## The one line of CSS that helps me in debugging CSS scroll

```
* {
  outline: 1px solid red;
}
```

There are different ways to add this line: adding it to the source code directly and removing it. But I usually add it to Chrome dev tools directly so that I don't have to remove it later.

The line adds a red outline to all elements on the page (* is the global selector). And using that, I am usually able to figure out which element is spilling out of the viewport and fix it.

Another thing to note is that `outline` is better than `border` in this case. Border widths can affect the layout of the elements. Depending on the `box-sizing` property, the width of the element would be different. `content-box` adds the width of the border to the calculated element width and `border-box` includes it in the calculation. That can make debugging CSS scroll a bit harder since it might affect those elements widths and heights.
