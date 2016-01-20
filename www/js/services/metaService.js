angular.module('mmr.services')

.factory('mmrMetaFactory', ['$http', 'restService', 'mmrCacheFactory',
  function($http, restService, mmrCacheFactory) {

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

  return {
    brands: function() {
      $http({
        url: restService['API_REST'] + 'c_brand/all',
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
        url: restService['API_REST'] + 'c_attribute/all',
        method: 'GET'
      }).then(function(res) {
        // save into cache
        mmrCacheFactory.set('attributes', res.data);
      }, function(err) {
      });
    },

    classification: function(gen) {
      var g = gen || 0;
      $http({
        url: restService['API_REST'] + 'c_classification/gen/',
        method: 'GET',
        param: {
          'g': g
        }
      }).then(function(res) {
        // save into cache
        var cCache = mmrCacheFactory.get('classifications') || {};
        cCache[g] = _.map(res.data, removeTrailing);

        // cCache[g] = cCache[g].concat(cCache[g]);

        mmrCacheFactory.set('classifications', cCache);
      }, function(err) {
      });
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
        ]
      };

      mmrCacheFactory.set('cities', Object.keys(items));
      mmrCacheFactory.set('districts', items);
    }
  };

}]);