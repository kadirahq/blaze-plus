## Blaze Plus (Blaze+)

Adding Props and State Management functionality to Meteor's Blaze templating engine. 

### Why?

Passing data from the top to the bottom of your UI is common pattern which pretty well, specially in React. But, it's an anti pattern in Meteor becasue, that leads to a lot of template re-renders.

**Blaze Plus, is gonna fix it.**

### Adding Blaze Plus

```
meteor add kadira:blaze-plus
```

### Passing Data to Templates via Props

Now, we are gonna pass some data to the template as props. Here's our app template which has the data.

```js
Template.App.helpers({
    getUser: function() {
        var name = Session.get("name") || "Arunoda";
        return {name: name};
    }
});
```

Let's pass this user object into a another template:

```html
<template name="App">
    {{>$ template="Welcome" user=prop$getUser}}
</template>

<template name="Welcome">
    <span>Hello, </span> {{getName}}
</template>
```

Here we simply pass the `getUser` helpers response to the `Welcome` template. But, how it access that object. Let's see the `getName` helper for that:

```js
Template.Welcome.helpers({
    getName: function() {
        return Template.instance.props.user().name;
    }
});
```

As you can see, Blaze Plus assign all the props you pass into the `props` property in the Template instance as a function. So, it only invalidate only when used it.

By doing that, we can avoid templates re-renders.

For an example, now you can chnage the name via: `Session.set('Your Name')` and it won't re-render the `Welcome` template. Just like that, you can pass data to any level you need.