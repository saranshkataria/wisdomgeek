---
title: 'Installing Intel-based packages using Homebrew on the M1 Mac'
description: 'I recently got the new Apple Silicon Mac (aka the M1 mac), which means having to deal with the pain points of buying the first generation of something product. Though things are slowly improving, there are still many gotchas when it comes to using the first generation of a product.&#46;&#46;&#46;'
pubDate: 'Mar 03, 2021'
updatedDate: 'Oct 10, 2023'
heroImage: './hero.jpg'
categories: ["Development"]
categoryHierarchy: ["Development"]
---

I recently got the new Apple Silicon Mac (aka the M1 mac), which means having to deal with the pain points of buying the first generation of something product. Though things are slowly improving, there are still many gotchas when it comes to using the first generation of a product. Installing Intel-based packages using Homebrew on the M1 mac ended up being one such pain for me.

I love the M1 mac's performance, but installing packages and software using Homebrew has not been as straightforward as I had hoped for. As you might know, the M1 macs run on a 64-bit ARM CPU, relative to the older Intel CPUs. So, packages that do not have support for ARM cannot be installed by default. Luckily, Apple announced Rosetta 2, which acts as a translation layer for applications built for Intel macs to run on the new Apple Silicon Macs. Rosetta 2 was a savior, and I will not be returning my M1 Macbook Pro because of it.

This might not be the best approach to doing things in the future, but this is the ecosystem's state right now. After going through several Stackoverflow questions and Github issues, this is what worked for me for installing Intel-based packages on the M1 mac.

## Installing Rosetta 2

Rosetta 2 sadly does not come pre-installed, and we have to install it explicitly. The user gets prompted to install Rosetta when installing an Intel-based application. However, since I was working mostly in the terminal, I did not get the prompt to do so. I installed it using the terminal itself.

```
/usr/sbin/softwareupdate --install-rosetta
```

Or if you are lazy:

```
/usr/sbin/softwareupdate --install-rosetta agree-to-license (root permission required)
```

## Installing Homebrew on the M1 mac

Though Homebrew has been updated for the ARM architecture, it does not simply work out of the box with the architecture as it does with the Intel-emulated Rosetta. I  kept getting errors like the one below on brew when trying to install an application that was not available for the M1 architecture:

```
Error: Cannot install in Homebrew on ARM processor in Intel default prefix (/usr/local)!
```

The two locations live independently of one another: /usr/local for rosetta-emulated (Intel) code and /opt/homebrew for ARM64. These are somewhat hardcoded locations for Homebrew, and there is not much we can do about it.

Installing Homebrew on the M1 mac was pretty straightforward from the homepage.

```
$ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## Installing Homebrew for the Rosetta emulator

After installing Homebrew on the M1 mac, we need to have a separate installation for the Rosetta emulator.

There are a couple of ways to do this: Creating a different terminal for Rosetta-related stuff and doing it in the same terminal, and adding a few aliases. I prefer the latter, but it is up to you what you choose to do.

### 1. Using a different Terminal for Rosetta

In the finder, we will right-click on Terminal (or iTerm) and create a duplicate of the application. We will rename it to something like "Rosetta Terminal". 

Next, we will right-click the new terminal and select "Get Info" or press Command + I.

In the window that opens, we will select the checkbox for "Open using Rosetta", and then close the window.

We can start using the Rosetta terminal as usual for this, then install Homebrew and other applications.

For some reason, this version did not work correctly for me, but I did not dive much into it since I preferred having a single terminal application anyway.

### 2. Configuring Homebrew in a single Terminal

Having two terminal applications is never fun. It would be great to do everything in one application, and who likes doubling their own work? Rosetta gives us the ability to prefix commands with the `arch -x86_64` prefix to run applications in the emulated mode. And this solves our problems!

So my next step was to use:

```
$ arch -x86_64 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
```

but alas, that did not work either.

So I used the tar installation to manually install Homebrew first (knowing) that it is installed in the /usr/local directory.

```
$ arch -x86_64 zsh
$ cd /usr/local && mkdir homebrew
$ curl -L https://github.com/Homebrew/brew/tarball/master | tar xz --strip 1 -C homebrew
```

And with that installed, we have Homebrew up and running, and we can start using the architecture flag for our installations.

For installing the packages using Intel, you can now use:

```
arch -x86_64 /usr/local/homebrew/bin/brew install package name>
```

And for using Homebrew on the M1 mac:

```
/opt/homebrew/bin/brew install package name>
```

### Additional possible configurations

### 1. Aliases

I have configured the above two commands as aliases for my convenience:

```
ibrew='arch -x86_64 /usr/local/bin/brew'
mbrew='arch -arm64e /opt/homebrew/bin/brew'
```

And use them as `mbrew install` or `ibrew install` to install packages as needed. The first preference obviously is mbrew.

I also have added them to my path with the M1 version before the Intel version so that I use native packages, if available, else I use the Intel-based emulated version for it.

```
# ~/.zshrc

export PATH="/usr/local/bin:$PATH"

export PATH="/opt/homebrew/bin:$PATH"
```

#### 2. Additional step for people having problems with Python (<3.9)

Run:

```
arch -x86_64 pip install --upgrade pip setuptools
```

#### 3. Alternative to opening Rosetta terminal

**Note: **You can also use

```
arch -x86_64 zsh
```

to switch to a Rosetta shell.

And that is all there is to this post. Hope this post helped you get up and running with Homebrew for your M1 machine and if you have any questions, feel free to drop a comment below!
