angular.module('mmr.services')

.factory('mmrPayment', ['$q', '$http', '$timeout', '$rootScope', 'mmrDataService', 'apiService', '$sce',
  function($q, $http, $timeout, $rootScope, mmrDataService, apiService) {

  var buildActionVo = function(config) {
    var vo = {};

    vo.uid = $rootScope.$root.pinfo.uid;
    vo.id = config.id;
    vo.balance = config.balance;

    return vo;
  };

  return {

    doAction: function(config) {
      var dfd = $q.defer();

      mmrDataService.request($http({
        url: apiService.PAYMENT_ACTION,
        method: 'POST',
        data: buildActionVo(config)
      }), '获取支付信息中...').then(function(res) {
        res = res[0];
        dfd.resolve(res);
      }, function(err) {
        dfd.reject(err);
      });

      return dfd.promise;
    }

  };

}]);
