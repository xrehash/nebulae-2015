/*** Application Level Object */

var zApp = (function () {
  function zApp() {
    var self = this;

    self.PageTitle = ko.observable("");
    self.Components = ko.observableArray(['relations', 'resources', 'resource_types']);

    self.present = function (comp) {
      var view = 'components/' + comp + '/view.html';
      var style = 'components/' + comp + '/style.css';
      var model = 'components/' + comp + '/model.js';
      var viewText = '';
      var composeOk = false;
      var req = $.get(view);
      req.done(function (data) {
        //console.log(ko);            
        viewText = data;
        $.get(model, function (scriptText) {
          $("#page").empty();
          $("#page").append(viewText);
          $("#page").append("<script>(function(){" + scriptText + "if(Model){var model = new Model(App);var comp = document.getElementById('page').getElementsByClassName('component').item(0);ko.applyBindings(model,comp);}})();</script>");
          var styleReq = $.get(style);
          styleReq.done(function (styleCopy) {
            $("#page").append("<style scoped>" + styleCopy + "</style>");
          });
        });
      });

      req.error = function (obj, err) {
        console.log(arguments);
      };
    };
    self.launch = function (comp, popName) {
      var view = 'components/' + comp + '/view.html';
      var style = 'components/' + comp + '/style.css';
      var model = 'components/' + comp + '/model.js';
      var viewText = '';
      var composeOk = false;
      var req = $.get(view);
      req.done(function (data) {
        //console.log(ko);            
        viewText = data;
        $.get(model, function (scriptText) {
          var propName = 'win.' + popName
          var prop = $('#' + propName) || $('#page').append('<div id="' + propName + '"></div>');
          console.log(prop);
          $(prop).empty();
          $(prop).append(viewText);
          $(prop).append("<script>(function(){" + scriptText + "if(Model){var model = new Model(App);var comp = document.getElementById('page').getElementsByClassName('component').item(0);ko.applyBindings(model,comp);}})();</script>");
          var styleReq = $.get(style);
          styleReq.done(function (styleCopy) {
            $(prop).append("<style scoped>" + styleCopy + "</style>");
          });
          $(prop).dialog();
        });
      });

      req.error = function (obj, err) {
        console.log(arguments);
      };
    };

    self.start = function () {
      console.log('starting app');
      ko.applyBindings(self, document.getElementById('body'));
      self.present('home')
    };
  }

  return zApp;
})();