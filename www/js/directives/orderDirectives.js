angular.module('mmr.directives')

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
        if($rootScope.$root.modals.orderDetailModal && !$rootScope.$root.modals.orderDetailModal.scope.$$destroyed) {
          // assign the passed in order item
          $rootScope.$root.modals.orderDetailModal.item = data;

          $rootScope.$root.modals.orderDetailModal.show();
        } else {
          mmrModal.createOrderDetailModal($scope, data);
        }
      });
    }
  };

}]);
