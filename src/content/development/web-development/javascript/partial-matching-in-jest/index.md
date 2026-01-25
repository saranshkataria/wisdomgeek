---
title: 'Partial Matching in Jest'
description: 'Jest has the ability to check for partial matches on arrays and objects. Let us see how to do partial matching in Jest. expect has powerful matcher methods for partial matching, and they can also be combined with the tohavebeencalledwith method. Matching objects partially using expect.objectContaining When trying only to&#46;&#46;&#46;'
pubDate: 'Oct 25, 2023'
updatedDate: 'Oct 25, 2023'
heroImage: './hero.jpg'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

Jest has the ability to check for partial matches on arrays and objects. Let us see how to do partial matching in Jest.

`expect` has powerful matcher methods for partial matching, and they can also be combined with the `tohavebeencalledwith` method.

## Matching objects partially using `expect.objectContaining`

When trying only to match a subset of an object's properties, we can use the `objectContaining` matcher.

```
test('should match website name', () => {
    const website = {
        name: 'Wisdom Geek',
        url: 'https://www.wisdomgeek.com',
    };
        
    expect(website).toEqual(expect.objectContaining({
        name: 'Wisdom Geek'
    }));
d});
```

The above test will pass if the name attribute matches in the test. The other key-value pairs in the object have no relevance to the outcome of the test.

The above test could have been easily rewritten as:

```
expect(website.name).toEqual('Wisdom Geek');
```

But partial matching in Jest shines when multiple properties need to be tested. For example:

```
test('should match website attributes', () => {
    const website = {
        name: 'Wisdom Geek',
        url: 'https://www.wisdomgeek.com',
        author: 'Saransh Kataria',
    };
        
    expect(website).toEqual(expect.objectContaining({
        name: 'Wisdom Geek'
        url: 'https://www.wisdomgeek.com',
    }));
d});
```

Is more readable and maintainable than

```
expect(website.name).toEqual('Wisdom Geek');
expect(website.url).toEqual('https://www.wisdomgeek.com');
```

There is only one assert statement with the partial matching statement, and all related properties are tested in it.

## Partial matching on nested objects

The `objectContaining` matcher can also be used to match nested objects.

```
test('should match author name in nested object', () => {
    const website = {
        name: 'Wisdom Geek',
        url: 'https://www.wisdomgeek.com',
        author: {
          name: 'Saransh Kataria',
        }
    };

    expect(nestedObject).toEqual(
        expect.objectContaining({
            author: expect.objectContaining({
                name: 'Saransh Kataria',
            }),
        })
    );
```

As long as the author name matches, the above test will always pass.

## Matching arrays partially using `expect.arrayContaining`

Similarly, if we only care about matching partial values in an array, we can use `arrayContaining`.

```
test('should contain wisdomgeek in given array', () => {
    const array = [
        'irrelevant', 
        'wisdomgeek'
    ];

    expect(array).toEqual(expect.arrayContaining(['wisdomgeek']));
});
```

The above test passes as long as one of the entries in the given array is wisdomgeek.

It is also worth mentioning that `arrayContaining` works irrespective of the order of the array.

```
test('should contain wisdomgeek in given array', () => {
    const array = [
        'irrelevant', 
        'wisdomgeek',
        'foo'
    ];

    expect(array).toEqual(expect.arrayContaining(['foo', 'wisdomgeek']));
    // passes, order does not matter
});
```

This can then be used to check that the array does have all the elements that it should have and not in any particular order. If we wanted to check that it had only the items that we wanted it to have and nothing else, we could add an additional length check as well.

```
test('should contain wisdomgeek in given array', () => {
    const array = [
        'irrelevant', 
        'wisdomgeek',
    ];

    expect(array).toEqual(expect.arrayContaining(['foo', 'wisdomgeek']));
    expect(array).toHaveLength(2);
});
```

## Combining object and array partial matching

We can combine the above two matchers to create various permutations and combinations if we wanted to do some advanced checks.

```
test('we should have ids 1 and 2', () => {
  const authors = [{id: 1, name: 'Saransh'}, {id: 2, name: 'Wisdom Geek'}];
  expect(authors).toEqual(
    expect.arrayContaining([
      expect.objectContaining({name: 'Saransh'}),
      expect.objectContaining({name: 'Wisdom Geek'})
    ])
  );
});
```

and 

```
test('user 3 should be a friend of user', () => {
  const author = {
    id: 1,
    name: 'Saransh',
    posts: ['foo', 'bar', 'baz']
  };
  expect(author).toEqual(
    expect.objectContaining({
      posts: expect.arrayContaining(['foo'])
    })
  );
});
```

## Partial match with toHaveBeenCalledWith arguments

These matchers can even be combined with Jest's toHaveBeenCalledWith function. Using the combination of toHaveBeenCalledWith and partial, Jest tests can assert that a function was called with a particular argument.

```
test('test jest tohavebeencalledwith partial', () => {
    const mockFunction = jest.fn();

    mockFunction('foo', 'bar', 'baz');

    expect(mockFunction).toHaveBeenCalledWith(
       'foo', expect.anything(), expect.anything()
    );
});
```

And that is all, folks. I hope that this post helps you with writing some advanced test cases using partial matching. If you have any questions, do let us know in the comments.
