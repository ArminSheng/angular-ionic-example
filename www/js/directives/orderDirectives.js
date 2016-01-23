angular.module('mmr.directives')

.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/directives/order/order-detail-banner.html',
    '<div class="m-order-detail-banner"><img ng-src="{{ ::bannerPath }}"/></div>');
}])

.directive('orderList', [function() {

  return {
    retrict: 'E',
    replace: true,
    scope: {
      items: '=',
      search: '='
    },
    templateUrl: 'templates/directives/order-list.html',
    link: function(scope, element, attrs) {

    },
    controller: function($rootScope, $scope, mmrModal, mmrEventing) {
      // 申请售后
      $scope.doApplyService = function(item) {

      };

      // 查看订单
      $scope.doCheckOrder = function(item) {
        mmrEventing.doOpenOrderDetail(item);
      };

      // 去付款
      $scope.doPayOrder = function(item) {

      };

      // 再次购买
      $scope.doBuyAgain = function(item) {

      };

      // 查看自提码
      $scope.doCheckSelfCode = function(item) {

      };

      // 售后详情
      $scope.doCheckServiceDetail = function(item) {

      };

      // event handlers
      $scope.$on('eventOpenOrderDetail', function($event, data) {
        mmrModal.createOrderDetailModal($scope, data);
      });
    }
  };

}])

.directive('orderSubList', [function() {

  // TODO: add replace: true will cause empty rendering, WHY?
  return {
    retrict: 'E',
    scope: {
      orders: '='
    },
    templateUrl: 'templates/directives/order/order-sub-list.html',
    link: function(scope, element, attrs) {
      console.log(scope);
    }
  };

}])

.directive('orderDetailBanner', [function() {

  return {
    retrict: 'E',
    replace: true,
    scope: {
      status: '@'
    },
    templateUrl: 'templates/directives/order/order-detail-banner.html',
    link: function(scope, element, attrs) {
      scope.bannerPath = (function() {
        switch(scope.status) {
          case '0':
            return 'img/common/status-wait-pay.png';
          case '1':
            return 'img/common/status-wait-send.png';
          case '2':
            return 'img/common/status-wait-receive.png';
          case '3':
            return 'img/common/status-wait-receive.png';
          case '6':
            return 'img/common/status-wait-service.png';
        }
      })();
    }
  };

}])

.directive('orderDetailAddress', [function() {

  return {
    retrict: 'E',
    replace: true,
    scope: {
      type: '@',
      address: '='
    },
    templateUrl: 'templates/directives/order/order-detail-address.html',
    link: function(scope, element, attrs) {
      scope.iconPath = (function() {
        switch(scope.type) {
          case 'location':
            return 'img/common/geo-location.png';
          case 'receipt':
            return 'img/common/geo-receipt.png';
          case 'quarantine':
            return 'img/common/geo-quarantine.png';
        }
      })();

      scope.doCheckReceipt = function() {

      };
    }
  };

}]);
