Template.App1.helpers({
  getUser: function() {
    return {name: Session.get('name')};
  }
});

Template.Welcome1.helpers({
  getName: function() {
    var name = Template.instance().props.user().name;
    return name;
  }
});

// ===================

Template.App2.helpers({
  getUser: function() {
    return {name: Session.get('name')};
  }
});

Template.Welcome2.onCreated(function() {
  var self = this;
  this.autorun(function() {
    var name = self.props.user().name;
    var oldName = self.getState('name');
    self.setState('oldName', oldName);
    self.setState('name', name);
  });
});