angular.module('mmr.directives')

.run(['$templateCache', function($templateCache) {

  // cartSummary directive
  $templateCache.put('templates/directives/cart/cart-summary.html',
    '<div class="m-cart-summary-component stable-bg" ng-click="doOpenCart()">' +
    '<span><i class="icon ion-ios-cart-outline"></i><span ng-if="$root.cart.counts[category] !== 0" class="badge badge-assertive">{{ $root.cart.counts[category] }}</span></span>' +
    '<span class="m-cart-summary-component-amount">{{ getTotalAmount() | currency: \'¥\' }}</span>' +
    '</div>');

}])

.directive('bottomCart', ['$rootScope', 'mmrEventing', 'mmrCartService', 'Validator', 'mmrAuth',
  function($rootScope, mmrEventing, mmrCartService, Validator, mmrAuth) {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      item: '='
    },
    templateUrl: 'templates/directives/cart/bottom-cart.html',
    link: function(scope, element, attrs) {
      scope.doAddToCart = function() {
        // check whether login
        if(mmrAuth.redirectIfNotLogin()) {
          return;
        }

        // check inventory
        var currentCount = mmrCartService.getItemCount(scope.item);
        if(Validator.number(currentCount + 1, scope.item.inventoryAmount, true, {
          title: '无法添加到购物车',
          template: '商品库存不足'
        })) {
          mmrCartService.addItemToCart(scope, scope.item);
        }
      };

      scope.doBuyImmediately = function() {
        // check whether login
        if(mmrAuth.redirectIfNotLogin()) {
          return;
        }

        var currentCount = mmrCartService.getItemCount(scope.item);
        if(Validator.number(currentCount + 1, scope.item.inventoryAmount, true, {
          title: '无法直接购买',
          template: '商品库存不足'
        })) {
          mmrEventing.doBuyImmediately(scope.item);
        }
      };
    }
  };

}])

.directive('cartCount', ['$rootScope', '$timeout', 'mmrEventing', 'Validator', 'mmrCommonService', 'mmrCartService', 'mmrSearchService',
  function($rootScope, $timeout, mmrEventing, Validator, mmrCommonService, mmrCartService, mmrSearchService) {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      item: '=',
      showRemoveBtn: '=',
      smallerSize: '=',
      counter: '='
    },
    templateUrl: 'templates/directives/cart/cart-count.html',
    link: function(scope, element, attrs) {
      var independentCounter = scope.counter === undefined ? false : true;
      if(!independentCounter) {
        // workaround for showing zero at the first time
        $timeout(function() {
          scope.currentCount = $rootScope.$root.cart.itemsCount[scope.item.id] || 0;
          scope.currentCountTemp = scope.currentCount;
        });
      } else {
        // workaround for showing zero at the first time
        $timeout(function() {
          scope.currentCountTemp = scope.counter;
        });
      }

      scope.doCountMinus = function($event) {
        // TODO: this is only workaround for the activated class not added
        var element = $($event.target);
        if(element && !element.hasClass('activated')) {
          element.addClass('activated');
          $timeout(function() {
            element.removeClass('activated');
          }, 200);
        }

        if(!independentCounter) {
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
        } else {
          // independent situation
          if(scope.currentCountTemp > 0) {
            scope.currentCountTemp -= 1;
            scope.counter = scope.currentCountTemp;
          }
        }

        $event.stopPropagation();
      };

      scope.doCountPlus = function($event) {
        if(!independentCounter) {
          if(Validator.number(scope.currentCountTemp + 1, scope.item.inventoryAmount, true)) {
            if(mmrCartService.isItemInCart(scope.item)) {
              mmrEventing.doIncreaseItemCount(scope, {
                item: scope.item
              });
            } else {
              // just change the count
              // mmrCartService.setItemCount(scope.item, scope.currentCount + 1);

              // make sure the item has shop information since cart needs it
              if(!scope.item.shop) {
                scope.item = mmrSearchService.itemDetail(scope.item);
              }
              mmrCartService.addItemToCart(scope, scope.item);
            }
          }
        } else {
          // independent situation
          if(scope.currentCountTemp < scope.item.inventoryAmount) {
            scope.currentCountTemp += 1;
            scope.counter = scope.currentCountTemp;
          }
        }

        $event.stopPropagation();
      };

      scope.doRemoveItem = function($event) {
        if(!independentCounter) {
          scope.currentCountTemp = 0;
          scope.doValidateCount();
        } else {
          // no need to consider since independent counter will not show DEL btn
        }
      };

      scope.doValidateCount = function() {
        scope.currentCountTemp = Number(scope.currentCountTemp);
        if(!Validator.number(scope.currentCountTemp, scope.item.inventoryAmount, true)) {
          // restore to last valid number
          if(!independentCounter) {
            scope.currentCountTemp = scope.currentCount;
          } else {
            scope.currentCountTemp = scope.counter;
          }
        } else {
          if(!independentCounter) {
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
            } else {
              mmrEventing.doSetItemCount(scope, {
                item: scope.item,
                newCount: scope.currentCountTemp
              });
            }
          } else {
            // independent situation
            scope.counter = scope.currentCountTemp;
          }
        }
      };

      // watchers
      if(!independentCounter) {
        scope.$watch(function() {
          return $rootScope.$root.cart.itemsCount[scope.item.id];
        }, function(newValue, oldValue, scope) {
          scope.currentCount = newValue;
          scope.currentCountTemp = newValue;

          mmrCartService.updateCheckedInformation(scope.item.isReserved ? 0 : 1);
        });
      }

      // private functions
      function setToZeroConfirm() {
        return mmrCommonService.confirm('确认移除', '确定要将此商品从购物车中移除吗？');
      }

    }
  };

}])

.directive('cartSummary', ['$rootScope', 'mmrEventing', 'mmrCartService',
  function($rootScope, mmrEventing, mmrCartService) {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      item: '='
    },
    templateUrl: 'templates/directives/cart/cart-summary.html',
    link: function(scope, element, attrs) {
      // calc the category
      scope.category = scope.item.isReserved ? 0 : 1;

      scope.doOpenCart = function() {
        mmrEventing.doStateToCart(scope.item);
      };

      // get total amount by item category: 0: reserved, 1: normal
      scope.getTotalAmount = function() {
        return mmrCartService.getTotalAmount(scope.category);
      };
    }
  };

}]);
