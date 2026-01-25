---
title: 'Copy/Pasting output from the terminal'
description: 'Manually copy-pasting the output of a terminal command with a mouse/trackpad feels tedious. It is more convenient to use commands to do so. And we can save the effort by using the built-in commands. Mac We can use pbcopy and pbpaste to copy and paste from the Mac terminal. We can pipe the&#46;&#46;&#46;'
pubDate: 'May 15, 2024'
updatedDate: 'May 15, 2024'
heroImage: './hero.png'
categories: ["Development"]
categoryHierarchy: ["Development"]
---

Manually copy-pasting the output of a terminal command with a mouse/trackpad feels tedious. It is more convenient to use commands to do so. And we can save the effort by using the built-in commands.

## Mac

We can use `pbcopy` and `pbpaste` to copy and paste from the Mac terminal.

We can pipe the output of a command to copy its output to the clipboard. For example, to copy the current directory path, we can use

```
pwd | pbcopy
```

Or if we want to copy the contents of a file:

```
cat ~/Desktop/example.txt | pbcopy
```

Similarly, to paste the clipboard output in a file, we can use:

```
pbpaste > ~/Documents/example.txt
```

## Windows

The commands to use on a Windows machine are `clip` and `powershell get-clipboard`.

For copying the standard output to the clipboard, we use the command line command:

```
 | clip
```

For copying the current directory, we need to convert it into a command. Since  `%cd%` is the environment variable that stores that value, we can echo that value and pipe it into the clip command.

```
echo %cd% | clip
```

Similarly, for copying a file's contents to the clipboard, we can use

```
cat example.txt | clip
```

To paste the clipboard into a file, we can use the `powershell get-clipboard` command

```
powershell get-clipboard > example.txt
```

## Linux

For Linux machines, we can use the terminal commands `xclip` or `xsel`.

These need to be installed first:

```
sudo apt-get install xclip
sudo apt-get install xsel
```

Using `xsel`, the command for copying something is

```
xsel --clipboard --input
```

So, copy the current directory, we can use:

```
pwd | xsel --clipboard --input
```

And for copying the contents of a file to the clipboard:

```
cat example.txt | xsel --clipboard --input
```

And for pasting the clipboard contents in a file, we can use:

```
xsel --clipboard --output > example.txt
```

That is all there is to copy/pasting output from the terminal to the system clipboard. If you have any questions, let us know in the comments below.
