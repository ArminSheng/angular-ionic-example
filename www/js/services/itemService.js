angular.module('mmr.services')

.factory('mmrItemFactory', ['$q', '$http', 'restService', 'apiService',
  function($q, $http, restService, apiService) {

  function postprocess(res) {
    _.forEach(res, function(item) {
      // image
      if(item.imagePath && _.startsWith(item.imagePath, './')) {
        item.imagePath = apiService.API_BASE + item.imagePath.substring(2);
      }
    });
  }

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
      var body = {};

      if(config.keyword) {
        body.keyword = config.keyword;
      }
      if(config.cid) {
        body.cid = config.cid;
      }
      if(config.bid) {
        body.bid = config.bid;
      }
      if(config.aid) {
        body.aid = config.aid;
      }
      if(config.page) {
        body.page = config.page;
      }
      if(config.size) {
        body.size = config.size;
      }
      if(config.sort) {
        body.sort = config.sort;
      }
      if(config.city) {
        body.city = config.city;
      }

      var dfd = $q.defer();

      $http({
        url: apiService.SEARCH_INDEX,
        method: 'POST',
        data: body
      }).then(function(res) {
        if(res.data &&
          res.data instanceof Array &&
          res.data.length > 0) {
          postprocess(res.data);
        }

        dfd.resolve(res);
      });

      return dfd.promise;
    }
  };

}]);
