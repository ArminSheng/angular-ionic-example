angular.module('mmr.services')

.factory('mmrItemFactory', ['$http', 'restService', 
  function($http, restService) {

  return {
    seckilling: function(size) {
      return $http({
        url: restService['API_REST'] + 'c_item/seckilling',
        method: 'GET',
        params: {
          's': size || 10
        }
      });
    },

    homeCommodity: function(size) {
      return $http({
        url: restService['API_REST'] + 'c_item/homeCommodity',
        method: 'GET',
        params: {
          's': size || 10
        }
      }); 
    }
  };

}]);