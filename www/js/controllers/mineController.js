angular.module('mmr.controllers')

.controller('MineCtrl', ['$scope', '$rootScope', '$interpolate', '$ionicHistory', '$ionicModal', '$ionicPopup', 'mmrEventing', 'Validator', 'mmrCommonService', 'mmrMineFactory', 'recommendedItems',
  function($scope, $rootScope, $interpolate, $ionicHistory, $ionicModal, $ionicPopup, mmrEventing, Validator, mmrCommonService, mmrMineFactory, recommendedItems) {

  if(recommendedItems.data) {
    $scope.recommendedItems = recommendedItems.data;
  } else {
    mmrCommonService.networkDown();
  }

  $scope.doLogin = function() {
    mmrEventing.doOpenLogin();
  };

  $scope.doModifyPInfo = function() {
    mmrEventing.doOpenPersonalInfo();
  };

  $scope.doOpenMyDeposit = function() {
    mmrEventing.doOpenMyDeposit();
  };

  $scope.doOpenMyCoupon = function() {
    mmrEventing.doOpenMyCoupon();
  };

  // ----------------------
  // event handler
  // ----------------------

  // coupon
  $scope.$on('eventOpenMyCoupon', function($event, data) {
    if($scope.couponModal) {
      $scope.couponModal.show();
    } else {
      $ionicModal.fromTemplateUrl('templates/modal/my-coupon.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.couponModal = modal;
        $scope.couponModal.show();

        // binding data
        $scope.couponModal.tab = 0;

        // methods
        $scope.couponModal.doHide = function() {
          $scope.couponModal.hide();
        };

        $scope.couponModal.switchTab = function(tabIdx) {
          $scope.couponModal.tab = tabIdx;
        };

        $scope.couponModal.getExplain = function(coupon) {
          switch(coupon.status) {
            case 0:
              return '请尽快使用';
            case 1:
              return coupon.usedTime + ' 已使用';
            case 2:
              return coupon.periodEnd + ' 已过期';
          }
        };

        init();
        function init() {
          $scope.couponModal.coupons = mmrMineFactory.couponDetails();
        }
      });
    }
  });

  // deposit
  $scope.$on('eventOpenMyDeposit', function($event, data) {
    if($scope.depositModal) {
      $scope.depositModal.show();
    } else {
      $ionicModal.fromTemplateUrl('templates/modal/my-deposit.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.depositModal = modal;
        $scope.depositModal.show();

        // binding data

        // methods
        $scope.depositModal.doHide = function() {
          $scope.depositModal.hide();
        };

        $scope.depositModal.doShowDepositHelp = function() {
          mmrCommonService.help('提示：余额的作用', '下单过程中产生的退款均会退回到此余额账户，下单时可直接勾选使用，用于抵扣部分总额，余额在购物时充当现金使用。');
        };

        init();
        function init() {
          $scope.depositModal.depositDetails = mmrMineFactory.depositDetails();
        }
      });
    }
  });

  // personal information
  $scope.$on('eventOpenPersonalInfo', function($event, data) {
    if($scope.pInfoModal) {
      // directly open it
      $scope.pInfoModal.show();
    } else {
      $ionicModal.fromTemplateUrl('templates/modal/personal-info.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.pInfoModal = modal;
        $scope.pInfoModal.show();

        // binding data

        // methods
        $scope.pInfoModal.doHidePInfo = function() {
          $scope.pInfoModal.hide();
        };

        $scope.pInfoModal.doModifyAvatar = function() {

        };

        $scope.pInfoModal.doModifyAttribute = function(type, origNgModel, title, noNeedValidation) {
          // copy the scope value to temp
          var targetField = origNgModel.substring(origNgModel.lastIndexOf('.') + 1),
              tempNgModel = targetField + 'Temp';
          $scope.pInfoModal.temp = $scope.pInfoModal.temp || {};

          if(type === 'date') {
            var interpolatedDate = $interpolate('{{ ' + origNgModel + ' }}')($scope);
            $scope.pInfoModal.temp[tempNgModel] = new Date(interpolatedDate.substring(1, interpolatedDate.indexOf('T')));
          } else {
            $scope.pInfoModal.temp[tempNgModel] = $interpolate('{{ ' + origNgModel + ' }}')($scope);
          }

          // show the popup for user to input
          showAttributePopup(type, '$scope.pInfoModal.temp.' + tempNgModel, title).then(function(res) {
            if(res === undefined) {
              return;
            }

            // convert date str to obj
            if(type === 'date') {
              res = new Date(res.substring(1, res.indexOf('T')));
            }

            if(!noNeedValidation) {
              if(Validator[targetField] && Validator[targetField](res, true)) {
                // save the attribute into server
                $rootScope.$root.pinfo[targetField] = res;
              } else {
                // when the validation is failed
              }
            } else {
              // when validation is not needed
              $rootScope.$root.pinfo[targetField] = res;
            }
          });
        };

        function showAttributePopup(type, ngModel, title) {
          // remove the prefixing '$scope.'
          ngModel = ngModel.substring(7);

          return $ionicPopup.show({
            template: '<input type="' + type + '" ng-model="' + ngModel + '">',
            title: title,
            scope: $scope,
            buttons: [
              { text: '取消' },
              {
                text: '<b>保存</b>',
                type: 'button-energized',
                onTap: function(e) {
                  var fieldValue = $interpolate('{{ ' + ngModel + ' }}')($scope);
                  if (!fieldValue) {
                    //don't allow the user to close unless he enters valid value
                    e.preventDefault();
                  } else {
                    return fieldValue;
                  }
                }
              }
            ]
          });
        }
      });
    }
  });

  // login
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
          // show the bind modal if necessary
          if($rootScope.$root.isOldUser) {
            $ionicModal.fromTemplateUrl('templates/modal/bind-old-user.html', {
              scope: $scope
            }).then(function(modal) {
              $scope.bindModal = modal;
              $scope.bindModal.show();

              // data bindings
              $scope.bindModal.data = {
                phone: '',
                code: ''
              };

              // methods for the bind modal
              $scope.bindModal.doBind = function() {

              };

              $scope.bindModal.doHideBind = function() {
                $scope.bindModal.hide();
              };
            });
          }
        };

        $scope.loginModal.doRegister = function() {
          mmrEventing.doOpenRegister();
        };
      });
    }
  });

  // register
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