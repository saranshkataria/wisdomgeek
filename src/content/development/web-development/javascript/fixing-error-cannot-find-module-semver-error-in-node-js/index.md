---
title: 'Fixing &#8220;error: cannot find module semver&#8221; error in Node.js'
description: 'When installing a package using npm, you might encounter the "error: cannot find module semver" error. The error is caused because of a corrupted package-lock.json or yarn.lock. The most common reason for this is a change in the node version. Fixing "error: cannot find module semver" The fix is a&#46;&#46;&#46;'
pubDate: 'Oct 19, 2023'
updatedDate: 'Oct 23, 2023'
heroImage: './hero.jpeg'
author: 'Saransh Kataria'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

When installing a package using npm, you might encounter the "error: cannot find module semver" error. 

```
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

## Fixing "error: cannot find module semver" 

The fix is a pretty simple one. We need to nuke the node_modules folder and the lock file.

```
rm-rf node_modules package-lock.json yarn.lock
```

Then we need to clear our npm cache:

```
npm clean cache --force
```

And re-install the packages

```
npm i
```

This should fix the error most of the time and if it does not, you probably will need to uninstall and reinstall Node to fix it.

If you're using homebrew:

```
brew uninstall --force node
brew install node
```

And that should hopefully fix it!
