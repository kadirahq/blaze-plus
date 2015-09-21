Tinytest.addAsync('Props - passing a helper a prop', function(test, done) {
  clean();
  var name = Random.id();
  Session.set('name', name);

  Blaze.render(Template.App1, $('#playground').get(0));
  var text = $('#playground').text();
  test.isTrue(text.indexOf(name) >= 0);
  done();
});

Tinytest.addAsync('Props - passing a data item as a prop', function(test, done) {
  clean();
  var name = Random.id();
  var user = {name: name};

  Blaze.renderWithData(Template.App3, {valueFromData: user}, $('#playground').get(0));
  var text = $('#playground').text();
  test.isTrue(text.indexOf(name) >= 0);
  done();
});

Tinytest.addAsync('Props - changing data without re-renders', function(test, done) {
  clean();
  var name = Random.id();
  Session.set('name', name);

  Blaze.render(Template.App1, $('#playground').get(0));
  test.isTrue($('#playground').text().indexOf(name) >= 0);
  
  // change hello text
  var newGreeting = 'Ayubowan';
  $('#playground span').text(newGreeting)

  var newName = Random.id();
  Session.set('name', newName);

  Tracker.afterFlush(function() {
    test.isTrue($('#playground').text().indexOf(newName) >= 0);
    test.isTrue($('#playground').text().indexOf(newGreeting) >= 0);
    Meteor.defer(done);
  });
});

Tinytest.addAsync('State - setting state', function(test, done) {
  clean();
  var name = Random.id();
  Session.set('name', name);

  Blaze.render(Template.App2, $('#playground').get(0));
  var text = $('#playground').text();
  test.isTrue(text.indexOf(name) >= 0);
  done();
});

Tinytest.addAsync('State - getting state', function(test, done) {
  clean();
  var name = Random.id();
  Session.set('name', name);

  Blaze.render(Template.App2, $('#playground').get(0));
  var text = $('#playground').text();
  test.isTrue(text.indexOf(name) >= 0);

  var newName = Random.id();
  Session.set('name', newName);

  Tracker.afterFlush(function() {
    var text = $('#playground').text();
    test.isTrue(text.indexOf('previously: ' + name) >= 0);
    Meteor.defer(done);
  });
});

function clean() {
  Blaze._destroyNode($('#playground').get(0));
  $('#playground').html(' ');
}