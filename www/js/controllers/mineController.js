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
    if($scope.loginModal) {
      // directly open it
      $scope.loginModal.show();
    } else {
      $ionicModal.fromTemplateUrl('templates/modal/login.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.loginModal = modal;
        $scope.loginModal.show();

        // binding data
        $scope.loginModal.data = {
          username: '',
          password: '',
          code: ''
        };

        $scope.loginModal.viewMode = 1;

        $scope.loginModal.doHideLogin = function() {
          $scope.loginModal.hide();
          $scope.loginModal = undefined;
        };

        $scope.loginModal.doClick = function() {
          console.log('clicked');
        };

        $scope.loginModal.getSwitchText = function() {
          if($scope.loginModal.viewMode === 1) {
            return "手机验证码登陆";
          } else {
            return "个人密码登陆";
          }
        };

        $scope.loginModal.doSwitchLoginMode = function() {
          if($scope.loginModal.viewMode === 1) {
            $scope.loginModal.viewMode = 2;
          } else {
            $scope.loginModal.viewMode = 1;
          }
        };

        $scope.loginModal.doFetchCode = function() {

        };

        $scope.loginModal.doLogin = function() {

        };
      });
    }
  });

}]);