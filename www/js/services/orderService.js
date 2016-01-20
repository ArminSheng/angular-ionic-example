angular.module('mmr.services')

.factory('mmrOrderFactory', ['$http', 'restService', 'mmrCacheFactory',
  function($http, restService, mmrCacheFactory) {

  // mock
  var orders = [
    {

    }
  ];

  return {
    orders: function() {
      // save into cache
      mmrCacheFactory.set('notifications', {
        '0': notificationsType0,
        '1': notificationsType1
      });
    },
  };

}]);