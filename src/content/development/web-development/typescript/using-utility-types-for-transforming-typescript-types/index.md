---
title: 'Using utility types for transforming TypeScript types'
description: 'TypeScript provides some built-in utility types that help facilitate transformations of types from one form to another. These utilities are available globally.'
pubDate: 'May 20, 2021'
updatedDate: 'Oct 10, 2023'
heroImage: './hero.jpg'
author: 'Saransh Kataria'
categories: ["TypeScript"]
categoryHierarchy: ["Development","Web Development","TypeScript"]
categoryPaths: ["development/web-development/typescript"]
tags: [{ name: "types", slug: "types" }, { name: "typescript", slug: "typescript" }]
---

TypeScript provides some built-in utility types that help facilitate transformations of types from one form to another.

These utilities are available globally. They can be quite handy in various situations.

## TypeScript generics

Before understanding the TypeScript utility types, it is important to understand type aliases and generics. You can create type aliases for any existing type in TypeScript.

```javascript
type MyString = string;

let helloWorldMessage: MyString = 'Hello Wisdom Geek';
```

Type generics are used to create reusable type aliases. Let us say we had an identity function which returns whatever value is passed back in:

Type generics are used to create reusable type aliases. Let us say we had an identity function which returns whatever value is passed back in:

```javascript
const identity = (arg: string): string => arg;
```

What if we wanted to use the function for a number? We could replace the specific type by any.

```javascript
const identity = (arg: any): any => arg;
```

But that reduces the type information of the argument and thus, the whole benefit of using TypeScript gets lost. We want to capture the type of the argument in a way that we can use it to denote the return type. This is where generics come into the picture. We will use a type variable that works on types instead of values.

```javascript
const identity = (arg: Type): Type => arg;
```

We specify the type of the function when we are invoking it:

```javascript
const output = identity<string>("Hello Wisdom Geek");
```

Now that we know these basics, let us dive into the built-in utility type functions in TypeScript.

## Built-in utility types in TypeScript

Before we jump into the utility types, it is important to note that these are available 4.0 onwards without the need of any additional packages.

### Partial

Partial constructs a type with all properties of the input type as optional. For example:

```javascript
type BlogPost = {
  title: string;
  author: string;
}

type PartialBlogPost = Partial<BlogPost>;
/* same as {
  title?: string;
  author?: string;
} */
```

A common use case for this would be while updating an item. You might want to provide a subset of the properties that changed instead of all the properties.

### Required

This is the opposite of Partial. It makes all the properties of the input type required.

```javascript
type PartialBlogPost = {
  title?: string;
  author?: string;
}

type BlogPost = Required<PartialBlogPost>;
/* same as {
  title: string;
  author: string;
} */
```

A use case for this one would be where portions of code need all members to be present but they can be optional somewhere else. In the place where they are required, you can explicitly use the required built-in utility type to ensure that the values have been initialized and you would not have to handle null checking in that code block.

### Readonly

This constructs a type with all the properties of the input type set as read only. The properties of the returned type cannot be reassigned.

```javascript
type BlogPost = {
  title: string;
  author: string;
}

type BlogPost = Readonly<PartialBlogPost>;
/* same as {
  readonly title: string;
  readonly author: string;
} */
```

The usage of this one is somewhat obvious, to freeze an object and prevent edits.

### Pick

This is a bit more advanced utility type. It allows picking only specified keys from the input type.

```javascript
type Point3D = {
  x: number,
  y: number,
  z: number,
};


type Point2D = Pick<Point3D, 'x' | 'y'>;
/* same as {
  x: number,
  y: number
} */
```

### Omit

The opposite of Pick is Omit. It allows exclusion of properties that will not be needed.

```javascript
type Point3D = {
  x: number,
  y: number,
  z: number,
};


type Point2D = Omit<Point3D, 'z'>;
/* same as {
  x: number,
  y: number
} */
```

### Record

Given a set of properties specified by a bunch of keys, and corresponding property values, the resulting type is records of key-value pairs. So Record\<Keys, Type> will provide a mechanism to create an interface by mapping all unit types specified in keys to the specified Type as their value’s type.

```javascript
type BlogPost = Record<'title'| 'author', string>

/* same as {
  title: string;
  author: string;
} */
```

If all types have the same value, the Record version of declaration is a bit more concise and readable since it is obvious that all of them have the same type.

### Extract

This extracts a type by including only the keys which are present in both given types.

```javascript
type T0 = Extract<"a" | "b" | "c", "a" | "f">;
     // type T0 = "a"
type T1 = Extract<string | number | (() => void), Function>;  
     // type T1 = () => void
```

It can be thought of as an intersection of two types. It can be useful in cases where you want to find the common base of two types.

### Exclude

This is the opposite of Extract. It excludes keys which are duplicates in given types.

```javascript
type T0 = Exclude<"a" | "b" | "c", "a">;
     // type T0 = "b" | "c"

type T1 = Exclude<string | number | (() => void), Function>;
     // type T2 = string | number
```

### NonNullable

This is an easy way to exclude null and undefined from your values in a type.

```javascript
type T0 = NonNullable<string | number | undefined>;
     // type T0 = string | number

type T1 = NonNullable<string[] | null | undefined>;
     // type T1 = string[]
```

## Conclusion

These are the most commonly used utility types for transforming TypeScript types. There are a few others, such as Parameters, ConstructorParameters, ReturnType, and InstanceType, which exist but are not frequently used. You can check their usage here if you are interested.

If you have any questions about using any of these types, drop a comment below.
