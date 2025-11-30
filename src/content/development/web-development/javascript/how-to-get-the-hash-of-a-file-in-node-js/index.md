---
title: 'How To Get The Hash of A File In Node.js'
description: 'While working on a project, I wanted to do an integrity check of a file that I was referencing. So, I needed to know how to get the hash of a file in Node.js. And this post is about that. We will use the fs and crypto modules that are available in&#46;&#46;&#46;'
pubDate: 'Apr 25, 2024'
heroImage: './hero.png'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

While working on a project, I wanted to do an integrity check of a file that I was referencing. So, I needed to know how to get the hash of a file in Node.js. And this post is about that.

We will use the `fs` and `crypto` modules that are available in Node.js to get the hash of a file. We will be using the createReadStream method of the fs module to read the file and get its contents. After we are done reading it, we will call the the `getHash()`method of the crypto module to calculate the hash of the file.

```
const fs = require('fs');
const crypto = require('crypto');

const getHash = async path => {
  try {
    const hash = crypto.createHash('sha256');
    const rs = fs.createReadStream(path);
    for await (const chunk of rs) {
      hash.update(chunk);
    }
    return hash.digest('hex');
  } catch (error) {
    console.error('Error while calculating hash:', error);
  }
}
```

Then, we can use the getHash method to get the hash of a file. It is worth mentioning that we could have used various algorithms for hashing our file, like `md5`, `sha1` and `sha256`. sha256 would be the more robust algorithm but a bit slower than the other less secure ones. For the digest method, we could have used `hex` or `base64` depending on how we want to output the hash. We can use the above method like so:

```
(async () => {
  try {
    const hashValue = await getHash('path/to/file');
    console.log(hashValue);
  } catch (error) {
    console.error('Error:', error);
  }
})();
```

And that is all to the code and its explanation. If you have any questions, feel free to drop a comment below.
