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

  var postprocessDepositList = function(list) {
    _.forEach(list, function(deposit) {
      deposit.time = Number(deposit.time) * 1000;
    });
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
    },

    fetchDepositList: function() {
      var dfd = $q.defer();

      mmrDataService.request($http({
        url: apiService.PAYMENT_DEPOSIT_LIST,
        method: 'POST',
        data: {
          uid: $rootScope.$root.pinfo.uid
        }
      }), '获取余额记录中...').then(function(res) {
        res = res[0];
        postprocessDepositList(res);
        dfd.resolve(res);
      }, function(err) {
        dfd.reject(err);
      });

      return dfd.promise;
    }

  };

}]);
