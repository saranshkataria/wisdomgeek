---
title: 'Chrome devtools: Using logpoints for logging messages directly'
description: 'When it comes to debugging JavaScript in Chrome devtools, there are two different camps: the console.log fans and the debugger/breakpoint maximalist. I often switch between the two depending on what problem I am tackling. There is a third option that is kind of in the middle. Logpoints provide us with&#46;&#46;&#46;'
pubDate: 'Mar 24, 2022'
heroImage: './hero.webp'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

When it comes to debugging JavaScript in Chrome devtools, there are two different camps: the `console.log` fans and the debugger/breakpoint maximalist. I often switch between the two depending on what problem I am tackling. There is a third option that is kind of in the middle. Logpoints provide us with a breakpoint-like mechanism that logs variables instead of halting the execution.

## How to add a logpoint

1. $1
2. $1
3. $1

All variables that are present in the current context can be logged using this.

Here's a video for the steps:

Logpoints: the best Chrome DevTools feature you aren’t using yet. [pic.twitter.com/m2h7rMknUx](https://t.co/m2h7rMknUx)

&mdash; danabra.mov (@dan_abramov) [April 30, 2020](https://twitter.com/dan_abramov/status/1255692247061929991?ref_src=twsrc%5Etfw)

This is particularly useful when dealing with third-party scripts which you cannot modify using your source code. Plus it saves a bunch of console.log/debugger cleanup once you are done debugging.

And that is it for this quick tutorial! Hope you found this tip useful and will start using more of it in your day-to-day debugging. Happy coding!
