angular.module('mmr.controllers')

.controller('NotificationCtrl', ['$scope', '$rootScope', 'localStorageService', 'mmrNotificationFactory',
  function($scope, $rootScope, localStorageService, mmrNotificationFactory) {

  $rootScope.$root.ui.tabsHidden = true;

  $scope.tab = 0;

  $scope.switchTab = function(tabIdx) {
    $scope.tab = tabIdx;
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

}]);