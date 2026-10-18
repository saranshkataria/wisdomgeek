---
title: 'How to fix “xcrun: error: invalid active developer path” after MacOS update'
description: 'If you are here, then you are getting an “invalid active developer path” error on running commands in the terminal after a MacOS update.'
pubDate: 'Nov 01, 2022'
updatedDate: 'Oct 19, 2023'
heroImage: './hero.png'
author: 'Saransh Kataria'
categories: ["Development"]
categoryHierarchy: ["Development"]
tags: []
---

If you are here, then you are getting an “invalid active developer path” error on running commands in the terminal after a MacOS update. To be exact, the error would be:

```bash
xcrun: error: invalid active developer path (/Library/Developer/CommandLineTools), missing xcrun at: /Library/Developer/CommandLineTools/usr/bin/xcrun
```

Fortunately, it is easy to fix this error and get your Git/Pip/Homebrew etc. working again. Most of the time these tools were working perfectly before the macOS update but stopped working after it. The solution, as is somewhat understandable from the error message, is to reinstall command line tools and agree to the license agreement.

All you need to do is run:

```bash
xcode-select --install
```

Restarting the terminal after this is completed should resolve the “invalid active developer path” error, but a reboot is recommended.

Just in case that does not work, you might have to do a reset using the command:

```bash
sudo xcode-select --reset
```

That should fix the “xcrun: error: invalid active developer path” error and you should be good to go\!
