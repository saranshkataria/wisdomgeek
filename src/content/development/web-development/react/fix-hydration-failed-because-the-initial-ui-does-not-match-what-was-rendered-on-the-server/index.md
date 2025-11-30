---
title: 'Fix: Hydration failed because the initial UI does not match what was rendered on the server'
description: 'Within a React or Next.js app, if you encounter the error "Hydration failed because the initial UI does not match what was rendered on the server", there could be a few reasons for it. Let us look at all the possible reasons and potential fixes for the error. Potential issues&#46;&#46;&#46;'
pubDate: 'Mar 12, 2024'
heroImage: './hero.png'
categories: ["React"]
categoryHierarchy: ["Development","Web Development","React"]
---

Within a React or Next.js app, if you encounter the error "Hydration failed because the initial UI does not match what was rendered on the server", there could be a few reasons for it.

Let us look at all the possible reasons and potential fixes for the error.

## Potential issues

### Incorrect HTML formatting

The most common cause for the error is incorrect HTML formatting in our code. 

But why does the browser not tell you that but instead throws the error "Hydration failed because the initial UI does not match what was rendered on the server"? Because the browser tries to fix these on its own and then does a comparison of the HTML it has from what the server sent, it fails to match the two. Thus it throws the generic error.

Some examples of invalid HTML are as follows.

Having a div element inside a paragraph is not allowed.

```
export const IncorrectComponent = () => {
  return (
    p>
      div>Incorrect HTMLdiv>
    p>
  )
}
```

A paragraph inside another paragraph is erroneous too. The same goes for an H1, or a list item too.

```
export const IncorrectComponent = () => {
  return (
    p>
      p>p inside paragraph is invalidp>
      h1>H1 inside paragraph is invalid tooh1>
    p>
  )
}

export const AnotherIncorrectComponent = () => {
  return (
    ul>
      p>
        li>Incorrect HTMLli>
      p>
    ul>
  )
}

```

The Link tag that is provided by Next.js is already rendered as an anchor component. Trying to add another anchor inside it will throw an error too, since an anchor cannot be placed inside another.

```
export const IncorrectComponent = () => {
  return (
    Link>
      a>Link tag already creates an anchor tag, so this errors tooa>
    Link>
  )
}
```

A `<table>` must have a `<thead>` or a `<tbody>` before adding any table rows (`<tr>` ).

```
export const IncorrectComponent = () => {
  return (
    table>
      tbody is needed inside a table
    table>
  )
}
```

Images inside an anchor tag throw an error too.

```
export const IncorrectComponent = () => {
  return (
    a>
      img />
    a>
  )
}
```

### Locale objects

When working with locale objects, like date or time objects that are being rendered in the component, it could lead to a mismatch in the output of the component. Who doesn't love timezones, right?

```
export const IncorrectComponent = () => {
  return (
    {new Date().toLocaleString()}
  )
}
```

### Incorrect CSS formatting

Incorrect CSS formatting can also lead to the error. For example, if you forget to add quotes when specifying background image

```
.image {
  background-image: url(https://www.wisdomgeek.com)
}
```

### Extensions

Another possible reason is that an extension might be inserting something in the client page that might lead to this error since the rendered HTML is different than what the server sent.

### Accessing the window object

If our component tries to access the window object, that is not going to be available on the server. That can lead to this error. This is pretty common when using a third-party component. Even checks like  `typeof window !== 'undefined'` can lead to this error. 

Sometimes you still need to access some of the properties mentioned above and there is no workaround. For those cases, there are a couple of possible solutions to fix it. Let us take a look at those next.

## Potential workaround solutions

### Use a useEffect to run only on the client side

We can intentionally render something different on the client side by using a variable that gets updated inside a useEffect hook.

```
import { useState, useEffect } from 'react'
 
export default function App() {
  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true);
  }, [])
 
  return (
    
      {isClient && {/* Window related checks or components can go here */}}
      {!isClient && "Pre-rendered content"}
    
  )
}
```

### Disable SSR

Another potential solution is to disable prerendering altogether for a component. In Next.js, we can do so using the following:

```
import dynamic from 'next/dynamic'

const DynamicComponent = dynamic(() => import('./Component'), { ssr: false })

export default NewComponent = () => {
  return (
    
      DynamicComponent />
    
  )
}
```

### Use suppressHydrationWarning

We can suppress the warning altogether by adding the HTML attribute suppressHydrationWarning to the component or element. For example, if we have a custom component that we want to suppress the warning for:

```
export default Component = () => {
  return (
    
      CustomComponent suppressHydrationWarning={true} />
    
  );
}
```

And those are all the potential solutions for fixing the "Hydration failed because the initial UI does not match what was rendered on the server" error. Let us know in the comments if you are still facing the error.
