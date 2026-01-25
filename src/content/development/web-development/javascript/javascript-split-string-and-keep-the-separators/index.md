---
title: 'JavaScript: Split string and keep the separators'
description: 'String.prototype.split() is a valuable method to split strings based on a delimiter. There often comes a scenario when we want to split a string and keep the separators in the result. The same JavaScript method provides a way to do so. Before we get into that, for people who are&#46;&#46;&#46;'
pubDate: 'Feb 01, 2022'
updatedDate: 'Oct 10, 2023'
heroImage: './hero.png'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

String.prototype.split() is a valuable method to split strings based on a delimiter. There often comes a scenario when we want to split a string and keep the separators in the result. The same JavaScript method provides a way to do so.

Before we get into that, for people who are unfamiliar with split(), here's a quick refresher.

## Split()

The function can be called on a string with two parameters. The first is the separator on which we want to split the input string. And the second is the limit which is an optional parameter and specifies the number of times that the separator should be matched.

The separator can be a string or a regex.

```
const inputString = 'The quick brown fox jumps over the lazy dog.';
console.log(inputString.split(" "));
//  ['The', 'quick', 'brown', 'fox', 'jumps', 'over', 'the', 'lazy', 'dog.']
```

Using regex for the separator:

```
console.log(inputString.split(/ /));
// ['The', 'quick', 'brown', 'fox', 'jumps', 'over', 'the', 'lazy', 'dog.']
```

## Splitting and keeping the separators

As the [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split#description) docs for Split() state:

When found, separator is removed from the string, and the substrings are returned in an array.

But there is a workaround for regular expressions. Using [positive lookaheads](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Assertions#other_assertions), we can assert that the regular expression exists, but not actually match it. In simpler words, if parenthesis, that is ( and ), are used in the separator, matched results are included in the array.

```
const inputString = 'Hello 1 word. Sentence number 2.'
const splits = inputString.split(/(\d)/)

console.log(splits)
// [ "Hello ", "1", " word. Sentence number ", "2", "." ]
```

**Note:** \d matches the character class for digits between 0 and 9.

Thus we can use lookarounds to separate strings and keep the separators too! This opens up easier ways to solve some string-parsing problems.
