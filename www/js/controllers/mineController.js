angular.module('mmr.controllers')

.controller('MineCtrl', ['$scope', '$rootScope', '$ionicHistory', 'messageCenter', 'recommendedItems',
  function($scope, $rootScope, $ionicHistory, messageCenter, recommendedItems) {

  if(recommendedItems.data) {
    $scope.recommendedItems = recommendedItems.data;
  } else {
    messageCenter.networkDown();
  }

}]);