angular.module('mmr.controllers')

.controller('CategoryCtrl', ['$scope', '$rootScope', 'localStorageService', 'mmrEventing',
  function($scope, $rootScope, localStorageService, mmrEventing) {

  // controller defaults
  $scope.sortActivated = false;
  $scope.selectedSortIndex = 0;
  $scope.sorters = [
    { 'text': '智能排序' },
    { 'text': '价格从高到低' },
    { 'text': '价格从低到高' },
    { 'text': '销量从高到低' },
    { 'text': '销量从低到高' }
  ];

  $scope.screenActivated = false;

  // methods
  $scope.activateSort = function() {
    $scope.screenActivated = false;
    $scope.sortActivated = !$scope.sortActivated;
  };

  $scope.doSelectSorter = function(idx) {
    $scope.selectedSortIndex = idx;
    $scope.sortActivated = false;
  };

  $scope.activateScreen = function() {
    $scope.sortActivated = false;
    $scope.screenActivated = !$scope.screenActivated;

    // hide the bottom tabs
    $rootScope.$root.ui.tabsHidden = !$rootScope.$root.ui.tabsHidden;
  };

  // cache bindings
  localStorageService.bind($scope, 'brands');
  localStorageService.bind($scope, 'attributes');

  // event handlers
}]);