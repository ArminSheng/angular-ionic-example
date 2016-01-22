angular.module('mmr.controllers')

.controller('OrderCtrl', ['$scope', '$rootScope', '$stateParams', 'localStorageService', 'mmrOrderFactory',
  function($scope, $rootScope, $stateParams, localStorageService, mmrOrderFactory) {

  $rootScope.$root.ui.tabsHidden = true;

  $scope.tab = $stateParams.orderType || 0;

  $scope.switchTab = function(tabIdx) {
    $scope.tab = tabIdx;
  };

  init();
  function init() {
    // init orders
    mmrOrderFactory.orders();

    // cache bindings
    localStorageService.bind($scope, 'orders');
  }

}]);
