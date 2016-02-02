angular.module('mmr.directives')

.run(['$templateCache', function($templateCache) {

}])

.directive('bottomCart', [function() {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      item: '='
    },
    templateUrl: 'templates/directives/cart/bottom-cart.html',
    link: function(scope, element, attrs) {

    }
  };

}])

.directive('cartCount', ['$rootScope', '$timeout', 'mmrEventing', 'Validator',
  function($rootScope, $timeout, mmrEventing, Validator) {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      itemId: '@',
      upperLimit: '@'
    },
    templateUrl: 'templates/directives/cart/cart-count.html',
    link: function(scope, element, attrs) {
      // workaround for showing zero at the first time
      $timeout(function() {
        scope.currentCount = $rootScope.$root.cart.itemsCount[scope.itemId] || 0;
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
        mmrEventing.doDecreaseItemCount(scope, {
          itemId: scope.itemId
        });
      };

      scope.doCountPlus = function($event) {
        // emit the event
        mmrEventing.doIncreaseItemCount(scope, {
          itemId: scope.itemId
        });
      };

      scope.doValidateCount = function() {
        if(!Validator.number(scope.currentCountTemp, scope.upperLimit, true)) {
          // restore to last valid number
          scope.currentCountTemp = scope.currentCount;
        } else {
          mmrEventing.doSetItemCount(scope, {
            itemId: scope.itemId,
            newCount: scope.currentCountTemp
          });
        }
      };

      // watchers
      scope.$watch(function() {
        return $rootScope.$root.cart.itemsCount[scope.itemId];
      }, function(newValue, oldValue, scope) {
        scope.currentCount = newValue;
        scope.currentCountTemp = newValue;
      });

    }
  };

}]);
