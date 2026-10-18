---
title: 'Fixing “error: cannot find module semver” error in Node.js'
description: 'When installing a package using npm, you might encounter the “error: cannot find module semver” error.'
pubDate: 'Oct 19, 2023'
updatedDate: 'Oct 23, 2023'
heroImage: './hero.jpeg'
author: 'Saransh Kataria'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","JavaScript"]
categoryPaths: ["development/web-development/javascript"]
tags: [{ name: "javascript", slug: "javascript" }, { name: "node", slug: "node" }]
---

When installing a package using npm, you might encounter the “error: cannot find module semver” error.

```bash
+ npm install
...
...
module.js:340
    throw err;
          ^
Error: Cannot find module 'semver'
    at Function.Module._resolveFilename (module.js:337:15)
    at Function.Module._load (module.js:287:25)
    at Module.require (module.js:366:17)
    at require (module.js:385:17)
```

The error is caused because of a corrupted package-lock.json or yarn.lock. The most common reason for this is a change in the node version.

## Fixing “error: cannot find module semver”

The fix is a pretty simple one. We need to nuke the node\_modules folder and the lock file.

```bash
rm-rf node_modules package-lock.json yarn.lock
```

Then we need to clear our npm cache:

```bash
npm clean cache --force
```

And re-install the packages

```bash
npm i
```

This should fix the error most of the time and if it does not, you probably will need to uninstall and reinstall Node to fix it.

If you’re using homebrew:

```bash
brew uninstall --force node
brew install node
```

And that should hopefully fix it\!
