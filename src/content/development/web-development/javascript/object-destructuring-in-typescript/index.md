---
title: 'Object destructuring in TypeScript'
description: 'Object destructuring is a powerful ES 6 feature that can help developers write cleaner code. It allows us to extract properties from a JavaScript object into variables. If you are unfamiliar with it, read our post about object destructuring to know more about what is possible using it. When it&#46;&#46;&#46;'
pubDate: 'Mar 28, 2024'
heroImage: './hero.png'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

Object destructuring is a powerful ES 6 feature that can help developers write cleaner code. It allows us to extract properties from a JavaScript object into variables.

If you are unfamiliar with it, read our post about [object destructuring](https://www.wisdomgeek.com/development/web-development/javascript/rest-and-spread-operator-three-dots-that-changed-javascript/) to know more about what is possible using it.

When it comes to object destructuring in TypeScript, the following statement doesn't work.

```
const { title: string, comments: number } = blog
```

Technically, the way it works is that it assigns the title property of the object to a variable named string and the comments property to the number variable. This happens because JavaScript assumes that we want to destructure and rename the variables, which is valid ES6 syntax.

The right way to do object destructuring in TypeScript would be

```
const { title, comments } : { title: string; comments: number }  = blog
```

Another alternative can be to use an interface or a type declaration:

```
interface Blog {
  title: string
  comments: number
}

const { title, comments }: Blog = blog
```

By default, the types usually get inferred, and this type of object destructuring is usually not needed. But for the cases when we do, we now know how to. I hope this post was helpful. If you have any questions, feel free to drop a comment below.
