---
title: 'Using Webpack Dev Server'
description: 'If you have been doing front-end development recently, the chances are that you would have heard about Webpack multiple times. In fact, most of the starter kits are built using Webpack Dev Server. The implementation and configuration are hidden by wrappers above it so that the developer continues working on&#46;&#46;&#46;'
pubDate: 'Jul 04, 2017'
heroImage: './hero.jpg'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

If you have been doing front-end development recently, the chances are that you would have heard about Webpack multiple times. In fact, most of the starter kits are built using Webpack Dev Server. The implementation and configuration are hidden by wrappers above it so that the developer continues working on the application and does not have to worry about how to serve the files. If you are unaware of Webpack, you can read more about it and the config file in my post which gives an [Introduction to Webpack](https://www.wisdomgeek.com/web-development/webpack-introduction/). Webpack Dev Server spins up a nodeJS server with some additional functionalities that help you as a developer working on your front end. So it provides us with all the features of Webpack plus a development server which serves our files over HTTP and functionalities such as watch mode, live reloading and hot module replacement which makes our lives easier as a developer.

A couple of things that should be kept in mind while using Webpack Dev Server:

- It is only meant to serve your front-end code. It is not intended for any kind of backend development.

- It generates assets and keeps them in memory. They are not written to disk anywhere by default.

## Getting started with Webpack Dev Server

Getting started is very easy. You need to follow steps similar to what Webpack requires for setup.

That is

- Install webpack and webpack-dev-server using npm

- Create a webpack.config.js file, which has an object which contains all the configuration and

- Export this object.

The setup of this would look like [this](https://github.com/saranshkataria/WebpackDevServerDemo/tree/dc8ae46b553b3cc148b7b2efddba2004d78ba971) commit. You can add a console log statement in a javascript file to test if the javascript file is getting included in the index.html file. In the webpack.config.js file, you will then specify the entry and output points for Webpack. The config file would then look like:

```
module.exports = {
    entry: './src/app.js',
    output: {
        filename: "bundle.js"
  }
}
```

If you have installed webpack and webpack-dev-server dependencies, place an index.html file in the root directory which has a script tag with source as bundle.js. After this, you should be run the command webpack-dev-server in a terminal window which is open in your project folder. When you then navigate to `localhost:8080` on your browser, you should see the contents of your index.html file and the logged statement in the console window.

## Basic Webpack Dev Server configuration

You can add some webpack dev server specific configuration to the config file to enhance the previous simple example. A separate object (with devServer as the key) is added in the webpack.config.js file for these. The commonly used settings are:

```
devServer: {
        port: 9000,
        compress: true,
        stats: "errors-only",
        open: true,
        contentBase: path.resolve(__dirname, 'app'),
        publicPath: '/dist'
    }
```

- The port property allows you to use a port number that is different from 8080.

- The compress property allows you to compress the files before serving them to the browser (gzip compression).

- Once you run the webpack-dev-server command in your terminal, it gives you a lot of metadata about the files that are being used, and other information about the workings. This extra information is not required most of the times, and the developer is usually only concerned about error messages if any errors arise. Luckily, the stats option allows you to configure this. If you set the value to errors-only, it prints only errors and a few details about the bundle to the console.

- The open parameter is one of my personal favorites! It automatically opens the browser at the specified address for you whenever you run the webpack-dev-server command in the terminal. And if you were already running it on a tab, it just refreshes it. This is a super awesome functionality baked into webpack dev server!

- The contentBase property allows you to specify the directory that you are serving the application from. You might be having multiple folders in the project and using the contentBase attribute, you tell webpack dev server the folder(s) in which it should look for the index.html file.

- The publicPath property tells webpack where to place the bundle it generates. By default it is an in memory bundle which is not written on disk and if you want to output it to a dist folder, you can specify it here.

This post gives you an overview of Webpack Dev Server and what all can be achieved using minimal configuration. The final code can be viewed at this [Github repository](https://github.com/saranshkataria/WebpackDevServerDemo). If you want some more detailed tutorial on how to dynamically inject javascript and CSS in your HTML using webpack, or any other functionalities regarding it, let me know in the comment section, and I will write a post on that. Hope this post helped clear your understanding of Webpack Dev Server.
