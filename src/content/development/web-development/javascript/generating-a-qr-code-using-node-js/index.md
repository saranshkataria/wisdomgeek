---
title: 'Generating a QR code using Node.js'
description: 'I was preparing a slide deck for a hackathon and decided to put in a QR code to allow people to connect with me. Naturally, I googled for a service and used it. It turns out that the code generated used a link that had an expiration time associated with&#46;&#46;&#46;'
pubDate: 'Jun 12, 2024'
updatedDate: 'Jun 12, 2024'
heroImage: './hero.png'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

I was preparing a slide deck for a hackathon and decided to put in a QR code to allow people to connect with me. Naturally, I googled for a service and used it. It turns out that the code generated used a link that had an expiration time associated with it.

I learned my lesson and searched for an npm package to achieve this for the future. With the terminal, I would be in total control next time by generating a QR code using Node.js instead.

And all good things start with installing an npm package. In this case, we can either install the `qrcode` package globally or use our good old friend npx to install it in a temporary cache. We will then use a shell script that makes use of this npm package for generating a QR code using Node.js in the terminal. I will talk about the shell script first, and then combine it with the npx usage as a single command towards the end.

Firstly, we will take the user input we want to use as text for our QR code. We will also store this in a variable called `inputText`

```
read -p "Enter the text for the QR code: " inputText
```

Next, we will pass this input to the qrcode npm package

```
qrcode -o qr.png "$inputText"
```

The `-o` option is used to specify the output file name that we want it to generate. Along with that, we will pass a couple of other arguments to the package

```
-w 1000 -q 1
```

The w parameter is used to specify the width of the output image and the q flag is used to specify the quality of the image (1 is the highest).

So combining these together into one command, we can use the following for generating a QR code using Node.js

```
read -p "Enter input text for the QR code: " inputText && qrcode -o qr.png "$inputText" -w 1000 -q 1
```

The above code works well if we have installed the `qrcode` package globally. But if we want to use npx, we can modify the command as follows:

```
read -p "Enter the text for the QR code: " inputText && npx qrcode -o qr.png "$inputText" -w 1000 -q 1
```

And that is all there is to it. This should generate a QR code that we can use wherever we want without worrying about expiration time concerns. If you have any questions regarding the process, feel free to ask them in the comments below.
