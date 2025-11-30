---
title: 'Avoiding race conditions and memory leaks in React useEffect'
description: 'Let us take a look at an implementation of getting data from an API request and see if there is any possibility of race conditions happening in this component: We have specified an empty array as a dependency to the useEffect React hook. So we have ensured that the fetch&#46;&#46;&#46;'
pubDate: 'Feb 08, 2021'
heroImage: './hero.jpg'
categories: ["React"]
---

Let us take a look at an implementation of getting data from an API request and see if there is any possibility of race conditions happening in this component:

```
import React, { useEffect} from 'react';
export default function UseEffectWithRaceCondition() {
  const [todo, setTodo] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
      const newData = await response.json();
      setTodo(newData);
    };
    fetchData();
  }, []);
  if (data) {
    return div>{data.title}div>;
  } else {
    return null;
  }
}
```

We have specified an empty array as a dependency to the [useEffect React hook](https://www.wisdomgeek.com/development/web-development/react/react-hooks-and-local-storage-lets-build-a-todo-app/). So we have ensured that the fetch request happens only once. But this component is still prone to race conditions and memory leaks. How?

The memory leak will happen if the API server took some time to respond and the component was unmounted before the response was received. Though the component was unmounted, the response to the request will still be received on completion. The response will then be parsed and setTodo will be called. And React will throw the warning:

Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.

And the message is pretty straightforward.

Another potential scenario of the same problem could have been that the todo list ID was being passed in as a prop.

```
import React, { useEffect} from 'react';
export default function UseEffectWithRaceCondition( {id} ) {
  const [todo, setTodo] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
      const newData = await response.json();
      setTodo(newData);
    };
    fetchData();
  }, [id]);
  if (data) {
    return div>{data.title}div>;
  } else {
    return null;
  }
}
```

If the hook received a different ID before the request finished and the second request finishes before our first one, we would have been shown the data for the first request in the component.

## Potential solutions to the race condition problem

There are a couple of ways to fix this. Both the approaches take advantage of the cleanup function that useEffect provides.

- We can use a boolean flag to ensure that the component is mounted. This way we only update state if the flag is true. And if we were making multiple requests inside a component, we would always display the data for the last one.

- We can use AbortController to cancel previous requests whenever the component is being unmounted. AbortController is not supported in IE though. So we need to think about that if we are to use this approach.

## useEffect cleanup with boolean flag

```
useEffect(() => {
  let isComponentMounted = true;
    const fetchData = async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
      const newData = await response.json();
      if(isComponentMounted) {
        setTodo(newData);
      }
    };
    fetchData();
    return () => {
      isComponentMounted = false;
    }
  }, []);
```

This fix relies on the way the cleanup function for useEffect works. If a component renders multiple times, the previous effect is cleaned up before executing the next effect.

Because of the way this works, it will also work correctly for our other example of multiple requests because of the ID being changed. We somewhat still have a race condition in the sense that there would be multiple requests that would be in flight in the background. But only the results from the last request will be displayed on the UI.

## useEffect cleanup with AbortController

Though the previous approach works, it is not the best way to handle race conditions. The requests are in-flight in the background. Having stale requests in the background is unnecessary consumption of the user's bandwidth. And the browser limits the maximum number of concurrent requests (maximum of 6-8) as well.

From our previous post about [how to cancel an HTTP fetch request](https://www.wisdomgeek.com/development/web-development/javascript/how-to-cancel-http-fetch-request/), we know about the AbortController API that was added to the DOM standard. We can make use of that to abort our requests altogether itself.

```
useEffect(() => {
  let abortController = new AbortController();
    const fetchData = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos/1', {
            signal: abortController.signal,
          });
      const newData = await response.json();
        setTodo(newData);
      }
      catch(error) {
         if (error.name === 'AbortError') {
          // Handling error thrown by aborting request
        }
      }
    };
    fetchData();
    return () => {
      abortController.abort();
    }
  }, []);
```

Since aborting a request throws an error, we need to handle it explicitly.

This solution works like the previous one. The cleanup function is executed before executing the next effect in case of a re-render. The difference is that the browser also cancels the request since we are using AbortController.

And those are the two ways we can avoid race conditions while making API requests using React's useEffect hook. If you want to use some third-party libraries that allow cancellation of requests as a feature, you can use Axios or React query, which provide a lot of other features as well.

If you have any questions, drop a comment below.
