angular.module('mmr.directives')

.directive('seckillingList', [function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        items: '='
      },
      templateUrl: 'templates/directives/item-list-seckilling.html',
      link: function(scope, element, attrs) {

      }
    };
}]);