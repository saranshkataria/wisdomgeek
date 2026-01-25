---
title: 'How to unit-test a private (non-exported) function in JavaScript'
description: 'When writing unit-tests for JavaScript modules, we often encounter a dilemma wherein the module has some private functions that have not been exported. Testing a function that has been exported is easy since it can be imported in the unit testing framework, and the functionality can be tested. But how&#46;&#46;&#46;'
pubDate: 'Nov 19, 2020'
updatedDate: 'Oct 10, 2023'
heroImage: './hero.jpeg'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

When writing unit-tests for JavaScript modules, we often encounter a dilemma wherein the module has some private functions that have not been exported. Testing a function that has been exported is easy since it can be imported in the unit testing framework, and the functionality can be tested. But how to unit-test a private (non-exported) function?

## Testing exported function

Before we get to the private functions, let us get familiar with how we would test an exported function in JavaScript. We will be using [Jest](https://www.wisdomgeek.com/development/web-development/how-to-setup-jest-typescript-babel-webpack-project/) for writing this unit test. Let us assume a function foo such that:

```
// foo.js
export function foo() {
  return 'bar';
}
```

We will then write the corresponding unit test case for testing the functionality of the exported function as:

```
// foo.test.js
import { foo } from './foo.js'

describe('testing foo', () => {
  expect(foo()).toBe('bar');
});
```

Now that we are familiar with exported functions let us move to the next part. Let us first see what the issue would be first.

## Non-exported (private) function

A non-exported function would be something like the secret function in this file:

```
// foo.js
let secret = () => '🤫'
export function foo() {
  return secret();
}
```

Now, if we were to test for baz in our unit test,

```
// foo.test.js
import secret from './foo.js'

// secret is undefined
```

**Note:** We should generally not separately test private functions. They are a part of the implementation detail. If a private function behaves incorrectly, then the publicly exposed functions which make use of it would misbehave as well. This way, by testing the public interface, we are also testing the private function. But there are scenarios like the private function is too complex where this might be needed. Another scenario could be that multiple private functions are being invoked one after another in a public function, and we need to test them individually. 

Now that we know what the problem is, let us think of potential solutions.

The most obvious one would be to not have "secret" as a private function and export it from the module foo. Though it is a quick way of resolving this problem, it is not the right way to do it. We are exposing a lot of functionality for the sake of unit testing our module, which can bring in a lot of security risks with it.

## Introducing Rewire

Having written unit-tests in other languages, I knew there should be a better solution out there. I was looking for something that would let me keep the private functions as private members of the module but still make them testable. And [Rewire](https://www.npmjs.com/package/rewire) provided me with this functionality.

Though Rewire was introduced as a monkey patching solution for unit-tests, the official description states:

"Rewire adds a special setter and getter to modules so you can modify their behavior for better unit testing. You may:

- inject mocks for other modules or globals like a process

- inspect private variables

- override variables within the module."

And the second point is what we need to solve our problem!

## Rewire and ES6

The common js implementation of rewire does not have ES6 support. And since we are using ES6 imports in our project, we want to use a package that transfers the concepts to ES6. And that is where the babel plugin for rewire comes into play.

babel-plugin-rewire is inspired by rewire.js and transfers the concepts to ES6 using Babel. So we will install it in our project using npm/yarn:

```
npm install babel-plugin-rewire --save-dev
```

or

```
yarn add --dev babel-plugin-rewire
```

And in the babel config file, we need to import it:

```
// babel.config.js
module.exports = {
  plugins: ['babel-plugin-rewire'],
  ...
};
```

## Unit-test a private function

Now that we have Rewire in place using the babel-plugin, we can access the private/non-exported function using the __get__ method. This method on the module acts as a getter allowing us to pull out the private function:

```
// foo.test.js
import foo from './foo.js'

describe('testing foo', () => {
  const secret = foo.__get__('secret'); // rewire magic happens here
  expect(secret()).toBe('🤫');
});
```

And thus, we can have our cake and eat it too. We are magically able to call private functions without exporting them from the module. We no longer need to resort to hacks to get references to the non-exported JavaScript functions and can ensure that the function remains private.

We hope this post helped you understand how to unit-test a private (non-exported) function in JavaScript using Rewire. The method discussed above works not just for Jest but for other unit-testing frameworks as well. And we do not need to do any code refactors or export our private functions just for the sake of testing. You might also be interested in our [running a specific unit-test case in Jasmine](https://www.wisdomgeek.com/development/web-development/javascript/running-specific-test-cases-in-jasmine/) blog post if you are writing unit-test cases for JavaScript.

If there is something that you would like to add to the post or something that you think we should cover next, do leave a comment below telling us about it.
