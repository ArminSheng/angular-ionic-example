angular.module('mmr.directives')

.run(['$templateCache', function($templateCache) {
  // template for order detail banner
  $templateCache.put('templates/directives/order/order-detail-banner.html',
    '<div class="m-order-detail-banner"><img ng-src="{{ ::bannerPath }}"/></div>');

  // template for order detail money
  $templateCache.put('templates/directives/order/order-detail-money.html',
    '<div class="m-order-detail-money-container">' +
    '<div class="m-order-detail-money-reserve" ng-if="money.reserve">订单预付总金额：<span>{{ ::money.reserve | currency: "￥" }}</span></div>' +
    '<div class="m-order-detail-money-final" ng-if="money.final">订单尾款总金额：<span>{{ ::money.final | currency: "￥" }}</span></div>' +
    '<div class="m-order-detail-money-shipment" ng-if="money.shipment">+ 运费：<span>{{ ::money.shipment | currency: "￥" }}</span></div>' +
    '<div class="m-order-detail-money-coupon" ng-if="money.coupon">- 优惠：<span>{{ ::money.coupon | currency: "￥" }}</span></div>' +
    '<div class="m-order-detail-money-actual" ng-if="money.actual">订单实付金额：<span>{{ ::money.actual | currency: "￥" }}</span></div>' +
    '<div class="m-order-detail-money-payback" ng-if="money.payback">退款金额：<span>{{ ::money.payback | currency: "￥" }}</span></div>' +
    '</div>');

  // template for order detail times
  $templateCache.put('templates/directives/order/order-detail-times.html',
    '<div class="m-order-detail-time-container">' +
    '<div class="m-order-detail-time-order" ng-if="times.order">下单时间：<span>{{ ::times.order | date: "yyyy-MM-dd HH:mm:ss" }}</span></div>' +
    '<div class="m-order-detail-time-reserve" ng-if="times.reserve">预付支付时间：<span>{{ ::times.reserve | date: "yyyy-MM-dd HH:mm:ss" }}</span></div>' +
    '<div class="m-order-detail-time-final" ng-if="times.final">尾款支付时间：<span>{{ ::times.final | date: "yyyy-MM-dd HH:mm:ss" }}</span></div>' +
    '<div class="m-order-detail-time-send" ng-if="times.send">发货时间：<span>{{ ::times.send | date: "yyyy-MM-dd HH:mm:ss" }}</span></div>' +
    '<div class="m-order-detail-time-payback" ng-if="times.payback">退款时间：<span>{{ ::times.payback | date: "yyyy-MM-dd HH:mm:ss" }}</span></div>' +
    '<div class="m-order-detail-time-service" ng-if="times.service">申请售后时间：<span>{{ ::times.service | date: "yyyy-MM-dd HH:mm:ss" }}</span></div>' +
    '</div>');

  // template for order detail service
  $templateCache.put('templates/directives/order/order-detail-service.html',
    '<div class="m-order-detail-service-container">' +
    '<div class="m-order-detail-service-reason" ng-if="service.reason">售后原因：<span>{{ ::service.reason }}</span></div>' +
    '<div class="m-order-detail-service-detail" ng-if="service.detail">售后原因说明：<div>{{ ::service.detail }}</div></div>' +
    '</div>');
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
  // ANSWER: ng-repeat should not be the top level element when replace is TRUE
  return {
    retrict: 'E',
    replace: true,
    scope: {
      orders: '='
    },
    templateUrl: 'templates/directives/order/order-sub-list.html',
    link: function(scope, element, attrs) {

    }
  };

}])

.directive('orderDetailMoney', [function() {

  return {
    retrict: 'E',
    replace: true,
    scope: {
      money: '='
    },
    templateUrl: 'templates/directives/order/order-detail-money.html',
    link: function(scope, element, attrs) {

    }
  };

}])

.directive('orderDetailTimes', [function() {

  return {
    retrict: 'E',
    replace: true,
    scope: {
      times: '='
    },
    templateUrl: 'templates/directives/order/order-detail-times.html',
    link: function(scope, element, attrs) {

    }
  };

}])

.directive('orderDetailService', [function() {

  return {
    retrict: 'E',
    replace: true,
    scope: {
      service: '='
    },
    templateUrl: 'templates/directives/order/order-detail-service.html',
    link: function(scope, element, attrs) {

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
