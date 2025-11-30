---
title: 'Creating new TypeScript types using template literal types'
description: 'TypeScript is way more powerful than I give it credit for. I recently learned about creating new TypeScript types using template literal types, and I was pretty surprised to know that TypeScript can do that. Let us assume we wanted to create a type for the CSS properties margin and&#46;&#46;&#46;'
pubDate: 'Feb 05, 2024'
heroImage: './hero.png'
categories: ["TypeScript"]
categoryHierarchy: ["Development","Web Development","Typescript"]
---

TypeScript is way more powerful than I give it credit for. I recently learned about creating new TypeScript types using template literal types, and I was pretty surprised to know that TypeScript can do that.

Let us assume we wanted to create a type for the CSS properties margin and padding, which can have sub-attributes such as top, right, left, and bottom. Instead of recreating those, we can use template literal types to achieve this

```
type Attribute = "margin" | "padding";
type SubAttribute = "top" | "right" | "bottom" | "left";

type MergedProperty = `${Attribute}-${SubAttribute}`;
```

and this would result in a new merged property:

```
type MergedProperty = "margin-top" | "margin-right" | "margin-bottom" | "margin-left" | "padding-top" |"padding-right" | "padding-bottom" | "padding-left";

```

And this helps us in creating new TypeScript types using template literal types. Pretty cool, right?
