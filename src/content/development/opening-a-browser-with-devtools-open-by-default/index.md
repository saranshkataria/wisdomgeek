---
title: 'Opening a Browser with DevTools Open by Default'
description: 'While automating some parts of my development workflow, I was wondering if there was a way of opening a browser with DevTools open by default. This would save me a few clicks and small tweaks like this are always helpful. And it turns out that it is possible! All I&#46;&#46;&#46;'
pubDate: 'Oct 10, 2021'
heroImage: './hero.png'
categories: ["Development"]
---

While automating some parts of my development workflow, I was wondering if there was a way of opening a browser with DevTools open by default. This would save me a few clicks and small tweaks like this are always helpful.

And it turns out that it is possible! All I needed was a command-line flag to be passed in when opening Google Chrome. The flag to be passed is `--auto-open-devtools-for-tabs` and can be passed as:

```
/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary --auto-open-devtools-for-tabs https://wisdomgeek.com
```

The –auto-open-devtools flag opens the browser tab for the URL with the DevTools open. Having the devtools open up by default can be handy for many things, including setting up your web development workflows!
