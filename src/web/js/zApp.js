/*** Application Level Object */

var zApp = (function () {
  function zApp() {
    var self = this;

    self.PageTitle = ko.observable("");
    self.Components = ko.observableArray(['relations', 'resources', 'resource_type_search']);
    self.listResourceTypes = ko.observableArray();

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
    self.compCloseClick = function (dObj, node) {
      if (confirm("Are you sure you want to remove this component?")) {
        console.log(dObj, node);
        self.clean(dObj.propName);
      }
    };
    self.clean = function (comp) {
      var node = $("#" + comp);
      if (node) {
        ko.cleanNode(node[0])
        var pNode = node[0].parentNode;
        pNode.removeChild(node[0])
      }
    }
    self.launch = function (comp, args) {

      var view = 'components/' + comp + '/view.html';
      var style = 'components/' + comp + '/style.css';
      var model = 'components/' + comp + '/model.js';
      var viewText = '';
      var composeOk = false;
      var popName = comp;
      self.launchArgs = args;
      var req = $.get(view);
      // console.log('launching ', comp, req)
      req.done(function (data) {
        //console.log(ko);            
        viewText = data;
        $.get(model, function (scriptText) {
          var propName = 'win_' + popName
          var prop = $('#' + propName);
          if (!prop.length) {
            $('#page').append('<div class="pagecomponent" id="' + propName + '"></div>');
          } else {
            ko.cleanNode(prop[0])
          }
          prop = $('#' + propName);
          // console.log("KK-KK", propName, prop);
          $(prop).empty();
          $(prop).append('<div class="compHeader"><button data-bind="click:compCloseClick" class="close"><em class="fa fa-close"></em> close</button><span class="compcaption">{{Caption}}</span></div>');
          $(prop).append(viewText);
          // console.log("zz")
          $(prop).append("<script>(function(){" + scriptText + "if(Model){var model = new Model(App,App.launchArgs);model.propName='" + propName + "';model.compCloseClick=App.compCloseClick;var comp = document.getElementById('" + propName + "');ko.applyBindings(model,comp);}})();</script>");
          var styleReq = $.get(style);
          styleReq.done(function (styleCopy) {
            $(prop).append("<style scoped>" + styleCopy + "</style>");
          });
          // $(prop).dialog();
        });
      });
      req.fail(
        function (obj, err) {
          alert("Unable to launch " + comp + " component!")
          console.log(arguments);
        });
    };

    self.loadResourceTypeList = function () {
      networkCall.GetResourceTypes(function (listData) {
          self.listResourceTypes(listData);
        },
        function (error) {
          console.log(error);
        }
      );
    };

    self.start = function () {
      console.log('starting app');
      self.loadResourceTypeList();
      ko.applyBindings(self, document.getElementById('body'));
      self.launch('home')
    };
  }

  return zApp;
})();