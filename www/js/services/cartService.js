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
    },

    generateCartOrders: function(isNormalOrder) {
      if(isNormalOrder) {
        return $rootScope.$root.cart.normalOrders;
      } else {
        return $rootScope.$root.cart.reservedOrders;
      }
    },

    checkAllCartItems: function(type) {
      if(type === 0) {
        if($rootScope.$root.cart.allChecked[type]) {
          doCheckAll($rootScope.$root.cart.reservedOrders, true);
        } else {
          doCheckAll($rootScope.$root.cart.reservedOrders, false);
        }
      } else if(type === 1) {
        if($rootScope.$root.cart.allChecked[type]) {
          doCheckAll($rootScope.$root.cart.normalOrders, true);
        } else {
          doCheckAll($rootScope.$root.cart.normalOrders, false);
        }
      }

      function doCheckAll(collection, status) {
        _.forEach(collection, function(element) {
          element.checked = status;
          _.forEach(element.items, function(item) {
            item.checked = status;
          });
        });
      }
    },

    // 0: reserved, 1: normal
    updateCheckedInformation: function(type) {
      if(type === 0) {
        doFillCheckAll($rootScope.$root.cart.reservedOrders);
        doUpdateCheckedInfo($rootScope.$root.cart.reservedOrders);
      } else if(type === 1) {
        doFillCheckAll($rootScope.$root.cart.normalOrders);
        doUpdateCheckedInfo($rootScope.$root.cart.normalOrders);
      }

      function doFillCheckAll(collection) {
        var allChecked = true;
        _.forEach(collection, function(element) {
          allChecked = _.every(element.items, {'checked': true});
          if(!allChecked) {
            return false;
          }
        });

        $rootScope.$root.cart.allChecked[type] = allChecked;
      }

      function doUpdateCheckedInfo(collection) {
        var checkedCount = 0,
            checkedAmount = 0;
        _.forEach(collection, function(element) {
          _.forEach(element.items, function(item) {
            if(item.checked) {
              checkedCount += item.quantity;
              checkedAmount += item.price * item.quantity;
            }
          });
        });

        $rootScope.$root.cart.checkedCounts[type] = checkedCount;
        $rootScope.$root.cart.checkedAmounts[type] = checkedAmount;
      }
    },

    generateCheckedOrders: function(tab) {

      function generateOrders() {
        if(tab === 0) {
          return $rootScope.$root.cart.reservedOrders;
        } else if(tab === 1) {
          return $rootScope.$root.cart.normalOrders;
        }
      }

      function generateMoney() {
        function calculateActualMoney(money) {
          return money.total + (money.shipment || 0) - (money.coupon || 0);
        }

        var result = {
          total: $rootScope.$root.cart.checkedAmounts[tab],
          shipment: 0,
          coupon: 0
        };

        result.summary = calculateActualMoney(result); // bottom summary area in gen modal

        return result;
      }

      return {
        isReserved: tab === 0,
        orders: generateOrders(),
        money: generateMoney()
      };
    },

    isCheckoutable: function(tab) {
      if($rootScope.$root.cart.checkedCounts[tab] > 0 &&
         $rootScope.$root.cart.checkedAmounts[tab] > 0) {
        return true;
      } else {
        return false;
      }
    },

    // get total amount by the
    getTotalAmount: function(tab) {
      return $rootScope.$root.cart.amounts[tab];
    }

  };

}]);
