---
title: 'GraphQL Basics: Types, Queries, Mutations, and Schema'
description: 'Once you get a grasp of what GraphQL is, and why it is important, you also realize that it is a different design process. And before diving into the implementation, it is important that we understand the GraphQL basics, the various terminologies that come with it. If you are just&#46;&#46;&#46;'
pubDate: 'Jul 15, 2020'
updatedDate: 'Oct 11, 2023'
heroImage: './hero.jpg'
categories: ["GraphQL"]
categoryHierarchy: ["Development","Web Development","Graphql"]
---

Once you get a grasp of what GraphQL is, and why it is important, you also realize that it is a different design process. And before diving into the implementation, it is important that we understand the GraphQL basics, the various terminologies that come with it.

If you are just getting started and still don't know about the importance of GraphQL, we would recommend reading our previous post about [why GraphQL?](https://www.wisdomgeek.com/development/web-development/why-graphql/)

Looking at the way GraphQL works in the examples mentioned in that post, we realize that we only have one endpoint to work with instead of multiple REST endpoints. This means that we no longer look at our API as a collection of endpoints. Instead, we look at it as a collection of schemas, queries, and mutations.

Before we get into implementing GraphQL, we need to get a better idea of all the GraphQL basics: Types, Queries, Mutations, and Schema. We need to understand these terminologies first since an understanding of this GraphQL glossary will help us in doing things the GraphQL way.

## What is a Type?

The first GraphQL basic term we will explore is a type. If we consider the blogging example (similar to the previous post), we will have the following data in our application:

- Posts

- Comments

- Authors (or can be Users)

These are similar to the tables that we are used to creating in our relational databases. In GraphQL, we call these types which are a collection of these data entities that can also contain relationships with other entities. The relationships are similar to foreign keys in a relational database which can be lazy-loaded.

**Note:** GraphQL does not care about what database is being used as the backend. So it can be a relational database, or these all can be collections in a NoSQL database. All we are doing is defining tyes and schemas in the codebase, to be able to interact with the database. This is pretty much similar to an Object-Relational Mapper (ORM) that most people are familiar with.

Since GraphQL is a strongly typed language, we specify the data type of the properties that it holds as well when defining the type. So the type for a post will look like:

```
type Post {
  id: ID!
  title: String!
  content: String!
  publishedDate: String 
}
```

The ID type and String type are built-in primitive types that are defined using the Schema Definition Language (SDL). The exclamation mark is present to tell that signify that the fields are required fields.

The ID, String, and other primitive types are known as Scalar types and the Post type that we created is known as Object type since it is a user-defined type. An object type can include another object type in it. 

**Note: **No matter what programming language is being used to implement GraphQL, the SDL remains the same.

## What is a Query?

The single endpoint for GraphQL requires a query to know what data to return. And as the name query suggests, we send a POST request with the query to fetch data from a GraphQL endpoint. In simpler words, a query allows us to fetch data from a GraphQL server.

Queries look like the JSON object that we would expect in response from the server, but without the values in it. Also, the keys are on separate lines, not separated by commas. The server then fills in the values in these and sends the completed JSON object back to us as the response.

For allowing the client to be able to query our schema, we first need to define them on the server-side.

To get all the posts, we define it like:

```
type Query {
  # Returns all blog posts
  getAllBlogs: [Post]
}
```

We can even extend this further by allowing the queries to accept parameters to fetch specific blog posts.

```
type Query {
  # Returns all blog posts
  getAllBlogs: [Post]

  # Returns a blog post matching input id
  getBlogPost(id: ID!): Post
}
```

On the client side, we can then fetch the data using the query operation:

```
query getAllBlogs {
  id
  title
}
```

When we execute this on the client, the server returns all the posts that we requested in the format that was requested. The response will be:

```
getAllBlogs {
  ["id" : 1,  "title" : "Wisdom Geek"],
  ["id" : 2, "title" : "Saransh Kataria"],
}
```

As we can see, even though we had the content and publish date defined for our posts, the server did not return those. The query defined on the server had them. But we did not request those as part of our query operation. Hence the server only returned what we asked for. They would have been returned if we had added them as part of our query in the client.

**Note:** Since GraphQL is strongly typed, we cannot put in random words in our query on the client-side. The query should always match the schema that has been exposed from the server.

## What is a Mutation?

Mutations are similar to queries with one difference. They are used to create new objects on the server.

Queries are used for reading objects from the server, and mutations are used to write them.

A single mutation contains a signature and a return type for that mutation. It defines what all properties the mutation needs to create the object and what it will return when the object is created. To create a blog post, we will make use of the following mutation:

```
Mutation {
  addBlogPost(title: String!, content: String!): Post
}
```

The id and published date field will be generated on the server-side. So we only need the title and the content of the blog post from the user. The mutation returns the newly created post object giving us a way to view what was created on the server.

Apart from queries and mutations, there is a third type of operation that can be performed using GraphQL known as subscriptions. Subscriptions allow us to watch data for real-time changes. They are specific to real-time applications only, so we are not going to cover much about it in this post.

## What is a Schema?

A schema definition contains the type definition, its relationships as well as a description of how this data can be queried or modified. In other words, we define how the client application interacts using GraphQL in a schema.

Extending the post type that we defined before, and adding relationships and queries, it would look something like the following. Every post will have an author. And similarly, the author has a collection of posts defined as a relationship. 

```
type Post {
  id: ID!
  title: String!
  content: String!
  publishedDate: String 
  author: Author!
}

type Author {
  id: ID!
  name: String!
  posts: [Post]
}

Mutation {
  addBlogPost(title: String!, content: String!): Post
}

type Query {
  getAllBlogs: [Post]
  getBlogPost(id: ID!): Post
}
```

## But, What does the graph in GraphQL mean?

Now that we have an idea of the GraphQL basics, there is one unanswered question. The Graph? The graph word does not mean a graph database or a graphical representation of the data. Instead, it refers to how we think about the data that we have in our application and its relationship with other data in the application.

In other words, we model all our business logic as a graph by defining a schema that contains all the types, their relationships, queries, and mutations.

And that should give you an overview of the GraphQL glossary. We hope that this post helped you understand the basic terminologies of GraphQL and now you have a better idea of the GraphQL basics: types, queries, mutations, and schemas. We will explore more about GraphQL and how to put these together in an application in a future post.

Until then, if you have any queries, drop a comment below. And share the post with your friends and help them learn too 😉
