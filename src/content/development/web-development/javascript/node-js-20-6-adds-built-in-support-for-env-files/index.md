---
title: 'Node.js 20.6 adds built-in support for .env files'
description: 'Node.js 20.6 added built-in support for the .env file. This is an excellent addition to the platform and gives us the ability to load environment variables from .env files directly without using third-party packages. While it is great to see first-class support, some caveats remain. Let us look at how it works. Assuming that&#46;&#46;&#46;'
pubDate: 'Apr 10, 2024'
heroImage: './hero.png'
categories: ["JavaScript"]
---

Node.js 20.6 added built-in support for the `.env` file. This is an excellent addition to the platform and gives us the ability to load environment variables from `.env` files directly without using third-party packages. While it is great to see first-class support, some caveats remain. 

Let us look at how it works. Assuming that you are running Node 20.6, create a .env file:

```
API_KEY="KEY"
DATABASE_URL="URL"
```

And then, you can run node using the following command:

```
node --env-file .env index.js
```

This would give you access to the variables defined in the .env file in your JavaScript code.

```
// index.js
console.log(`Hello ${process.env.DATABASE_URL}`)

// URL
```

That is it! Want to have a different production configuration? Just create a new file and point it to a `.env.production` file.

### Order when running the command matters

A minor detail to remember when executing the script is that the env file needs to be passed in before the file name. Ideally, it should have been interchangeable, but that is not the case. The env file gets ignored if we use the command:

```
// .env file gets ignored in this case
node inex.js --env-file .env
```

## Caveats

As with all experimental things, a few things are missing. Some of these might lead to people using dotenv until support for these gets added. I will mention them here and let you see if they are dealbreakers. You can also follow the [GitHub issue](https://github.com/nodejs/node/issues/49148) to track missing feature support.

### **No Multiline Suppor**t

Multiline environment variables are not supported currently. If you add one, it will be undefined.

```
// .env
WORLD="Hello
World"

// index.js
console.log(`Hello ${process.env.WORLD}`)

// running the script
node --env-file=.env index.js
Hello undefined

```

### The same variable is defined in both the environment and file

If the same variable is defined in the environment and the file, the value from the file takes precedence. There is no way to override it with the system environment variables.

```
// .env
WORLD="foo"

// index.js
console.log(`Hello ${process.env.WORLD}`)

// running the script
export WORLD="bar"
node --env-file=.env index.js
Hello foo
```

**Note:** This has been changed in version 20.7.0, where values defined in the environment variable take precedence.

### No variable references/expansions

Node does not support variable expansion currently. It will output the variable as a string if trying to reference another variable using $variable. This is possible in dotenv using the [dotenv-expand](https://github.com/motdotla/dotenv-expand) library.

```
// .env
WORLD="foo"
WORLD_BAZ=$WORLD

// index.js
console.log(`Hello ${process.env.WORLD_BAZ}`)

// running the script
node --env-file=.env index.js
Hello $WORLD
```

### No .env.vault support

[dotenv-vault](https://github.com/dotenv-org/dotenv-vault) is another popular package that lets you encrypt your secret and decrypt the file just in time. They are quite helpful for production and CIT environments but are not supported currently.

## Conclusion

Node.js 20.6 adding built-in support for .env files is a huge step forward for the Node community. Hopefully, it does not stay experimental in the near future, and we can start using it in our applications soon!
