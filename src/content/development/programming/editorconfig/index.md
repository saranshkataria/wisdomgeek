---
title: 'Why you should be using an EditorConfig file in your project'
description: 'Let us all face it. It is 2017 and many of us are still fighting over tabs versus spaces! And nobody cares what code style you use, the main concern is that you should be having one across your project. And the fact that it should be consistent across your&#46;&#46;&#46;'
pubDate: 'Mar 14, 2017'
heroImage: './hero.jpg'
categories: ["Programming"]
---

Let us all face it. It is 2017 and many of us are still fighting over tabs versus spaces! And nobody cares what code style you use, the main concern is that you should be having one across your project. And the fact that it should be consistent across your project. It is your code, so you define the rules. And anyone contributing to it will adhere to them. Tabs versus spaces should be handled by your editor and that is where EditorConfig files come in. All you do is drop a `.editorconfig` file in your project. In this file, you put some lines which define your configuration for the current project, and the editor applies these settings for this project only.

This is a pretty useful technique for people working in large groups having different favourite editors. This enables everyone to have consistent coding styles across all editors.

## Common configurable options

- indent style

- indent size

- end of line characters

- character set

- the maximum length of lines

- trim trailing whitespace

These might sound like trivial things when writing code for a large-scale application. But having an editorconfig file ensures that these settings go along with your project to every place the code gets setup. Which in turn ensures that the editor's settings do not need to be tweaked in order to have consistent coding styles. Some editors support editorconfig by default. For most of the others, there is a [plugin](http://editorconfig.org/#download) which enables support for editorconfig. Also, you can specify different types of configurations for different file types, and you can even override the settings for a folder by creating another editorconfig in that directory. And if you are looking for more options to configure, there is a [wiki](https://github.com/editorconfig/editorconfig/wiki/EditorConfig-Properties) with details about the possible ones.

## A sample EditorConfig file

```
# indicate this is the root of the project
root = true

[*]
indent_style = space
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
indent_size = 2

[*.html]
indent_size = 4
max_line_length = 80

[*.md]
trim_trailing_whitespace = false
```

And that is all you need to know! Go and put a file in your project now. No more fights over tabs vs spaces!
