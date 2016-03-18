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

    validateReceipt: function(receipt) {
      if(!Validator.field(receipt.companyName, '单位名称')) {
        return false;
      }

      if(receipt.type === 1) {
        // normal receipt
      } else {
        // special receipt
        if(!Validator.field(receipt.taxpayer, '纳税人识别号')) {
          return false;
        }

        if(!Validator.field(receipt.registerAddress, '注册地址')) {
          return false;
        }

        if(!Validator.field(receipt.phone, '注册电话号码')) {
          return false;
        }

        if(!Validator.field(receipt.bank, '开户银行')) {
          return false;
        }

        if(!Validator.field(receipt.bankAccount, '银行账户')) {
          return false;
        }

        // validate license
      }

      return true;
    },

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
        res = res[0];

        if(res instanceof Object) {
          $rootScope.$root.receipts = res;
        } else {
          res = [];
        }

        dfd.resolve(res);
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
        if(res.id) {
          // add the receipt
          var type = receipt.type === 1 ? 'usual' : 'special';
          var container = $rootScope.$root.receipts[type];
          if(!container) {
            container = [];
          }
          container.push(res);

          dfd.resolve(res);
        } else {
          dfd.reject();
        }
      }, function(err) {
        dfd.reject(err);
      });

      return dfd.promise;
    },

    removeReceipt: function(receipt) {
      var dfd = $q.defer();

      mmrDataService.request($http({
        url: apiService.RECEIPT_DELETE,
        method: 'POST',
        data: {
          uid: $rootScope.$root.pinfo.uid,
          id: receipt.id
        }
      })).then(function(res) {
        res = res[0];
        if(res.status === 'OK') {
          // remove the receipt
          var type = _.has(receipt, 'taxpayer') ? 'special' : 'usual';

          _.remove($rootScope.$root.receipts[type], function(target) {
            return target.id === receipt.id;
          });

          dfd.resolve();
        } else if(res.status === 'ERROR') {
          dfd.reject();
        }
      }, function(err) {
        dfd.reject(err);
      });

      return dfd.promise;
    }

  };

}]);
