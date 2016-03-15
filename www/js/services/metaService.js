angular.module('mmr.services')

.factory('mmrMetaFactory', ['$rootScope', '$q', '$http', 'restService', 'apiService', 'mmrCacheFactory', 'mmrEventing',
  function($rootScope, $q, $http, restService, apiService, mmrCacheFactory, mmrEventing) {

  // remove the '专区'
  var removeTrailing = function(item) {
    if(item && item.name) {
      var idx = item.name.indexOf('专区');
      if(idx > 0) {
        item.name = item.name.substring(0, idx);
      }
    }

    return item;
  };

  var fillHomeEntries = function(items) {
    _.forEach(items, function(item) {
      if(item.name === '禽产品') {
        $rootScope.$root.category.entries[0] = item;
      } else if(item.name === '畜产品') {
        $rootScope.$root.category.entries[1] = item;
      } else if(item.name === '水产品') {
        $rootScope.$root.category.entries[2] = item;
      } else if(item.name === '熟食调理') {
        $rootScope.$root.category.entries[3] = item;
      } else if(item.name === '腌腊制品') {
        $rootScope.$root.category.entries[4] = item;
      }
    });
  };

  var stringify = function(classParam) {
    var result = '';

    if('gen' in classParam) {
      result += 'gen' + classParam.gen;
    }
    if('gid' in classParam) {
      result += 'gid' + classParam.gid;
    }
    if('id' in classParam) {
      result += 'id' + classParam.id;
    }

    return result;
  };

  return {
    brands: function() {
      $http({
        url: restService.API_REST + 'c_brand/all',
        method: 'GET'
      }).then(function(res) {
        // save into cache
        mmrCacheFactory.set('brands', res.data);
      }, function(err) {
      });
    },

    // such as: 冻品，鲜品
    attributes: function() {
      $http({
        url: restService.API_REST + 'c_attribute/all',
        method: 'GET'
      }).then(function(res) {
        // save into cache
        $rootScope.$root.mappings = {};
        $rootScope.$root.mappings.attributes = {};
        _.forEach(res.data, function(attr) {
          $rootScope.$root.mappings.attributes[attr.id] = attr.name;
        });
        mmrCacheFactory.set('attributes', res.data);
      }, function(err) {
      });
    },

    // params is an object:
    // gen, gid and id
    classification: function(params) {
      var dfd = $q.defer();

      params = params || {};
      params.gen = params.gen || 0;
      params.gid = params.gid || 1;

      $http({
        url: restService.API_REST + 'c_classification/gen/',
        method: 'GET',
        params: params
      }).then(function(res) {
        // save into cache
        var cCache = mmrCacheFactory.get('classifications') || {},
            cCacheKey = stringify(params);
        cCache[cCacheKey] = _.map(res.data, removeTrailing);
        mmrCacheFactory.set('classifications', cCache);

        // broadcast the category items event
        mmrEventing.doSetCategoryItems(cCacheKey);
        $rootScope.$root.category.items = cCache[cCacheKey];

        // fill the home view entries
        if(params.gen === 0) {
          fillHomeEntries(res.data);
          mmrEventing.doLoadHomeCommodity();
        }

        dfd.resolve(cCache[cCacheKey]);
      }, function(err) {
        dfd.reject();
      });

      return dfd.promise;
    },

    citiesAndDisctricts: function() {
      var items = {
        '南京市': [
          '玄武区',
          '白下区',
          '秦淮区',
          '建邺区',
          '鼓楼区',
          '下关区',
          '浦口区',
          '雨花台区',
          '江宁区',
          '六合区',
          '溧水区',
          '高淳区',
          '其它区'
        ],
        '上海市': [
          '黄浦区',
          '卢湾区',
          '徐汇区',
          '长宁区',
          '静安区',
          '普陀区',
          '闸北区',
          '虹口区',
          '杨浦区',
          '闵行区',
          '宝山区',
          '嘉定区',
          '浦东新区',
          '金山区',
          '松江区',
          '青浦区',
          '南汇区',
          '奉贤区',
          '川沙区',
          '崇明县',
          '其它区'
        ],
        '苏州市': [
          '沧浪区',
          '平江区',
          '金阊区',
          '虎丘区',
          '吴中区',
          '相城区',
          '常熟市',
          '张家港市',
          '昆山市',
          '吴江区',
          '太仓市',
          '新区',
          '园区',
          '其它区'
        ]
      };

      mmrCacheFactory.set('cities', Object.keys(items));
      mmrCacheFactory.set('districts', items);
    },

    // longitude,latitude
    location: function(location) {
      return $http({
        url: apiService.META_LOCATION,
        method: 'POST',
        data: {
          data: location
        }
      }).then(function(res) {
        if(res.data && res.status === 200) {
          $rootScope.$root.location = res.data;
        }
      }, function(err) {

      });
    }
  };

}]);
