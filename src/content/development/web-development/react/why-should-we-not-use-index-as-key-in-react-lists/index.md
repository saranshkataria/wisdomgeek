---
title: 'Why should we not use index as key in React Lists'
description: 'When working with React, developers often come across the need to render lists of items efficiently. Every item in a list needs to have a key prop assigned to it. It is essential for enabling React to track changes made to these items. Using array indexes as these keys is&#46;&#46;&#46;'
pubDate: 'Jan 22, 2024'
updatedDate: 'Jul 14, 2024'
heroImage: './hero.png'
categories: ["React"]
categoryHierarchy: ["Development","Web Development","React"]
---

When working with React, developers often come across the need to render lists of items efficiently. Every item in a list needs to have a key prop assigned to it. It is essential for enabling React to track changes made to these items. Using array indexes as these keys is a common error made by beginners. Let us discuss why we should not use array index as key in React lists. We will also go into what alternatives exist and can be used for better performance and consistency.

## What are Keys in React?

Keys in React are unique string attributes that are used to identify what items in a list have been added, updated, or removed from DOM. They play a crucial role in optimizing the re-rendering process since they guarantee that only changed elements get updated, which improves the application's performance.

## The Issue with Array Indexes as Keys

Using array indexes as keys might appear to be easier at first glance, but it can introduce problems later. To start with, array indexes are not stable identifiers. React may render extra components if the array's order is altered by additions or deletions, as this affects the indexes. This can lead to performance issues and it can also potentially cause conflicts with sibling components and inconsistent UI.

## Alternatives to Array Indexes for Keys

We talked about why should we not use index as key in React Lists. But what should we use then? Some alternatives are:

1. $1

```
const posts = [
  { id: 'post-1', title: 'React Essentials' },
  { id: 'post-2', title: 'Understanding Hooks' },
  // ... other posts
];

const Posts = () => {
  return (
    ul>
      {posts.map((post) => (
        li key={post.id}>{post.title}li>
      ))}
    ul>
  );
}
```

1. $1

```
const todoItems = [
{ userId: 1, title: 'Buy milk', date: '2023-04-30' },
{ userId: 2, title: 'Send email', date: '2023-04-30' },
// … other items
];

const TodoList = () => {
  return (
    ul>
      {todoItems.map((item) => (
        li key={`${item.userId}-${item.date}-${item.title}`}>
          {item.title}
        li>
      ))}
    ul>
  );
}
```

1. $1

```
import { useId } from 'react';

function ListItem({ children }) {
  const uniqueId = useId();
  return li key={uniqueId}>{children}li>;
}

function MyList({ items }) {
  return (
    ul>
      {items.map((itemText) => (
        ListItem>{itemText}ListItem>
      ))}
    ul>
  );
}
```

Developers can fully utilize React's effective update mechanisms and create apps that are more resilient and maintainable by adhering to these best practices. Hope this post helped you learn more about React's internals and if you have any questions, leave a comment below.
