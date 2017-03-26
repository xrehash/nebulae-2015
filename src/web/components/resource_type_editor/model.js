var Model = (function () {
  function ResourceTypeEditorModel(App, args) {
    var self = this;
    self.App = App;
    self.Caption = "Resource Type Editor";
    self.mode = ko.observable("read-mode");
    self.dataSource = function () {
      return self.mode() == 'read-mode' ? self.ResourceType : self.WorkingCopy;
    };

    self.editBtnClick = function (obj, domObj) {
      var newMode = self.mode() == 'read-mode' ? 'edit-mode' : 'read-mode';
      if (newMode == "edit-mode") {
        // make working copy
        self.updateWorkingCopy();
      }
      self.mode(newMode);
    };
    self.updateWorkingCopy = function () {
      var workee = new nebulae.ResourceType(nebulae.newId());
      workee.inflate(JSON.parse(self.ResourceType().deflate()));
      workee.ListResourceTypes = self.ListResourceTypes()
      workee = ko.mapping.fromJS(workee);
      self.newProperty = ko.observable(false);
      self.newPropertyName = ko.observable();
      self.newPropertyTypes = ["string", "number", "date"];
      self.newPropertyType = ko.observable();
      self.newPropertyClick = function () {
        self.newProperty(true);
      }
      workee.family.subscribe(function (newParentId) {
        console.log(newParentId)
        var newParent = self.resTypeFind(newParentId)
        if (newParent && Array.isArray(newParent.schema)) {
          newParent.schema.forEach((x) => {
            if (!workee.schema().find(function (e) {
                return Object.getOwnPropertyNames(e)[0] == Object.getOwnPropertyNames(x)[0]
              })) {
              workee.schema.push(x)
            }
          })
        }
      })
      self.WorkingCopy(workee)
      //console.log(self.WorkingCopy())
    }
    self.saveBtnClick = function (obj, domObj) {
      var data = ko.mapping.toJS(self.WorkingCopy())
      delete data.ListResourceTypes
      //console.log(data)
      var p = networkCall.SaveResourceType(data);
      p.then(function (result) {
        result = JSON.parse(result)
        if (result.ok) {
          self.mode(self.mode() == 'read-mode' ? 'edit-mode' : 'read-mode')
          $.gevent.publish('spa-data-save-ResourceType', [data._id])
        }
      });

    };
    self.removeSchemaItem = function (obj, domObj) {
      // console.log("removing ", obj);
      var set = self.WorkingCopy().schema;
      set.remove(function (val) {
        return Object.getOwnPropertyNames(val)[0] == Object.getOwnPropertyNames(obj)[0];
      });
    };
    self.addSchemaItem = function (obj, domObj) {
      console.log(self.newPropertyName(), self.newPropertyType())
      if (self.newPropertyName() && self.newPropertyType()) {
        var p = {}
        p[self.newPropertyName()] = self.newPropertyType();
        self.WorkingCopy().schema.push(p)
      }
    }
    self.ListResourceTypes = function () {
      return self.App.listResourceTypes;
    };

    self.ResourceType = ko.observable();
    self.WorkingCopy = ko.observable();
    self.setupRT = function (rt) {
      rt.familyName = function () {
        if (rt.family) {
          var p = self.resTypeFind(rt.family)
          return p.name
        } else {
          return undefined
        }
      }
      self.ResourceType(rt)
    }

    if (args && args.length > 0 && args[0] instanceof nebulae.ResourceType) {
      var rt = args[0]
      self.setupRT(rt)
    } else {
      self.setupRT(new nebulae.ResourceType(nebulae.newId()))

      self.mode("edit-mode")
      self.updateWorkingCopy();
    }
    self.dirtyDataResourceType = function (evt, arg) {
      //console.log("I am dirty", self.ResourceType())
      var x = self.resTypeFind(self.ResourceType()._id)
      if (x)
        self.setupRT(x)
      else
        console.log("cant find it")
    }

    self.resTypeFind = function (rtId) {
      var list = self.App.listResourceTypes()
      // console.log(list)
      var p = list.find(function (val) {
        return val._id == rtId
      })
      return p
    }

    $.gevent.subscribe($(document), 'spa-data-change-ResourceType', self.dirtyDataResourceType);

    self.init = function () {}
    self.init()
  }
  return ResourceTypeEditorModel
}());