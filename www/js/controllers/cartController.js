angular.module('mmr.controllers')

.controller('CartCtrl', ['$scope', '$rootScope', '$stateParams', '$ionicHistory', '$ionicScrollDelegate', 'mmrScrollService', 'mmrModal', 'mmrCartService', '$state', 'mmrAuth',
  function($scope, $rootScope, $stateParams, $ionicHistory, $ionicScrollDelegate, mmrScrollService, mmrModal, mmrCartService, $state, mmrAuth) {

  $rootScope.$root.ui.tabsHidden = false;
  $scope.tab = Number($stateParams.tab);

  // define tabs
  $scope.tabs = [
    { text: '预定商品(' + $rootScope.$root.cart.counts[0] + ')' },
    { text: '普通商品(' + $rootScope.$root.cart.counts[0] + ')' }
  ];

  // last item
  $scope.lastItem = undefined;

  // is empty function
  isEmpty($scope.tab);
  function isEmpty(tab) {
    $scope.isEmpty = $rootScope.$root.cart.counts[tab] === 0 ? true : false;
  }

  $scope.switchTab = function(tab) {
    $scope.tab = tab;
    isEmpty(tab);
    // recalculate the height and back to top
    var cartScroll = $ionicScrollDelegate.$getByHandle('cartScroll');
    cartScroll.resize();
    cartScroll.scrollTop(true);
  };

  // empty content
  $scope.words = ['购物车还是空的，去挑选商品吧'];
  $scope.additionalClass = 'm-cart-empty';
  $scope.button = {
    text:'去看看',
    type: 'text',
    onTap: function() {
      $state.go('tab.home');
    }
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
    isEmpty(tab);
    return mmrCartService.generateCartOrders(tab === 1);
  };

  // check all
  $scope.doCheckAll = function(tab) {
    mmrCartService.checkAllCartItems(tab);
    mmrCartService.updateCheckedInformation(tab);
  };

  // check out
  $scope.doCheckout = function(tab) {
    if(mmrCartService.isCheckoutable(tab)) {
      // check login status
      if(!mmrAuth.redirectIfNotLogin('tab.cart')) {
        if ($rootScope.$root.modals.genOrderModal && !$rootScope.$root.modals.genOrderModal.scope.$$destroyed) {

          //binding data
          $rootScope.$root.modals.genOrderModal.orders = mmrCartService.generateCheckedOrders(tab);
          $rootScope.$root.modals.genOrderModal.show();
        }else {
          mmrModal.createGenerateOrderModal($scope, mmrCartService.generateCheckedOrders(tab));
        }
      }
    }
  };

  // event handlers
  $rootScope.$on('doStateToCart', function($event, data) {
    $scope.lastItem = data;
    isEmpty($stateParams.tab);
  });

  $rootScope.$on('doNewOrderGenerated', function($event, data) {
    mmrCartService.removeGeneratedItems(data);
  });

  // watchers
  $scope.$watch(function(scope) {
    return $rootScope.$root.cart.totalCount;
  }, function(newValue, oldValue, scope) {
    $scope.tabs = [
      { text: '预定商品(' + $rootScope.$root.cart.counts[0] + ')' },
      { text: '普通商品(' + $rootScope.$root.cart.counts[1] + ')' }
    ];
  });

}]);
