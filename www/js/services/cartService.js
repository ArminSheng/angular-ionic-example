angular.module('mmr.services')

.factory('mmrCartService', ['$rootScope',
  function($rootScope) {

  return {

    isItemInCart: function(item) {
      return !!$rootScope.$root.cart.itemsId[item.id];
    },

    setItemCount: function(item, newCount) {
      $rootScope.$root.cart.itemsCount[item.id] = newCount;
    }

  };

}]);
