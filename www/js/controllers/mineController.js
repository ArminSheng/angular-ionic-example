angular.module('mmr.controllers')

.controller('MineCtrl', ['$scope', '$rootScope', '$q', '$timeout', '$state', '$interval', '$cordovaCamera', '$cordovaFileTransfer', '$cordovaImagePicker', '$ionicHistory', '$ionicModal', '$ionicPopup', '$ionicActionSheet', 'REST_BASE', 'mmrModal', 'mmrEventing', 'mmrCommonService', 'mmrMineFactory', 'mmrItemFactory', 'mmrLoadingFactory', 'mmrDataService', 'Validator', 'mmrAuth',
  function($scope, $rootScope, $q, $timeout, $state, $interval, $cordovaCamera, $cordovaFileTransfer, $cordovaImagePicker, $ionicHistory, $ionicModal, $ionicPopup, $ionicActionSheet, REST_BASE, mmrModal, mmrEventing, mmrCommonService, mmrMineFactory, mmrItemFactory, mmrLoadingFactory, mmrDataService, Validator, mmrAuth) {

  $scope.initialize = function() {
    $rootScope.$root.ui.tabsHidden = false;

    // load data
    mmrDataService.request(mmrItemFactory.recommend()).then(function(res) {
      $scope.recommendedItems = res[0];
    }, function(err) {
      console.log(err);
    }).finally(function() {
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.doOpenConfig = function() {
    if(!mmrAuth.redirectIfNotLogin()) {
      mmrEventing.doOpenConfig();
    }
  };

  $scope.doLogin = function() {
    mmrEventing.doOpenLogin();
  };

  $scope.doModifyPInfo = function() {
    if(!mmrAuth.redirectIfNotLogin()) {
      mmrEventing.doOpenPersonalInfo();
    }
  };

  $scope.doOpenMyDeposit = function() {
    if(!mmrAuth.redirectIfNotLogin()) {
      mmrEventing.doOpenMyDeposit();
    }
  };

  $scope.doOpenMyCoupon = function() {
    if(!mmrAuth.redirectIfNotLogin()) {
      mmrEventing.doOpenMyCoupon();
    }
  };

  $scope.doAddressMgmt = function() {
    if(!mmrAuth.redirectIfNotLogin()) {
      mmrEventing.doOpenMyAddressMgmt();
    }
  };

  $scope.doOpenMoreOrders = function(tab) {
    if(!mmrAuth.redirectIfNotLogin()) {
      mmrEventing.doOpenMoreOrders(tab);
    }
  };

  $scope.doOpenMyReceipt = function() {
    if(!mmrAuth.redirectIfNotLogin()) {
      mmrEventing.doOpenMyReceipt();
    }
  };

  $scope.doOpenMyCollect = function(tab) {
    if(!mmrAuth.redirectIfNotLogin()) {
      mmrEventing.doOpenMyCollect(tab);
    }
  };

  $scope.doChangeAvatar = function() {
    // check whether this feature is supported
    if($rootScope.$root.platform === 'browser') {
      return;
    }

    // whether the user has login
    if(!$rootScope.$root.authenticated) {
      $scope.doLogin();
      return;
    }

    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: '新拍摄一张' },
        { text: '从相册中选择一张' }
      ],
      titleText: '修改您的头像',
      cancelText: '取消',
      cancel: function() {

      },
      buttonClicked: function(index) {
        var options;
        switch(index) {
          case 0:
            // invoke the camera
            options = {
              quality: 60,
              destinationType: Camera.DestinationType.FILE_URI,
              sourceType: Camera.PictureSourceType.CAMERA,
              allowEdit: true,
              encodingType: Camera.EncodingType.PNG,
              targetWidth: 300,
              targetHeight: 300,
              popoverOptions: CameraPopoverOptions,
              saveToPhotoAlbum: true,
              correctOrientation:true
            };

            $cordovaCamera.getPicture(options).then(uploadAvatar, function(err) {
              // error
              mmrCommonService.help('错误提示', '在调用摄像头时发生了错误');
            });

            break;
          case 1:
            // open the album
            options = {
              maximumImagesCount: 1,
              width: 300,
              height: 300,
              quality: 60
            };

            $cordovaImagePicker.getPictures(options).then(function (results) {
              uploadAvatar(results[0]);
            }, function(error) {
              // error getting photos
              mmrCommonService.help('错误提示', '在调用相册时发生了错误');
            });

            break;
        }

        return true;
      }
    });
  };

  $scope.doOpenMyFootprint = function() {
    if(!mmrAuth.redirectIfNotLogin()) {
      mmrEventing.doOpenMyFootprint();
    }
  };

  $scope.doRecommend = function() {
    // load another batch of recommended data
    mmrDataService.request(mmrItemFactory.recommend()).then(function(res) {
      $scope.recommendedItems = res[0];
    }, function(err) {
      console.log(err);
    });
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

  // open products collect or shops
  $scope.$on('eventOpenMyCollect', function($event, tab) {
    if ($rootScope.modals.collectModal && !$rootScope.modals.collectModal.scope.$$destroyed) {
      $rootScope.modals.collectModal.switchTab(tab);
      // $rootScope.modals.collectModal.myFav = mmrMineFactory.myFav(tab);
      $rootScope.modals.collectModal.show();
    } else{
      mmrModal.createMyCollectModal($scope,tab);
    }
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
          isEmpty(tabIdx);
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
        // is empty function
        isEmpty(modal.tab);
        function isEmpty(tab) {
          $scope.isEmpty = modal.coupons[tab].length === 0 ? true : false;
        }

        // empty content
        $scope.words = ['暂无优惠券'];
        $scope.additionalClass = 'm-coupon-empty';
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
        $scope.depositModal.ec = {};
        $scope.depositModal.ec.words = ['暂无余额变动记录, 去购买一些商品吧 :)'];
        $scope.depositModal.ec.additionalClass = 'm-deposit-list-empty';

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

  $scope.$on('eventOpenMyFootprint', function($event) {
    if ($rootScope.modals.footprintModal && !$rootScope.modals.footprintModal.scope.$$destroyed) {
      $rootScope.modals.footprintModal.show();
    } else {
      mmrModal.createMyFootprintModal($scope);
    }
  });

  $scope.initialize();

  // private functions
  function getUploadAvatarName() {
    return new Date().getTime() + '-' + String(Math.random()).substring(2, 6) + '.png';
  }

  function uploadAvatar(imageURI) {
    // uploaded filename
    var filename = getUploadAvatarName();

    // show the loading mark
    mmrLoadingFactory.show('正在上传新的头像...');

    // upload the image to server
    $cordovaFileTransfer.upload(REST_BASE + 'c_upload/upload', imageURI, {
      mimeType: 'image/png',
      params: {
        name: filename
      }
    }).then(function(result) {
      // reassign the latest avatar url
      mmrLoadingFactory.hide();
      $rootScope.$root.pinfo.avatar = REST_BASE + 'user_uploaded/' +filename ;
    }, function(err) {
      // reassign the latest avatar url
      mmrLoadingFactory.hide();
      $rootScope.$root.pinfo.avatar = REST_BASE + 'user_uploaded/' +filename ;
    }, function (progress) {
      // constant progress updates
      console.log('progress: ', progress);
    });
  }

  // calc the height for avatar, workaround
  $timeout(function() {
    var avatarWidth = $('.m-mine-avatar img').width();
    $('.m-mine-avatar img').height(avatarWidth);
  }, 10);

}])

.controller('ConfigCtrl', ['$scope', '$rootScope', '$timeout', '$state', '$ionicHistory', '$ionicActionSheet', 'mmrModal', 'mmrEventing', 'mmrAuth',
  function($scope, $rootScope, $timeout, $state, $ionicHistory, $ionicActionSheet, mmrModal, mmrEventing, mmrAuth) {

  $rootScope.$root.ui.tabsHidden = true;

  $scope.doOpenPersonalInfo = function() {
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

  $scope.doLogout = function() {
    $ionicActionSheet.show({
      destructiveText: '退出',
      titleText: '确定要退出当前登录帐号吗',
      cancelText: '取消',
      cancel: function() {

      },
      destructiveButtonClicked: function() {
        mmrEventing.doLogout();

        return true;
      }
   });
  };

  // event handlers
  $scope.$on('doLogout', function($event, data) {
    mmrAuth.logout();
    $timeout(function() {
      $rootScope.$root.ui.tabsHidden = false;
      $state.go('tab.mine');
      $timeout(function() {
        $state.go('tab.home');
      }, 100);
    }, 100);
  });

}]);
