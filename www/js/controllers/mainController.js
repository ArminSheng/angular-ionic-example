angular.module('mmr.controllers')

.controller('MainCtrl', ['$scope', '$rootScope', '$ionicHistory', 
  function($scope, $rootScope, $ionicHistory) {

  $scope.myGoBack = function() {
    $rootScope.tabsHidden = "";
    $ionicHistory.goBack();
  };
  
}]);