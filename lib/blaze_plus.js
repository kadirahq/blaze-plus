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
    var states = {};

    // set a state 
    this.setState = function(key, value) {
      if(!states[key]) {
        states[key] = new ReactiveVar();
        var helpers = {};
        helpers['$' + key] = function() {
          return states[key].get();
        };

        templateInstance.view.template.helpers(helpers);
      }

      states[key].set(value);
    };

    // get a state 
    this.getState = function(key) {
      var state = states[key];
      if(!state) {
        throw new Error("There is no state called: " + key);
      }

      return states[key].get();
    }
  });

  var view = template.constructView();
  return view;
});