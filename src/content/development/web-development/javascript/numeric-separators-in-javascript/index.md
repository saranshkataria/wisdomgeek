---
title: 'Numeric Separators in JavaScript'
description: 'Writing performant code is not enough as a developer. We need to ensure that it is readable as well. And it is rare that an API change in a language introduces readability. Numeric Separators are one such rare change. Why numeric Separators? Reading this takes a few seconds: Counting the&#46;&#46;&#46;'
pubDate: 'Jun 16, 2021'
updatedDate: 'Oct 10, 2023'
heroImage: './hero.jpg'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

Writing performant code is not enough as a developer. We need to ensure that it is readable as well. And it is rare that an API change in a language introduces readability. Numeric Separators are one such rare change.

## Why numeric Separators?

```
const number = 100000000;
```

Reading this takes a few seconds:

Counting the number of zeroes is something nobody wants to do. It takes some mental capacity but there was no other way of writing them until now. With numeric separators, we can now use underscores to separate numeric literals.

## How?

```
const number = 100_000_000;
```

The rules with separators are pretty obvious ones. The number cannot start or end with underscores and there cannot be two consecutive underscores in a literal.

Also, it can be applied to binary, octal and hex numbers too!

```
const binary = 0b1_0000; // 16
const octal = 0o1_0_0_1; // 513
const hex = 0xA_B_C_0_0; // 703488
```

It is widely supported as well. IE is the only browser that does not have support. You can see the complete list [here](https://caniuse.com/mdn-javascript_grammar_numeric_separators).

Let us go and make our numbers easier to read!
