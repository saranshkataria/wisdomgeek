---
title: 'Native popover API in HTML'
description: 'Popovers have been a problem that was typically solved by using a third-party solution. But that is no longer the case. We now have a native popover API in HTML supported by all browsers (Firefox added preview browser support on 16th April 2024 in version 125). Let us take a&#46;&#46;&#46;'
pubDate: 'Apr 18, 2024'
updatedDate: 'Apr 18, 2024'
heroImage: './hero.png'
author: 'Saransh Kataria'
categories: ["Web Development"]
categoryHierarchy: ["Development","Web Development"]
---

Popovers have been a problem that was typically solved by using a third-party solution. But that is no longer the case. We now have a native popover API in HTML supported by all browsers (Firefox added preview browser support on 16th April 2024 in version 125).

Let us take a look at how the native popover API works.

## Creating a popover element

Popovers are window-like components shown when a user interacts with an element (that serves as a trigger for showing them). It usually provides additional information or context. They are typically used as tooltips, context menus, toast menus, notifications, onboarding tours, etc.

First, look at the HTML needed to create a popover using the native popover API.

```
button popovertarget="wg-popover-container">Toggle popoverbutton>
div id="wg-popover-container" popover>Popover content goes herediv>
```

By default, the container element is hidden (thanks to the popover attribute) and is only visible when a user action triggers it. We can write some JavaScript to do that. However, we can simply use native popover API in HTML without needing any JavaScript. All we need is the custom attribute called `popovertarget`. It controls the display/hide logic of the div with the same id as the value specified for the attribute. The corresponding element gets hidden or shown when the button gets clicked.

**Note:** The popover attribute has the value auto by default, meaning that the popover force closes other popovers (except ancestors) when triggered. It can be set to `popover="manual"` to not force the closing of elements, and manual popovers need to be explicitly closed programmatically.

## Popover API and JavaScript

Even though JavaScript is not needed for usage, the popover API does provide a way to trigger popovers using JavaScript for it. The `HTMLElement.togglePopover()` method can be used to toggle the popover state programmatically. There also are methods for `hidePopover()` and `showPopover()` if we want to do the actions independently. Additionally, there are two events available `beforetoggle` and `toggle` which are fired before and after a transition state of a popover element.

## Popover API and CSS

It is worth mentioning that the popover elements are stacked on a different layer above the rest of the page. So we do not need to worry about z-index's. In addition to that, there are pseudo-classes, such as the `:popover-open` that allows us to target the element when it is opened and `::backdrop` allows us to add CSS to content behind the popover.

And that is all there is to the native popover API in HTML. It is also worth noting that there is no built-in support for responsiveness in the popover API, and it needs to be handled manually. There is no built-in animation support yet, but it is in the works.

Let us know in the comments if you have any questions!
