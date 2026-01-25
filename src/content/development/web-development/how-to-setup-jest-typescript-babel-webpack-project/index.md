---
title: 'How to setup Jest in a TypeScript, Babel and Webpack project'
description: 'As you might know, I have been diving into setting up a boilerplate for a TypeScript project with React. And what good is a project without a unit testing framework? So I will go through the process of setting up Jest with TypeScript and Babel in this post. If you&#46;&#46;&#46;'
pubDate: 'Apr 09, 2019'
updatedDate: 'Oct 15, 2023'
heroImage: './hero.png'
categories: ["Web Development"]
categoryHierarchy: ["Development","Web Development"]
---

As you might know, I have been diving into setting up a boilerplate for a TypeScript project with React. And what good is a project without a unit testing framework? So I will go through the process of setting up Jest with TypeScript and Babel in this post.

If you are curious about my project setup, you can read about how I [setup TypeScript with Babel](https://www.wisdomgeek.com/development/web-development/how-to-setup-typescript-with-babel-and-webpack/) and my [ESLint for TypeScript setup](https://www.wisdomgeek.com/development/web-development/how-to-setup-eslint-for-typescript-code/).

For people unfamiliar with Jest, it is a JavaScript testing framework which comes in with a lot of built-in capabilities such as mocking, assertion, snapshot testing etc. It works out of the box for JavaScript projects but since we are using TypeScript, we need to do some configurations, though it is not a lot.

## Installing Jest

To install Jest, all you need to do is run the `npm install jest` or `yarn add jest` command.

You should also add the corresponding types (@types/jest) for it since those will come in handy. You will also need to install `react-test-renderer` and its types. React test renderer allows you to render your React components to JavaScript objects instead of using the DOM tree. This increases the performance of your test cases since DOM manipulations are slower.

## Modifying your Babel configuration for Jest

In the Babel configuration, we set the modules property to false in our .babelrc file (for our Babel preset env). We did this because we were relying on Webpack to find out which imports are being used, transpile them and create the output bundle. We do not transpile the import statements using Babel because we want Webpack to be able to do tree shaking and eliminate dead code.

But Jest does not understand the module syntax and it does not know what to do. So, for Jest to understand what is going on, we will convert the modules to commonjs format. But we only want to do this when we are running Jest. So we change our .babelrc.js (You need to convert it into a JavaScript file for this to work) to the following:

```
module.exports = api => {
  // Testing if babel is being run in test mode
  const isTest = api.env('test');
  /**
   * Cache the returned value forever and don't call this function again. This is the default behavior but since we
   * are reading the env value above, we need to explicitly set it after we are done doing that, else we get a
   * caching was left unconfigured error.
   */
  api.cache(true);
  return {
    presets: [
      // For transformation of JSX and other react related bable plugins
      '@babel/preset-react',
      // Enabling Babel to understand TypeSFcript
      '@babel/preset-typescript',
      [
        // Allows smart transpilation according to target environments
        '@babel/preset-env',
        {
          // Specifying which browser versions you want to transpile down to
          targets: {
            browsers: ['last 2 versions'],
          },
          /**
           * Specifying what module type should the output be in.
           * For test cases, we transpile all the way down to commonjs since jest does not understand TypeScript.
           * For all other cases, we don't transform since we want Webpack to do that in order for it to do
           * dead code elimination (tree shaking) and intelligently select what all to add to the bundle.
           */
          modules: isTest ? 'commonjs' : false,
        },
      ],
    ],
  };
};
```

What is happening above is that we are reading the environment variable to check if the current mode is test or not. Jest sets that variable value when it starts execution. So, we get its value the first time Babel is executed, and then we set the cache value to true after that. This allows Babel to cache the returned value since we will not be changing it after this. After this, all we do is set the value of the modules property conditionally on the basis of this value. If it is test, we set it to &#8216;commonjs&#8216;, else it is set to false.

This sets up Babel for us, and all we are left with is writing the test cases and executing them.

## Writing a test case

Jest by default looks for test files with any of the popular naming conventions, that is files with:

- .js suffix in __tests__ folders

- .test.js suffix

- .spec.js suffix 

I prefer having the files next to the code that they are written with so that the imports at the top are shorter (since they are in the same folder). Colocation is also useful for larger projects.

A basic Jest test case looks like this:

```
import React from 'react';
import TestRenderer from 'react-test-renderer';
import App from './App';

it('renders without crashing', () => {
  TestRenderer.create(App />);
});
```

We are simply importing the required packages and files, setting expectations and hoping that it does not crash. You can add assertions using the `expect` method.

For running the test cases, all you need to do is run the jest command from the terminal. You can add a build script as `"test": "jest"` in your npm scripts and then do `npm run test` or `yarn test`.

## Creating coverage reports using Jest

Jest has built-in support for creating coverage reports for your test cases. All you need to do is pass the –coverage param while running Jest to get the report. This will create a report in the coverage/lcov-report which has an index.html file in there. You can open it in the browser to view the results.

It is worth noting that coverage mode adds additional code collection metrics to the statements, so it does slow down the execution of the test cases.

And this is all you need to know about configuring Jest to work in your Typescript project with Babel and Webpack. I have the final output as a repository [here](https://github.com/saranshkataria/frontend-starter-toolkit) which you might want to refer if you get stuck. It contains all the source code for configuring everything and I try to keep it updated.

If you have any questions, feel free to drop them in the comments section below.
