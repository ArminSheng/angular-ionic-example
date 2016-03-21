angular.module('mmr.controllers')

.controller('OrderCtrl', ['$scope', '$rootScope', '$ionicScrollDelegate', '$stateParams', 'localStorageService', 'mmrScrollService', 'mmrOrderFactory', 'mmrCommonService',
  function($scope, $rootScope, $ionicScrollDelegate, $stateParams, localStorageService, mmrScrollService, mmrOrderFactory, mmrCommonService) {

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
  $scope.search.status = getStatus($scope.tab);

  $scope.switchTab = function(tab) {
    $scope.tab = tab;

    $scope.search.status = getStatus(tab);

    // recalculate the height
    $ionicScrollDelegate.$getByHandle('orderScroll').resize();

    // back to top
    $ionicScrollDelegate.scrollTop(true);
  };

  // scroll related
  $scope.onScroll = function() {
    var threshold = 150;
    var scrollStatus = mmrScrollService.onScroll(
      {
        handler: 'orderScroll',
        threshold: threshold,
        onThreshold: function(isGreaterThanThreshold) {
          $scope.$apply(function() {
            if(isGreaterThanThreshold) {
              $scope.showBacktoTopBtn = true;
            } else {
              $scope.showBacktoTopBtn = false;
            }
          });
        }
      }
    );

    $scope.$apply(function() {
      $scope.scrollStatus = scrollStatus;
    });
  };

  $scope.scrollToTop = function() {
    $ionicScrollDelegate.$getByHandle('orderScroll').scrollTop(true);
    $scope.showBacktoTopBtn = false;
  };

  $scope.initialize = function() {
    mmrOrderFactory.fetchOrderList({
      type: $scope.tab
    }).then(function(res) {
      $scope.orders = res;
      $scope.isEmpty = res.length === 0;
    }, function(err) {
      mmrCommonService.help('获取订单失败', '获取过程中发生了错误, 请稍后重试');
      $scope.isEmpty = true;
    }).finally(function() {
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.initialize();

  // empty content related
  $scope.ec = {};
  $scope.ec.words = ['这里空空的，快去下单吧！'];
  $scope.ec.additionalClass = 'm-order-empty';
  $scope.ec.button = {
    text:'去逛逛',
    onTap: function() {
      console.log('orders');
    }
  };

  function getStatus(tab) {
    // convert the tabIdx to status
    switch(Number(tab)) {
      case 0:
        return '';
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
