---
title: 'Adding fixtures and parameterized functions to PyTest'
description: 'As we discussed in our post on getting started with Pytest, the framework allows us to reuse tests by using test fixtures and parameterized functions. In this post, we will learn how to do so. We will build on the simple calculator example that we discussed in the previous post&#46;&#46;&#46;'
pubDate: 'Mar 11, 2021'
heroImage: './hero.png'
categories: ["Python"]
---

As we discussed in our post on [getting started with Pytest](https://www.wisdomgeek.com/development/web-development/python/testing-python-applications-using-pytest/), the framework allows us to reuse tests by using test fixtures and parameterized functions. In this post, we will learn how to do so.

We will build on the simple calculator example that we discussed in the previous post and add to it. Without further ado, let us get started.

## Adding test fixtures

As we saw in our small example, there is some repetition in the two basic tests that we wrote:

```
# calculator_test.py
from calculator import add

def test_add():
    firstNumber = 2
    secondNumber = 1
    assert add(firstNumber, secondNumber) == 3

def test_add():
    firstNumber = 2
    secondNumber = 1
    assert subtract(firstNumber, secondNumber) == 1
```

This might seem trivial in this case, but it is one of the productivity enhancements we can get with Pytest. We can avoid repetition and set up some helper code that gets executed before any tests. These fixtures are the perfect places to initialize resources that will be needed by the tests.

We can create fixture functions by marking them using the @pytest.fixture decorator. This provides us with a way of injecting dependencies into our tests via function parameters.

Functions that require these fixtures can then accept them as an argument. So our fixture definition will become:

```
import pytest

@pytest.fixture
def numbers():
    firstNumber=2
    secondNumber=1
    return [firstNumber,secondNumber]
```

Since a fixture is a function, we could have either defined two functions to return the two numbers, or we can combine them in a list and return it from one. And now, we can have access to this list in our test case, and our test simplifies to:

```
def test_add(numbers):
    assert add(numbers[0], numbers[1]) == 3
```

For the subtract one, we can simply do:

```
def test_subtract(numbers):
    assert subtract(numbers[0], numbers[1]) == 1
```

A few things to note about fixtures:

- We can define multiple fixtures for a single file. These can then be individually accessed by their names in the argument of the test function.

- A test can request multiple fixtures.

- Every test receives a newly initialized value of the variables declared in the fixture. The values are not re-used among tests.

- Fixtures are accessible only among a particular file.

- Fixtures can request other fixtures.

### Conftest.py

We might want to reuse some of our fixtures across files as well. We can do so by creating a file named conftest.py in our directory. The tests defined in this file are available to all the tests in the directory.

We can even have multiple conftest.py files in a project, but only one per Python module. Tests defined in a module can use all fixtures defined in the configuration for that module and those defined globally.

### Scopes

By default, all fixtures are executed once per function. This can be an expensive operation if we are doing some intensive operation in our fixture. Every time an argument of a test has a fixture, that fixture gets executed.

For instance, if we were calling an API, we would make the request every time, slowing down our tests. We can define scopes for fixtures which gives us the capability to re-use fixture instances in between tests.

The possible values of scope are: `function`, `class`, `module`, `package` or `session`.

```
# content of conftest.py
import pytest
import smtplib
@pytest.fixture(scope="module")
def smtp_connection():
   return smtplib.SMTP("smtp.gmail.com", 587, timeout=5)
```

The smtp object will be re-used across the module.

## Parameterized test functions

When it comes to writing tests, we usually want to test the function with multiple values. And more often than not, we end up writing multiple test cases for doing that. Pytest provides us with a feature known as parameterized test functions which enables testing of different scenarios in a single function.

We use the @pytest.mark.parameterize decorator. Before getting into the implementation, let us first understand what markers are.

### Markers

Markers are decorators that allow classification of tests or give us the ability to perform a specific action. Some of the relevant markers are:

@pytest.mark.skip(reason=None):
skip the given test function with an optional reason

@pytest.mark.filterwarnings(warning):
add a warning filter to the given test

@pytest.mark.xfail(condition, reason=None, run=True, raises=None, strict=False):
mark the test function as an expected failure if eval(condition) has a True value

@pytest.mark.parametrize(argnames, argvalues):
call a test function multiple times passing in different arguments in turn.
argvalues generally needs to be a list of values
if argnames specifies only one name
or a list of tuples of values if argnames specifies multiple names.

To see a list of all markers, we can use:

```
pytest --markers
```

### Writing parameterized functions

As we found out, we can parameterize our test cases using markers. Let us assume we wanted to test not just positive numbers but negative numbers as well. Instead of writing multiple tests, we would instead use:

```
# calculator_test.py
from calculator import add

@pytest.mark.parametrize("firstNumber,secondNumber,expected", [
    (1, 2, 3),
    (2, -2, 0),
])
def test_add():
    assert add(firstNumber, secondNumber) == expected
```

This provides us with a succinct way of combining values and avoiding repetition.

## Conclusion

And that wraps up our exploration of fixtures and parameterized functions in Pytest. Now go and write some awesome tests! If you have any questions, feel free to drop a comment below.
