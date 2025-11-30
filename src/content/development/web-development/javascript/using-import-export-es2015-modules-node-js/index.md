---
title: 'Using Babel to import/export ES2015 modules in Node.js'
description: 'Using "require" statements (commonJS syntax) in your server side code while writing "import" and "export" statements (ES2015 syntax) for your front end makes writing javascript a bit weird. The reason for not having import and export statements for modules is that node parses modules a bit differently than how they&#46;&#46;&#46;'
pubDate: 'Aug 15, 2017'
heroImage: './hero.png'
categories: ["JavaScript"]
---

Using "require" statements (commonJS syntax) in your server side code while writing "import" and "export" statements ([ES2015 ](https://www.wisdomgeek.com/web-development/using-es6-today-future-of-javascript/)syntax) for your front end makes writing javascript a bit weird. The reason for not having import and export statements for modules is that node parses modules a bit differently than how they are defined in the ECMAScript spec. In node, the modules are imported truly dynamically, that is, the file gets parsed whenever a property of the module is needed. The require statement just tells the V8 engine to use the module whenever needed. In ES6, however, we specify which functions or variables are needed from the module and the engine imports only those. Thus, an understanding of the contents of the module is needed by the parser before hand in this case. You can read more about the specifics in [this post](https://hackernoon.com/node-js-tc-39-and-modules-a1118aecf95e) if it interests you. The node community has decided to follow the [Michael Jackson script](https://medium.com/the-node-js-collection/an-update-on-es6-modules-in-node-js-42c958b890c) solution to this problem, and this issue should be resolved by early 2018. But that should not stop us from using ES6 modules, right? So what do we do? Remember Babel? Why not use that? Yes, we can use Babel to import/export ES2015 modules in Node.js as well!

There are two ways this can be achieved:

- Babel-Node

- Babel CLI

The first is useful when in development mode. The second one will be what you would want to use in production. Do note that you will need a .babelrc file in your directory with presets set to es2015 for these to work.

## Babel-Node

Babel-node transpiles the ES6 code to ES5 code on the fly for us and then executes it. This then allows you to import/export ES2015 modules in node.js. To have Babel-Node available as a command in your terminal, you need to install Babel CLI globally (Or install it locally and reference it from there in your build tool). You can then start using the executable `babel-node` instead of node in your scripts file and you should be good to go. So your start command would change to `babel-node server.js`

## Babel CLI

When usually in production, Babel-Node is not a recommended approach since there can be memory leaks and other issues when transpiling files on the fly. So instead, we use the command line to transpile the files first and then run them normally with node. To do so, you need to first install Babel using NPM, then transpile the code to an output directory using the command:

```
babel src --out-dir dist
```

This will take your code in the src directory, transpile it and output it into a dist directory, allowing you to use import/export ES2015 modules in node.js code inside the src folder, which is transpiled to require statements inside the dist directory and can be used in node. And then you can just do "node dist/server.js" to run it.

It is worth mentioning that there might be features which do not get transpiled by Babel since they are add-ons to the language itself such as additional methods on the prototype etc. For such purposes, we will need to add a production level dependency, Babel runtime. In addition to that, we would need a development dependency, babel-plugin-transform-runtime. This plugin will convert the missing features to require statements from the Babel runtime. We need to use the runtime in order to avoid the features being referenced from the global namespace. Also, you need to add this plugin in your .babelrc config file.

For example, if there were references to a promise object, such as

```
  let promise = new Promise((reject,resolve) => {});
```

These will get transpiled to 

```
var _promise = require("babel-runtime/core-js/promise");
var promise = new _promise(function (resolve,reject){})
```

This then allows you to use import/export ES2015 modules as well as use additional ES2015 features in your node.js code. It is worth mentioning though that there are a few features which the Babel runtime does not support. You might run into some errors, for example, some instance methods might not be available. So you need to be careful about choosing which ES2015 functions you are using.

That is how Babel will allow you to write ES2015 code and then transpile it for use in Node currently. Hopefully, the node team will implement the features within node itself so that we can bypass Babel altogether.
