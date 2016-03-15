angular.module('mmr.services')

.factory('mmrAddressService', ['$q', '$http', '$timeout', 'restService', '$rootScope', 'Validator',
  function($q, $http, $timeout, restService, $rootScope, Validator) {

  var currentAddressId = 10;

  return {

    defaultAddresses: function() {
      var normalAddress = _.find($rootScope.$root.addresses, function(address) {
        return address.isDefault;
      });

      var receiptAddress = _.find($rootScope.$root.addresses, function(address) {
        return address.isReceiptDefault;
      });

      var quarantineAddress = _.find($rootScope.$root.addresses, function(address) {
        return address.isQuarantineDefault;
      });

      return {
        normal: normalAddress,
        receipt: receiptAddress,
        quarantine: quarantineAddress
      };
    },

    generateAddressCheckboxes: function(currentAddress) {
      return _.map($rootScope.$root.addresses, function(address) {
        return address.id === currentAddress.id;
      });
    },

    validateAddress: function(address) {
      // receiver
      if(!Validator.field(address.receiver, '收货人')) {
        return false;
      }

      // phone
      if(!Validator.phone(address.cellphone, true)) {
        return false;
      }

      // fixed phone
      if(!Validator.fixedPhone(address.phoneArea + '-' + address.phone, true)) {
        return false;
      }

      // city and district
      if(!Validator.field(address.city, '城市')) {
        return false;
      }

      if(!Validator.field(address.district, '地区')) {
        return false;
      }

      // street
      if(!Validator.field(address.street, '街道地址')) {
        return false;
      }

      return true;
    },

    createAddress: function(address) {
      var dfd = $q.defer();

      // check whether the currently creating address is the only one
      if($rootScope.$root.addresses.length === 0) {
        address.isDefault = true;
      }

      $timeout(function() {
        // resolved address should have id field
        address.id = currentAddressId;
        currentAddressId += 1;

        if(address.isDefault) {
          _.forEach($rootScope.$root.addresses, function(address) {
            if(address.isDefault) {
              address.isDefault = false;
            }
          });
        }

        $rootScope.$root.addresses.push(address);

        dfd.resolve(address);
      }, 500);

      return dfd.promise;
    },

    updateAddress: function(address) {
      var dfd = $q.defer();

      if(!address.id) {
        dfd.reject('无效地址');
      }

      $timeout(function() {
        $rootScope.$root.addresses = _.map($rootScope.$root.addresses, function(target) {
          if(address.isDefault) {
            if(target.isDefault && target.id !== address.id) {
              target.isDefault = false;
            }

            if(address.id === target.id) {
              target = address;
            }

            return target;
          }
        });

        dfd.resolve(address);
      }, 500);

      return dfd.promise;
    },

    removeAddress: function(id) {
      var dfd = $q.defer(),
          self = this;

      $timeout(function() {
        var removedAddress = _.remove($rootScope.$root.addresses, function(address) {
          return address.id === id;
        })[0];

        if(removedAddress) {
          if(removedAddress.isDefault && $rootScope.$root.addresses.length > 0) {
            var defaultCandidate = $rootScope.$root.addresses[0];
            defaultCandidate.isDefault = true;

            // update the default candidate
            self.updateAddress(defaultCandidate);
          }

          dfd.resolve();
        } else {
          dfd.reject('删除失败');
        }

      });

      return dfd.promise;
    }

  };

}]);
