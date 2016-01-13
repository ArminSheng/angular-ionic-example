angular.module('mmr.controllers')

.controller('MineCtrl', ['$scope', '$rootScope', '$ionicHistory', '$ionicModal', 'mmrEventing', 'Validator', 'mmrCommonService', 'recommendedItems',
  function($scope, $rootScope, $ionicHistory, $ionicModal, mmrEventing, Validator, mmrCommonService, recommendedItems) {

  if(recommendedItems.data) {
    $scope.recommendedItems = recommendedItems.data;
  } else {
    mmrCommonService.networkDown();
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

        $scope.loginModal.doRegister = function() {
          mmrEventing.doOpenRegister();
        };
      });
    }
  });

  $scope.$on('eventOpenRegister', function($event, data) {
    $ionicModal.fromTemplateUrl('templates/modal/register.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.registerModal = modal;
      $scope.registerModal.show();

      // data bindings
      $scope.registerModal.term1 = false;
      $scope.registerModal.term2 = false;

      $scope.registerModal.data = {
        phone: '',
        password: '',
        code: ''
      };

      // methods for the register modal
      $scope.registerModal.doHideRegister = function() {
        $scope.registerModal.hide();
      };

      $scope.registerModal.doFetchCode = function() {

      };

      $scope.registerModal.doPrecheck = function() {
        if(!Validator.phone($scope.registerModal.data.phone) ||
           !Validator.password($scope.registerModal.data.password) ||
           !Validator.verifyCode($scope.registerModal.data.code) ||
           !$scope.registerModal.term1 ||
           !$scope.registerModal.term2) {
          return false;
        }

        return true;
      };
    });
  });

}]);