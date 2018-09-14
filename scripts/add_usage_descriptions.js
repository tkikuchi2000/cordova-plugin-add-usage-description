var ios_script = require('./add_usage_descriptions_ios');

module.exports = function(context) {
  var Q = context.requireCordovaModule('q');
  var platforms = context.requireCordovaModule('cordova-lib/src/cordova/util').listPlatforms(context.opts.projectRoot);

  var promises = [];

  if (platforms.indexOf('ios') >= 0) {
    promises.push(ios_script(context));
  }

  return Q.all(promises);
};
