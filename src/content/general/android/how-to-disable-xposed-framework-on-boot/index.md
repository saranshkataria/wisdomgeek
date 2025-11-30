---
title: 'How to disable Xposed Framework on boot'
description: 'I recently installed an Xposed module on my One Plus One running Lollipop only to figure out that it went into a bootloop. The module was incompatible with the alpha version of Xposed framework installed and I was stuck on the android startup screen with nowhere to go. (For those of&#46;&#46;&#46;'
pubDate: 'Apr 26, 2015'
heroImage: './hero.png'
categories: ["Android"]
categoryHierarchy: ["General","Android"]
---

I recently installed an Xposed module on my One Plus One running Lollipop only to figure out that it went into a bootloop. The module was incompatible with the alpha version of Xposed framework installed and I was stuck on the android startup screen with nowhere to go.

(For those of you who are not aware about Xposed, it is a framework that you can install on your android device and it allows you to customize your ROM with the help of different modules. You can read more about it on the [XDA thread](http://forum.xda-developers.com/xposed/xposed-installer-versions-changelog-t2714053). And if you do try it out, be very careful.)

Googling suggested me ways to disable by getting into the installer, but I was stuck on a bootloop. So I needed a way to disable Xposed installer on boot. There were posts stating that I should flash a disabler recovery zip which I couldn't find on my device. Googling "xposed disable zip" gave me random sources as zip files which I did not consider reliable enough when flashing a critical zip file. So after a lot more googling, I found out that the new version (v2.5 and above) have the ability to disable xposed framework, if you repeatedly press the power button when the device is starting up (some say any hardware button would do, but I have personally tested the power button).

When you boot and press the power button for the first time, the device will vibrate and after that you have to repeatedly press the same button for at least four times (I didn't count, I went on pressing it for a long period). After that your device will load into a safe mode, as it has been termed. Essentially what it does is disable Xposed framework overall.

Do note that re flashing the zip file for Xposed does not re-enable it after this. You need to wipe cache and dalvik first in order to re install the framework (obviously, after you have disabled the module from the application which caused the bootloop). Then you can flash the Xposed zip. to re install the Xposed framework. (Which is still better than having to dirty flashing your ROM or recovering from a TWRP backup to recover from the bootloop).

Do let us know in comments if this worked for you!
