angular.module('mmr.controllers')

.controller('MainCtrl', ['$scope', '$rootScope', '$ionicHistory', '$interval', 'messageCenter',
  function($scope, $rootScope, $ionicHistory, $interval, messageCenter) {

  $scope.myGoBack = function() {
    $rootScope.tabsHidden = "";
    $ionicHistory.goBack();
  };

  // notification count
  $rootScope.$root = {
    notificationCount: 5,
    authenticated: true,
    pinfo: {
      phone: '18501751020',
      deposit: 200.0
    },
    network: true
  };

  // send heartbeat every 30s
  $interval(function() {
    messageCenter.networkCheck();
  }, 30000);

}]);