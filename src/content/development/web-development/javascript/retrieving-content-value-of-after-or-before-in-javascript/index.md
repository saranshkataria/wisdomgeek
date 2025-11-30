---
title: 'Retrieving content value of ::after or ::before in JavaScript'
description: 'Let us suppose we had an HTML element which had an ::after property assigned to it. We are going to be retrieving the content value of ::after or ::before of this element using JavaScript. For the following element: If we needed a way of retrieving content value of ::after in&#46;&#46;&#46;'
pubDate: 'Nov 21, 2021'
heroImage: './hero.png'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

Let us suppose we had an HTML element which had an ::after property assigned to it. We are going to be retrieving the content value of ::after or ::before of this element using JavaScript. For the following element:

```
#element::after {
  content: 'Custom value'
}
```

If we needed a way of retrieving content value of ::after in JavaScript, that is &#8216;Custom value', we would need to make use of the getComputedStyle() method available on the window object.

```
const getContentValueOfPseudoElement = (element, pseudoSelector) => {
    const styles = window.getComputedStyle(el, '::'+ pseudoSelector);
    return styles.content;
}
```

Then, if we wanted to get the content value of ::before, we would do:

```
console.log(getContentOfPseudoElement(document.getElementById('element'), 'before'));
```

Or if we wanted the ::after element:

```
console.log(getContentOfPseudoElement(document.getElementById('element'), 'after'));
```

It is also worth noting that if the content property is not defined, we will get the string "none" as the result from the method.
