var Model = (function () {
  function ResourceTypeEditorModel(App, args) {
    var self = this;
    self.App = App;
    self.Caption = "Resource Type Editor";
    self.mode = ko.observable("read");

    self.ResourceType = ko.observable();
    if (args && args.length > 0 && args[0] instanceof nebulae.ResourceType) {
      self.ResourceType(args[0])
    } else {
      self.ResourceType(new nebulae.ResourceType(nebulae.newId()))
    }

    self.init = function () {}
    self.init()
  }
  return ResourceTypeEditorModel
}());