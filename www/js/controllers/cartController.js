angular.module('mmr.controllers')

.controller('CartCtrl', ['$scope', '$rootScope', '$ionicHistory', '$ionicScrollDelegate',
  function($scope, $rootScope, $ionicHistory, $ionicScrollDelegate) {

  $scope.tab = $scope.tab || 0;
  $scope.cart = {
    counts: {
      reserve: 0,
      normal: 0,
      total: 0
    }
  };

  // define tabs
  $scope.tabs = [
    { text: '预定商品(' + $scope.cart.counts.reserve + ')' },
    { text: '普通商品(' + $scope.cart.counts.normal + ')' }
  ];

  $scope.switchTab = function(tab) {
    $scope.tab = tab;

    // recalculate the height and back to top
    var cartScroll = $ionicScrollDelegate.$getByHandle('cartScroll');
    cartScroll.resize();
    cartScroll.scrollTop(true);
  };

}]);
