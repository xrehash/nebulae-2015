/** Domain Model Objects */

var nebulae;
(function (nebulae) {
  nebulae.newId = function () {
    var dt = new Date();
    var num = Math.floor(Math.random() * 100 * Date.now());
    return "" + dt.getFullYear() + dt.getMonth() + dt.getDay() + dt.getHours() + dt.getMinutes() + "_" + num;
  };

  var ResourceType = (function () {
    function ResourceType(id) {
      var self = this;
      self._id = id;
      self.family = undefined;
      self.name = "";
      self.schema = [];

      self.inflate = function (dao) {
        self._id = dao['_id'];
        self.name = dao['name'];
        self.family = dao['family'];
        if (dao['schema'])
          self.schema = dao['schema'];
        if (dao['_rev'])
          self._rev = dao['_rev'];
      }
      self.deflate = function () {
        return JSON.stringify(self)
      }
    }
    return ResourceType
  }());
  nebulae.ResourceType = ResourceType;

  var Resource = (function () {
    function Resource(id, name, resourceType) {
      var self = this;
      self._id = id
      self.name = name
      self.resourceTypeId = resourceType._id
      if (resourceType && resourceType.schema && resourceType.schema.length) {
        resourceType.schema.map(function (v) {
          self[Object.getOwnPropertyNames(v)[0]] = null
        })
      }

      self.resourceType = function () {
        return resourceType
      }

      self.deflate = function () {
        return JSON.stringify(self)
      }
      self.inflate = function (dao) {
        self._id = dao['_id']
        self.name = dao['name']
        self.resourceTypeId = dao['resourceTypeId']
        Object.getOwnPropertyNames(dao).map(function (v, i, Arr) {
          if (['_id', 'name', 'resourceTypeId'].indexOf(v) < 0) {
            self[v] = dao[v]
          }
        })
      }
    }
  }())
  nebulae.Resource = Resource;

})(nebulae || (nebulae = {}))