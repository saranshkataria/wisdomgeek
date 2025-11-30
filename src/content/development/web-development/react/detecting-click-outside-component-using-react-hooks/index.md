---
title: 'Detecting click outside component using React hooks'
description: 'If you have tried developing your own dropdown, modal, or popover in React, you would have come across this. "How do I detect a click outside my react component so that I can close it?" Detecting click outside component is luckily is not that difficult. This post will use react&#46;&#46;&#46;'
pubDate: 'Nov 10, 2020'
heroImage: './hero.jpg'
categories: ["React"]
---

If you have tried developing your own dropdown, modal, or popover in React, you would have come across this. "How do I detect a click outside my react component so that I can close it?" Detecting click outside component is luckily is not that difficult. This post will use react hooks to implement this functionality.

Before we get started with our process of detecting click outside component using React hooks, there is one hook in particular that we need to know about: useRef.

## The useRef hook

useRef is a react hook that can be used to access DOM elements. It returns a mutable object whose current property is initialized to the argument that gets passed as an argument.

The syntax for using the hooks looks like this:

```
const refContainer = useRef(initialValue);
```

And a sample implementation to focus the component on render would be:

```
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` points to the mounted text input element
    inputEl.current.focus();
  };
  return (
    
      input ref={inputEl} type="text" />
      button onClick={onButtonClick}>Focus the inputbutton>
    
  );
}
```

ref can be used in element tags or components too. It provides a way to access the corresponding DOM nodes. If you pass in a reference object using ref = {}, React sets the current property of the corresponding node. This property is updated whenever the node changes too. 

There are other use cases for the useRef hook as well. But this post will be focused only on detecting click outside component. If you are interested in knowing more about what the [useRef hook](https://www.wisdomgeek.com/development/web-development/react/understanding-the-useref-react-hook/) can do, do check out our post regarding that hook.

## Setting up event listeners

Now that you know of useRef, we will use it along with an event listener (for mouseDown or click). This listener will be attached to the document whenever the component is rendered. It will also be unmounted whenever the component is hidden. For obtaining this functionality, the useEffect react hook can be used. If you want a deeper insight into the [useEffect react hook](https://www.wisdomgeek.com/development/web-development/react/learning-context-api-and-the-usecontext-react-hook/), you can read the previous post about it.

For the component, there is a showOptionsList variable that is being used as a state variable to determine whether the component is visible or not. Thus, the useEffect will have it as a dependency, and according to its value, the event listener will be added/removed.

```
 useEffect(() => {
    if (showOptionsList) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOptionsList]);
```

## Detecting click outside component

Now that the handleClick will be triggered every time a click is registered on the document, all that remains is to check if the click is outside the component or not. For this, a reference to the component is needed. This can be obtained by making use of the useRef hook that was discussed earlier. Thus:

```
const Select = () => {
  const node = useRef();
  return (
    div ref={node}>
      // Remaining code
    div>
  );
};

```

And then, all that needs to be done in the handle click outside function would be to check if the user clicked outside the component or not. An implementation could be to check the target element of the click and if that equals the reference. But that only works for a single level node. In the case of multiple sub-nodes, the simple comparison would not work.

The .contains() method can be used to solve that problem. It tells if a node is a child of a given node or not. Thus, the implementation of the function becomes:

```
const handleClickOutside = (e) => {
  if (node.current && node.current.contains(e.target)) {
    // inside click
    return;
  }
  // outside click
  setShowOptionsList(false);
};
```

The completed source code for the Select implementation can be found on [Github](https://github.com/saranshkataria/react-select/blob/main/src/components/Select/index.js) if you want to go through it. If you want to make yourself familiar with other react hooks like [useState and useEffect](https://www.wisdomgeek.com/development/web-development/react/learning-context-api-and-the-usecontext-react-hook/), [useReducer](https://www.wisdomgeek.com/development/web-development/react/understanding-the-usereducer-hook-in-react/), or [useContext](https://www.wisdomgeek.com/development/web-development/react/learning-context-api-and-the-usecontext-react-hook/), check out the respective posts.

If there are any other [react hooks](https://www.wisdomgeek.com/tag/react-hooks/) related things that you would want to cover, or if you have any queries, feel free to drop a comment below.
