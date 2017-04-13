/** View Model for resource search component */
var Model = (function () {
  function TabSearchModel() {
    var me = this
    me.activeTab = ko.observable("tab1")
    me.tabClick = function (obj, domObj) {
      // console.log(obj, domObj.target.id)
      if (me.activeTab() == undefined || me.activeTab() != obj) {
        me.activeTab(domObj.target.id)
      }
    }
    me.family = ko.observable(undefined)
    me.nameSearch = ko.observable(undefined)
    me.isSearchEnabled = ko.computed(function () {
      return me.family() || me.nameSearch()
    })
    me.doSearch = function (obj, domObj) {
      $.gevent.publish('spa-data-search-request', [{
        family: me.family(),
        name: me.nameSearch()
      }])
    }
    me.doCreate = function (obj, domObj) {
      $.gevent.publish('spa-data-create-request', [{
        family: me.family()
      }])
    }
  }

  function SearchModel(App) {
    var self = this
    self.App = App
    self.Caption = "Resource Search"
    self.tabCompModel = new TabSearchModel()
    self.resultIds = ko.observableArray()
    self.resultResources = ko.observableArray()
    self.resourceType = ko.observable()
    self.searchSend = function (evt, objs) {
      console.log('fart', objs)
      if (objs && objs.family) {
        self.resourceType(self.App.listResourceTypes().find((val) => {
          return (val._id == objs.family)
        }))
        var p = networkCall.GetResourcesByType(objs.family, function (result) {
          self.resultIds(result)
          networkCall.GetResources(result.map((val) => {
            return val.id
          }), function (resData) {
            self.resultResources(resData)
          }, console.log)
        }, console.log)
      }
    }
    self.createLaunch = function (evt, objs) {
      objs.mode = "read"
      objs.target = new nebulae.Resource(nebulae.newId(), "", self.App.getResourceTypeById(objs.family))
      // console.log(objs, self.App.getResourceTypeById(objs.family))
      self.App.launch('resource-editor', objs)
    }

    $.gevent.subscribe($(document), 'spa-data-search-request', self.searchSend);
    $.gevent.subscribe($(document), 'spa-data-create-request', self.createLaunch);
  }



  return SearchModel;
})();