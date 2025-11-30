---
title: 'JSON Modules in JavaScript'
description: 'ES Modules were introduced in ES2015. The import and export keywords by default are only applicable to JavaScript code. But there is a new proposal to allow it to be used for JSON modules in JavaScript. It is convenient to keep some configuration inside a JSON file and import that.&#46;&#46;&#46;'
pubDate: 'Dec 08, 2021'
heroImage: './hero.png'
categories: ["JavaScript"]
---

ES Modules were introduced in ES2015. The import and export keywords by default are only applicable to JavaScript code. But there is a new proposal to allow it to be used for JSON modules in JavaScript.

It is convenient to keep some configuration inside a JSON file and import that. And this was possible using the commonjs module format. The [proposal](https://github.com/tc39/proposal-json-modules) will allow us to do import JSON Modules in an ES module.

Let us assume we have a configuration file called configuration.js. The following will give an error by default:

```
import config from './configuration.json';
```

Node.js will throw the following error:

```
TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".json"
```

## JSON modules proposal

The proposal now allows us to import JSON modules using an import assertion.

```
import jsonObject from "./file.json" assert { type: "json" };
```

assert { type: "json" } is what is defined as an import assertion that specifies the type of the module and how it should be parsed and imported as.

The jsonObject variable will contain the JavaScript object obtained after parsing the file.

**Note:** named imports are not available for JSON modules.

It is also possible to import JSON modules dynamically.

```
const { default: jsonObject } = await import('./file.json', {
  assert: {
    type: 'json'
  }
});
```

## Support

JSON modules currently work in Node.js >=17.1 by using the –experimental-json-modules flag.

```
node --experimental-json-modules index.mjs
```

For browsers, Chrome 91 already has support for JSON modules and others should implement it soon.
