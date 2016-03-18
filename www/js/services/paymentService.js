angular.module('mmr.services')

.factory('mmrPayment', ['$q', '$http', '$timeout', '$rootScope', 'mmrDataService', 'apiService', '$sce',
  function($q, $http, $timeout, $rootScope, mmrDataService, apiService) {

  return {

    doAction: function() {
      var dfd = $q.defer();

      mmrDataService.request($http({
        url: apiService.PAYMENT_ACTION,
        method: 'POST',
        data: {
          uid: $rootScope.$root.pinfo.uid,
          id: "1231",
          code: "mbill",
          balance: 0
        }
      }), '获取支付信息中...').then(function(res) {
        res = res[0];
        console.log(res);
        dfd.resolve(res);
      }, function(err) {
        dfd.reject(err);
      });

      return dfd.promise;
    }

  };

}]);
