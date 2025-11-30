---
title: 'How to convert a React component to an image'
description: 'Sometimes you want to give the users the ability to download a part of the web application as an image. In that case, you want a way to convert a React component to an image. And it can be straightforward by using a third-party NPM package called html2canvas. Let us&#46;&#46;&#46;'
pubDate: 'Sep 27, 2021'
heroImage: './hero.jpeg'
categories: ["React"]
categoryHierarchy: ["Development","Web Development","React"]
---

Sometimes you want to give the users the ability to download a part of the web application as an image. In that case, you want a way to convert a React component to an image. And it can be straightforward by using a third-party NPM package called html2canvas. Let us look at how to do it.

## Setup

We want to first mark the div in HTML markup that we want to be downloaded when the user hits the download button. This could be a chart, user data, a table, or anything we want. We will allocate an id to that element.

```
div id="print">This will be downloaded as an imagediv>
```

We can wrap this as a React component with an event handler attached to a download button:

```
const App = () => {
  const handleImageDownload = () => {
    // TODO: add logic here
  };
  return (
    
      button type="button" onClick={handleImageDownload}>Downloadbutton>
      div id="print">This will be downloaded as an imagediv>
    
  );
}
```

## Programming logic

As we discussed earlier, we will install the html2canvas NPM package.

```
npm install html2canvas
```

Then, all we need to do is use the package to fetch the corresponding div that we want to convert to an image. We then create a link in memory to download the image, click it programmatically and then remove the link from the DOM. 

```
const handleDownloadImage = () => {
    const element = document.getElementById('print'),
    canvas = await html2canvas(element),
    data = canvas.toDataURL('image/jpg'),
    link = document.createElement('a');
 
    link.href = data;
    link.download = 'downloaded-image.jpg';
 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
```

And that is all we need to do to convert a React component to an image! Hope you found this post useful.
