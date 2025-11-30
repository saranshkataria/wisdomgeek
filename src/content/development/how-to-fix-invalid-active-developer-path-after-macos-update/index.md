---
title: 'How to fix &#8220;xcrun: error: invalid active developer path&#8221; after MacOS update'
description: 'If you are here, then you are getting an "invalid active developer path" error on running commands in the terminal after a MacOS update. To be exact, the error would be: Fortunately, it is easy to fix this error and get your Git/Pip/Homebrew etc. working again. Most of the time&#46;&#46;&#46;'
pubDate: 'Nov 01, 2022'
heroImage: './hero.png'
categories: ["Development"]
---

If you are here, then you are getting an "invalid active developer path" error on running commands in the terminal after a MacOS update. To be exact, the error would be:

```
xcrun: error: invalid active developer path (/Library/Developer/CommandLineTools), missing xcrun at: /Library/Developer/CommandLineTools/usr/bin/xcrun
```

Fortunately, it is easy to fix this error and get your Git/Pip/Homebrew etc. working again. Most of the time these tools were working perfectly before the macOS update but stopped working after it. The solution, as is somewhat understandable from the error message, is to reinstall command line tools and agree to the license agreement.

All you need to do is run:

```
xcode-select --install
```

Restarting the terminal after this is completed should resolve the "invalid active developer path" error, but a reboot is recommended.

Just in case that does not work, you might have to do a reset using the command:

```
sudo xcode-select --reset
```

That should fix the "xcrun: error: invalid active developer path" error and you should be good to go!
