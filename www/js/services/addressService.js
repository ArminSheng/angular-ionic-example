angular.module('mmr.services')

.factory('mmrAddressService', ['$http', 'restService', '$rootScope',
  function($http, restService, $rootScope) {

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
    }

  };

}]);
