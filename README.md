## Blaze Plus (Blaze+) [![](https://api.travis-ci.org/kadirahq/blaze-plus.svg)](https://travis-ci.org/kadirahq/blaze-plus)

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
<body>
  {{> App}}
</body>

<template name="App">
  <!-- This is the starting point of the Magic functionality -->
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
    // getting props via Template instance
    var props = Template.instance().props;
    return props.user().name;
  }
});
```

As you can see, Blaze Plus assign all the props you pass into the `props` property in the Template instance as a function. So, it only invalidate only when used it.

> You can clone this app via: https://github.com/arunoda/blaze-plus-props-only

By doing that, we can avoid templates re-renders.

For an example, now you can chnage the name via: `Session.set('Your Name')` and it won't re-render the `Welcome` template. Just like that, you can pass data to any level you need.

[Watch this video to see it yourself.](https://youtu.be/Gaz6S75Qo6c)

## Using States to Simplyfy Things

In the above example, getting the name via props is kind a bit difficult and we need to write more code: That's where state's gonnna help us.

Now we are trying to get the name in the Welcome template using states like this:

~~~html
<template name="Welcome">
  <span>Hello, </span> {{$name}}
</template>
~~~

We write states with a `$` symbol at the beginning. This is how we create this state:

~~~js
Template.Welcome.onCreated(function() {
  var self = this;
  this.autorun(function() {
    var user = self.props.user();
    self.setState('name', user.name);
  });
});
~~~

We are doing it inside a autorun created inside the `onCreated` hook. Here autorun will run whenever the name changes. Then it'll set the state accordingly.

> It is recommended to run as many as autoruns isolating props into their own autorun. With that, it'll invalidate only the necessory states. But, that's not a rule.

Just like setting state, you can get state as well using `getState()`.

~~~js

Template.Welcome.onCreated(function() {
  var self = this;
  this.autorun(function() {
    var user = self.props.user();
    var exisingName = self.getState('name') || "";
    self.setState('name', exisingName + ":" + user.name);
  });
});
~~~

**It is not reactive.** That's something we did to prevent invalidating loops.