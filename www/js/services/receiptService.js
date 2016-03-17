angular.module('mmr.services')

.factory('mmrReceiptService', ['$q', '$http', '$timeout', 'restService', '$rootScope', 'Validator', 'mmrDataService', 'apiService',
  function($q, $http, $timeout, restService, $rootScope, Validator, mmrDataService, apiService) {

  var generateReceiptVo = function(receipt) {
    var vo = {};

    vo.type = receipt.type;
    vo.uid = $rootScope.$root.pinfo.uid;
    vo.companyName = receipt.companyName;

    if(receipt.type === 1) {

    } else if(receipt.type === 2) {
      vo.taxpayer = receipt.taxpayer;
      vo.registerAddress = receipt.registerAddress;
      vo.phone = receipt.phone;
      vo.bank = receipt.bank;
      vo.bankAccount = receipt.bankAccount;
      vo.license = receipt.license;
    }

    return vo;
  };

  return {

    // API below
    fetchReceiptList: function() {
      var dfd = $q.defer();

      mmrDataService.request($http({
        url: apiService.RECEIPT_LIST,
        method: 'POST',
        data: {
          uid: $rootScope.$root.pinfo.uid
        }
      })).then(function(res) {
        dfd.resolve(res[0]);
      }, function(err) {
        dfd.reject(err);
      });

      return dfd.promise;
    },

    createReceipt: function(receipt) {
      var dfd = $q.defer();

      mmrDataService.request($http({
        url: apiService.RECEIPT_ADD,
        method: 'POST',
        data: generateReceiptVo(receipt)
      })).then(function(res) {
        res = res[0];
        console.log(res);
        if(res.status === 1 && res.msg === '操作成功') {
          // dfd.resolve(receipt);
        }
      }, function(err) {
        dfd.reject(err);
      });

      return dfd.promise;
    },

    removeReceipt: function(id) {
      var dfd = $q.defer(),
          self = this;

      mmrDataService.request($http({
        url: apiService.RECEIPT_DELETE,
        method: 'POST',
        data: {
          uid: $rootScope.$root.pinfo.uid,
          id: id
        }
      })).then(function(res) {
        res = res[0];
        console.log(res);
        if(res.status === 1 && res.msg === '操作成功') {
          // dfd.resolve(receipt);
        }
      }, function(err) {
        dfd.reject(err);
      });

      return dfd.promise;
    }

  };

}]);
