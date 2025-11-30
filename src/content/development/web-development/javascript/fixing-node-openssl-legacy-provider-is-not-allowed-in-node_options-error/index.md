---
title: 'Fixing &#8220;node: &#8211;openssl-legacy-provider is not allowed in node_options&#8221; error'
description: 'I recently ran into the "node: –openssl-legacy-provider is not allowed in node_options" error while working with Node 17. It occurs when the NODE_OPTIONS environment variable is set with the value –openssl-legacy-provider. I had set that value for another project I tried recently, which conflicted with this project. Fixing the "node:&#46;&#46;&#46;'
pubDate: 'Oct 13, 2023'
heroImage: './hero.jpg'
categories: ["JavaScript"]
---

I recently ran into the "node: –openssl-legacy-provider is not allowed in node_options" error while working with Node 17. It occurs when the `NODE_OPTIONS` environment variable is set with the value –openssl-legacy-provider. I had set that value for another project I tried recently, which conflicted with this project.

## Fixing the "node: –openssl-legacy-provider is not allowed in NODE_OPTIONS" error

Since we know what is causing the error, the simple fix would be to remove that value. To do that, all we need to do is run the following command:

```
unset NODE_OPTIONS
```

While the above command works on Mac and Linux machines, it does not work on Windows. Windows users need to run:

```
set NODE_OPTIONS=
```

After running the command, the error should be fixed. After this, we should be able to run our npm scripts.

**Note: **Unsetting the NODE_OPTIONS can lead to a "[Error:0308010C:digital envelope routines::unsupportedFixing](https://www.wisdomgeek.com/development/web-development/javascript/fixing-error0308010cdigital-envelope-routinesunsupportedfixing-in-node-js/)" error for other projects. So you might want to fix the underlying issue of upgrading outdated OpenSSL and/or packages that depend on it. We cover how to upgrade in that post if you are interested in doing that.

## Still not working?

Sometimes, the issue still persists even after running that command. We should first verify that the NODE_OPTIONS value was reset by running:

```
echo $NODE_OPTIONS
```

on Mac. For Windows, the command would be:

```
echo %NODE_OPTIONS%
```

If that command prints an empty string, the unsettling worked, and there is either a cached value or some package causing some issue. So we will remove our node_modules folder and re-install the dependencies of the project.

```
rm -rf node_modules/
npm cache clean --force
npm install
```

We might need to remove the package-lock.json (or yarn.lock) as well if the error persists though that is pretty rare.

## Switch to a different version of Node

The `--openssl-legacy-provider` became a thing in Node 17 because of the usage of OpenSSL 3.0. And while downgrading is not the best solution to fix the "node: –openssl-legacy-provider is not allowed in node_options" error.

Some people were able to fix it by upgrading to Node 18 and then unsetting the NODE_OPTIONS value. If we are using nvm:

```
nvm install 18
nvm use 18
unset NODE_OPTIONS
```

Sometimes we just want to move on and not spend too much time into why things are broken. Downgrading to Node 16 might be a last resort but it is one we can lean towards if time is of the essence.

```
nvm install 16
nvm use 16
```

And those are all the ways to solve the "node: –openssl-legacy-provider is not allowed in node_options" error. Hope this post helped you resolve it.
