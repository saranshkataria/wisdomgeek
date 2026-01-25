---
title: 'How To Fix ReferenceError: __dirname is not defined'
description: 'I recently tried to use __dirname inside a ES module. It turns out, that I cannot. It throws an error. So let us see how To Fix ReferenceError: __dirname is not defined. For people who do not know what it is, let us first discuss what __dirname is. __dirname is a global variable in Node.js&#46;&#46;&#46;'
pubDate: 'Feb 15, 2024'
updatedDate: 'Feb 15, 2024'
heroImage: './hero.jpg'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

I recently tried to use `__dirname` inside a ES module. It turns out, that I cannot. It throws an error. So let us see how To Fix ReferenceError: __dirname is not defined.

For people who do not know what it is, let us first discuss what `__dirname` is.[](https://www.devbabu.com/author/chandan-tudu/)

`__dirname` is a global variable in Node.js that can be used to reference the directory name of the current module.

We can use `import.meta.url` and `fileURLToPath` to get the name of the directory in ES modules.

```
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

We are importing the dirname function from the Node.js path module. [`import.meta`](https://nodejs.org/api/esm.html#importmeta) is a property that can be used to access context-specific metadata of an ES module.

import.meta.url gives us the URL of the current module (including query parameters and/or hash if they exist). Using the combination of these properties, we are able to replicate `__dirname` functionality in an ES module and able to fix the "__dirname is not defined in ES module scope" error.
