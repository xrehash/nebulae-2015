var Model = (function () {
  function ResourceEditorModel(App, args) {
    var Me = this
    Me.App = App
    Me.Caption = "Resource Editor"
    Me.modes = {
      READ: 'read',
      EDIT: 'edit'
    }
    Me.currentMode = ko.observable(args.mode)
    Me.resourceObject = args.target
    Me.editorResource = ko.observable(args.target)
    Me.dataSource = ko.computed(function () {
      return Me.resourceObject
      // if (Me.currentMode == Me.modes.EDIT) {
      //   return Me.editorResource
      // } else {
      //   return Me.resourceObject
      // }
    })
    Me.editableProps = function () {
      return Me.resourceObject.ResourceType().schema
    }
    Me.familyName = function () {
      return Me.resourceObject.ResourceType().name
    }

  }
  return ResourceEditorModel
})();