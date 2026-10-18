---
title: 'Copy/Pasting output from the terminal'
description: 'Manually copy-pasting the output of a terminal command with a mouse/trackpad feels tedious. It is more convenient to use commands to do so.'
pubDate: 'May 15, 2024'
updatedDate: 'May 15, 2024'
heroImage: './hero.png'
author: 'Saransh Kataria'
categories: ["Development"]
categoryHierarchy: ["Development"]
categoryPaths: ["development"]
tags: []
---

Manually copy-pasting the output of a terminal command with a mouse/trackpad feels tedious. It is more convenient to use commands to do so. And we can save the effort by using the built-in commands.

## Mac

We can use `pbcopy` and `pbpaste` to copy and paste from the Mac terminal.

We can pipe the output of a command to copy its output to the clipboard. For example, to copy the current directory path, we can use

```bash
pwd | pbcopy
```

Or if we want to copy the contents of a file:

```bash
cat ~/Desktop/example.txt | pbcopy
```

Similarly, to paste the clipboard output in a file, we can use:

```bash
pbpaste > ~/Documents/example.txt
```

## Windows

The commands to use on a Windows machine are `clip` and `powershell get-clipboard`.

For copying the standard output to the clipboard, we use the command line command:

```bash
<some command> | clip
```

For copying the current directory, we need to convert it into a command. Since  `%cd%` is the environment variable that stores that value, we can echo that value and pipe it into the clip command.

```bash
echo %cd% | clip
```

Similarly, for copying a file’s contents to the clipboard, we can use

```bash
cat example.txt | clip
```

To paste the clipboard into a file, we can use the `powershell get-clipboard` command

```bash
powershell get-clipboard > example.txt
```

## Linux

For Linux machines, we can use the terminal commands `xclip` or `xsel`.

These need to be installed first:

```bash
sudo apt-get install xclip
sudo apt-get install xsel
```

Using `xsel`, the command for copying something is

```bash
xsel --clipboard --input
```

So, copy the current directory, we can use:

```bash
pwd | xsel --clipboard --input
```

And for copying the contents of a file to the clipboard:

```bash
cat example.txt | xsel --clipboard --input
```

And for pasting the clipboard contents in a file, we can use:

```bash
xsel --clipboard --output > example.txt
```

That is all there is to copy/pasting output from the terminal to the system clipboard. If you have any questions, let us know in the comments below.
