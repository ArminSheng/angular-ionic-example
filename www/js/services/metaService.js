angular.module('mmr.services')

.factory('mmrMetaFactory', ['$http', 'restService', 'mmrCacheFactory',
  function($http, restService, mmrCacheFactory) {

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
    }
  };

}]);