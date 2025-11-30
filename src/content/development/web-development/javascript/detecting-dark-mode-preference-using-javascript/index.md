---
title: 'Detecting dark mode preference using JavaScript'
description: 'As dark themes have become popular across the web and across operating systems, we might want to check the user''s operating system preference when they visit our website. This way, we can initialize our website accordingly after detecting their dark mode preference. We can make use of the prefers-color-scheme media&#46;&#46;&#46;'
pubDate: 'Mar 02, 2022'
heroImage: './hero.png'
categories: ["JavaScript"]
---

As dark themes have become popular across the web and across operating systems, we might want to check the user's operating system preference when they visit our website. This way, we can initialize our website accordingly after detecting their dark mode preference.

We can make use of the prefers-color-scheme media feature to help us do this.

## Using CSS

```
@media (prefers-color-scheme: dark) {
  /* styles */
}
```

The possible values of the prefers-color-scheme are: light, dark, and no-preference.

## Using JavaScript

We will again make use of the same property, but use the window.matchMedia function to check for it.

```
const isDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
```

We can then use this to set the default value for a user that has set the dark mode as their operating system default. And we leave the default as light mode for the rest of the users.

If we want to add a listener to the property to ensure that we change the theme as the user switches between the two (this would rarely be a scenario, though), we can do so by:

```
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", event => {
    if (event.matches) {
      //dark mode
    } else {
      //light mode
    }
})
```

And that is it for this super small API! Now, go dark mode everything! 😉
