angular.module('mmr.services')

.factory('mmrEventing', ['$rootScope', function($rootScope) {

  return {

    doOpenConfig: function(data) {
      $rootScope.$broadcast('eventOpenConfig', data);
    },

    doBackMine: function(data) {
      $rootScope.$broadcast('eventBackMine', data);
    },

    doOpenLogin: function(data) {
      $rootScope.$broadcast('eventOpenLogin', data);
    },

    doOpenPersonalInfo: function(data) {
      $rootScope.$broadcast('eventOpenPersonalInfo', data);
    },

    doOpenMyDeposit: function(data) {
      $rootScope.$broadcast('eventOpenMyDeposit', data);
    },

    doOpenMyCoupon: function(data) {
      $rootScope.$broadcast('eventOpenMyCoupon', data);
    },

    doOpenMyReceipt: function(data) {
      $rootScope.$broadcast('eventOpenMyReceipt', data);
    },

    doOpenRegister: function(data) {
      $rootScope.$broadcast('eventOpenRegister', data);
    },

    doOpenMyAddressMgmt: function(data) {
      $rootScope.$broadcast('eventOpenAddressMgmt', data);
    },

    doOpenMoreOrders: function(data) {
      $rootScope.$broadcast('eventOpenMoreOrders', data);
    },

    // inside category view
    doOpenFilters: function(data) {
      $rootScope.$broadcast("eventOpenFilters", data);
    },

    // order operations below
    doOpenOrderDetail: function(data) {
      $rootScope.$broadcast("eventOpenOrderDetail", data);
    },

    doApplyService: function(data) {
      $rootScope.$broadcast("eventApplyService", data);
    },

    doPayOrder: function(data) {
      $rootScope.$broadcast("eventPayOrder", data);
    },

    doBuyAgain: function(data) {
      $rootScope.$broadcast("eventBuyAgain", data);
    },

    doCheckSelfCode: function(data) {
      $rootScope.$broadcast("eventCheckSelfCode", data);
    },

    doCheckServiceDetail: function(data) {
      $rootScope.$broadcast("eventCheckServiceDetail", data);
    }
    // order operations end

  };

}]);
