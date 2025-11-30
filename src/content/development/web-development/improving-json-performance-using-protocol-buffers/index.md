---
title: 'Beating JSON performance using Protocol Buffers'
description: 'Protocol buffers or Protobuf, is a binary format that was created by Google to serialize structured data that is transferred among services. Before we get into what protocol buffers are, let us first look into JSON. JSON clearly has great advantages when it comes to being a data interchange format&#46;&#46;&#46;'
pubDate: 'Oct 20, 2020'
heroImage: './hero.png'
categories: ["Web Development"]
categoryHierarchy: ["Development","Web Development"]
---

Protocol buffers or Protobuf, is a binary format that was created by Google to serialize structured data that is transferred among services.

Before we get into what protocol buffers are, let us first look into JSON. JSON clearly has great advantages when it comes to being a data interchange format such as:

- Widely accepted format on the web

- Can be read by all languages

- Can be easily shared over the network

- Data can be of any type (nested elements, arrays etc.)

- Human readable

But it has a few disadvantages as well:

- Schema is not enforced

- Objects can be huge in size because of repeated keys

- Does not support comments, metadata or documentation

Keeping these in mind, let us now take a look at what protobuf is and how it tries to address these disadvantages.

## What are protocol buffers?

From the [official](https://developers.google.com/protocol-buffers/) page:

Protocol buffers are Google's language-neutral, platform-neutral, extensible mechanism for serializing structured data – think XML, but smaller, faster, and simpler. You define how you want your data to be structured once, then you can use special generated source code to easily write and read your structured data to and from a variety of data streams and using a variety of languages.

Thus, protocol buffers are a method of encoding structured data efficiently. It provides flexibility to create the structure of the data by defining its schema using a specification language. The specification language is not written in any language and you can define a message using the proto file syntax.

These messages are used to encode the data in a specific format to make the message size smaller. Before understanding about the optimization, let us first take a look at the schema definition itself.

## How to define a protocol buffer message

Let us define a message definition for a blog post. We will specify 3 field names on it, the title, author and a body.

```
syntax = "proto3";

message BlogPost {
  required title string = 1;
  required author string = 2;
  optional body string = 3;
}
```

This is defined in a .proto text file. There is a lot of functionality embedded in the above message definition.

### Field name

The field name must all be in lowercase. This is a convention mandated by the protoc compiler.

### Field type

We have fully typed data by specifying the data type of the field names which can be scalar types (int32, bool, string, float etc.) or composite types, including enumeration types and other message types.

### Field numbers

The numbers towards the right are field numbers which are unique for every field name. As we learned before, protobuf converts our data into a binary format and thus these numbers are used to identify our fields in the binary message that gets created. The field numbers should not be changed once we start using a message type since it will lead to issues with backward compatibility. The number can be in the range of 1 to 2^29-1.

### Field rules

The messages also have field rules allocated to them which let us specify if the field is required, optional or repeated. Repeated fields are used to define arrays or lists.

### Comments

We can also add documentation in the message definition by making use of the single line (//) and multi-line comment definitions (/*  */).

This is a sample schema file for a type, and we do not need to manually create this every time. It can be created using auto-generation tools, depending on the programming language that we are implementing protobufs in.

Other useful things to know are:

- Multiple types can be defined in the same .proto file

- Types can be nested within one another

- Types can be imported in different .proto files as well (import statements require relative path from the root of the project)

## How is a protobuf message compressed?

Now that we know how a schema is created for a protocol buffer message, what optimizations are applied on it that it is faster than XML and JSON?

A key feature of protocol buffers is that they separate the context of the message from the data that the message contains.

So for the JSON message:

```
{
  "author" : "saransh",
  "title" : "protobuf"
}
```

The corresponding protocol buffer (in string for our understanding) would according to our message definition above would be:

```
127saransh228protobuf
```

As we can see the protocol buffer message is way shorter and does not contain any additional meta information that can be inferred from the proto file itself. Thus, protobuf messages are smaller and easier to parse too. Plus when they are converted to binary, they improve the performance even more.

The output message is less human readable and needs understanding of the protobuf encoding to be deciphered, but that is what we pay for improved efficiency. Let us break the protobuf message to understand what it means:

Each segment of the message is structured like this:

```
{field_number}{field_type}{data}
```

The field number is the number that was assigned to the field name in the .proto file. The field type is the representation of the type that we defined for it. In our case, it was a string, which is a variable-length field. This also means that the value that will be assigned to this field is not a fixed-width construct like an integer. So we need to specify we have to provide the length next as well. Thus `"author": "saransh"` becomes `127saransh`. You can read more about encoding in detail on the [website](https://developers.google.com/protocol-buffers/docs/encoding) if you wish to understand it more.

Thus instead of carrying along the entire definition of the field, all we need is three numbers to define the context of the message and what value the field maps to. Therefore this whole process becomes way more efficient both in terms of size and speed when compared to other serialization methods.

## Advantages of protobuf

- Data is fully typed

- Data is compressed automatically

- Documentation can be embedded in the schema definition

- Language agnostic (All major languages have support)

- Schema can evolve over time in a safe manner (backwards compatibility is ensured)

- 3-10x smaller and 20-100x faster than XML

- Code can be generated automatically for you

- Less boilerplate code for data type checking is needed

## Disadvantages of protobuf

- Schema is needed to generate code and read data

- Serialized data is not human-readable

- Support for some language might be lacking (the majority of them do exist though)

If a platform (such as making web requests), does not support the binary format of protocol buffers, there are capabilities within protocol buffers to serialize the binary message to a string in order to make it safe for transmission. This makes it usable for those scenarios as well, though the majority use cases of protocol buffers revolve around microservices and gRPC calls.

In the end, one needs to consider all those tradeoffs and make the decision of choosing one thing over the other. But it is good to know about the various technologies out there and this post was intended to make you aware about it. If you liked the post, do leave a comment below letting us know!
