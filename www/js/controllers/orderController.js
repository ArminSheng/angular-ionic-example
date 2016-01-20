angular.module('mmr.controllers')

.controller('OrderCtrl', ['$scope', '$rootScope', '$stateParams', 'localStorageService',
  function($scope, $rootScope, $stateParams, localStorageService) {

  $rootScope.$root.ui.tabsHidden = true;

  $scope.tab = $stateParams.orderType || 0;

  $scope.switchTab = function(tabIdx) {
    $scope.tab = tabIdx;
  };

  init();
  function init() {
    // cache bindings
  }

}]);