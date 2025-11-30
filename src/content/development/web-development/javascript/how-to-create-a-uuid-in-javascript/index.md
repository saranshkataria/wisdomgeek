---
title: 'How to create a UUID in JavaScript'
description: 'Creating a globally unique identifier has always been a necessity in all programming languages and for some reason, JavaScript never had a way of doing it in the default spec. But that is changing now with the crypto API. We can now create a UUID in JavaScript. What is UUID/GUID?&#46;&#46;&#46;'
pubDate: 'Sep 30, 2021'
heroImage: './hero.png'
categories: ["JavaScript"]
---

Creating a globally unique identifier has always been a necessity in all programming languages and for some reason, JavaScript never had a way of doing it in the default spec. But that is changing now with the crypto API. We can now create a UUID in JavaScript.

## What is UUID/GUID?

A universally unique identifier (UUID) is a 128-bit label used for information in computer systems. The term globally unique identifier (GUID) is also used instead of UUID.

For example: "4ab4e2a1-0efb-4e5b-8f73-e503f5b8e89f"

## Create a UUID in JavaScript

Traditionally, we needed to use either Math.Random(), or the Date object and then convert it into a UUID format. But now all we need is:

```
crypto.randomUUID() // "819df8d4-587b-4200-90b3-d30f8ed01457"
```

It is important to note that it still might not generate a unique value though the probability of that happening is fairly low.
