---
title: 'Node.js introduces node: protocol imports'
description: 'Node.js recently introduced a node: protocol for built-in modules. Built-in node modules can now be imported by prefixing the node: protocol prefix. So, what previously used to be can now be imported as Benefits It is currently supported:'
pubDate: 'Dec 23, 2021'
updatedDate: 'Oct 10, 2023'
heroImage: './hero.jpg'
author: 'Saransh Kataria'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

Node.js recently introduced a node: protocol for built-in modules. Built-in node modules can now be imported by prefixing the node: protocol prefix.

So, what previously used to be

```
import * as fs from 'fs/promises';
```

can now be imported as

```
import * as fs from 'node:fs/promises';
```

## Benefits

- More explicit protocol makes it more readable and also makes it clear that a built-in module is being imported. Since there are a lot of built-in ones, this extra information is useful for beginners or for someone who might not know about one of them.

- It reduces the risk of a module present in node_modules overriding the newer imports.

It is currently supported:

In Node.js starting:

- v16.0.0, v14.18.0 (ESM `import` and CommonJS `require()`)

- v14.13.1, v12.20.0 (only ESM `import`)

In TypeScript by the latest versions of `@types/node`.
