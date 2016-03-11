angular.module('mmr.directives')

.run(['$templateCache', function($templateCache) {
  // template for order detail banner
  $templateCache.put('templates/directives/order/order-detail-banner.html',
    '<div class="m-order-detail-banner"><img ng-src="{{ ::bannerPath }}"/></div>');

  // template for order detail money
  $templateCache.put('templates/directives/order/order-detail-money.html',
    '<div class="m-order-detail-money-container" ng-class="{\'hidden\': _.isEmpty(money)}">' +
    '<div class="m-order-detail-money-total" ng-if="money.total">订单总金额：<span>{{ ::money.total | currency: "￥" }}</span></div>' +
    '<div class="m-order-detail-money-reserve" ng-if="money.reserve">订单预付总金额：<span>{{ ::money.reserve | currency: "￥" }}</span></div>' +
    '<div class="m-order-detail-money-final" ng-if="money.final">订单尾款总金额：<span>{{ ::money.final | currency: "￥" }}</span></div>' +
    '<div class="m-order-detail-money-shipment" ng-if="money.shipment >= 0">+ 运费：<span>{{ ::money.shipment | currency: "￥" }}</span></div>' +
    '<div class="m-order-detail-money-coupon" ng-if="money.coupon >= 0">- 优惠：<span>{{ ::money.coupon | currency: "￥" }}</span></div>' +
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
    '<div class="m-order-detail-service-detail" ng-if="service.detail">售后原因说明：<div class="m-order-detail-service-detail">{{ ::service.detail }}</div></div>' +
    '<div class="m-order-detail-service-photos" ng-if="service.photos">凭证照片：<ion-gallery ion-gallery-items="service.photos"></ion-gallery></div>' +
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

    }
  };

}])

.directive('orderOperations', ['$ionicPopup', '$rootScope', function($ionicPopup, $rootScope) {

  return {
    retrict: 'E',
    replace: true,
    scope: {
      item: '=',
      inDetail: '@'
    },
    templateUrl: 'templates/directives/order/order-operations.html',
    link: function(scope, element, attrs) {

    },
    controller: function($rootScope, $scope, mmrModal, mmrEventing) {
      // 申请售后
      $scope.doApplyService = function(item) {
        mmrEventing.doApplyService(item);
      };

      // 查看订单
      $scope.doCheckOrder = function(item) {
        mmrEventing.doOpenOrderDetail(item);
      };

      // 去付款
      $scope.doPayOrder = function(item) {
        mmrEventing.doPayOrder(item);
      };

      // 再次购买
      $scope.doBuyAgain = function(item) {
        mmrEventing.doBuyAgain(item);
      };

      // 查看自提码
      $scope.doCheckSelfCode = function(item) {
        mmrEventing.doCheckSelfCode(item);
      };

      // 售后详情
      $scope.doCheckServiceDetail = function(item) {
        mmrEventing.doCheckServiceDetail(item);
      };

      // 确认收货
      $scope.doConfirmOrder = function(item) {
        mmrEventing.doConfirmOrder(item);
      };

      // event handlers
      $scope.$on('eventOpenOrderDetail', function($event, data) {
        // all orders will try to respond to the event
        if($rootScope.$root.modals.orderDetailModal && !$rootScope.$root.modals.orderDetailModal.scope.$$destroyed) {

          $rootScope.$root.modals.orderDetailModal.item = data;
          $rootScope.$root.modals.orderDetailModal.show();
        }else {
          if (data.orderId === $scope.item.orderId) {
            mmrModal.createOrderDetailModal($scope, data);
          }
        }
      });

      $scope.$on('eventApplyService', function($event, data) {
        // all orders will try to respond to the event
        if(data.orderId === $scope.item.orderId) {
          mmrModal.createApplyServiceModal($scope, data);
        }
      });

      $scope.$on('eventPayOrder', function($event, data) {
        // all orders will try to respond to the event
        if(data.orderId === $scope.item.orderId) {

        }
      });

      $scope.$on('eventBuyAgain', function($event, data) {
        // all orders will try to respond to the event
        if(data.orderId === $scope.item.orderId) {

        }
      });

      $scope.$on('eventCheckSelfCode', function($event, data) {
        // all orders will try to respond to the event
        if(data.orderId === $scope.item.orderId) {

        }
      });

      $scope.$on('eventCheckServiceDetail', function($event, data) {
        // all orders will try to respond to the event
        if(data.orderId === $scope.item.orderId) {

        }
      });

      $scope.$on('eventConfirmOrder', function($event, data) {
        // all orders will try to respond to the event
        if(data.orderId === $scope.item.orderId) {
          $ionicPopup.show({
            template:'<div class="m-msg-cong"><span class="m-msg-cong-subtitle">您已收到该商品？</span><div>',
            scope:$scope,
            buttons:[
              {
                text:'取消',
              },
              {
                text:'确定,去评价',
                type:'button-energized',
                onTap:function(e) {
                  if ($rootScope.$root.modals.addReviewModal && !$rootScope.$root.modals.addReviewModal.scope.$$destroyed) {
                    $rootScope.$root.modals.addReviewModal.show();
                  } else {
                    mmrModal.createAddReviewModal($scope, data);
                  }
                }
              }
            ]
          });
        }
      });
    }
  };

}])

