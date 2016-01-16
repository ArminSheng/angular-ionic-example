angular.module('mmr.directives')

.directive('mineDepositList', [function() {

  return {
    retrict: 'E',
    replace: true,
    scope: {
      items: '='
    },
    templateUrl: 'templates/directives/mine-deposit-list.html',
    link: function(scope, element, attrs) {

    }
  };

}]);