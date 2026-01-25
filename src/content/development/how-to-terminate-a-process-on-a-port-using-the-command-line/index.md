---
title: 'How to kill a process on a port using the command line'
description: 'Zombie processes are usually a pain to figure out. More often than not, I end up googling about how to kill a process on a port using the command line. It can be done using the activity monitor as well, but that is a time-consuming process. There are ways of&#46;&#46;&#46;'
pubDate: 'Mar 10, 2022'
updatedDate: 'Oct 25, 2023'
heroImage: './hero.png'
categories: ["Development"]
categoryHierarchy: ["Development"]
---

Zombie processes are usually a pain to figure out. More often than not, I end up googling about how to kill a process on a port using the command line. It can be done using the activity monitor as well, but that is a time-consuming process.

There are ways of doing it using netstat and other methods which I kept fiddling through. But recently I discovered an npm package that is easy to remember and does the job pretty instantaneously. And since I am a JavaScript developer, this is a lifesaver instead of remembering terminal commands.

First, we need to install the "kill-port" package globally:

```
yarn global add kill-port
```

And then:

```
# Kill processes on multiple ports
kill-port 8080 8000
```

Or, if you want to do it in one step without a global install:

```
npx kill-port 8080
```

And that is it. Let us start nuking those zombie processes now.
