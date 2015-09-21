Package.describe({
  name: 'kadira:blaze-plus',
  summary: 'Adds Props and State Management Functionlity to Blaze',
  version: '1.0.1',
  git: 'https://github.com/kadirahq/blaze-plus.git'
});

Package.onUse(function(api) {
  configure(api);
});

Package.onTest(function(api) {
  configure(api);
  api.use('tinytest');
  api.use('jquery');

  api.addFiles('test/helpers/templates.html', 'client');
  api.addFiles('test/helpers/templates.js', 'client');
  api.addFiles('test/blaze_plus.js', 'client');
});

function configure(api) {
  api.versionsFrom('1.0');

  api.use('underscore');
  api.use('tracker');
  api.use('reactive-var');
  api.use('templating');
  api.use('blaze');

  api.addFiles('lib/blaze_plus.js', 'client');
}
