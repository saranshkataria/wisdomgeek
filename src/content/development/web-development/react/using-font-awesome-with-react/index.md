---
title: 'Using Font Awesome with React'
description: 'Font Awesome is a great resource to use various types of icons in your project including well-known social media icons and a lot more. It can be used with any front-end library. In this post, we are going to be using Font Awesome with React. Set up The first step&#46;&#46;&#46;'
pubDate: 'Oct 22, 2022'
heroImage: './hero.webp'
categories: ["React"]
categoryHierarchy: ["Development","Web Development","React"]
---

Font Awesome is a great resource to use various types of icons in your project including well-known social media icons and a lot more. It can be used with any front-end library. In this post, we are going to be using Font Awesome with React.

## Set up

The first step usually is installing some NPM packages and in this case, it's not so different. We will first install the core dependencies:

```
npm i --save @fortawesome/fontawesome-svg-core
npm i --save @fortawesome/react-fontawesome
```

Next up, we will install the packages for the icons themselves. Font Awesome comes with a collection of free icons that can be installed using:

```
# Free icons
npm i --save @fortawesome/free-regular-svg-icons
npm i --save @fortawesome/free-solid-svg-icons
```

and they have a paid set of icons as well which can be installed using:

```
# Pro icons
npm i --save @fortawesome/pro-regular-svg-icons
npm i --save @fortawesome/pro-solid-svg-icons
npm i --save @fortawesome/pro-thin-svg-icons
npm i --save @fortawesome/pro-light-svg-icons
npm i --save @fortawesome/pro-duotone-svg-icons
npm i --save @fortawesome/sharp-solid-svg-icons
```

For this post, we will be focussing on the free icons, though the setup is mostly going to be the same for pro icons with some checks for validation that we actually purchased them.

**Note:** to see which all icons are present, you can explore their [gallery](https://fontawesome.com/icons?d=gallery).

## Using Font Awesome with React

There are two ways of importing icons into your React project: individually and globally.

When adding icons individually, the icons are subsetted and optimized in the final bundle and you only include the icons that are imported into the bundle.

When doing it globally, all icons are imported in one go in an `init` module and we do not need to individually import them into each component. This method can impact performance or we could end up including icons that are not being used in the project.

Let us take a look at how we can achieve both of these.

### Individually importing icons

```
import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'

const element = FontAwesomeIcon icon={faCoffee} />

ReactDOM.render(element, document.body)
```

While this is a performant method than the global one, it can be a pain to add icons in different components.

### Globally importing icons

We will add the global icons in our application's entry point, such as the App.js file.

```
import ReactDOM from "react-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { faCheckSquare, faCoffee } from "@fortawesome/free-solid-svg-icons";

library.add(fab, faCheckSquare, faCoffee);
```

Then, in our children components, we will use it as:

```
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Beverage = () => (
  div>
    FontAwesomeIcon icon="check-square" />
    Your FontAwesomeIcon icon="coffee" /> is hot and ready!
  div>
);
```

We did not have to import individual icons in the file in this case. But the downside of this is that any icons imported globally are added to our bundle and it might increase the size of the bundle, even for routes that do not use the icons.

And those are the ways to use Font Awesome with React. We can choose from either way to do it depending on our project's needs. Let us know in the comments if there is anything else that you would like to know about using Font Awesome with React.
