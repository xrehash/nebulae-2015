var Model = (function () {
  function SearchModel(rTModel) {
    var self = this;
    self.rTModel = rTModel;
    self.Caption = "Resource Types";
    self.searchTerm = ko.observable("");
    self.pickedResourceType = ko.observable();
    self.hasPicked = ko.computed(function () {
      return self.pickedResourceType() ? true : false
    })
    self.resultList = ko.observableArray();
    self.showResults = ko.computed(function () {
      return self.resultList() && self.resultList().length;
    });
    self.searchBoxKeyPress = function (obj, evt) {
      //console.log(evt.originalEvent);
      if (evt.originalEvent.keyCode == 13) {
        setTimeout(self.doSearch, 100);
      }
      return true;
    };
    self.doSearch = function () {
      if (self.searchTerm()) {
        var target = new RegExp(self.searchTerm(), "i");
        var results = [];
        self.rTModel.listResourceTypes().map(function (rt, idx, arr) {
          if (target.test(rt.name)) {
            results.push(rt);
          }
        });
        self.resultList(results);
      };
    };
    self.rowSelected = function (argObj, arg) {
      //console.log(argObj, arg);
      self.pickedResourceType(argObj);
      $.gevent.publish('spa-model-search-SelectionChange', [argObj]);
    };
    self.openPicked = function () {
      if (self.pickedResourceType()) {
        self.rTModel.launch('resource_type_editor', [self.pickedResourceType()]);
      }
    }



  }
  return SearchModel;

})();