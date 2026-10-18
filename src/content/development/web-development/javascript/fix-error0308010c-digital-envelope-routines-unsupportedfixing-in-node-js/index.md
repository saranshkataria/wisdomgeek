---
title: 'Fix “Error:0308010C:digital envelope routines::unsupportedFixing” in Node.js'
description: 'Node 17 introduced OpenSSL v3.0, which brought in some breaking changes, and the “Error: error:0308010C:digital envelope routines::unsupported” is a result of…'
pubDate: 'Oct 17, 2023'
updatedDate: 'Oct 23, 2023'
heroImage: './hero.jpg'
author: 'Saransh Kataria'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
tags: [{ name: "javascript", slug: "javascript" }, { name: "node", slug: "node" }]
---

Node 17 introduced OpenSSL v3.0, which brought in some breaking changes, and the “Error: error:0308010C:digital envelope routines::unsupported” is a result of one such change. It can be solved by passing in a “–openssl-legacy-provider” flag when running the application.

## Setting the NODE\_OPTIONS environment variable

We can set the environment variable that allows us to continue using the legacy provider. These are called legacy because they are not supported anymore and have security vulnerabilities. This is the quickest fix in the short term but one that should not be used long-term.

```bash
export NODE_OPTIONS=--openssl-legacy-provider
```

Or if we were using Windows:

```bash
export NODE_OPTIONS=--openssl-legacy-provider
```

### React scripts

For react-scripts, setting the environment variable is not enough. We need to pass the flag using Webpack to the scripts themselves. This can be done using the package.json commands:

```javascript
{
  "scripts": {
    "start": "react-scripts start --openssl-legacy-provider",
  }
}
```

**Note:** You might run into the [“node: –openssl-legacy-provider is not allowed in node\_options”](/development/web-development/javascript/fixing-node-openssl-legacy-provider-is-not-allowed-in-node_options-error/) error on other projects on the machine if you only set NODE\_OPTIONS and do not fix the underlying issue.

## Upgrade Node and npm packages

As mentioned earlier, the legacy options are a quick fix but one that we should avoid. Instead, we should upgrade to the latest versions to be more secure.

### Upgrading OpenSSL on our machine

We might need to update the local version of OpenSSL installed on our machine before upgrading packages that rely on it. For Mac, we need to run:

```bash
brew update
brew upgrade openssl
```

And for Ubuntu/Debian:

```bash
sudo apt-get update
sudo apt-get upgrade openssl
```

And CentOS/RHEL:

```bash
sudo yum update openssl
```

### Finding packages that rely on older OpenSSL

To find out which package is using an outdated version of OpenSSL, we can run the command:

```bash
npm audit fix
```

It will audit our project’s dependency tree and try fixing packages with known vulnerabilities.

There is also a –force flag if we want to force it to fix the packages with known vulnerabilities.

```bash
npm audit fix --force
```

The force flag can potentially break our project.

The yarn equivalent for these is:

```bash
yarn-audit-fix
```

### Upgrading to Webpack 5

Webpack [v5.61.0](https://github.com/webpack/webpack/releases/tag/v5.61.0) fixed the “error:0308010C:digital envelope routines::unsupported” error. So we might want to upgrade to a version higher than that using:

```bash
npm i webpack@latest
```

Or

```bash
yarn add webpack@latest
```

### React scripts

React scripts similarly fixed the “error:0308010C:digital envelope routines::unsupported” error in v5. So we can upgrade to them using:

```bash
npm i react-scripts@latest
```

Or

```bash
yarn add react-scripts@latest
```

Similarly, if we were using some other CLI, we’d need to re-install the version that stopped relying on the outdated OpenSSL version.

After updating the packages, we might still end up in an error state because of cached dependencies. To clean our cache, we need to run the following command:

```bash
npm cache clean --force
```

And do a clean install thereafter.

```bash
npm i
```

## Downgrade to v16

This is yet another short-term solution, which is a last resort, but sometimes things are not working, and we don’t have the time to figure it out. In those cases, we can just downgrade to Node 16 and not bother with the “error:0308010C:digital envelope routines::unsupported” error at all. If using nvm, we need to run:

```bash
nvm install 16.13.0
nvm use 16.13.0
```

And those are all the possible ways to fix the “Error:0308010C:digital envelope routines::unsupportedFixing” error in Node.js. Let us know in the comments below if you have any questions or are stuck with something.
