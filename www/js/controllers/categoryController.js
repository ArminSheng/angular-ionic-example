angular.module('mmr.controllers')

.controller('CategoryCtrl', ['$scope', '$rootScope', '$ionicHistory',
  function($scope, $rootScope, $ionicHistory) {

  // controller defaults
  $scope.filtersActivated = false;
  $scope.selectedFilterIndex = 0;
  $scope.filters = [
    { 'text': '智能排序' },
    { 'text': '价格从高到低' },
    { 'text': '价格从低到高' },
    { 'text': '销量从高到低' },
    { 'text': '销量从低到高' }
  ]

  $scope.activateFilters = function() {
    $scope.filtersActivated = !$scope.filtersActivated;
  };

  $scope.doSelectFilter = function(idx) {
    $scope.selectedFilterIndex = idx;
    $scope.filtersActivated = false;
  };

}]);