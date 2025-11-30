---
title: 'JavaScript: fix &#8220;SyntaxError: cannot use import statement outside a module&#8221;'
description: 'I recently was working with a third-party library. I ran into the error "Uncaught SyntaxError: cannot use import statement outside a module" when I tried to import a function from the package. Let us look into why it occurred and how I fixed it. Why is this happening? The error&#46;&#46;&#46;'
pubDate: 'Oct 09, 2023'
heroImage: './hero.png'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

I recently was working with a third-party library. I ran into the error "**Uncaught SyntaxError: cannot use import statement outside a module**" when I tried to import a function from the package. Let us look into why it occurred and how I fixed it.

## Why is this happening?

The error description "Uncaught SyntaxError: cannot use import statement outside a module" gives us some hints as to what is happening, but it is still unclear what the exact error is. It occurs when we are trying to use "import" inside a non-ES module. The error can occur in both Node.js environments and packages being imported in the browser. You can read more about [ES modules](https://www.wisdomgeek.com/development/web-development/javascript/how-to-import-export-es6-modules-in-node/) in this post if you are unfamiliar with them.

So whenever we try to import a CommonJS module, we will get the error: "**Uncaught SyntaxError: cannot use import statement outside a module**".

Now that we understand the why, let us look into potential solutions.

## Use CommonJS "require" instead of "import"

Let us assume we were importing the function `hello` from `wisdomgeek.js`. Then, the line that was causing the error would have been:

```
import { hello } from './wisdomgeek.js';
```

This would then be replaced by:

```
const { hello } = require('./wisdomgeek.js');
```

This is the most naive solution, but we cannot natively mix and match between ES modules and CommonJS modules. We can configure our bundler to make it work with both modules, but that can cause more problems than it solves.

## Convert the CommonJS package to use ES Modules instead

We want to convert the CommonJS package to use ES Modules without changing its source code. Luckily, there is a way to tell Node that our project uses ES modules no matter what the third-party package is written as. For this, we need to add a property in our `package.json` file:

```
{
  "type": "module"
}
```

After doing this, the import statement should work without any errors.

```
import { hello } from './wisdomgeek.js';
```

## What about script tags on the front end?

While the above solution works for Node.js, it does not work if we import the package inside a script tag. We can specify the type as an attribute on the script tag to resolve these errors. So, the import:

```
script src="wisdomgeek.js">script>
```

Becomes:

```
script type="module"src="wisdomgeek.js">script>
```

Those are all the solutions to solving the "**Uncaught SyntaxError: cannot use import statement outside a module**" error. Let us know in the comments section if it helped resolve your error.
