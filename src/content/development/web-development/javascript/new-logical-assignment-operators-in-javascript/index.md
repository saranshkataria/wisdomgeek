---
title: 'The new Logical Assignment Operators in JavaScript'
description: 'The latest version of ECMAScript introduced three new logical assignment operators: nullish, AND, and OR operators. These are supported from Firefox 79 onwards, Chrome 85 onwards, and naturally there is no IE support but since Edge is now chromium based, it is available there too. They are not available in&#46;&#46;&#46;'
pubDate: 'Oct 08, 2020'
updatedDate: 'Oct 11, 2023'
heroImage: './hero.png'
author: 'Saransh Kataria'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

The latest version of ECMAScript introduced three new logical assignment operators: nullish, AND, and OR operators. These are supported from Firefox 79 onwards, Chrome 85 onwards, and naturally there is no IE support but since Edge is now chromium based, it is available there too. They are not available in Node.js quite yet either.

The new logical assignment operators are syntactical additions to write cleaner assignment in JavaScript. They have the same short-circuit behavior as the existing logical operators (+= and -=) and thus some people might love them and some people might not like them. But just like every new feature, we will eventually get used to them.

Let us take a look at the three new logical assignment operators: 

## Logical Nullish Assignment (??=)

```
expr1 ??= expr2
```

The logical nullish operator only assigns the value to expr1 only if it is nullish (null or undefined).

The expression:

```
x ??= y
```

might look to be equivalent to:

```
x = x ?? y;
```

But it is not! There is a subtle difference.

The nullish coalescing operator (??) operates from left to right and short circuits if x is not nullish. So the expression "y" will never be evaluated if x were not null nor undefined. Thus, if y was a function, it would not be invoked at all.

Therefore, this logical assignment operator is equivalent to:

```
x ?? (x = y);
```

Thus, this behavior is different than mathematical and bitwise assignment operators and is an important distinction to note. This applies to the next two operators as well.

## Logical OR Assignment (||=)

This logical assignment operator only assigns the value if the left-hand expression is falsy. Falsy is different than nullish since falsy can be any of the valeus: false, 0, "", null, undefined, and NaN and a few more.

The syntax:

```
x ||= y
```

is again equivalent to :

```
x || (x = y)
```

This can be useful in cases where we want to keep the existing value if it does not exist, otherwise we want to assign a default to it. For example, we want to set the inner HTML of an element to a default value if there is no data from a search request. Otherwise we want to display the existing list. This way, we avoid unnecessary updates and any side-effects such as parsing, re-rendering, losing focus etc. We can simply use this operator to update our HTML using JavaScript:

```
document.getElementById('search').innerHTML ||= '*No posts found matching this search.*'
```

## Logical AND Assignment (&&=)

As you might have already guessed, this logical assignment operator only assigns the value if the left-hand side is truthy. Thus:

```
x &&= y
```

whose equivalent again would be:

```
x && (x = y)
```

And that is all you need to know about these operators!

What do you think about these new operators being added to JavaScript? Do you like them/hate them? Let us know in the comments section below!
