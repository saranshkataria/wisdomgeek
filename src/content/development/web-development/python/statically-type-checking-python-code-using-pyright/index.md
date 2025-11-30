---
title: 'Statically type checking Python code using Pyright'
description: 'With the introduction of type hinting in Python 3.5, static typing and checking Python codes has started to gain popularity. While MyPy was the first tool to do static type checking of Python code, many other frameworks have been built after it. Pyright is one such tool built by Microsoft&#46;&#46;&#46;'
pubDate: 'Mar 16, 2021'
heroImage: './hero.png'
categories: ["Python"]
---

With the introduction of type hinting in Python 3.5, static typing and checking Python codes has started to gain popularity. While MyPy was the first tool to do static type checking of Python code, many other frameworks have been built after it. Pyright is one such tool built by Microsoft and is the one that we will be discussing in this post.

## Type hints in Python

Python has been a dynamically typed language. While that flexibility has its benefits, it becomes a hassle when working on large scale projects. Inferring the type of an object can be hard at times for the interpreter. Using type hints, we can resolve the following problems:

- Lesser run-time issues because of typeless code and failure of inferring the correct types

- Test cases for type checking do not need to exist

- Better tooling and IDE support since it becomes easy for the tools to infer types and provide suggestions accordingly

- Code becomes easier to understand and IDE's can help generate more accurate docstrings

Type hints, like TypeScript, are usually beneficial for larger projects. For smaller projects, they might be an overhead.

It is also important to note that type hints are optional. Hinting as many things as we want will not have any effect since Python itself is not using them. And that is why we need linters like Pyright to statically type check our code.

Another thing to point out is type hints are only available in Python 3.5 and above.

## Hello type hints

There are 3 ways in which we can specify type hints in Python:

1. $1

```
name = "Saransh Kataria" # type: str
```

2. Function annotations

```
def greeting(name: str) -> str:
    return 'Hello {}'.format(name)
```

3. Stub files

Stub files can be created for modules to avoid modifying the existing codebase. Stub files have a .pyi extension. The convention in the pyi file is to replace the body with "...". We define our code without the types in the main file:

```
def greeting():
    return 'Hello {}'.format(name)
```

And in the greeting.pyi file, we specify the hints:

```
def greeting(name: str) -> str: ...
```

For generics, we can use:

```
from typing import Dict

def greeting(names: Dict[str, int]) -> str:
    keys = names.keys()
    return 'Hello, {}'.format(', '.join(keys))
```

We can also use Optional for passing in None to variables.

## Installing Pyright

As we saw, type hints are just hints. No errors are thrown even if the types do not much of what is defined as a hint. We need tools like Pyright to throw those errors and help ensure type safety. One of the major benefits of Pyright over other similar tools is the speed.

It is faster at type-checking than other tools and more accurate than MyPy.

From the README

Pyright is typically 5x or more faster than mypy and other type checkers that are written in Python. It is meant for large Python source bases. It can run in a “watch” mode and performs fast incremental updates when files are modified.

### Terminal

The one negative for Pyright is that you need Node installed for using Pyright since it is available as an npm package. While most people do have Node installed, it might seem like a hassle for those who do not. After all, it is a python type checking tool, it should be available via pip. But it is not.

So for installing Pyright, we will use:

```
npm install pyright

# or we can use npm install -g pyright if we want to install it globally
```

Once installed, we can use it as:

```
pyright options>
```

### VSCode extension

Apart from the benefit of Pyright being fast, it has amazing support for VS Code in the form of an extension. And since most of us have already switched to VSCode, this is definitely a huge plus. The extension can be downloaded from [here](https://marketplace.visualstudio.com/items?itemName=ms-python.vscode-pylance) and does a lot more than just static type checking. It provides better IntelliSense support for your Python code, auto-imports, code navigation, and much more.

## Pyright configuration

As with all tools, we can have a configuration file for Pyright to set it up according to our needs. We create a pyrightconfig.json in our root directory of the project. The options include:

**pythonVersion:** the version of Python to execute the source code. Pyright will also generate errors for the code if the feature being used is not supported for that Python version.

**include:** an array of paths in the form of directories or files that Pyright should check. If this is not specified, the default is the current directory.Paths can follow glob pattern ( ** for a directory or multiple levels), or the regex pattern of single (?) or zero or more characters (*).

**exlcude:** an array of paths of directories/subdirectories/files to be excluded. It is also worth noting that Pyright automatically excludes: **/node_modules, **/__pycache__, .git, and any virtual environment directories.

**ignore:** By default, if there is a file in the exclude path but is used in a file which is included in the analysis, Pyright will analyze that file too. If we want those to be ignored completely, we can specify them in the ignore path instead.

**strict:** strict mode enables all type-checking rules. We can turn it on by specifying the file paths under this key or we can manually add a “# pyright: strict” comment to a file to enable it.

**verboseOutput: **A boolean to specify if the output logs should be verbose or not.

**typeCheckingMode**: specify wether the type checking mode should be off", "basic", or "strict".

There are other flags which can be configured to fine tune type check diagnostics and execution environment settings. Those can be found [here](https://github.com/microsoft/pyright/blob/master/docs/configuration.md#type-check-diagnostics-settings).

## Statically type checking Python code using Pyright

Once we have the configuration in place, we can run the Pyright command from the terminal to see the type checking errors. Or, if we have the extension installed for Visual Studio Code, the editor will show us the errors inline itself.

Thus, if we try to do something like:

```
def greeting(name: str) -> str:
        return 0
```

We will get the error:

```
Expression of type "Literal[0]" cannot be assigned to return type "str"
  "Literal[0]" is incompatible with "str"
```

And that is all there is to get an introduction about Pyright. If you have any questions, feel free to drop a comment below. Or drop your configuration of rules that you use with Pyright.
