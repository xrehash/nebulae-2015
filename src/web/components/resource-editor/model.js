var Model = (function () {
  function ResourceEditorModel(App, args) {
    var Me = this
    Me.App = App
    Me.Caption = "Resource Editor"
    Me.modes = {
      READ: 'read',
      EDIT: 'edit'
    }
    console.log(args)
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
    Me.resourcePropertyNames = function () {
      var lst = Object.getOwnPropertyNames(Me.resourceObject)
      return lst.filter(function (val) {
        if (val[0] != '_' && typeof (Me.resourceObject[val]) != 'function') {
          return true
        }
      })
    }
    Me.saveAction = function () {
      swal({
          title: "Are you sure?",
          text: "Any changes made will be lost!",
          type: "warning",
          showCancelButton: true,
          animation: "slide-from-top",
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes!",
          cancelButtonText: "No, cancel plx!",
          closeOnConfirm: true,
          closeOnCancel: true

        },
        function (isConfirm) {
          if (isConfirm) {
            Me.currentMode(Me.modes.READ)
          }
        }
      )
    }
    Me.editAction = function () {
      Me.currentMode(Me.modes.EDIT)
    }

  }
  return ResourceEditorModel
})();