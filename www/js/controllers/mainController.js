angular.module('mmr.controllers')

.controller('MainCtrl', ['$scope', '$rootScope', '$ionicHistory',
  function($scope, $rootScope, $ionicHistory) {

  $scope.myGoBack = function() {
    $rootScope.tabsHidden = "";
    $ionicHistory.goBack();
  };

  // notification count
  $rootScope.$root = {
    notificationCount: 5,
    authenticated: true,
    pinfo: {
      phone: '18501751020'
    }
  };

}]);