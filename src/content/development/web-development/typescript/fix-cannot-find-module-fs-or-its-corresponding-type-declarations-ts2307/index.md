---
title: 'Fix Cannot find module ‘fs’ or its corresponding type declarations.ts(2307)'
description: 'I recently ran into the error “Cannot find module ‘fs’ or its corresponding type declarations.ts(2307)” while I was using VSCode and I was searching for a fix.'
pubDate: 'Jan 24, 2024'
updatedDate: 'Jan 24, 2024'
heroImage: './hero.png'
author: 'Saransh Kataria'
categories: ["TypeScript"]
categoryHierarchy: ["Development","Web Development","Typescript"]
tags: []
---

I recently ran into the error “`Cannot find module 'fs' or its corresponding type declarations.ts(2307)`” while I was using VSCode and I was searching for a fix.

Turns out all I needed to do was to add the definition file for node types in my project.

```bash
npm i -D @types/node
```

After that, reloading the window fixed the error\!

If you are still facing the error, maybe the .tsconfig file needs to be updated too. The `types` array inside compilerOptions needs to have “`node`” as a value inside the array.

```json
{
  "compilerOptions": {
    "types": [
      "node"
    ]
  },
}
```

And that should hopefully solve the `Cannot find module 'fs' or its corresponding type declarations.ts(2307)` error.
