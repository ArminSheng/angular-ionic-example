angular.module('mmr.services')

.factory('mmrShopService', ['$http', 'restService', 'mmrCacheFactory',
  function($http, restService, mmrCacheFactory) {

  var shops;

  return {
    shops: function() {
      return $http({
        url: restService.API_REST + 'c_shop/all',
        method: 'GET'
      }).then(function(res) {
        var mappings = {};

        _.forEach(res.data, function(shop) {
          mappings[shop.id] = shop;

          // convert to number
          shop.id = Number(shop.id);
        });

        shops = mappings;
        mmrCacheFactory.set('shops', mappings);
      }, function(err) {

      });
    },

    // get by shop id
    shop: function(id) {
      return shops[id];
    }
  };

}]);
