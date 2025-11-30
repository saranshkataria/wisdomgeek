---
title: 'How to prevent npm install for unsupported Node.js versions'
description: 'npm configurations allow us to do quite a lot of nifty things. One of them is to allow the project to set the Node.js version that needs to be used in order to run the project. This also provides us with the functionality to prevent npm install for unsupported Node.js&#46;&#46;&#46;'
pubDate: 'Mar 17, 2022'
heroImage: './hero.jpg'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

npm configurations allow us to do quite a lot of nifty things. One of them is to allow the project to set the Node.js version that needs to be used in order to run the project. This also provides us with the functionality to prevent npm install for unsupported Node.js versions.

## The engines property

The engines property in the package.json can be used to define supported Node.js versions. It can accept a version range.

```
{
  "engines": {
    "node": ">=0.10.3 
  }
}
```

Specifying this property does not enforce the version. It only shows a warning when the user runs npm install on an unsupported Node.js version:

```
$ npm install

npm WARN EBADENGINE Unsupported engine {
npm WARN EBADENGINE   package: 'wisdom-geek@1.0.0',
npm WARN EBADENGINE   required: { node: ' },
npm WARN EBADENGINE   current: { node: 'v14.15.0', npm: '7.5.2' }
npm WARN EBADENGINE }
```

## Stopping npm install with an unsupported Node.js version

We need to create an npm configuration in the root directory of our project. You might know about this file as the `.npmrc` file. We then need to explicitly specify that we want to turn on engine checking for the project by using the key-value pair:

```
engine-strict=true
```

Once this is specified, and if someone tries to do an npm install on an unsupported Node.js version, they will get an error:

```
 npm install

npm ERR! code EBADENGINE
npm ERR! engine Unsupported engine
npm ERR! engine Not compatible with your version of node/npm: wisdom-geek@1.0.0
npm ERR! notsup Not compatible with your version of node/npm: wisdom-geek@1.0.0
npm ERR! notsup Required: {"node":"
npm ERR! notsup Actual:   {"npm":"7.5.2","node":"v14.15.0"}
```

## How do I do this while using Yarn?

Yarn does not need the .npmrc file and treats the engine property as strict by default.

```
$ yarn install

yarn install v1.22.5
info No lockfile found.
[1/5] 🔍  Validating package.json...
error wisdom-geek@1.0.0: The engine "node" is incompatible with this module. Expected version " Got "14.15.0"
error Found incompatible module.
info Visit https://yarnpkg.com/en/docs/cli/install for documentation about this command.
```

And that is all it takes to prevent npm install for unsupported Node.js versions! 🎉
