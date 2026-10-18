---
title: 'How to clear the global npx cache'
description: 'I have been using npx a lot lately, especially whenever I want to use a CLI tool. It is an excellent alternative to installing packages globally since it…'
pubDate: 'Jun 02, 2024'
updatedDate: 'Jun 02, 2024'
heroImage: './hero.png'
author: 'Saransh Kataria'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","JavaScript"]
categoryPaths: ["development/web-development/javascript"]
tags: []
---

I have been using npx a lot lately, especially whenever I want to use a CLI tool. It is an excellent alternative to installing packages globally since it installs them in a temporary cache instead.

Even though it is installed in a temporary location, I figured it is a good idea to clear the cache once in a while. To do so, we can run the following command on a Mac:

```bash
rm -rf ~/.npm/_npx
```

And if we were on a Windows machine:

```bash
del /q /s %LocalAppData%/npm-cache/_npx
```

If npx cache is not located at one of these locations and we want to find the exact location for it, we can also use the following command to do so.

```bash
npm config get cache
```

And that is it. The command will clear the global npx cache and we can then install a new version if we want to do so or just have a clean slate to begin with. If you have any questions, do let us know in the comments below.
