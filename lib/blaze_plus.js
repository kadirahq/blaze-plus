var originalLookup = Blaze.View.prototype.lookup;
Blaze.View.prototype.lookup = function(name, options) {
  var view = this;
  var matched = name.match(/prop\$(.*)/);
  if(matched) {
    var propName = name.replace(/^prop\$/, '');
    // Here we are returning two functions by purpose
    // Because of that, blaze won't invalidate due to data changes
    return function() {
      return function() {
        var value = view.lookup(propName)();
        return value;
      };
    };
  }

  return originalLookup.call(this, name, options);
};

Template['$'] = new Template("Template.$", function() {
  var wrapperView = this;
  var templateName = Spacebars.call(wrapperView.lookup("template"));
  var template = Template[templateName];
  if(!template) {
    throw new Error("There is no such template called: " + templateName);
  }

  var props = _.clone(Blaze._parentData(0));
  // deleting template property from props
  delete props.template;

  // Assign the props to the template instance
  // We need to run this onCreated hook at the beginning
  // That's why we do this
  template._callbacks.created.unshift(function() {
    var templateInstance = this;

    // Assign props to the template instance
    this.props = props;
    var reactiveState = {};
    var nonReactiveState = {};

    // set a state 
    this.setState = function(key, value) {
      if(!reactiveState[key]) {
        reactiveState[key] = new ReactiveVar();
        var helpers = {};
        helpers['$' + key] = function() {
          return reactiveState[key].get();
        };

        templateInstance.view.template.helpers(helpers);
      }

      reactiveState[key].set(value);
      nonReactiveState[key] = value;
    };

    // get a state 
    this.getState = function(key) {
      var state = nonReactiveState[key];
      if(!state) {
        return undefined;
      }

      return state;
    }
  });

  var view = template.constructView();
  return view;
});