angular.module('mmr.controllers')

.controller('OrderCtrl', ['$scope', '$rootScope', '$ionicScrollDelegate', '$stateParams', 'localStorageService', 'mmrScrollService', 'mmrOrderFactory',
  function($scope, $rootScope, $ionicScrollDelegate, $stateParams, localStorageService, mmrScrollService, mmrOrderFactory) {

  $rootScope.$root.ui.tabsHidden = true;

  $scope.tab = $stateParams.orderType || 0;

  // define tabs
  $scope.tabs = [
    { text: '全部' },
    { text: '待付款' },
    { text: '待发货' },
    { text: '待收货' },
    { text: '待自提' },
    { text: '售后中' }
  ];

  // search template
  $scope.search = $scope.search || {};

  $scope.switchTab = function(tab) {
    $scope.tab = tab;

    $scope.search.status = getStatus(tab);

    // recalculate the height
    $ionicScrollDelegate.$getByHandle('orderScroll').resize();
  };

  // scroll related
  $scope.onScroll = function() {
    mmrScrollService.onScroll('orderScroll', $scope, function() {
      console.log('downing');
    }, function() {
      console.log('uping');
    }, function() {
      console.log('negative');
    })
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
