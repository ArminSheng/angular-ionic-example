angular.module('mmr.directives')

.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/directives/item-remain-time.html',
    '<span class="m-sec-killing-item-remain-time"></span>');

  $templateCache.put('templates/directives/item/item-detail-images.html',
    '<div class="m-item-detail-images">' +
    '<div class="m-item-detail-image" ng-repeat="image in images"><img ng-src="{{ image.path }}"/></div>' +
    '</div>');
}])

.directive('bottomCart', [function() {

  return {
    restrict: 'E',
    replace: true,
    scope: {

    },
    templateUrl: 'templates/directives/cart/bottom-cart.html',
    link: function(scope, element, attrs) {

    }
  };

}]);