.directive('orderSubList', ['mmrCartService', 'mmrModal',
  function(mmrCartService, mmrModal) {

  // sub order id ---> whether to show all items
  var expandedMapping = {

  };

  // TODO: add replace: true will cause empty rendering, WHY?
  // ANSWER: ng-repeat should not be the top level element when replace is TRUE
  return {
    retrict: 'E',
    replace: true,
    scope: {
      orders: '=',
      isReserved: '@',
      isCartMode: '@'
    },
    templateUrl: 'templates/directives/order/order-sub-list.html',
    link: function(scope, element, attrs) {
      scope.doShowMore = function(subOrder, readonly) {
        if(scope.isCartMode === 'true') {
          return false;
        }

        if(subOrder.items && subOrder.items.length <= 2) {
          return false;
        }

        if(!readonly) {
          expandedMapping[subOrder.subOrderId] = true;
        } else {
          return !expandedMapping[subOrder.subOrderId];
        }
      };

      scope.getShownItems = function(subOrder) {
        if(scope.isCartMode === 'true' || expandedMapping[subOrder.subOrderId]) {
          return subOrder.items;
        } else {
          // default to show 2 items
          return subOrder.items.slice(0, 2);
        }
      };

      scope.doToggleEdit = function(subOrder) {
        subOrder.isEditing = !subOrder.isEditing;
      };

      // click on check all for one shop
      scope.doCheckSubOrder = function(subOrder) {
        subOrder.checked = !!subOrder.checked;

        // iterate for all items below
        if(subOrder.checked) {
          _.forEach(subOrder.items, function(element) {
            element.checked = true;
          });
        } else {
          _.forEach(subOrder.items, function(element) {
            element.checked = false;
          });
        }

        // check whether to check 'checkall'
        mmrCartService.updateCheckedInformation(scope.isReservedBoolean ? 0 : 1);
      };

      // click on check for one item
      scope.doCheckSubOrderItem = function(subOrder, subItem) {
        subItem.checked = !!subItem.checked;
        if(!subItem.checked) {
          subOrder.checked = false;
        } else {
          // check whether to check at shop level
          if(_.every(subOrder.items, {'checked': true})) {
            subOrder.checked = true;
          }
        }

        // check whether to check 'checkall'
        mmrCartService.updateCheckedInformation(scope.isReservedBoolean ? 0 : 1);
      };

      scope.doOpenDetail = function(subItem) {
        mmrModal.createItemDetailModal(scope, subItem);
      };

      // watchers
      scope.$watch(function() {
        return scope.isReserved;
      }, function(newValue, oldValue, scope) {
        if(scope.isReserved === 'false') {
          scope.isReservedBoolean = false;
        } else {
          scope.isReservedBoolean = true;
        }
      });

      scope.$watch(function() {
        return scope.isCartMode;
      }, function(newValue, oldValue, scope) {
        if(scope.isCartMode === 'false') {
          scope.isCartModeBoolean = false;
        } else {
          scope.isCartModeBoolean = true;
        }
      });
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
      if(_.isEmpty(scope.money)) {
        element.addClass('hidden');
      }
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
      if(_.isEmpty(scope.times)) {
        element.addClass('hidden');
      }
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
      if(_.isEmpty(scope.service)) {
        element.addClass('hidden');
      }
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

.directive('orderDetailAddress', ['mmrModal', function(mmrModal) {

  return {
    retrict: 'E',
    replace: true,
    scope: {
      type: '@',
      address: '=',
      item: '=',
      clickable: '@'
    },
    templateUrl: 'templates/directives/order/order-detail-address.html',
    link: function(scope, element, attrs) {
      scope.iconPath = (function() {
        switch(scope.type) {
          case 'normal':
            return 'img/common/geo-location.png';
          case 'receipt':
            return 'img/common/geo-receipt.png';
          case 'quarantine':
            return 'img/common/geo-quarantine.png';
        }
      })();
    },
    controller: function($rootScope, $scope, mmrModal, mmrEventing) {
      $scope.doCheckReceipt = function(item) {
        if($rootScope.$root.modals.receiptListModal && !$rootScope.$root.modals.receiptListModal.scope.$$destroyed) {
          // directly open it
          $rootScope.$root.modals.receiptListModal.item = item;
          $rootScope.$root.modals.receiptListModal.show();
        } else {
          mmrModal.createReceiptListModal($scope, item);
        }
      };

      $scope.doOpenAddressList = function() {
        if($scope.clickable === 'false' || ($scope.type && $scope.type === 'receipt')) {
          return;
        }

        mmrModal.createAddressModal($scope, $scope.address, $scope.type);
      };
    }
  };

}]);
