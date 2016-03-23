angular.module('mmr.services')

.factory('mmrItemFactory', ['$q', '$http', '$rootScope', '$sce', 'restService', 'apiService', 'mmrDataService',
  function($q, $http, $rootScope, $sce, restService, apiService, mmrDataService) {

  function processImagePath(imagePath) {
    if(imagePath && _.startsWith(imagePath, './')) {
      imagePath = apiService.API_BASE + imagePath.substring(2);
    } else {
      imagePath = 'img/item/default.png';
    }

    return imagePath;
  }

  function postprocessItem(item, processFav) {
    // image
    item.imagePath = processImagePath(item.imagePath);

    // detail banners
    if(item.banner && item.banner.length > 0) {
      _.forEach(item.banner, function(banner) {
        banner.path = processImagePath(banner.path);
      });
    }

    // seckilling
    if(item.deadline) {
      item.deadline *= 1000;
    }

    // place
    if(!item.place) {
      item.place = '未知';
    }

    // unit name
    item.specName = item.unitName;
    item.unitName = item.unitName.substring(item.unitName.indexOf('/'));

    // shop
    if(item.shop) {
      item.shop.logoPath = processImagePath(item.shop.logoPath);

      // REMOVE: mock usage
      item.shop.ratings = {
        description: 4.8,
        service: 4.6,
        logistics: 4.2
      };
    }

    // REMOVE: mock usage
    item.review = {
      rate: 92,
      number: 7,
      last: {
        name: '185****1020',
        date: '2016-01-11 20:25',
        content: '肉特别新鲜。',
        avatar: 'img/mine/avatar-bak.png',
        rating: '0'
      },
      comments: []
    };

    // detailed html
    item.detailHtml = $sce.trustAsHtml(item.detailHtml);

    // TODO: use the more efficient API
    if(processFav) {
      // favorite
      item.fav = false;
      var config = {
        item_id: item.id,
        type: 3
      };

      checkFavorate(config, item);
    }


  }

  function checkFavorate(config, item) {
    var dfd = $q.defer();
    $http({
      url: apiService.FOOTPRINT_CHECKED,
      method: 'POST',
      data: prepareFootprintBody(config)
    }).then(function(res) {
      item.fav = res.data === '1' ? true : false;
      dfd.resolve(res.data);
    }, function(err) {
      console.log(err);
      dfd.reject();
    });

    return dfd.promise;
  }

  function postprocessList(res) {
    _.forEach(res, function(item) {
      postprocessItem(item);
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

  function prepareFootprintBody(config) {
    var body = {};

    if(config.uid) {
      body.uid = config.uid;
    } else if($rootScope.$root.authenticated) {
      body.uid = $rootScope.$root.pinfo.uid;
    }

    if(config.item_id) {
      body.item_id = config.item_id;
    }

    if(config.id) {
      body.id = config.id;
    }

    if(config.type) {
      body.type = config.type;
    }

    if(config.price) {
      body.price = config.price;
    }

    if(config.city) {
      body.city = config.city;
    } else {
      body.city = $rootScope.$root.location.id;
    }

    if(config.s) {
      body.s = config.s;
    }

    if(config.p) {
      body.p = config.p;
    }

    if(config.fav) {
      body.fav = config.fav;
    }

    return body;
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

    seckilling2: function() {
      var dfd = $q.defer();

      $http({
        url: apiService.SEARCH_SECKILLING,
        method: 'POST'
      }).then(function(res) {
        postprocessList(res.data);
        dfd.resolve({
          data: res.data
        });
      }, function() {
        dfd.reject();
      });

      return dfd.promise;
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

    // recommend items[mock usage]
    recommend2: function(size) {
      return $http({
        url: restService.API_REST + 'c_item/recommend',
        method: 'GET',
        params: {
          's': size || 10
        }
      });
    },

    recommend: function() {
      var dfd = $q.defer();

      $http({
        url: apiService.SEARCH_RECOMMEND,
        method: 'POST',
        data: {
          sort: 5
        }
      }).then(function(res) {
        postprocessList(res.data);
        dfd.resolve({
          data: res.data
        });
      }, function() {
        dfd.reject();
      });

      return dfd.promise;
    },

    // retrieve the details of item
    item: function(id) {
      var dfd = $q.defer();
      $http({
        url: apiService.ITEM_DETAIL,
        method: 'POST',
        data: {
          id: id
        }
      }).then(function(res) {
        // process the images
        if(!res.data.id) {
          dfd.reject('商品不存在');
          return;
        }

        postprocessItem(res.data, true);
        // console.log(res);
        dfd.resolve({
          data: res.data
        });
      }, function() {
        dfd.reject();
      });

      return dfd.promise;
    },

    checkFav: function(item) {
      var type = item.logoPath ? 4 : 3;
      var config = {
        item_id: item.id,
        type: type
      }

      return checkFavorate(config, item);
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
      if(config.sid) {
        body.sid = config.sid;
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
          postprocessList(res.data);
        }

        dfd.resolve(res);
      });

      return dfd.promise;
    },

    footprintList: function(config) {
      var dfd = $q.defer();

      mmrDataService.request($http({
        url: apiService.FOOTPRINT_LIST,
        method: 'POST',
        data: prepareFootprintBody(config)
      })).then(function(res) {
        res = res[0];
        if(res &&
          res instanceof Array &&
          res.length > 0) {
          postprocessList(res);
        }
        dfd.resolve(res);
      }, function(err) {
        dfd.reject(err);
      });

      return dfd.promise;
    },

    footprintAdd: function(config) {
      var dfd = $q.defer();

      $http({
        url: apiService.FOOTPRINT_ADD,
        method: 'POST',
        data: prepareFootprintBody(config)
      }).then(function(res) {
        dfd.resolve(res);
      });

      return dfd.promise;
    },

    footprintDelete: function(config) {
      var dfd = $q.defer();

      mmrDataService.request($http({
        url: apiService.FOOTPRINT_DELETE,
        method: 'POST',
        data: prepareFootprintBody(config)
      })).then(function(res) {
        res = res[0];
        dfd.resolve(res);
      }, function(err) {
        dfd.reject(err);
      });

      return dfd.promise;
    },

    // high level sao
    // if authenticated: 1. item detail; 2. add footprint
    // if not: 1. item detail
    openItemDetail: function(item) {
      if($rootScope.$root.authenticated) {
        return mmrDataService.request(this.item(item.id),
          this.footprintAdd({
            id: item.id,
            type: 1
          })
          );
      } else {
        return mmrDataService.request(this.item(item.id));
      }
    }
  };

}]);
