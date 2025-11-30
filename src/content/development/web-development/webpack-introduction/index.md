---
title: 'Webpack: An Introduction'
description: 'Before coming to the discussion about Webpack, let us first discuss how web development has evolved over the past few years and why we even need a build tool for something like Javascript. The problem with loading javascript files The only way to load javascript in an HTML document is&#46;&#46;&#46;'
pubDate: 'Jan 12, 2017'
heroImage: './hero.png'
categories: ["Web Development"]
---

Before coming to the discussion about Webpack, let us first discuss how web development has evolved over the past few years and why we even need a build tool for something like Javascript.

## The problem with loading javascript files

The only way to load javascript in an HTML document is to add a script tag. So if a developer wants to include a javascript file, they have to add a script tag in the HTML to include it. Then they can either add javascript code in the HTML file or it could link to a javascript file using the source attribute.

Since web apps are becoming fairly common these days, it is common to see javascript code cross 10,000 lines. Putting all of this code in a single file can bring in problems related to scope, performance, maintainability, and security.

## What are the possible solutions?

Clearly, we want to write as much of modular javascript as we can. The challenge that comes with that is that you end up having thousands of files. The browser can only download a limited number of scripts at a time.

The best way to overcome that is splitting files into modules which can be concatenated later. This does potentially solve the initial problem of modular code but also introduces another one.

When fetching modules on the browser, you need to ensure the order in which modules get loaded. If one module depends on the other, the other module has to be loaded before this one.

This is where module systems came into the picture. A variety of tools like gulp, grunt, broccoli came into existence to tackle these problems.

But there still existed problems such as dead code elimination, full rebuilds on changing a single file, lazy loading files. This is where bundlers and loaders started gaining popularity.

The next question that comes to mind then is

## Why do I need Webpack?

Webpack supports all javascript module formats (ES Modules, commonjs etc.). It also allows you to use not only javascript, but it also supports other processors for CSS (SASS, LESS, Stylus), HTML, assets etc.

So it is a module bundler that allows you to use any module format and compiles them for the browser. (It even supports Web assembly modules). It also allows you to create code splitted bundles at build time (which brings in a lot of static analysis optimizations) that can be lazily loaded later.

Webpack also has a rich vast ecosystem and a lot of the major CLI's such as Angular CLI, Create React App, Vue use it. It is super extensible and has a vast amount of plugins for different kinds of workflows.

Other features of webpack include concatenation, minification, hot module replacement, converting/transpiling files from one format to another, linting files etc.

In short, Webpack can be considered as a specialized task runner which optimally processes input files into output files. It does so by using making use of components called loaders.

## Installation (Webpack 2)

For installing Webpack, you need to have NPM installed. After that, as with all node modules, you do a `npm install webpack -g` for installing it globally. You can then use the CLI for transpiling files, but since projects are more complex than just putting files together and passing them as parameters in the command line, you would mostly use a config file for running Webpack. For doing so, you need to create a webpack.config.js file in our project's root directory. A configuration file in itself is a module, so it needs to have a module.exports statement.

## Configuration

The object being returned should have two important keys for a basic build, namely the entry key which is a string or array of strings that point to the file(s) that we need to include in our build. The other key which we need to specify is the output key which is an object that can contain the directory to output to, the filename etc. So a basic configuration file which converts a single app.js file to a bundle.js file would like the following:

```
module.exports = {
    entry : "./app.js",
    output: {
        filename: "bundle.js"
    }
}
```

The above file seems like not much is happening, and that we are just converting one app.js file to another bundle.js file which is meaningless. But even this basic configuration will make Webpack look inside the app.js files, and if you have required or imported other modules inside it, then Webpack will go and fetch those dependencies as well. All this is done with Webpack maintaining a dependency graph for the developer so that they do not focus on maintaining the order of importing modules.

A lot will be happening in this scenario if you have referenced other modules in your app.js file. For having multiple entry points instead of a single file, you need to have an array of files as the value to the entry key. That is, the line will now become

```
entry: ["./app.js","./file.js"]
```

Using the above configuration, you can create a very basic build for your project.

## Loaders

What makes Webpack a flexible build tool is the capability of extending it by making use of loaders. By using loaders, you can go beyond the processing, minification, and concatenation of javascript files of the build tool.

I will take the example of babel loader which is the most common transpiler for converting ES6 (or ES2015) code into ES5. I already assume you have the babel CLI, babel preset es2015 installed. If not, install them using NPM using the command `npm install babel-cli babel-preset-es2015 babel-loader --save` .You also will need to install babel loader which plugs babel in as a loader for Webpack. Also, for transpiling, you need a .babelrc file in your project directory. The file contents will be an object containing the presets key and its value set to an array containing an item value es2015. Next, for the configuration of Webpack, we will add a module key in the config which will have the following object:

```
module.exports = {
    entry : "./app.js",
    output: {
        filename: "bundle.js"
    },
    rules: [
            {
                test: /\.js/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
}
```

The above configuration adds the babel loader to our build pipeline. The babel loader runs on all javascript files except for those that are present in the node_modules folder (as specified in the RegEx in the test and exclude sections).

This is all you need to do to add a loader to Webpack!

Similarly, you can add a preloaders key in the module object to add preloaders to your build. They can be useful for linting purposes and ESint is usually used for this purpose.

## Creating the build

After creating your configuration file, all you need to do is type in "webpack" in your command line. The bundler will then do everything that you had specified in the config file. You can also run it in watch mode by using "webpack -w". This will re-run the build everytime you make changes to a file in the directory.

And if you wish to serve your files over HTTP using webpack, you can install [webpack-dev-server](https://www.wisdomgeek.com/development/web-development/using-webpack-dev-server/) for doing so.

There are a lot of other nice features in Webpack such as hot module replacement, adding CSS to modules, building multiple bundles, chaining loaders, adding plugins etc.

This post should be enough to get you started and you can play with other features.

If you want a more detailed post, do let me know in the comments section below. I will write another one with some advanced builds.
