angular.module('mmr.controllers')

.controller('MineCtrl', ['$scope', '$rootScope', '$ionicHistory', '$ionicModal', 'mmrEventing', 'messageCenter', 'recommendedItems',
  function($scope, $rootScope, $ionicHistory, $ionicModal, mmrEventing, messageCenter, recommendedItems) {

  if(recommendedItems.data) {
    $scope.recommendedItems = recommendedItems.data;
  } else {
    messageCenter.networkDown();
  }

  $scope.doLogin = function() {
    mmrEventing.doOpenLogin();
  };

  // event handler
  $scope.$on('eventOpenLogin', function($event, data) {
    $ionicModal.fromTemplateUrl('templates/modal/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.loginModal = modal;
      $scope.loginModal.show();

      // binding data
      $scope.loginModal.data = {
        username: '',
        password: ''
      };

      $scope.loginModal.doHideLogin = function() {
        $scope.loginModal.hide();
        $scope.loginModal = undefined;
      };

      $scope.loginModal.doClick = function() {
        console.log('clicked');
      };
    });
  });

}]);