angular.module('mmr.services')

.factory('mmrMineFactory', ['$http', 'restService', 'mmrCacheFactory',
  function($http, restService, mmrCacheFactory) {

  // mock
  var details = [
    { time: new Date(), direction: 'in', orderId: '20151223123456', amount: 200 },
    { time: new Date(), direction: 'out', orderId: '20151223123457', amount: 300 },
    { time: new Date(), direction: 'in', orderId: '20151223123458', amount: 400 },
    { time: new Date(), direction: 'out', orderId: '20151223123459', amount: 500.66 },
    { time: new Date(), direction: 'in', orderId: '20151223123460', amount: 700.33 },
    { time: new Date(), direction: 'out', orderId: '20151223123461', amount: 100.11 }
  ];

  return {
    depositDetails: function() {
      // save into cache
      mmrCacheFactory.set('depositDetails', details);
      return details;
    },
  };

}]);