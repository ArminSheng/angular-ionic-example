angular.module('mmr.controllers')

.controller('MineCtrl', ['$scope', '$rootScope', '$ionicHistory', 'recommendedItems',
  function($scope, $rootScope, $ionicHistory, recommendedItems) {

  $scope.recommendedItems = recommendedItems.data;

}]);