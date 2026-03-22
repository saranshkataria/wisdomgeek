---
title: 'How to import/export ES6 modules in Node'
description: 'If you have been following the javascript ecosystem for a while, you already know that even though ES6 modules are a thing, you still cannot import/export ES6 modules in node.js as of today. Node 10 experimental flag for importing/exporting ES6 modules in Node Though Node 10 has added an experimental&#46;&#46;&#46;'
pubDate: 'Jun 19, 2018'
updatedDate: 'Oct 15, 2023'
heroImage: './hero.jpg'
author: 'Saransh Kataria'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

If you have been following the javascript ecosystem for a while, you already know that even though ES6 modules are a thing, you still cannot import/export ES6 modules in node.js as of today.

## Node 10 experimental flag for importing/exporting ES6 modules in Node

Though Node 10 has added an experimental flag (–experimental-modules) which allows you to use this functionality, upon using this functionality, you will soon realize that it is not that useful. You need to write your import/export statements in files which are named as ".mjs" instead of js files. Though that is because of the [way ES6 modules are being implemented](https://medium.com/the-node-js-collection/an-update-on-es6-modules-in-node-js-42c958b890c), but as a javascript developer, I should be able to keep using things I have been using and the modules should just work.

Even if I jump ship and start using the experimental flag for new projects that I am creating, using ES6 modules in node is still not that easy. As soon as you reference an npm package, you will get an error saying that the code being referenced is not in the Michael Jackson script format aka their file extensions are not ending with ".mjs". Now I cannot control the npm registry. So this experimental flag usage was not something that I could have used in any project since a node project without npm packages is pretty much useless these days. And I will never work on getting the interoperability among these two correct since there are better ways out there.

**Update 11/21/2019:** Node 13.2.0 ships support for ECMASCRIPT modules and you no longer require the experimental flag, even though the implementation is still experimental and subject to change. You can read [this](https://medium.com/@nodejs/announcing-core-node-js-support-for-ecmascript-modules-c5d6dc29b663) post to know more about the announcement.

## What other options do I have?

### **Babel**

The other option would have been to use babel as we have been doing for ages. Babel would then transpile our ES6 code to ES5 code and then we can run our server using the transpiled code. I have previously written about [using Babel to import/export ES6 modules using Node](https://www.wisdomgeek.com/web-development/using-import-export-es2015-modules-node-js/), but setting up Babel is a pain and an additional step which I would prefer avoiding whenever I can.

### ESM

John-David Dalton has created a super easy to use npm package called esm which allows you to use tomorrow's ES6 modules in node today! It is a zero-config solution which just works.

#### Using esm

You do not need to do much to use esm in your project. Firstly, you need to install it in your project.

- For new projects, Run `npm init esm` or `yarn create esm` depending on which package manager you prefer

- For existing projects, `yarn add esm` or `npm install esm`.

After that, you need to do is require this package when starting your server with node. For doing so you can use the require command line option when running your server. So for running the node server for the index.js file, you would use the command `node -r esm index.js`

If you don't want to modify the command line parameters, you can require the esm module in a separate file. So, create a new file, say server.js and its contents would be:

```
require = require("esm")(module/*, options*/)
module.exports = require("./index.js")
```

And then you can run server.js using node as you normally would.

If you are looking to get some more insights about esm and it's internals, this video should help you understand more:

Even if you don't watch it, you are not missing on much. You don't need to understand the implementation details and can easily keep using import/export for your ES6 modules in node if you followed the steps that I had mentioned above. So go ahead and remove dependencies to babel in your node project now and enjoy writing the future modules today!

Share this post with other fellow node developers to help them avoid the hassle of using commonjs in their node projects.

### Sponsored:

Take a small step towards being a professional web developer by migrating your web development/designing environment tools onto the cloud Hosted Citrix vdi at an affordable [citrix xendesktop pricing](https://www.clouddesktoponline.com/citrix-xen-desktop/) from CloudDesktopOnline. from CloudDesktopOnline. Learn more about [QuickBooks Hosting](https://www.apps4rent.com/quickbooks-cloud-hosting/) and Office 365 [Enterprise E1](https://www.o365cloudexperts.com/office-365-e1/) suite by visiting Apps4Rent.
