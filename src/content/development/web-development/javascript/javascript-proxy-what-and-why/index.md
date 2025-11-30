---
title: 'JavaScript Proxy: What and Why?'
description: 'EcmaScript 2015 introduced yet another feature that has not been used widely yet. A JavaScript proxy allows us to wrap an existing object with a layer. The layer can provide us with capabilities such as the interception of attributes and methods. And this can be done even if the properties&#46;&#46;&#46;'
pubDate: 'Feb 16, 2021'
heroImage: './hero.png'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

EcmaScript 2015 introduced yet another feature that has not been used widely yet. A JavaScript proxy allows us to wrap an existing object with a layer. The layer can provide us with capabilities such as the interception of attributes and methods. And this can be done even if the properties do not exist!

What does that mean?

A JavaScript proxy gives us the ability to change the underlying behavior of objects and functions. They can be considered as middlewares for JavaScript objects. It allows us to override internal operations such as object property lookup, assignment, enumeration, function invocation, generators' behavior, iteration, and much more.

Let us get an understanding of the terminologies before we get into how we declare a JavaScript proxy.

## Traps

The internal methods that we can override are known as traps. The JavaScript proxy API allows us to override the following:

### **Object methods:**

```
getPrototypeOf()
setPrototypeOf()
isExtensible()
preventExtensions()
getOwnPropertyDescriptor()
ownKeys()
```

### **Property getters/setters:**

```
has()
get()
set()
deleteProperty()
```

### Function methods:

```
apply()
construct()
```

## Target

The object whose properties need to be overridden is known as the target. It can be any object we want. This means it could be a regular JS object, or a third-party module, a function, or a proxy itself.

## Handler

Since there are multiple traps on an object, we can have multiple configurations for a single object. Therefore the proxy configuration is known as a handler. It can have multiple traps. A get trap for reading properties of the target, a set trap for writing them, etc.

## Defining a JavaScript Proxy

Now that we know the terminologies, let us define a JavaScript proxy!

```
let proxy = new Proxy(target, handler);
```

Now, JavaScript will internally refer to the handler whenever we perform an operation on the proxy. If a corresponding trap exists on the proxy, it will be invoked. Otherwise, the operation will be performed on the target.

If we were to create a proxy without any traps on the handler

```
let proxy = new Proxy(target, {});
```

The proxy is a transparent wrapper around the target object.

A proxy does not have any properties of its own. Before we start intercepting handlers, let us take a look at when the handler methods are triggered.

**get: **reading a property
**set:** writing to a property
**has:** in operator
**deleteProperty:** delete operator
**apply:** function call
**construct:** new operator
**getPrototypeOf:** Object.getPrototypeOf
**setPrototypeOf:** Object.setPrototypeOf
**isExtensible:** Object.isExtensible
**preventExtensions:** Object.preventExtensions
**defineProperty:** Object.defineProperty, Object.defineProperties
**getOwnPropertyDescriptor:** Object.getOwnPropertyDescriptor, for..in, Object.keys/values/entries
**ownKeys:** Object.getOwnPropertyNames, Object.getOwnPropertySymbols, for..in, Object.keys/values/entries

Now that we have know all the in's and out's of JavaScript proxies, let us get to some examples!

## Assigning default values using the GET trap

Let us assign a default value for undefined properties.

```
const handler = {
	get: (obj, property) => 
  	property in obj ? obj[property] : 'you forgot to assign a value to this property bruh'
}

const objectWithDefaultValue = new Proxy({}, handler);

objectWithDefaultValue.foo = 'bar';

console.log(objectWithDefaultValue.foo); // bar
console.log(objectWithDefaultValue['hello there']); // you forgot to assign a value to this property bruh
```

The get trap that we have defined overrides the lookup behavior. And if the object has a defined property, we return the value. Else we return our custom message.

## Performing validation using the SET trap

JavaScript has an invariant on the SET trap. That is, there is a condition that needs to be fulfilled by this internal method. The handler must return true if the value was written successfully. It can otherwise return false or throw an error.

Let us create a proxy to validate the age property before setting it.

```
let handler = {
  set: function(obj, property, value) {
    if (property === 'age') {
      if (!Number.isInteger(value)) {
        throw new TypeError('Age is not an integer');
      }
      if (value > 200) {
        throw new RangeError('Age is invalid, enter value less than 200');
      }
    }

    // Default behavior of storing the value
    obj[prop] = value;

    return true;
  }
};

const person = new Proxy({}, handler);

person.age = 18;
console.log(person.age); // 18
person.age = 'old';    // Throws exception: Age is not an intege
person.age = 250;        // Throws exception: Age is invalid, enter value less than 200
```

## Private properties using the HAS, OWNKEYS, SET, GET, and DELETE traps

```
const hidePrivateFields = (target, prefix = "_") {
  return new Proxy(target, {
    has: (target, prop) => {
      if(typeof prop === "string" && prop.startsWith(prefix)){
        return false;
      }
      return prop in target
    },
    ownKeys: target => {
      return Reflect.ownKeys(target).filter(
        prop => typeof prop !== "string" || !prop.startsWith(prefix)
      )
    },
    get: (target, prop) => {
      if(typeof prop === "string" && prop.startsWith(prefix)){
        return undefined;
      }
      return target[prop];
    },
    deleteProperty(target, prop) { 
      if (prop.startsWith('_')) {
        return true;
      } else {
        delete target[prop];
        return true;
    }
  },

  });
}

let userInfo = hidePrivateFields({
  firstName: 'Saransh',
  _password: 'password'
})

userInfo._password           // undefined
('_password' in userInfo)    // false
Object.keys(userInfo)        // ['firstName']
delete userInfo._password    // returns true, but does not delete the password
```

## Conclusion

And that concludes our post about JavaScript proxies!

A few gotchas before we conclude the post:

- Currently, there is no support for proxies in IE.
And there are no complete polyfills available 🙁

- There is no way to determine whether an object is a proxy or not.

- Once defined, it is not possible to change the target or the handler objects.

- Proxy performance is relatively slow.

- The target needs to be an object and proxies cannot be applied on primitives.

Let us know your experiences with it, or if you face any issues. What proxies are you going to create? Drop a comment below and let us know.
