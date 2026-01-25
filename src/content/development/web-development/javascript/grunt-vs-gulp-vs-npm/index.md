---
title: 'Grunt Vs Gulp Vs npm: Javascript build wars'
description: 'You might have already made the choice among Grunt Vs Gulp Vs npm already. Or you might be totally confused what all these are. All these are automation tools used during or after development. Some people might be confused that why do we even need a build process for javascript?&#46;&#46;&#46;'
pubDate: 'Jan 12, 2016'
updatedDate: 'Jan 12, 2016'
heroImage: './hero.png'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

You might have already made the choice among Grunt Vs Gulp Vs npm already. Or you might be totally confused what all these are. All these are automation tools used during or after development.

Some people might be confused that why do we even need a build process for javascript? It is an interpreted language and is not compiled. So there simply is no need for it. But for larger projects, you cannot serve all the files as they are. Maintenance becomes an issue and you need to concatenate and minify all your files and bundle them before sending them to the browser.  You cannot make multiple web requests for all files since that will introduce latency. Also reducing the size of the file will be a good thing for the user. That is where the build tools come in.

Task runners are an important part of the build automation process. Javascript build runners have been on the rise since a couple of years due to the fact that they allow you to do smart work, and avoid the hard work. For those of you who are unaware of the advantages of a task runner, they essentially solve the problem of automating repetitive task. In case of a javascript task runner, these can be:

- Preparing js, html, css (minifying, concatenating),

- Compiling less/sass to css,

- Injecting files into html

- Testing

- Linting/ code analysis

- Allows to focus on code, not the build pipeline

- Can integrate into continuous integration as well (Jenkins, tfs etc.)

And for the ones aware of these automation tools, you probably would have already chosen one for your project. But I recently came across all these tools which are used in the open source land (what I call it to be, coming from a Visual Studio background). And I wanted to choose one out of the three most popular options Grunt, Gulp and NPM. Finding the most used runners was an easy task, but Grunt Vs Gulp Vs npm was a fairly huge discussion over the internet and it took me some time to grasp all the information and select one out of these.

## NPM and Windows issues

Initially, I chose NPM out of these three, after reading Keith Cirkel's [post](http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/). The post made a lot of sense, specially when one is going to install gulp or grunt using npm, then why not use npm itself to automate things and use it as the build tool rather than relying on a third party tool. Although grunt and gulp are fairly popular but having the ability to run tasks in command line and having pipe-lining as an option in it along with the option of pre and post hooks inside the run task, made NPM a better choice than the others. So I chose npm initially in the Grunt Vs Gulp Vs npm confusion I had. And I was happy having made a wise decision. But soon I started facing issues such as the command line not accepting regex for arguments such as "jshint /*.js". There was a work around in which if I used "jshint .", it recursively scanned all the directory to look for files, and although it was not a neat approach, I carried on. Then I faced other problems such as quotes not working when using watch inside the NPM command, double quotes vs single quotes caused issues and also pipe lining was giving some trouble too. Having read  and also facing the issue that NPM gives troubles on windows, I decided not to do any more hacks and use one of the two other alternatives. So in the Grunt Vs Gulp Vs npm war, the latter had lost for windows as a platform and it was time to give the other two a shot.

## The final choice

Then googling kicked in for the final two choices. And after trying out bits and pieces of both, here is my reason for choosing Gulp over Grunt. Though most people have their own preferences when choosing one among gulp and grunt, **I chose gulp** for the following reasons:

- Gulp uses streams instead of temporary files/folders (streams make IO faster and resemble to what one assumes tasks will functionally run like)

- Code over configuration (gulp makes use of streams and pipes as opposed to using configuration files in grunt in which you specify everything and then it gets executed)

- Grunt configurations (JSON objects) are easy to understand when they are small (for smaller projects), but as they grow, it is a bit more difficult to read huge configurations.

- Grunt requires a watch plugin to be installed manually. Gulp has one built in, which is something required as a core feature inside a task runner.

- Gulp tasks are more readable and easy to debug since you can set breakpoints in it, compared to no debugging in config files

- I felt the syntax to be easier to adapt to as compared to grunt.

One thing to be noted is that grunt 1 alpha does use Orchestrator (which is responsible for the asynchronous execution of tasks). So do not let asynchronous tasks be the reason of you choosing Gulp over Grunt. Gulp still has fewer plugins as well as downloads as compared to Grunt, but using it is my personal preference. And if you are already using one out of these two, no need to switch to another one, the advantages are not worth the effort.

I just provided my reasoning here as to why I chose what and why I did not. Your opinions may differ, and I would love to know your side of the story in comments.
