---
title: 'React fragments: What and Why'
description: 'React fragments were a feature released in React 16.2. They have been around for a while now but have been a relatively lesser used feature. Let us explore the what and why the feature exists. What are React Fragments? React fragments are a syntactic addition to React that allow wrapping&#46;&#46;&#46;'
pubDate: 'Jul 15, 2021'
updatedDate: 'Oct 10, 2023'
heroImage: './hero.jpg'
author: 'Saransh Kataria'
categories: ["React"]
categoryHierarchy: ["Development","Web Development","React"]
---

React fragments were a feature released in React 16.2. They have been around for a while now but have been a relatively lesser used feature. Let us explore the what and why the feature exists.

## What are React Fragments?

React fragments are a syntactic addition to React that allow wrapping or grouping of multiple HTML elements without the need for any additional DOM nodes. We mostly come across this situation when a React component needs to return multiple elements.

The traditional approach has been to wrap them in a div element because a React component can return only one element. This behavior results in useless additional markup and also makes the DOM tree heavy with additional layers of divs.

The traditional solution to render 3 child components in a single component would have been:

```
const App = () => {
  return (
    div>
      ChildA />
      ChildB />
      ChildC />
    div>
  );
}
```

With fragments, this can be:

```
const App = () => {
  return (
    React.Fragment>
      ChildA />
      ChildB />
      ChildC />
    React.Fragment>
  );
}
```

**Note: **React.Fragment can also be replaced by empty tags as <></>.

```
const App = () => {
  return (
    
      ChildA />
      ChildB />
      ChildC />
    
  );
}
```

## Why React fragments?

There are 3 typical use cases for fragments.

### 1. Returning groups of elements

This one is the typical use case for fragments. As discussed above, using fragments avoids additional div containers that can make the DOM heavy and also often cause problems when styling things.

### 2. Conditional rendering

Fragments make it easier to conditionally render groups of elements without any extra markup.

```
const Login = ({isLoggedIn, name}) => {
    {isLoggedIn ? (
        
          h3>Welcome {name}h3>
          p>
            You are logged in!
          p>
        
      ) : (
        
          h3>Loginh3>
              input type="text" id="username" />
              input type="password" id="password" />
              input type="submit" value="Login" />
        
      )}
}
```

### 3. Rendering arrays with keyed fragments

Fragments can have key props! This is yet another powerful feature that can be pretty handy at times. This cannot be used with the empty tags though.

This can be helpful when rendering lists, such as:

```
const Glossary = ({items}) => {
  return (
    
      {items.map(item => (
        // Without the `key`, React will fire a key warning
        React.Fragment key={item.id}>
          dt>{item.term}dt>
          dd>{item.description}dd>
        React.Fragment>
      ))}
    
  );
}
```

## Advantages

- React fragments are a but faster and have little lesser memory consumption (lesser DOM nodes). This is helpful in applications with deep tree structures.

- Styling can be easier at times since there is no additional div created. Sometimes some libraries depend on parent child relationships, and the div in the middle causes layout issues.

- The DOM is easier to inspect because of less clutter.

And that is all there is to know about React fragments!
