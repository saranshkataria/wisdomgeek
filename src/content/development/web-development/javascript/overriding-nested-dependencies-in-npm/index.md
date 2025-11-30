---
title: 'Overriding nested dependencies in NPM'
description: 'Whenever we install a particular package, it is common to come across a problem with a dependency''s dependency. With the release of npm 8.3, an overrides attribute has been added to solve this problem and allow overriding of nested dependencies in NPM. The problem Let us say your project depends&#46;&#46;&#46;'
pubDate: 'Jan 18, 2022'
heroImage: './hero.jpeg'
categories: ["JavaScript"]
---

Whenever we install a particular package, it is common to come across a problem with a dependency's dependency. With the release of npm 8.3, an overrides attribute has been added to solve this problem and allow overriding of nested dependencies in NPM.

## The problem

Let us say your project depends on Package A which depends on Package B. Package B has an update, but package A has not updated it yet.

```
my-project
  |_ Package A@1.0.0
      |_ Package B @1.0.0
```

If Package B was updated to 2.0.0 and we wanted to use that version (there can be multiple reasons for this, the most common being other packages use the updated one), there was no easy solution for this.

The most common solution that developers used was to fork Package A, update Package B, and use their fork and maintain it. This was a tedious solution and one that required a lot of maintenance.

## Overrides

We can now specify an overrides property in our package.json that enforces the dependency version that is specified there.

The changes can be as specific as we want and scoped, or we can make them generic.

If we wanted to install version 2.0.0 of package B no matter what, we could use:

```
{
  "overrides": {
    "package-b": "2.0.0"
  }
}
```

If we wanted package A to always be 1.0.0, and package B at any depth beyond package A to be 2.0.0:

```
{
  "overrides": {
    "package-a": {
      ".": "1.0.0",
      "package-b": "1.0.0"
    }
  }
}
```

If we wanted package B to be resolved as 2.0..0 when specified as a dependency of Package A at version 1.0.0:

```
{
  "overrides": {
    "package-a@1.0.0": {
      "package-b": "2.0.0"
    }
  }
}
```

This overrides and enforces the version of the nested dependency and can be useful if we want to patch a dependency with a security issue or just ensuring that the same package is used everywhere.

The keys can be of any nested length, so we can choose the specificity we want according to our needs.

**Note: **Only root package's overrides will be considered when installing dependencies. overrides of installed dependencies (including workspaces) will not be a part of the dependency resolution.
