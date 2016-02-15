angular.module('mmr.controllers')

.controller('CartCtrl', ['$scope', '$rootScope', '$ionicHistory', '$ionicScrollDelegate', 'mmrScrollService', 'mmrModal', 'mmrCartService',
  function($scope, $rootScope, $ionicHistory, $ionicScrollDelegate, mmrScrollService, mmrModal, mmrCartService) {

  $rootScope.$root.ui.tabsHidden = false;
  $scope.tab = $scope.tab || 0;

  // define tabs
  $scope.tabs = [
    { text: '预定商品(' + $rootScope.$root.cart.reservedCount + ')' },
    { text: '普通商品(' + $rootScope.$root.cart.normalCount + ')' }
  ];

  // last item
  $scope.lastItem = undefined;

  $scope.switchTab = function(tab) {
    $scope.tab = tab;

    // recalculate the height and back to top
    var cartScroll = $ionicScrollDelegate.$getByHandle('cartScroll');
    cartScroll.resize();
    cartScroll.scrollTop(true);
  };

  // scroll related
  $scope.onScroll = function() {
    var threshold = 150;
    var scrollStatus = mmrScrollService.onScroll(
      {
        handler: 'cartScroll',
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
    $ionicScrollDelegate.$getByHandle('cartScroll').scrollTop(true);
    $scope.showBacktoTopBtn = false;
  };

  // business logic
  $scope.doOpenLastItemDetail = function() {
    mmrModal.createItemDetailModal($scope, $scope.lastItem);
    $scope.lastItem = undefined;
  };

  $scope.getOrders = function(tab) {
    return mmrCartService.generateCartOrders(tab === 1);
  };

  // check all
  $scope.doCheckAll = function(tab) {
    mmrCartService.checkAllCartItems(tab);
  };

  // check out
  $scope.doCheckout = function(tab) {

  };

  // event handlers
  $rootScope.$on('doStateToCart', function($event, data) {
    $scope.lastItem = data;
  });

  // watchers
  $scope.$watch(function(scope) {
    return $rootScope.$root.cart.totalCount;
  }, function(newValue, oldValue, scope) {
    $scope.tabs = [
      { text: '预定商品(' + $rootScope.$root.cart.reservedCount + ')' },
      { text: '普通商品(' + $rootScope.$root.cart.normalCount + ')' }
    ];
  });

}]);
