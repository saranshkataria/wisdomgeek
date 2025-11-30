---
title: 'Script to change Zoom virtual background every day'
description: 'Over the past few months, I found a new use of the pictures that I have clicked while hiking. I started using them as Zoom virtual backgrounds. If you are anything like me and take a lot of pictures, it can be hard to decide which one looks good. And&#46;&#46;&#46;'
pubDate: 'Aug 17, 2021'
heroImage: './hero.png'
categories: ["General"]
categoryHierarchy: ["General"]
---

Over the past few months, I found a new use of the pictures that I have clicked while hiking. I started using them as Zoom virtual backgrounds. If you are anything like me and take a lot of pictures, it can be hard to decide which one looks good. And then I decided to use them all, on different days. Sadly, Zoom does not have this as a built-in feature. And being a Software developer, I had to automate the process of choosing a random Zoom virtual background every day.

## What does the script do?

Zoom does have an API that I could have used to change my background every day but that seemed like too much effort for this task. Software developers are born lazy, right?

Instead, I found out that the Zoom application creates a copy of the background that gets selected in its preferences folder and references it. The script just takes in a random file and replaces it with this background file. And voila! A different Zoom virtual background is shown. This can then be put in a cron job to be executed every day (or any frequency you prefer) to periodically change the background.

## Prerequisites

I have put all the images I want to use as backgrounds in a folder in my user directory. Mine is at `/zoom/bgpictures/`, and that is what I use in the script, but it is a variable that can be changed to whatever you want it to be.

Next, we set a Zoom virtual background in our application. It does not matter which one. All we need is the unique ID that Zoom will assign to this background. There might be some files already in the directory, but we want to select the one that corresponds to the image that we just uploaded to avoid replacing a different file. The directory is located at: `~/Library/Application Support/zoom.us/data/VirtualBkgnd_Custom`. The file name will be something like: `9WAE197F-90G2-4EL2-9M1F-AP784B4C2FAD`

## The script

We will be using a bash script to replace the image we just used. I will be putting this scrip in the zoom folder that I created for the background images. It can again be named whatever you like, I am naming mine as `~/zoom/zoombg.sh`. The script is as follows:

```
#!/bin/bash

# The name of file that we copied before and will be replaced with
OG_BG="9WAE197F-90G2-4EL2-9M1F-AP784B4C2FAD";

# Directory where Zoom keeps the backgrounds
ZOOM_DIR="/Users/$USER/Library/Application Support/zoom.us/data/VirtualBkgnd_Custom/";

# Directory of our images
BGPATH="/Users/$USER/zoom/bgpictures/";

# Picking a random file
NEW_BG=$(find "$BGPATH" -type f | sort -R | head -1);

# Replacing the file
cp -R "$NEW_BG" "$ZOOM_DIR/$OG_BG";
```

If you choose different paths for the directory, change it in the variable. We need to make this script executable by running the command:

```
chmod 755 ~/zoom/zoombg.sh
```

## Changing Zoom virtual background randomly

The script is ready. All we need to do is put it in a cron job which is a built-in time-based job scheduler. We need to decide a schedule for how frequently we want to change the Zoom virtual background. I do mine at 9:55 AM every day since my meetings start at 10 AM.

If you are new to cron jobs, you can use the [generat](https://codebeautify.org/crontab-format)[or](https://corntab.com/) to help you. I use:

```
55 9 * * 1-5 /Users/saranshkataria/zoom/zoombg.sh > /dev/null 2>&1
```

The first part (55 9 * * 1-5) is what you will need to customize according to your schedule. The second part is just telling the OS what to do at that point in time. The path will need to be updated if you chose a different location for the bash script.

To put it in a cron job, type

```
crontab -e
```

and it will open up an editor using vi. Hit the I key on the keyboard to enter insert mode, paste in the line, and press Escape followed by ":wq" and enter to save and quit.

That is all there is to it and we shall have a random Zoom virtual background every day/ frequency you chose!

If you are using Windows, the script can be modified accordingly and should be fairly straightforward to use.

If you have any questions, feel free to drop a comment below!
