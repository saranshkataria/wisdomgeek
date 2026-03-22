---
title: 'Getting started with Flask: a Python microframework'
description: 'Flask is a python framework for writing web applications. It is a microframework, which as the name suggests, is a small, clean, and simple to use framework. It comes with a minimal set of features, which sounds like a strange choice at first. So why would we choose Flask if&#46;&#46;&#46;'
pubDate: 'Feb 25, 2021'
updatedDate: 'Oct 10, 2023'
heroImage: './hero.png'
author: 'Saransh Kataria'
categories: ["Flask"]
categoryHierarchy: ["Development","Web Development","Flask"]
---

Flask is a python framework for writing web applications. It is a microframework, which as the name suggests, is a small, clean, and simple to use framework. It comes with a minimal set of features, which sounds like a strange choice at first. So why would we choose Flask if it does a minimal amount of things? Flask is

- clean and simple

- un-opinionated (aka flexible)

- well documented

- popular and has active community support

- does not have any additional bloatware that might not be needed

- extensible to include extensions that we want to add

What is included in Flask?

- Jinja 2: template engine for building HTML

- Werkzeug: A tool that provides support for HTTP and routing

- Development and debugging server

- Unit testing support

For the rest of the article, it is assumed that we know how to use Python (we will use Python 3) and pip.

## Installing Flask

We do not want to install Flask globally and use [Python virtual environments](https://www.wisdomgeek.com/development/web-development/python/managing-python-dependencies-using-virtual-environments/) instead. So we will make use of them instead of polluting our global installation.

```
$ mkdir flask-hello-world
$ cd flask-hello-world
$ python3 -m venv venv
$ source venv/bin/activate
(venv) $
```

Once we have that setup, we can install Flask in our virtual environment.

```
(venv) $ python3 -m pip install flask
```

This will download and install Flask and its dependencies. To confirm that the installation was successful, we can start the Python interpreter and try and importing Flask:

```
>>> import flask
>>> _
```

We know that the installation was successful if we do not get any errors.

## The Hello Flask application

Let us start with a minimal Flask application. We will later convert it into a more elaborate version that is better suited for a larger application.

We will start by creating a hello-world.py file with a few lines of code:

```
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello Flask!'
```

The above 5 lines of code are all that we need to host our simple "Hello Flask" web page. This simplicity is one of the things that makes Flask so popular and easy to work with. Let us understand what this no-effort code is doing.

We imported the package in the first line so that we can use it. This works correctly only if we have it installed.

The next line calls the Flask constructor which creates a Global Flask application object. The constructor takes the name of the application as an argument. Since we are using a single module, we can use the Python predefined variable  `__name__`. This variable contains the name of the current module (in our case, the file name is hello-world, so that is used). We could have passed in a string as an argument if we wanted to. Flask uses this name to understand where to look for templates, static files, etc.

We use the route decorator in the next line which changes the behavior of the function that follows the declaration. The function changes from being a simple one to a view function. @app.route is an attribute of the app object that we made in the previous line. The effect of using this decorator is that we assign a URL to our function and telling Flask which URL will trigger this function. "/" denotes the root of our application.

The next line is a definition of our hello world function which returns our string.

## Running our application

Before we run the application, we need to ensure two things.

First that we are in our active virtual environment in the terminal.

Second, we need to tell Flask about the module in which our application can be found. We do this by setting the `FLASK_APP` environment variable to the name of our python file.

```
$ export FLASK_APP=hello-world.py

# or

# set FLASK_APP=hello.py
# for Windows
```

If we wanted to set Flask in development mode to enable features like debugging, we can also set the `FLASK_ENV` environment variable.

```
$ export FLASK_ENV=development

# use set instead of export for Windows
```

And then we can run the application by using:

```
$ python3 -m flask run
 * Running on http://127.0.0.1:5000/
```

If we copy-paste the URL into a browser, we can see the string from our code. This will launch a simple built-in development server but it is not something we want to use in production.

Once we are done playing with the server, we can Ctrl-C our way out of it on the terminal to stop it.

## Improving our project structure

Instead of writing things in a file and running it, we will create a package for our application. A sub-directory with an __init__.py file is considered as a package in Python. This package can then be imported into other packages, thus making our code modular. When we import a package, the __init__.py file gets executed and it defines the symbols that the package has exposed to be consumed by the outside world.

We can thus move our file to an *application/__init__.py* file. 

We will also split our routes into a separate routes.py file:

```
from application import app

@app.route('/')
def index():
    return "Hello, Flask!"
```

Then our __init__.py file can be:

```
from flask import Flask

app = Flask(__name__)

from application import routes
```

And our simplified hello-flask.py becomes:

```
from application import app
```

And that will convert our application into a somewhat modular one that we can build upon.

## Remembering environment variables across terminal sessions

Since the terminal does not remember environment variables across sessions, it can be irritating to type in the flask app variable every time we open a new terminal window. We can make use of the python-dotenv package to register environment variables and import them before we run the flask command. All we need to do is install the package:

```
(venv) $ pip install python-dotenv
```

And write the key and value pair of our variables in a .flaskenv file in the root directory:

```
FLASK_APP=hello-flask.py
```

Congratulations! We are on our way to play around with Flask servers. If you have any questions, feel free to drop a comment below!
