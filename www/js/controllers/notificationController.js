angular.module('mmr.controllers')

.controller('NotificationCtrl', ['$scope', '$rootScope', 'localStorageService', 'mmrNotificationFactory',
  function($scope, $rootScope, localStorageService, mmrNotificationFactory) {

  $rootScope.$root.ui.tabsHidden = true;

  $scope.tab = 0;

  $scope.switchTab = function(tabIdx) {
    $scope.tab = tabIdx;
    isEmpty(tabIdx);
  };

  $scope.getNotifications = function(tabIdx) {
    return _.filter($scope.notifications, { 'type': tabIdx });
  };

  init();
  function init() {
    mmrNotificationFactory.notifications();

    // cache bindings
    localStorageService.bind($scope, 'notifications');
  }
  //empty content related
  $scope.words = ['暂无消息'];
  $scope.additionalClass = 'm-notification-empty';

  // is empty function
  isEmpty($scope.tab);
  function isEmpty(tab) {
    $scope.isEmpty = $scope.notifications[tab].length === 0 ? true : false;
  }

}]);