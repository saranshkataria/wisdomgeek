---
title: 'How to setup ESLint for Typescript code'
description: 'The Typescript team recently announced its road map. Interestingly, they have decided to not focus on TSLint any more and focus their efforts on ESLint for Typescript linting instead. This is a great thing for the community overall since ESLint becomes the defacto linting tool going forward. In this post,&#46;&#46;&#46;'
pubDate: 'Mar 19, 2019'
updatedDate: 'Oct 15, 2023'
heroImage: './hero.png'
author: 'Saransh Kataria'
categories: ["Web Development"]
categoryHierarchy: ["Development","Web Development"]
---

The Typescript team recently [announced](https://eslint.org/blog/2019/01/future-typescript-eslint) its road map. Interestingly, they have decided to not focus on TSLint any more and focus their efforts on ESLint for Typescript linting instead. This is a great thing for the community overall since ESLint becomes the defacto linting tool going forward. In this post, we will set up ESLint for Typescript.

If you are looking to set Typescript up from scratch with Babel, then this post about [setting Typescript with Babel and Webpack](https://www.wisdomgeek.com/development/web-development/how-to-setup-typescript-with-babel-and-webpack/) might help you do that.

For people who are unaware of ESLint, it is a linting tool for JavaScript that allows you to identify and report errors based on a configuration of rules. It allows you to enforce a coding style, reduces chances of some common errors, and can also fix a few of those.

To add support in ESLint for Typescript, you need to add a custom parser to help it understand Typescript syntax. My first choice for this was [babel-eslint](https://github.com/babel/babel-eslint) since it would have worked for both Typescript projects and the ones that did not use it. But I faced a few challenges while setting the latest beta for it. Firstly, it only has [partial support](https://github.com/babel/babel-eslint/pull/711) as of now. Moreover, there are existing issues that need to be resolved to fully support ESLint for Typescript.

Hence, I moved to typescript-eslint which is the recommended way by the Typescript team. It is also maintained by them. For setting it up, I needed to first install @typescript-eslint/eslint-plugin and @typescript-eslint/parser. The first one allows you to enable linting rules in ESLint for Typescript specific functionality. The second one leverages typescript-eslint to help ESLint parse Typescript code.

For the initial setup, you should have installed ESLint and Typescript as developer dependencies.

## Setting up plugins required to enable ESLint for Typescript

To install, you can simply run the following command in terminal:

```
yarn add --dev @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

If you are using npm, you can use npm install -D instead of yarn add –dev.

## Configuring ESLint

Once you add those plugins, you need to create an eslintrc.js file in the root directory of your project to help configure ESLint for Typescript. This will be a javascript module exporting the config as an object. The file should look something like this:

```
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
};
```

The parser option tells ESLint to use the Typescript parser instead of its default. This helps ESLint understand Typescript language. Then we set the ECMA version to 2018 since we would be using the latest ES features in our code. And since we would be using ES modules, we set the source type to that.

We then add the @typescript-eslint argument to the plugins array to tell ESLint to use that plugin. We set the browser and node attributes in the env property to true so that ESLint knows about the globals such as window and import. Otherwise, it would through errors of no-undefined global imports.

The last attribute (extends) is the one wherein we set all the rules that we want to be enabled. These are the rules that ESLint checks for and finds out violations. You can use Airbnb rules here, or standard, but those are relatively strict ones. So I have only enabled the basic ESLint recommended rules along with the ones that the typescript plugin recommends.

Note that if you use [prettier](https://www.wisdomgeek.com/development/web-development/javascript/using-prettier-format-javascript-code/) for your project, you need to disable some ESLint rules since the ESLint recommended ruleset has a lot of defaults which might conflict with your prettier settings. You can install eslint-config-prettier and then enable that in the rules section to disable formatting related rules. You can refer to [this configuration file ](https://github.com/saranshkataria/frontend-starter-toolkit/blob/master/.eslintrc.js)to see more specific configurations if you use prettier.

## Running ESLint

Now all you need to do is either use npx to run linting in your project, or add a npm script in your project such as:

```
"lint": "eslint . --ext .ts,.tsx"
```

The . argument tells ESLint to run in the root directory of the project. You can change it to something else if you wish to. The ext parameter tells what file extensions to run ESLint on. You can add on to that list if you wish to by including js and jsx if you have those, or remove tsx if you are not working with react. Depending on the naming convention of the files, change those as you want to.

You can also add a –fix argument as another command to make ESLint fix some of the linting errors it throws.

You can also install an extension to your editor/IDE to keep running ESLint in the background and showing errors as you type your code. It does have support for all editors and is a handy one to have.

### Note for VS Code users

The [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint#overview) currently does not have TypeScript support by [default](https://github.com/Microsoft/vscode-eslint/issues/609). To enable TypeScript support, you will need to add some lines to your settings file. These changes can be made globally for Code in its settings panel, or you can add these lines in the file located at `.vscode/settings.json` (you can create this file if it does not exist ).

```
{
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    { "language": "typescript", "autoFix": true },
    { "language": "typescriptreact", "autoFix": true }
  ]
}
```

And that should set you up! You can see a complete version of this along with some linting rules for a react project in this [Github repo](https://github.com/saranshkataria/frontend-starter-toolkit) for reference. 

(It is also worth noting that there is an open bug for functional components in React for which it throws an error if you do not specify a return type to the function even though you have specified its type. I spent a considerable amount of time understanding the issue and turns out that it was an open [issue](https://github.com/typescript-eslint/typescript-eslint/issues/149) with the plugin and should be fixed soon.)

 Let me know in the comments section if you have any more questions.
