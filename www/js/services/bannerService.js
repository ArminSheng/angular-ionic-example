angular.module('mmr.services')

.factory('mmrAreaFactory', ['$http', 'restService', 
  function($http, restService) {

  return {
    banners: function(platform) {
      return $http({
        url: restService['API_REST'] + 'c_banner/platform',
        method: 'GET',
        params: {
          'p': platform || 1  // 1 represents the moblie app
        }
      });
    },

    areas: function(platform) {
      return $http({
        url: restService['API_REST'] + 'c_salesarea/platform',
        method: 'GET',
        params: {
          'p': platform || 1  // 1 represents the moblie app
        }
      });
    }
  };

}]);