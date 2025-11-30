---
title: 'Fixing cookies are blocked for a website with shields down on Brave'
description: 'I recently switched completely to the Brave browser and have set ad blocking to aggressive mode because ads were still showing on some websites. This however, broke my WordPress website since it relies on cookies. I thought just taking the shields down for the website would be enough but WordPress&#46;&#46;&#46;'
pubDate: 'Jul 14, 2024'
heroImage: './hero.jpg'
categories: ["General"]
categoryHierarchy: ["General"]
---

I recently switched completely to the Brave browser and have set ad blocking to aggressive mode because ads were still showing on some websites. This however, broke my WordPress website since it relies on cookies.

I thought just taking the shields down for the website would be enough but WordPress would give me the "cookies are blocked" error every time I tried to log in.

It was annoying and I did not want to globally enable cookies. After some research, turns out that I needed to enable cookies for all subdomains of the website for this to function correctly. Brave by default only adds the root domain to the list of sites that are allowed to use third-party cookies. In [WisdomGeek](https://www.wisdomgeek.com)&#8216;s case, it was adding www.wisdomgeek.com to the list and nothing else. 

The fix was to enable cookies for the website in Brave Settings. To do so, I had to add `[*.]wisdomgeek.com` to [cookie settings](brave://settings/cookies) (brave://settings/cookies) and voila! Everything started working after that. I hope that that helps you in fixing "cookies are blocked" for a particular website on Brave even after disabling shields for the website. (Shields will still need to be disabled for the website if your settings are set to aggressive mode)
