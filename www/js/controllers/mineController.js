angular.module('mmr.controllers')

.controller('MineCtrl', ['$scope', '$rootScope', '$state', '$ionicHistory', '$ionicModal', '$ionicPopup', 'mmrModal', 'mmrEventing', 'mmrCommonService', 'mmrMineFactory', 'recommendedItems',
  function($scope, $rootScope, $state, $ionicHistory, $ionicModal, $ionicPopup, mmrModal, mmrEventing, mmrCommonService, mmrMineFactory, recommendedItems) {

  $rootScope.$root.ui.tabsHidden = false;

  if(recommendedItems.data) {
    $scope.recommendedItems = recommendedItems.data;
  } else {
    mmrCommonService.networkDown();
  }

  $scope.doOpenConfig = function() {
    mmrEventing.doOpenConfig();
  };

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

  $scope.doAddressMgmt = function() {
    mmrEventing.doOpenMyAddressMgmt();
  };

  $scope.doOpenMoreOrders = function(tab) {
    mmrEventing.doOpenMoreOrders(tab);
  };

  $scope.doOpenMyReceipt = function() {
    mmrEventing.doOpenMyReceipt();
  };

  // ----------------------
  // event handler
  // ----------------------

  // more orders
  $scope.$on('eventOpenMoreOrders', function($event, tab) {
    $state.go('tab.orders-mine', {
      orderType: tab || 0
    });
  });

  // address mgmt
  $scope.$on('eventOpenAddressMgmt', function($event, data) {
    if($rootScope.modals.addressModal && !$rootScope.modals.addressModal.scope.$$destroyed) {
      $rootScope.modals.addressModal.show();
    } else {
      mmrModal.createAddressModal($scope);
    }
  });

  // config
  $scope.$on('eventOpenConfig', function($event, data) {
    $state.go('tab.config-mine');
  });

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
    if($rootScope.modals.pInfoModal && !$rootScope.modals.pInfoModal.scope.$$destroyed) {
      // directly open it
      $rootScope.modals.pInfoModal.show();
    } else {
      mmrModal.createPersonalInfoModal($scope);
    }
  });

  //receipt
  $scope.$on('eventOpenMyReceipt', function($event, data) {
    if($rootScope.modals.receiptModal && !$rootScope.modals.receiptModal.scope.$$destroyed) {
      // directly open it
      $rootScope.modals.receiptModal.show();
    } else {
      mmrModal.createMyReceiptModal($scope);
    }
  });

  // login
  $scope.$on('eventOpenLogin', function($event, data) {
    if($rootScope.modals.loginModal) {
      // directly open it
      $rootScope.modals.loginModal.show();
    } else {
      mmrModal.createLoginModal($scope);
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

}])

.controller('ConfigCtrl', ['$scope', '$rootScope', 'mmrModal',
  function($scope, $rootScope, mmrModal) {

  $rootScope.$root.ui.tabsHidden = true;

  $scope.doOpenPersonalInfo = function() {
    console.log('doOpenPersonalInfo');
    if($rootScope.modals.pInfoModal && !$rootScope.modals.pInfoModal.scope.$$destroyed) {
      // directly open it
      $rootScope.modals.pInfoModal.show();
    } else {
      mmrModal.createPersonalInfoModal($scope);
    }
  };

  $scope.doOpenAddress = function() {
    if($rootScope.modals.addressModal && !$rootScope.modals.addressModal.scope.$$destroyed) {
      $rootScope.modals.addressModal.show();
    } else {
      mmrModal.createAddressModal($scope);
    }
  };

  $scope.doOpenMyReceipt = function() {
      
      if($rootScope.modals.receiptModal && !$rootScope.modals.receiptModal.scope.$$destroyed) {
      // directly open it
      $rootScope.modals.receiptModal.show();
    } else {
      mmrModal.createMyReceiptModal($scope);
    }
  };

  $scope.doOpenSecurityConfig = function() {
    if($rootScope.modals.securityModal && !$rootScope.modals.securityModal.scope.$$destroyed) {
      $rootScope.modals.securityModal.show();
    } else {
      mmrModal.createSecurityModal($scope);
    }
  };

  $scope.doOpenAboutUs = function() {
    console.log('doOpenAboutUs');
  };


}]);