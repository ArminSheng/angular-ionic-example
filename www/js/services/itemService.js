angular.module('mmr.services')

.factory('mmrItemFactory', ['$http', 'restService',
  function($http, restService) {

  return {
    seckilling: function(size) {
      return $http({
        url: restService.API_REST + 'c_item/seckilling',
        method: 'GET',
        params: {
          's': size || 10
        }
      });
    },

    // for home view usage
    homeCommodity: function(size) {
      return $http({
        url: restService.API_REST + 'c_item/homeCommodity',
        method: 'GET',
        params: {
          's': size || 10
        }
      });
    },

    // recommend items
    recommend: function(size) {
      return $http({
        url: restService.API_REST + 'c_item/recommend',
        method: 'GET',
        params: {
          's': size || 10
        }
      });
    },

    // search the items [mock usage]
    // config object:
    // size: size per request, default 10,
    // page: page number, default 0,
    // sort: sort method, default 0,
    // keyword: user input keyword, default '',
    // cid: category id,
    // gid: category level (1-5)
    // search: function(config) {
    //   return $http({
    //     url: restService.API_REST + 'c_search/',
    //     method: 'GET',
    //     params: {
    //       's': config.size || 10,
    //       'p': config.page || 0,
    //       'o': config.sort || 0,
    //       'k': config.keyword || '',
    //       'c': config.cid,
    //       'g': config.gid
    //     }
    //   });
    // },

    search: function(config) {
      return $http({
        url: restService.API_REST + 'c_search/',
        method: 'GET',
        params: {
          's': config.size || 10,
          'p': config.page || 0,
          'o': config.sort || 0,
          'k': config.keyword || '',
          'c': config.cid,
          'g': config.gid
        }
      });
    }
  };

}]);
