---
title: 'How to reload zsh configuration'
description: 'I have been using zsh for quite some time now and learned something new while setting up some commands today. I was trying to reload zsh configuration after making some changes. I knew it was a source command but did not remember the complete one. So I googled and found&#46;&#46;&#46;'
pubDate: 'Sep 26, 2023'
updatedDate: 'Oct 10, 2023'
heroImage: './hero.png'
categories: ["Development"]
categoryHierarchy: ["Development"]
---

I have been using zsh for quite some time now and learned something new while setting up some commands today. I was trying to reload zsh configuration after making some changes. I knew it was a source command but did not remember the complete one. So I googled and found that there is a new way to do it now too.

## The old way

The source command has been the go to way of reloading your zsh config. Simply type in:

```
source ~/.zshrc
```

And it works without any errors. But I recently learned of a newer way.

## A new command

As is the nature of things in programming land, new things always come to the stage and omz added a new alias to make reloading zshrc configuration more rememberable. The new command to reload zsh configuration is:

```
omz reload
```

I also found out another interesting thing. I assumed it was an alias to the source command under the hood but turns out that it is an alias for

```
exec zsh
```

The exec command is different than source because it completely reloads the zsh process. This means that the exec command removes any env variables that were set before in the configuration which can be  a better default than having a rogue state after doing a reload.

So if you're an omz user, you can use the reload command or for other zsh users, you can use the exec command which is probably easier to remember too. And those are the 2 ways to reload your zshrc configuration.
