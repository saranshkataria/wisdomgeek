---
title: 'Writing conditionals in CSS: when/else'
description: 'CSS already has had conditionals in the form of @media queries or @support queries to selectively apply styling to the document. But there is a new proposal called when/else which takes it to a different level. At the time of writing this post, the when proposal for when has been&#46;&#46;&#46;'
pubDate: 'Nov 24, 2021'
updatedDate: 'Oct 10, 2023'
heroImage: './hero.jpeg'
author: 'Saransh Kataria'
categories: ["Web Development"]
categoryHierarchy: ["Development","Web Development"]
---

CSS already has had conditionals in the form of @media queries or @support queries to selectively apply styling to the document. But there is a new proposal called when/else which takes it to a different level.

At the time of writing this post, the [when proposal](https://tabatkins.github.io/specs/css-when-else/) for when has been resolved to be adopted by CSSWG. The [else proposal](https://drafts.csswg.org/css-conditional-4/) is a separate one and is a level 4 specification right now.

Let us take a look at how they work.

## Using media queries

Using media queries, if we were to make our page responsive, we could add some logic like

```
@media (min-width: 800px) {
  /* styling logic for width > 800px */
}
```

And if we wanted to add some logic for smaller resolutions, we would do

```
@media (min-width: 800px) {
  /* styling logic for width > 800px */
}
@media (max-width: 799px) {
  /* width 
}
```

## Using when/else

The when else syntax is cleaner:

```
@when media(min-width: 800px) {
  /* .. */ 
}
@else {
  /* .. */ 
}
```

And it even supports multiple conditionals

```
@when media(min-width: 800px) {
  /* .. */ 
}
@else media(min-width: 600px) {
  /* .. */ 
}
@else {
  /* .. */ 
}
```

## Creating generalized rules

When else is not limited to @media queries. It can be combined with other conditionals as well.

So instead of doing:

```
@media (max-width: 799px) {
    @supports (display: flex) {
        .flex {
            flex-direction: row;
        }
    }
}
```

We can simply do:

```
@when media(max-width: 769px) and supports(display: flex) {
    .flex {
        flex-direction: row;
    }
}
```

@when can also be used inline

```
.button {
  padding: 2rem;
  @when element(max-width: 400px) {
    padding: 1rem;
  }
}
```

When the width is less than 400 pixels, the padding would be 1 rem instead of 2 rem.

## Additional new ways of writing media queries

There is another [proposal](https://www.w3.org/TR/mediaqueries-4/#mq-range-context) to the media queries spec, which will allow more semantic conditions while writing media queries themselves. It is again a level 4 specification right now.

Instead of writing min-width and max-width, media queries could then be rewritten as

```
@media (width 800px) {
  /* styling logic */
}
```

## Conclusion

The proposals are moving along fairly quickly and CSS has been on a tear lately. There is a debate about using @if instead of @when but the argument is that it'd conflict with Sass. There is a proposal to replace it with @where as well.

Irrespective of the name, this will be a great addition to the CSS toolset.
