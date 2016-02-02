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

.directive('cartCount', ['$rootScope', '$timeout', 'mmrEventing',
  function($rootScope, $timeout, mmrEventing) {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      itemId: '@'
    },
    templateUrl: 'templates/directives/cart/cart-count.html',
    link: function(scope, element, attrs) {
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
        mmrEventing.doDecreaseItem(scope, scope.itemId);
      };

      scope.doCountPlus = function($event) {
        // emit the event
        mmrEventing.doIncreaseItem(scope, scope.itemId);
      };

      scope.getItemCount = function() {
        return $rootScope.$root.cart.itemsCount[scope.itemId] || 0;
      };
    }
  };

}]);
