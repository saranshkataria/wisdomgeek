---
title: 'How to write comments in React (JSX)?'
description: 'I was recently trying to comment out some logic inside my JSX to add context about what a potentially complex logic. I then realized that comments in JSX are weird. So, how to write comments in React (JSX)? You cannot use HTML comments because they are parsed as DOM nodes:&#46;&#46;&#46;'
pubDate: 'Oct 15, 2022'
updatedDate: 'Oct 25, 2023'
heroImage: './hero.png'
author: 'Saransh Kataria'
categories: ["React"]
categoryHierarchy: ["Development","Web Development","React"]
---

I was recently trying to comment out some logic inside my JSX to add context about what a potentially complex logic. I then realized that comments in JSX are weird. So, how to write comments in React (JSX)?

You cannot use HTML comments because they are parsed as DOM nodes:

```
const doesNotWork = () => {
  return Does not work -->
}
const doesNotWork2 = () => {
  return (
    // not a valid comment
  )
}
```

## How to write comments in React (JSX)

To write comments in React (JSX), we need to wrap them in curly braces.

```
const doesWork = () => {
  return {/* this works */ }
}
```

The curly braces tell the JSX parser to parse the code inside as JavaScript and not a string.

## Multi-line comments in JSX

Since the contents inside are parsed as JavaScript, this enables us to also do multi-line or single-line comments:

```
const doesWork = () => {
  return 
  {
    /*
      mult-line
      test
    */
  }
  {
      // single-line test
  }
  
}
```

In the case of a single-line comment, You cannot have the ending bracket in the same line because that will break everything.
