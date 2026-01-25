---
title: 'What is SASS and why you should use it'
description: 'I have been playing a lot with CSS these days, and then I came across the concepts of using variables inside it. I came to know of two ways to do so, SASS and LESS. I was eager to try both out but it was only possible one at a&#46;&#46;&#46;'
pubDate: 'Sep 02, 2015'
updatedDate: 'Sep 02, 2015'
heroImage: './hero.png'
categories: ["Web Development"]
categoryHierarchy: ["Development","Web Development"]
---

I have been playing a lot with CSS these days, and then I came across the concepts of using variables inside it. I came to know of two ways to do so, SASS and LESS. I was eager to try both out but it was only possible one at a time. So I chose SASS first, since a couple of friends of mine suggested it to be better, and that SASS compiles into CSS on the server side as opposed to the client side in LESS (using javascript). Also I saw Bootstrap v4 dumping LESS for SASS. So, that made the choice pretty much obvious. In this post, I will cover the very basics of SASS, not dwelling into any code since most people are not using a pre-processor for CSS, so a need for its use needs to be understood first.

Syntactically Awesome Stylesheets (sounds cool, no?) is a CSS pre-processor, that is, it compiles into CSS. It is a scripting language which can contain variables, functions, conditions, loops etc and finally all of it gets compiled in the form of plain old CSS! For the people curious to know about its origins, it is written in Ruby. Though you do not even need to know how to write a "Hello World" program in Ruby to use SASS. Also libsass is preferred over ruby sass these days since it is a lot better and faster choice. Though usually plugins are used to process sass into css, it is worthwhile to know the differences and its evolution.

SASS files have the extension .scss and these files are passed through a pre-processor which converts all of it into a .css file. It is to be noted that a css file is also a valid scss file (unless you are using the older version of SASS, which used to have files name by the extension .sass and were indentation based rather than looking similar to css). Otherwise, a scss file can contain a mixture of css and sass things.
I personally use Visual Studio for development purposes and to compile SASS, I have the [Web Essentials](http://vswebessentials.com/) extension installed which automatically converts my files for me every time I hit the save button. If you have Visual Studio 2015 installed, the extension has been split into multiple parts and you need to install the [Web compiler](https://visualstudiogallery.msdn.microsoft.com/3b329021-cd7a-4a01-86fc-714c2d05bb6c) extension for this. For people not using VS, you can

- Use the Ruby SASS library (gem install sass) and then compile the scss file using sassc sass_file_name.scss css_filename.css

- Use [libsass](https://github.com/sass/libsass).

- Use a GUI application, like [Compass](http://compass.kkbox.com/), [Hammer](http://hammerformac.com/) or [Scout](http://mhs.github.com/scout-app/)

The benefits of using SASS are:

- Reduced maintenance (you define something once and re-use it everywhere else. If changes are to be made, you only change it at a single place)

- Lesser boilerplate code

- Reduced duplication

- Use of calculated values (if one changes, everything is recalculated automatically)

- Better organization (Multiple scss files can be used and they all will compile into a single css file if need be)

- Improved readability (similar to HTML markup, makes it easier to understand)

In short, SASS allows you to use variables, inherit previously used styles in another style, use parameterized functions, loops, conditions, provide nested rules and a lot more, and this all happens using CSS! And you can get a lot more done by writing lesser lines and it will be more readable than your plain old CSS.

If you're interested in knowing more, I can make a short tutorial for the same in my next post. Do let me know in comments.
