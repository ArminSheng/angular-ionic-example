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

  // record which brand and attribute has been selected
  var selectedBrandsIdx = {},
      selectedAttributesIdx = {};

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

  $scope.doSelectBrand = function(idx) {
    toggleStatus(selectedBrandsIdx, idx);
  };

  $scope.doSelectAttribute = function(idx) {
    toggleStatus(selectedAttributesIdx, idx);
  };

  $scope.checkStatus = function(type, idx) {
    if(type === 'brand') {
      return !!selectedBrandsIdx[idx];
    } else {
      return !!selectedAttributesIdx[idx];
    }
  };

  // cache bindings
  localStorageService.bind($scope, 'brands');
  localStorageService.bind($scope, 'attributes');

  // event handlers

  // private functions
  function toggleStatus(mapping, idx) {
    if(mapping[idx]) {
      delete mapping[idx];
    } else {
      mapping[idx] = true;
    }
  }
}]);