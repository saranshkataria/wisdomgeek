---
title: 'Enforcing coding standards using husky pre-commit hooks'
description: 'Having consistency and enforcing coding standards becomes very important as an application scales. It becomes important to automate the process to ensure quality standards and make the application maintainable. ESLint and Prettier can be used to define these standards, but we also need a tool to enforce them. Husky provides&#46;&#46;&#46;'
pubDate: 'Jun 05, 2021'
heroImage: './hero.png'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

Having consistency and enforcing coding standards becomes very important as an application scales. It becomes important to automate the process to ensure quality standards and make the application maintainable. ESLint and Prettier can be used to define these standards, but we also need a tool to enforce them. Husky provides that functionality by providing pre-commit git hooks that can be configured per our needs.

These standards can also be enforced by using gated checks on pull requests at the CI level, but Husky is an alternative to doing it at the local machine level.

## What is Husky?

Husky is an npm package to make managing Git hooks easy. When initialized with Git, it enables a feature called hooks (no correlation with react hooks, in case you were wondering).

It provides pre-push, pre-rebase, pre-commit and other similar hooks. These hooks allow a mechanism to perform an action before one of the git commands is run.

To view a list of all the hooks in a project, we can run:

```
ls .git/hooks
```

A list of all git hooks and their usage can be found [here](https://git-scm.com/docs/githooks).

For our purpose, we need to run the linter and formatter before someone creates a commit. So, we will be using the pre-commit git hook.

Husky ensures:

- Hooks are shared across machines (installed using configurations in the package.json)

- Hooks are created on local developer machines

- Hooks run when a git command is executed (before it's execution)

- Enforce checks are in place to fail git command execution if criteria are not met

## Installing and configuring Husky

We install husky using the command:

```
npm i -D husky
```

Configuring husky requires adding a husky key to the root of the project's package.json:

```
"husky": {
  "hooks": {
    "pre-commit": "",  // pre-commit command
    "pre-push": "",    // pre-push command
    "...": "..."
  }
}
```

The commands can be anything we want to run before the corresponding git action.

If we have npm scripts for running prettier and ESLint set up as:

```
"scripts": {
    "prettier": "prettier --config .prettierrc 'src/**/*.{js,jsx,css}' --write",
    "lint": "eslint . --ext .js",
    ...
  },
```

We can configure husky to run those before a commit happens:

```
"husky": {
    "hooks": {
      "pre-commit": "npm run prettier && npm run lint"
    }
  }
```

This ensures that a commit cannot be made without having code that is formatted, as well as enforces the coding standards set using ESLint.

**Note:** Instead of running linting on the complete project, check out the package [lint-staged](https://github.com/okonet/lint-staged), which runs the linter only on staged files. This reduces the time it takes to lint the project.

Using husky and git pre-commit hooks, we can thus enforce coding standards across our projects without manual interventions. Let us know in the comments below if you have any questions or other linting tips.
