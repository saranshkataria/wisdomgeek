---
title: 'Using Emotion js in a react project'
description: 'CSS in JS is a fairly controversial topic depending on who you talk to. What it gives you is the ability to do is write all your styling in javascript instead of creating a separate CSS file. I really like CSS in JS because it solves some of the major&#46;&#46;&#46;'
pubDate: 'Jul 02, 2019'
heroImage: './hero.png'
categories: ["React"]
categoryHierarchy: ["Development","Web Development","React"]
---

CSS in JS is a fairly controversial topic depending on who you talk to. What it gives you is the ability to do is write all your styling in javascript instead of creating a separate CSS file. I really like CSS in JS because it solves some of the major challenges for me like scoping, conditional and dynamic styles, re-usability and maintainability (deleting styles with confidence). There are ways to solve this without using CSS in JS, but it is a concept that I have started playing with because of the challenges mentioned before. There are a ton of CSS in JS libraries as well, but after doing some research I chose Emotion js over the others. The major reason being it's small size and it being relatively faster than some of the alternatives. So I will go on and talk about how to use emotion js in your project in this post.

Emotion js allows you to compile your CSS in JS so that you eventually end up with a CSS file in the end which has the combined styles, but for development purposes you write your styles using the CSS in JS style. So let's get started with emotion js.

## Installing Emotion js

We will first install emotion js using npm/Yarn by using `npm install @emotion/core @emotion/babel-preset-css-prop` or `yarn add @emotion/core @emotion/babel-preset-css-prop`. This gives us the runtime for emotion and it's core library. The babel preset allows us to do some extra compiling ahead of time to make emotion js even faster.

**Note:** @emotion/core is a package that requires React and is recommended for React projects. The framework agnostic version on npm is named emotion and it does not require any setup or babel plugins. You don't get the css prop functionality with the framework agnostic version but this post is about a react project, so we will use the former.

## Using in a react component

 Before we start writing any code, we need to add the babel preset in our .bablerc file (under the presets field). Babel would then do the transformations required for everything to work. 

We would now open up a jsx file and start using emotion as follows:

```
import React from 'React'
import { css } from '@emotion/core';

export default () => {
  span css = {css`
      background-color: blue;
  `
  }>
    Hello emotion js
  span>
}
```

The tagged template literal {css (")} is a type of the template literal string that came out in ES2015. A tagged template literal just runs it's stuff through a function which is declared inside it. The function in this scenario happens to be the CSS function which is defined in Emotion.

Inside the tagged literal, you can put in normal CSS as you do otherwise. 

Now if you render this component anywhere, you will see a span with a blue background.

Since the CSS attributes above are template strings, you could just extract the color property to a JavaScript variable. It can then be made dynamic if you wanted to, on the basis of some condition. That is the benefit of CSS in JS!

Anything you can do with JavaScript, you can now do in here as well. You could even have a centralized file which consists of the theme and design that you want every component in the project to have and then just export it to all components. If you ever want to make changes to your style guide, changes to this central location would be enough to propagate it across the application.

### Compound selectors  

You can also do compound selectors using CSS in JS as you would in any other CSS pre-processing tool.

```
span css = {css`
    background-color: blue;

    &:hover: {
    text-decoration: underline;
    }
`}
>
```

The above snippet would render the same span as before, which would become underlined when you hover over it.

## Animations using emotion js

For doing animations, you need to import the keyframes from the emotion package. Using this tagged literal, you can do animations of all kinds. For example, the snippet for a spin animation would look something like this:

```
import React from 'React'
import { css, keyframes } from '@emotion/core';

const spinning = keyframes`
  to {
    transform:rotate(360deg);
  }
`;

export default () => {
span css = {css`
    background-color: blue;
    display: inline-block;
    &:hover: {
        animation: 2s ${spinning} linear infinite;
    }
`}
>
Hello emotion js
span>
}
```

If you are omitting the from property in an animation, it just takes the current state and animates till the to property.  The above snippet will create an animation of rotating the HTML element by 360 degrees. We then assign it to the &#8216;spinning' object.

We then assign it to the animation attribute of the span in its hover property. As a result, the span will be constantly spinning when you hover over it. This is probably not something that you want to do. But this gives you a simplistic idea about how to apply animations using emotion js.

## Inserting global Styles

No matter how modularized you want to get with CSS in JS, you always need some things to be applied globally. Emotion supports adding a Global component which allows you to add global styles. You can even make changes to this global CSS style based on state, allowing it to be dynamic in nature.

So you can add something like this in the render method:

```
Global
      styles={css`
        * {
          color: green;
        }
      `}
    />
```

This would inject the styles on a global level wherever this component is included. The above snippet would add the color green attribute to the global scope. Any HTML element that does not have a color property will now have a green color.

You can also create a layout file, add the global styles to this file and then have this at the root of your project. And since the global object is just another prop, you can change its values dynamically or create your own theming variation if you want to.

This should help you get started with emotion js in a react project. You can now keep experimenting with different possibilities with the library. Refer to the [docs ](https://emotion.sh/docs/introduction)for more information if you need to get in depth knowledge about a particular topic.

Do let us know in the comments section what you think about CSS in JS and emotion. Let us also know if you would be using emotion in any react projects anytime soon.
