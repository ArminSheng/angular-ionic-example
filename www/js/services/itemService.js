angular.module('mmr.services')

.factory('mmrItemFactory', ['$q', '$http', '$rootScope', 'restService', 'apiService',
  function($q, $http, $rootScope, restService, apiService) {

  function postprocess(res) {
    _.forEach(res, function(item) {
      // image
      if(item.imagePath && _.startsWith(item.imagePath, './')) {
        item.imagePath = apiService.API_BASE + item.imagePath.substring(2);
      } else {
        item.imagePath = 'img/item/sample.png';
      }
    });
  }

  function fillToTen(results, source) {
    _.forEach(results, function(subResults) {
      while(subResults.length < 10) {
        var target = source[Math.floor(Math.random() * 34)];

        // make sure target is not undefined
        while(target === undefined) {
          target = source[Math.floor(Math.random() * 34)];
        }

        subResults.push(target);
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

    // for home view usage [mock usage]
    homeCommodity: function(size) {
      return $http({
        url: restService.API_REST + 'c_item/homeCommodity',
        method: 'GET',
        params: {
          's': size || 10
        }
      });
    },

    homeCommodity2: function() {
      var dfd = $q.defer();
      var configs = _.map($rootScope.$root.category.entries, function(entry) {
        return {
          cid: entry.id
        };
      });

      var self = this;
      var promises = _.map(configs, function(config) {
        return self.search(config);
      });

      var results = [];
      _.forEach(promises, function(promise, idx) {
        promise.then(function(res) {
          if(res.data && res.data instanceof Array) {
            results[idx] = res.data;
          } else {
            results[idx] = [];
          }
        }, function(err) {
          console.log(err);
        });
      });

      $q.all(promises).then(function() {
        // REMOVE: fill to ten
        var flat = _.flatten(results);
        fillToTen(results, flat);

        // adapt the dataService spec
        dfd.resolve({
          data: results
        });
      });

      return dfd.promise;
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
      if(config.new) {
        body.new = config.new;
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
