angular.module('mmr.controllers')

.controller('CategoryCtrl', ['$scope', '$rootScope', '$ionicModal', 'localStorageService', 'mmrEventing',
  function($scope, $rootScope, $ionicModal, localStorageService, mmrEventing) {

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
    // if($scope.screenActivated) {
    //   if($scope.modal) {
    //     $scope.modal.show();
    //   } else {
    //     mmrEventing.doOpenFilters('123');
    //   }
    // }

    // hide the bottom tabs
    $rootScope.$root.ui.tabsHidden = !$rootScope.$root.ui.tabsHidden;
  };

  // cache bindings
  localStorageService.bind($scope, 'brands');

  // event handlers
  $scope.$on('eventOpenFilters', function(event, data) {
    console.log('hahaha', data);

    $ionicModal.fromTemplateUrl('templates/popup/filters.html', {
      scope: $scope,
      animation: 'slide-in-down'
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });
  });

  // filter popup events
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
    $scope.activateScreen();
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });

}]);