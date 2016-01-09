angular.module('mmr.controllers')

.controller('CategoryCtrl', ['$scope', '$rootScope', '$ionicHistory',
  function($scope, $rootScope, $ionicHistory) {

  // controller defaults
  $scope.sortActivated = false;
  $scope.selectedSortIndex = 0;
  $scope.sorters = [
    { 'text': '智能排序' },
    { 'text': '价格从高到低' },
    { 'text': '价格从低到高' },
    { 'text': '销量从高到低' },
    { 'text': '销量从低到高' }
  ]

  $scope.activateSort = function() {
    $scope.sortActivated = !$scope.sortActivated;
  };

  $scope.doSelectSorter = function(idx) {
    $scope.selectedSortIndex = idx;
    $scope.sortActivated = false;
  };

}]);