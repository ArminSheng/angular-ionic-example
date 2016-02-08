angular.module('mmr.services')

.factory('mmrCartService', ['$rootScope', 'mmrEventing',
  function($rootScope, mmrEventing) {

  return {

    isItemInCart: function(item) {
      return !!$rootScope.$root.cart.itemsId[item.id];
    },

    setItemCount: function(item, newCount) {
      $rootScope.$root.cart.itemsCount[item.id] = newCount;
    },

    getItemCount: function(item) {
      return $rootScope.$root.cart.itemsCount[item.id] || 0;
    },

    addItemToCart: function(scope, item) {
      // check whether count is greater than 0
      this.setItemCount(item, this.getItemCount(item) + 1);
      mmrEventing.doAddItemToCart(scope, {
        item: scope.item
      });
    }

  };

}]);
