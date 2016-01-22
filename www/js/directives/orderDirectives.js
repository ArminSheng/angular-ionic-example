angular.module('mmr.directives')

.directive('orderList', [function() {

  return {
    retrict: 'E',
    replace: true,
    scope: {
      items: '='
    },
    templateUrl: 'templates/directives/order-list.html',
    link: function(scope, element, attrs) {

    }
  };

}]);
