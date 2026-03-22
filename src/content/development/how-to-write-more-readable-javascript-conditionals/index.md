---
title: 'How to write more readable JavaScript conditionals'
description: 'One of the practices of clean code is to make it more readable. And a fairly common use case in code bases is conditionals. I recently came across a way of writing more readable JavaScript conditionals and thought of sharing it with everyone. Consider the following conditional: The mind takes&#46;&#46;&#46;'
pubDate: 'Oct 04, 2022'
updatedDate: 'Oct 10, 2023'
heroImage: './hero.png'
author: 'Saransh Kataria'
categories: ["Development"]
categoryHierarchy: ["Development"]
---

One of the practices of clean code is to make it more readable. And a fairly common use case in code bases is conditionals. I recently came across a way of writing more readable JavaScript conditionals and thought of sharing it with everyone.

Consider the following conditional:

```
if (noteType === CallNoteType.Comment || noteType === CallNoteType.Text) {
}
```

The mind takes a few minutes to process the "if" conditionals. And it would be less readable if there were more note types that we were checking for.

Instead of chaining all the logical ORs, we can make use of the includes method on an array to get more readable JavaScript conditionals.

```
if ([CallNoteType.Comment, CallNoteType.Text].includes(noteType)) {
}

// or use a variable 
// to make it even clearer
if (editableNoteTypes.includes(noteType)) {
}
```

It looks like a tiny change, but it tremendously improves readability!
