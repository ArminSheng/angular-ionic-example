angular.module('mmr.services')

.factory('mmrMetaFactory', ['$q', '$http', 'restService', 'mmrCacheFactory', 'mmrEventing',
  function($q, $http, restService, mmrCacheFactory, mmrEventing) {

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

        dfd.resolve(cCache[cCacheKey]);
      }, function(err) {
        dfd.reject();
      });

      return dfd.promise;
    },

    citiesAndDisctricts: function() {
      var items = {
        '南京市': [
          '雨花区',
          '玄武区',
          '江北区'
        ],
        '上海市': [
          '长宁区',
          '浦东新区',
          '普陀区',
          '徐汇区',
          '卢湾区',
          '黄浦区'
        ],
        '北京市': [
        '朝阳区'
        ],
        '苏州市': []
      };

      mmrCacheFactory.set('cities', Object.keys(items));
      mmrCacheFactory.set('districts', items);
    }
  };

}]);
