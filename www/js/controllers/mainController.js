angular.module('mmr.controllers')

.controller('MainCtrl', ['$scope', '$rootScope', '$ionicHistory', '$interval', 'mmrCommonService', 'mmrMetaFactory',
  function($scope, $rootScope, $ionicHistory, $interval, mmrCommonService, mmrMetaFactory) {

  $scope.myGoBack = function() {
    $rootScope.tabsHidden = "";
    $ionicHistory.goBack();
  };

  $rootScope.$root = {
    // notification related
    notificationCount: 5,

    // auth related
    isOldUser: true,
    authenticated: false,
    pinfo: {
      phone: '18501751020',
      deposit: 200.0,
      oldUserAccounts: [
        'mmr-mmr-mmr1@mmr.com',
        'mmr-mmr-mmr2@mmr.com',
        'mmr-mmr-mmr3@mmr.com'
      ]
    },

    // network related
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