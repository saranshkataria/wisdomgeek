---
title: 'Running specific test cases in Jasmine or Mocha'
description: 'I recently was working on writing end-to-end test cases using protractor on a project. Everything was working fine until the number of test cases increased significantly, and running the complete set of test cases took too much time. It was a pain to even think of running the e2e command&#46;&#46;&#46;'
pubDate: 'Nov 20, 2017'
updatedDate: 'Oct 25, 2023'
heroImage: './hero.jpg'
categories: ["JavaScript"]
categoryHierarchy: ["Development","Web Development","Javascript"]
---

I recently was working on writing end-to-end test cases using protractor on a project. Everything was working fine until the number of test cases increased significantly, and running the complete set of test cases took too much time. It was a pain to even think of running the e2e command since I knew it would take 10 minutes at least to get to a specific test.

I started searching for a way to run a specific test case, and there were some solutions on Google and Stack Overflow, which provided command-line arguments while running the test cases. Sadly, they did not work. Others mentioned some changes to configuration files, which I could not do since I was using a CLI that had encapsulated all of those files.

However, controlling which test case to execute was something I needed to do. I wanted to run a single test case using Jasmine. And I was not going to comment out test cases that I did not want to run or delete other files temporarily. I found a temporary workaround for running specific test cases in Jasmine. Instead of the tedious task of commenting test cases, all you need to do is add a character to your file/test cases!

## Running specific test cases in Jasmine

You can use `fit()` or `fdescribe()` instead of `it()` and `fdescribe()` to achieve what is known as focussed test cases.

```
describe("test spec",() => {
    it("test case 1",() => {});
    fit("test case 2", () => {});
});
```

In the above example, only test case 2 would get executed. On execution, a single test (test case 2) case gets executed. Multiple fit() calls can be used to run specific test cases. And that is how you make running specific test cases an easy thing.

## Running specific test cases in Mocha

For Mocha, we need to use use `it.only()` instead of `fit()` to achieve the same result.

```
describe("test spec",() => {
    it("test case 1",() => {});
    it.only("test case 2", () => {});
});
```

## Excluding specific test cases or specs in Jasmine

To exclude a specific test case or spec, all you need to do is use `xit()` or `xdescribe()` instead of `it()` and `describe()`. And that is it!

This means that all of the following test cases would get skipped during execution:

```
xdescribe("test spec", function() {
    it("test case 1", () => {});
    it("test case 2", () => {});
});
```

```
describe("test spec", function() {
    it("test case", () => {});
    xit("test case", () => {});
});

```

The output in the terminal would read:

```
Executed 0 of 3 test cases (skipped 3) SUCCESS
```

```
Executed 0 of 3 test cases (skipped 3) SUCCESS
```

## Excluding specific test cases or specs in Mocha

For Mocha, we need to use use `describe.skip()` instead of `xdescribe()` to achieve the same result.

```
describe.skip("test spec", function() {
    it("test case", () => {});
    it("test case", () => {});
});

```

For skipping individual test cases:

```
describe("test spec", function() {
    it.skip("test case", () => {});
    it("test case", () => {});
});

```

## Conclusion

This still might not be what you want, and you might explicitly want only one test case to run. Excluding multiple specs or test cases in multiple files can still be tedious.

I hope this post helped you. Let us know if you have any queries in the comment section below.
