---
title: 'TypeScript: the difference between interface and type'
description: 'Once we start exploring TypeScript, we start using interfaces and types without really understanding the differences between them. I am guilty of doing that as well. It is simple to get started with them and keep using them. But, at some point, it becomes important to know the difference between&#46;&#46;&#46;'
pubDate: 'May 13, 2021'
heroImage: './hero.jpg'
categories: ["TypeScript"]
categoryHierarchy: ["Development","Web Development","Typescript"]
---

Once we start exploring TypeScript, we start using interfaces and types without really understanding the differences between them. I am guilty of doing that as well. It is simple to get started with them and keep using them. But, at some point, it becomes important to know the difference between interface and type.

After all, we can use either of these:

```
interface Point {
    x: number;
    y: number;
}
```

or

```
type Point = {
    x: number;
    y: number;
};
```

The difference between interface and type is more than just the minor syntax declaration. Let us get deeper into it.

## Type and type aliases

TypeScript has primitive types such as boolean, number, string etc. And if we want to declare advanced types, we use what are called type aliases.

Type aliases refer to the process of creating a new name for a type. It is important to note that we are not defining a new type. The "type" keyword we use to do so might lead us to believing that we are creating a new type, but we are only giving a type a new name.

So whenever someone refers to types, the reference is aimed at type aliases.

## Interfaces

Interfaces, on the contrary to types, are restricted to object types. They are a way to describe an object and its properties. Type alias declarations can be used for any primitive type, unions, or intersections. In that regard, interfaces are restricted to object types.

## Similarities of interface and type

Before getting into the differences, let us take a look at the similarities of interface and type.

### Both can be extended

Both interface and type can be extended.The syntax is the only difference, yet again. Another note worth mentioning is that an interface and type alias are not mutually exclusive. A type alias can extend an interface, and vice versa.

For an interface, extending another interface:

```
interface PartialPointX { x: number; }
interface Point extends PartialPointX { y: number; }
```

Or, extending a type:

```
type PartialPointX = { x: number; };
interface Point extends PartialPointX { y: number; }
```

For a type extending another type:

```
type PartialPointX = { x: number; };
type Point = PartialPointX & { y: number; };
```

or extending an interface:

```
interface PartialPointX { x: number; }
type Point = PartialPointX & { y: number; };
```

### Implements

A class can implement both an interface as well as a type (TS 2.7+).

A class cannot, however implement a union type.

```
interface Point {
  x: number;
  y: number;
}

class SomePoint implements Point {
  x = 1;
  y = 2;
}

type AnotherPoint = {
  x: number;
  y: number;
};

class SomePoint2 implements AnotherPoint {
  x = 1;
  y = 2;
}

type PartialPoint = { x: number; } | { y: number; };

// Following will throw an error
class SomePartialPoint implements PartialPoint {
  x = 1;
  y = 2;
}
```

## Differences between interface and type

### Union and intersection types

Though interfaces can be extended and merged (next point), they cannot be composed together in the form of unions and intersections. Types can make use of union and intersection operators to form new types.

```
// object
type PartialPointX = { x: number; };
type PartialPointY = { y: number; };

// union
type PartialPoint = PartialPointX | PartialPointY;

// intersection
type PartialPoint = PartialPointX & PartialPointY;
```

### Declaration merging

The TypeScript compiler merges two or more interfaces that have the same name into a single declaration. This does not work for types. If we try and create two types with the same name but different properties, the TypeScript compiler will throw an error.

```
// These two declarations become:
// interface Point { x: number; y: number; }
interface Point { x: number; }
interface Point { y: number; }

const point: Point = { x: 1, y: 2 };
```

### Tuple types

Tuples (key-value pairs) can only be typed via the type keyword.

```
type Point = [x: number, y: number];
```

There is no way to declare a tuple using an interface.

We can use a tuple inside an interface though:

```
interface Point {
  coordinates: [number, number]
}
```

## Which one should I use?

In general, both interface and type are pretty similar, as noted before.

For public API definitions in a library or third-party type definition, an interface should be used to provide declaration merging capabilities.

Apart from that, we can use whichever we want, but there should be consistency across the codebase.

And that is all there is to know about interface vs type in TypeScript. I hope this helped you learn something about each, and if you did, please share it with your friends!
