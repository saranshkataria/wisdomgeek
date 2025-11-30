---
title: 'CSS :has a parent selector now'
description: 'CSS now includes a :has selector that allows us to apply styles on the basis of what is happening inside an element. Often referred to as a parent seletor, the :has() function allows us to achieve this and more. Let us take a look at this relative selector. It only&#46;&#46;&#46;'
pubDate: 'Nov 12, 2022'
heroImage: './hero.png'
categories: ["Web Development"]
---

CSS now includes a :has selector that allows us to apply styles on the basis of what is happening inside an element. Often referred to as a parent seletor, the :has() function allows us to achieve this and more.

Let us take a look at this relative selector.

```
div:has(img) {
  background: black;
}
```

It only applies the background if there is an image inside the div, otherwise, it will not. So

```
div>
     img />
div>
```

will get selected but if it is a simple div, or has anything else inside it, the styles will not be applied to them.

## Chaining

We can even chain the selector and have nested conditions:

```
div:has(h2):has(ul) {
  background: black;
}
```

## Not just a parent selector

I came across [this](https://www.bram.us/2021/12/21/the-css-has-selector-is-way-more-than-a-parent-selector/) article which takes the selector a bit further and does not limit the :has selector to just being a parent selector. You can select the children as well by combining it with the parent selector.

```
/*  Matches  elements that have a  as a child element */
figure:has(figcaption) { … }

/* Matches  elements that is a child of a  that contains a  child element */
figure:has(figcaption) img { … }
```

The second selector gives us the ability to select the child image and we can get a lot more creative and it opens a world of opportunities.

## Browser support

While CSS :has is a part of the official [spec](https://drafts.csswg.org/selectors-4/#has-pseudo), it is not fully supported across all [browsers](https://caniuse.com/css-has) yet. But it should hopefully be implemented by Firefox soon and we will get to use it in our future projects.
