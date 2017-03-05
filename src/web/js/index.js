/* app setup */

$(document).ready(function (_) {
  // ko.bindingProvider.instance = new MustacheBindingProvider();
  // ko.setTemplateEngine(new ko.mustacheTemplateEngine());
  ko.punches.enableAll();
  var App = new zApp();
  window.App = App;
  App.start();
});