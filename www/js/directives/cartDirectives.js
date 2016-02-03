angular.module('mmr.directives')

.run(['$templateCache', function($templateCache) {

}])

.directive('bottomCart', ['$rootScope', 'mmrEventing',
  function($rootScope, mmrEventing) {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      item: '='
    },
    templateUrl: 'templates/directives/cart/bottom-cart.html',
    link: function(scope, element, attrs) {
      scope.doAddToCart = function() {
        // check whether count is greater than 0
        var count = $rootScope.$root.cart.itemsCount[scope.item.id];
        if(count && count > 0) {
          mmrEventing.doAddItemToCart(scope, {
            item: scope.item
          });
        }
      };

      scope.doBuyImmediately = function() {

      };
    }
  };

}])

.directive('cartCount', ['$rootScope', '$timeout', 'mmrEventing', 'Validator', 'mmrCommonService', 'mmrCartService',
  function($rootScope, $timeout, mmrEventing, Validator, mmrCommonService, mmrCartService) {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      item: '='
    },
    templateUrl: 'templates/directives/cart/cart-count.html',
    link: function(scope, element, attrs) {
      // workaround for showing zero at the first time
      $timeout(function() {
        scope.currentCount = $rootScope.$root.cart.itemsCount[scope.item.id] || 0;
        scope.currentCountTemp = scope.currentCount;
      });

      scope.doCountMinus = function($event) {
        // TODO: this is only workaround for the activated class not added
        var element = $($event.target);
        if(element && !element.hasClass('activated')) {
          element.addClass('activated');
          $timeout(function() {
            element.removeClass('activated');
          }, 200);
        }

        // emit the event
        if(scope.currentCount > 0) {
          if(mmrCartService.isItemInCart(scope.item)) {
            if(scope.currentCount === 1) { // current count
              setToZeroConfirm().then(function(res) {
                if(res) {
                  mmrEventing.doDecreaseItemCount(scope, {
                    item: scope.item
                  });
                }
              });
            } else {
              mmrEventing.doDecreaseItemCount(scope, {
                item: scope.item
              });
            }
          } else {
            // just change the count
            mmrCartService.setItemCount(scope.item, scope.currentCount - 1);
          }
        }
      };

      scope.doCountPlus = function($event) {
        // emit the event
        mmrEventing.doIncreaseItemCount(scope, {
          item: scope.item
        });

        if(mmrCartService.isItemInCart(scope.item)) {
          mmrEventing.doIncreaseItemCount(scope, {
            item: scope.item
          });
        } else {
          // just change the count
          mmrCartService.setItemCount(scope.item, scope.currentCount + 1);
        }
      };

      scope.doValidateCount = function() {
        if(!Validator.number(scope.currentCountTemp, scope.item.inventoryAmount, true)) {
          // restore to last valid number
          scope.currentCountTemp = scope.currentCount;
        } else {
          if(scope.currentCountTemp === 0) {
            setToZeroConfirm().then(function(res) {
              if(res) {
                mmrEventing.doSetItemCount(scope, {
                  item: scope.item,
                  newCount: scope.currentCountTemp
                });
              } else {
                scope.currentCountTemp = scope.currentCount;
              }
            });
          }
        }
      };

      // watchers
      scope.$watch(function() {
        return $rootScope.$root.cart.itemsCount[scope.item.id];
      }, function(newValue, oldValue, scope) {
        scope.currentCount = newValue;
        scope.currentCountTemp = newValue;
      });

      // private functions
      function setToZeroConfirm() {
        return mmrCommonService.confirm('确认移除', '确定要将此商品从购物车中移除吗？');
      }

    }
  };

}]);
