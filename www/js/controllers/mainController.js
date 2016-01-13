angular.module('mmr.controllers')

.controller('MainCtrl', ['$scope', '$rootScope', '$ionicHistory', '$interval', 'mmrCommonService', 'mmrMetaFactory',
  function($scope, $rootScope, $ionicHistory, $interval, mmrCommonService, mmrMetaFactory) {

  $scope.myGoBack = function() {
    $rootScope.tabsHidden = "";
    $ionicHistory.goBack();
  };

  // notification count
  $rootScope.$root = {
    notificationCount: 5,
    authenticated: false,
    pinfo: {
      phone: '18501751020',
      deposit: 200.0
    },
    network: true,

    // UI related
    ui: {
      tabsHidden: false
    }
  };

  // send heartbeat every 30s
  $interval(function() {
    mmrCommonService.networkCheck();
  }, 30000);

  // retrieve meta data
  mmrMetaFactory.brands();
  mmrMetaFactory.attributes();
  mmrMetaFactory.classification();

}]);