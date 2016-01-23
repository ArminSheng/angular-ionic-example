angular.module('mmr.controllers')

.controller('OrderCtrl', ['$scope', '$rootScope', '$ionicScrollDelegate', '$stateParams', 'localStorageService', 'mmrOrderFactory',
  function($scope, $rootScope, $ionicScrollDelegate, $stateParams, localStorageService, mmrOrderFactory) {

  $rootScope.$root.ui.tabsHidden = true;

  $scope.tab = $stateParams.orderType || 0;

  // search template
  $scope.search = $scope.search || {};

  $scope.switchTab = function(tabIdx) {
    $scope.tab = tabIdx;

    $scope.search.status = getStatus(tabIdx);

    // recalculate the height
    $ionicScrollDelegate.$getByHandle('orderScroll').resize();
  };

  init();
  function init() {
    // init orders
    mmrOrderFactory.orders();

    // cache bindings
    localStorageService.bind($scope, 'orders');
  }

  function getStatus() {
    // convert the tabIdx to status
    switch($scope.tab) {
      case 0:
        return '!!';
      case 1:
        return 0;
      case 2:
        return 1;
      case 3:
        return 2;
      case 4:
        return 3;
      case 5:
        return 6;
    }
  }

}]);
