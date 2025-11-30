---
title: 'Javascript build tools: Why do we need one?'
description: 'If I had asked a web developer a few years ago about using a build tool for their web project, the developer would have mocked me for even thinking about using a javascript build tool. It is a common notion that Javascript is not compiled and is interpreted by the&#46;&#46;&#46;'
pubDate: 'Jul 28, 2016'
heroImage: './hero.jpg'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

If I had asked a web developer a few years ago about using a build tool for their web project, the developer would have mocked me for even thinking about using a javascript build tool. It is a common notion that Javascript is not compiled and is interpreted by the browser. Hence, there was no need for having any javascript build tool. In cross-platform languages such as Java or .Net the code is converted into an intermediate form first which then gets converted to native machine code based on the operating system and the run-time environment. Unlike those languages, Javascript does not have these hassles and gets executed in the browser. So the idea of having a javascript build can sound mostly ridiculous. And thus the popular Javascript build tools did not exist up to a certain point in time.

But time changes quickly. And as projects have started growing in size, problems regarding maintenance, security and performance have begun to arise. A few of the problems that the Javascript build tools solve are:

Concatenation of multiple files

Splitting your javascript code into multiple files is an excellent way to build components. It makes the code base easier to maintain. But when serving files in the production environment, the number of requests that are made to the server for fetching multiple files needs to be reduced. So javascript files need to be concatenated to reduce this load on the server. Similarly, we need to concatenate our CSS files and images into sprite sheets. We can use Javascript build tools to automate this concatenation of files and improve the overall performance of the web application.

## **Minification:**

Every byte that we transfer on a network increases the load time of our web page. Though everyone likes clean and linted code, the extra indentation and styling of our code can lead to the files becoming larger. As a result, the overall size of transmission of the website increases, increasing the page load time. So Javascript build tools are used to minify our javascript and CSS files so that our readable code gets converted to minified (refactored) code without changing the logic behind it. This reduces the footprint of the file. You can even use them to compile your [SASS ](http://wisdomgeek.com/web-development/what-is-sass/)files to CSS at build time automatically.

Managing file order dependencies:

When putting javascript files in our HTML, the browser loads them in the order in which we specify the script tags. This means that if file A depends on another file B, then file A must be loaded before file B. So we need to specify them in that order in our HTML file. And when there are multiple javascript files, managing order dependencies becomes a difficult task. Also putting in the javascript files manually in HTML is a thing of the past. There are pluginss like wiredep which provide you templates which act as placeholders for your script tags. And these are filled in at build time by your favorite Javascript build tool.

Transpiling:

With the advent of [EcmaScript 6](http://wisdomgeek.com/web-development/using-es6-today-future-of-javascript/) and ES7, the browsers need to catch up with the latest versions of the language. But as developers, we should be able to utilize this new functionality today. Hence transpilers are used to convert existing ES6 code to ES5 code (which is already supported by browsers). For that again, we make use of Javascript build tools which help us transpile the files every time we run our application.

## **Linting, static analysis, and style checking:**

Often, we miss semi-colons at the end of the line when writing code. And in the case of multiple developers working on the same code base, they use different code styles which lead to non-uniform coding standards. To enforce these, and also avoid linting errors such as unused variable declarations and other similar issues, we use Javascript build tools to ensure that all code is linted. Also, you can do a static analysis of your javascript code to see which common mistakes you have made and fix them before they go to production and appear as bugs.

## Automating running of unit test cases:

Running unit test cases on every build is something no developer wants to do. So javascript build tools let you automate that part as well so that you do not have to worry about those at all. And you get to know if your code broke a unit test at build time itself.

## Live Reload:

When developing, nobody wants to do a minor change in their CSS/JS files and then go to the browser, hit refresh to see the changes. This is a time-consuming process even though it might seem like a small thing. Live reloading refreshes the browser automatically for you whenever you save files in your development environment.

So having a build process or a build system solves all the problems mentioned above. And they also enable you to have a build process which is independent of the IDE you should use. Also for any task that you want to automate, a javascript build tool can do that for you.

## Commonly used javascript build tools

- **Server side tools:** ASP.Net and Rails provide a solution to the problem of concatenation, minification and bundling. These are helpful, but they do not solve other issues mentioned above.

- **Task Runners:** Gulp and Grunt are the most used task runners to automate tasks. Task runners are generic tools which can be used in your build pipeline to solve above mentioned issues. And they can also automate other tasks such as automating test cases execution, static analysis of code, re-running the server whenever the code changes, installing specific things, etc. You can then use a module system or manage file order dependencies using wiredep or use a framework in which file order does not matter. You can even use NPM as a build tool if you want to. For a comparison amongst which to choose, I wrote a post before explaining the scenario of [Gulp vs Grunt vs NPM ](http://wisdomgeek.com/web-development/grunt-vs-gulp-vs-npm/)and why I chose [Gulp as the task runner](http://wisdomgeek.com/web-development/getting-started-with-gulp/).

- **Dependency Managers and Module Loaders: **There are tools like Browserify, which can help you manage your dependencies efficiently. There is another module loader called Webpack, which can be considered as a specialized task runner that process input files to output files. JSPM is also the new kid in town. I haven't read much about it but with HTTP 2 becoming a reality, many people are backing it. If you have something to say about it, I would love to hear them in comments below.

So you should start using one of the above-mentioned Javascript build tools if you are not using one already. Using them, you would end up saving yourself the hassle and headaches of repeating tasks that can be automated. Which one do you prefer and Why can be discussed in the comments section.
