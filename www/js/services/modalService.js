angular.module('mmr.services')

.factory('mmrModal', ['$rootScope', '$interval', '$timeout', '$interpolate', '$state', '$ionicModal', '$ionicPopup', 'localStorageService', 'Validator', 'mmrMineFactory', 'mmrItemFactory', 'mmrCacheFactory', 'mmrEventing', 'mmrScrollService', '$ionicScrollDelegate', 'mmrSearchService', '$ionicActionSheet', 'mmrAddressService', 'mmrCommonService', 'mmrOrderFactory', 'mmrLoadingFactory', 'mmrAuth', 'apiService', 'mmrDataService',
  function($rootScope, $interval, $timeout, $interpolate, $state, $ionicModal, $ionicPopup, localStorageService, Validator, mmrMineFactory, mmrItemFactory, mmrCacheFactory, mmrEventing, mmrScrollService, $ionicScrollDelegate, mmrSearchService, $ionicActionSheet, mmrAddressService, mmrCommonService, mmrOrderFactory, mmrLoadingFactory, mmrAuth, apiService, mmrDataService) {

  return {

    createLoginModal: function(scope) {
      $ionicModal.fromTemplateUrl('templates/modal/login.html', {
        scope: scope
      }).then(function(modal) {
        scope.loginModal = modal;
        $rootScope.modals.loginModal = modal;

        scope.loginModal.show();

        // binding data
        scope.loginModal.sendCodeBtn = '获取验证码';
        scope.loginModal.data = {
          username: '',
          password: '',
          code: ''
        };

        scope.loginModal.viewMode = 1;

        scope.loginModal.doHideLogin = function() {
          scope.loginModal.remove();
          scope.loginModal = undefined;
        };

        scope.loginModal.doClick = function() {
          console.log('clicked');
        };

        scope.loginModal.getSwitchText = function() {
          if(scope.loginModal.viewMode === 1) {
            return "手机验证码登陆";
          } else {
            return "个人密码登陆";
          }
        };

        scope.loginModal.doSwitchLoginMode = function() {
          if(scope.loginModal.viewMode === 1) {
            scope.loginModal.viewMode = 2;
          } else {
            scope.loginModal.viewMode = 1;
          }
        };

        var intervalPromise;
        scope.loginModal.doFetchCode = function() {
          if(Validator.phone(scope.loginModal.data.username, true)) {
            // 4 means login
            mmrAuth.sendCode(scope.loginModal.data.username, 4).then(function() {
              // show the message has sent
              scope.loginModal.codeSent = true;
              // change the btn text
              var remainingSeconds = 60;
              scope.loginModal.sendCodeBtn = remainingSeconds + '秒';
              intervalPromise = $interval(function() {
                remainingSeconds -= 1;
                if(remainingSeconds === 0) {
                  scope.loginModal.sendCodeBtn = '获取验证码';
                } else {
                  scope.loginModal.sendCodeBtn = remainingSeconds + '秒';
                }
              }, 1000, 60);
            }, function(errMsg) {
              // sent failed
              if(errMsg === '手机号不存在') {
                mmrCommonService.help('手机号不存在', '此手机号不存在, 请尝试注册操作');
              } else {
                mmrCommonService.help('网络异常', '验证码发送失败, 请稍后重试');
              }
              scope.loginModal.codeSent = false;
            });
          }
        };

        scope.loginModal.doLogin = function() {
          if(Validator.phone(scope.loginModal.data.username, true)) {
            if((scope.loginModal.viewMode === 1 &&
               Validator.password(scope.loginModal.data.password, true)) ||
               (scope.loginModal.viewMode === 2 &&
               Validator.verifyCode(scope.loginModal.data.code, true))) {
              mmrAuth.login(scope.loginModal.data).then(function(res) {
                $timeout(function() {
                  mmrCommonService.help('登录成功', '恭喜您, 登录成功!');
                }, 100);
              }, function(errMsg) {
                if(errMsg === '用户不存在' || errMsg === '账号密码错误') {
                  mmrCommonService.help('登录失败', '用户名或者密码错误, 请重新尝试');
                }
              });
            }
          }

          // TODO: show the bind modal if necessary (old user only)
          // if($rootScope.$root.isOldUser) {
          //   $ionicModal.fromTemplateUrl('templates/modal/bind-old-user.html', {
          //     scope: scope
          //   }).then(function(modal) {
          //     scope.bindModal = modal;
          //     scope.bindModal.show();

          //     // data bindings
          //     scope.bindModal.data = {
          //       phone: '',
          //       code: ''
          //     };

          //     // methods for the bind modal
          //     scope.bindModal.doBind = function() {

          //     };

          //     scope.bindModal.doHideBind = function() {
          //       scope.bindModal.hide();
          //     };
          //   });
          // }
        };

        scope.loginModal.doRegister = function() {
          mmrEventing.doOpenRegister();
        };

        // event handler
        scope.$on('doLoginSuccessfully', function($event) {
          // close the login
          if(scope.loginModal) {
            scope.loginModal.doHideLogin();
          }
        });

        scope.$on('$destroy', function($event) {
          if(intervalPromise) {
            $interval.cancel(intervalPromise);
          }
        });
      });
    },

    createMyReceiptModal: function(scope) {
      var self = this;
      $ionicModal.fromTemplateUrl('templates/modal/my-receipt.html', {
        scope:scope,
        animation: 'slide-in-right'
      }).then(function(modal) {
        $rootScope.modals.receiptModal = modal;
        modal.show();

        // empty content
        modal.words = ['暂无发票'];
        modal.additionalClass = 'my-receipt-empty';

        modal.tab = 0;
        modal.switchTab = function(tabIdx) {
          modal.tab = tabIdx;
          isEmpty(tabIdx);
        };

        //methods
        modal.doHideReceipt = function() {
          modal.hide();
        };

        modal.getExplain = function(receipt) {
          switch(receipt.status) {
            case 0:
              return '有效';
            case 1:
              return '过期';
            case 2:
              return '审核未通过';
          }
        };

        modal.doAdd = function(tab) {
          self.createReceiptDetailModal(scope,tab);
        };

        init();
        function init() {
          modal.receipts = mmrMineFactory.receiptDetails();
        }

        //is empty function
        isEmpty(modal.tab);
        function isEmpty(tab) {
          modal.isEmpty = modal.receipts[tab].length === 0 ? true : false;
        }
      });
    },

    createReceiptDetailModal: function(scope,tab) {
      var receiptTemplate = (tab === 0) ? 'receipt-usual-detail' : 'receipt-special-detail';

          $ionicModal.fromTemplateUrl('templates/modal/'+receiptTemplate+'.html', {
            scope: scope,
            animation: 'slide-in-right'
          }).then(function(modal) {
            $rootScope.modals.receiptDetailModal = modal;
            $rootScope.modals.receiptDetailModal.show();

            //methods
            $rootScope.modals.receiptDetailModal.doHideReceiptUsl = function() {
              $rootScope.modals.receiptDetailModal.hide();
            };

            $rootScope.modals.receiptDetailModal.doCreateReceipt = function() {
              //save data

            };
          });
    },

    createMyCollectModal: function(scope, tab) {
      $ionicModal.fromTemplateUrl('templates/modal/my-collect.html', {
        scope: scope
      }).then(function(modal) {
        $rootScope.modals.collectModal = modal;
        modal.show();

        // binding data
        modal.sortEventName = 'eventCollectSort';
        modal.sortActivated = false;
        modal.screenEventPrefix = 'eventCollectScreen';

        // options bar related
        scope.optionsBarOpened = true;

        modal.screenActivated = false;
        // backdrop isShow
        modal.isShow = false;

        //methods
        modal.doHide = function() {
          modal.hide();
        };

        modal.switchTab = function(tabIdx) {
          modal.tab = tabIdx;
          init(tabIdx);
        };

        modal.doTapBackdrop = function() {
          // reset all
          modal.sortActivated = false;
        };

        // scroll related
        scope.onScroll = function() {

          mmrScrollService.onScroll({
            handler: 'favScroll',
            onDowning: function() {
              scope.optionsBarOpened = false;
            },
            onUping: function() {
              scope.optionsBarOpened = true;
            },
            onNegative: function() {
              scope.optionsBarOpened = true;
            }
          });
        };

        // sorter related
        modal.activateSort = function() {
          modal.screenActivated = false;
          modal.sortActivated = !modal.sortActivated;
          modal.isShow = modal.sortActivated;

        };

        // screener related
        modal.activateScreen = function() {
          modal.sortActivated = false;
          modal.screenActivated = !modal.screenActivated;
          modal.isShow = modal.sortActivated;
        };

        // event handler
        scope.$on(modal.sortEventName, function($event, data) {
          // process on sorting event
          scope.sortMethod = data;
          modal.myFav  = mmrDataService.sortItems(modal.myFav, scope.sortMethod);
          console.log('log');
          // close bacdrop
          modal.isShow = false;
        });

        scope.$on(modal.screenEventPrefix + 'SelectItem', function($event, data) {

        });

        scope.$on('eventHideBackdrop', function($event) {
          modal.sortActivated = false;
          modal.screenActivated = false;
        });

        scope.$on(modal.screenEventPrefix + 'Reset', function($event, data) {
          // make all selected flag to false
          _.forEach(modal.tags, function(tag) {
            _.forEach(tag.items, function(item) {
              item.selected = false;
            });
          });
        });

        scope.$on(modal.screenEventPrefix + 'Confirm', function($event, data) {
          // confirm logic

          // hide the screen popup
          modal.activateScreen();
        });

        function init(tab) {
          modal.myFav = mmrMineFactory.myFav(tab);
          modal.words = ['您还没有任何收藏，快去收藏吧！'];
          modal.isShow = false;
          modal.sortActivated = false;
          modal.screenActivated = false;
          modal.additionalClass = tab === 0 ? 'm-collect-empty-product' : 'm-collect-empty-shop';
          modal.isEmpty = modal.myFav.length === 0 ? true : false;
        }

        modal.switchTab(tab);
      });
    },

    createShopDetailModal: function(scope, item) {
      $ionicModal.fromTemplateUrl('templates/modal/shop-detail.html', {
        scope: scope
      }).then(function(modal) {
        scope.shopDetailModal = modal;
        scope.shopDetailModal.show();
        //bind data
        scope.shopDetailModal.classifications = [
          { name: '牛肉' },
          { name: '羊肉' },
          { name: '猪肉' },
          { name: '牛胫骨' },
          { name: 'category4' },
          { name: 'category4' },
          { name: 'category4' },
          { name: 'category4' },
          { name: 'category4' },
          { name: 'category4' },
          { name: 'category5' }
        ];

        scope.shopDetailModal.hotKeywords = [
          '热词','排骨','猪肉','牛排'
        ];

        modal.sortEventName = 'eventProductsSort';
        modal.sortActivated = false;
        modal.screenEventPrefix = 'eventProductsScreen';
        modal.screenActivated = false;
        modal.sorters = [
          { 'text': '智能排序' },
          { 'text': '价格从高到低' },
          { 'text': '价格从低到高' },
          { 'text': '销量从高到低' },
          { 'text': '销量从低到高' }
        ];

        modal.tags = [
          { title: '品牌', items: mmrCacheFactory.get('brands') },
          { title: '产品属性', items: mmrCacheFactory.get('attributes') }
        ];

        // backdrop isShow
        modal.isShow = false;

        // menu related
        modal.currentLevel = 0;
        modal.menuOpened = false;
        modal.menuHeight = 0;

        //methods
        modal.doHide = function() {
          modal.hide();
        };

        // search related
        modal.searchResults = [];
        modal.searchInputFocused = false;

        modal.doFocusSearchInput = function() {
          modal.searchInputFocused = true;
          //$rootScope.$root.ui.tabsHidden = true;

          // hide the sort/screen/menu
          modal.sortActivated = false;
          modal.screenActivated = false;
          modal.menuOpened = false;
          modal.isShow = false;
        };

        modal.doBlurSearchInput = function($event) {
          modal.searchInputFocused = false;
        };

        // sorter related
        modal.activateSort = function() {
          modal.screenActivated = false;
          modal.sortActivated = !modal.sortActivated;
          modal.isShow = modal.sortActivated;
          // close menu
          //scope.swipeMenu(false);
        };

        modal.swipeMenu = function(open) {
          modal.menuOpened = open;
          modal.isShow = open;
          // control the tab

        };

        // screener related
        modal.activateScreen = function() {
          modal.sortActivated = false;
          modal.screenActivated = !modal.screenActivated;
          modal.isShow = modal.sortActivated;
        };

        // scroll related
        scope.scrollToTop = function() {
          $ionicScrollDelegate.scrollTop(true);
          modal.showBacktoTopBtn = false;
        };

        modal.onScroll = function() {
          mmrScrollService.onScroll({
            handler: 'shopItemsScroll',
            threshold: 150,
            onThreshold: function(isGreaterThanThreshold) {
              scope.$apply(function() {
                if(isGreaterThanThreshold) {
                  modal.showBacktoTopBtn = true;
                } else {
                  modal.showBacktoTopBtn = false;
                }
              });
            }
          });
        };

        //event handler
        scope.$on(modal.sortEventName, function($event, data) {
          // after selecting the new sorting method
          modal.isShow = false;
        });

        scope.$on('eventHideBackdrop', function($event) {
          modal.sortActivated = false;
          modal.screenActivated = false;
          modal.menuOpened = false;
        });

        scope.$on(modal.screenEventPrefix + 'SelectItem', function($event, data) {

        });

        scope.$on(modal.screenEventPrefix + 'Reset', function($event, data) {
          // make all selected flag to false
          _.forEach(modal.tags, function(tag) {
            _.forEach(tag.items, function(item) {
              item.selected = false;
            });
          });
        });

        scope.$on(modal.screenEventPrefix + 'Confirm', function($event, data) {
          // confirm logic
          // hide the screen popup
          modal.activateScreen();
        });

        modal.switchTab = function(tabIdx) {
          modal.tab = tabIdx;
        };

        init();
        function init() {
          mmrDataService.request(mmrItemFactory.search({
            page: 0
          })).then(function(res) {
            modal.items = res[0];
          }, function(err) {

          });
        }
        modal.shop = item;
        modal.switchTab(0);
      });
    },

    createPersonalInfoModal: function(scope) {
      $ionicModal.fromTemplateUrl('templates/modal/personal-info.html', {
        scope: scope,
        animation: 'slide-in-right'
      }).then(function(modal) {
        $rootScope.modals.pInfoModal = modal;
        $rootScope.modals.pInfoModal.show();

        // binding data

        // methods
        $rootScope.modals.pInfoModal.doHidePInfo = function() {
          $rootScope.modals.pInfoModal.hide();
        };

        $rootScope.modals.pInfoModal.doModifyAvatar = function() {

        };

        $rootScope.modals.pInfoModal.doModifyAttribute = function(type, origNgModel, title, noNeedValidation) {
          // copy the scope value to temp
          var targetField = origNgModel.substring(origNgModel.lastIndexOf('.') + 1),
              tempNgModel = targetField + 'Temp';
          $rootScope.modals.pInfoModal.temp = $rootScope.modals.pInfoModal.temp || {};

          if(type === 'date') {
            var interpolatedDate = $interpolate('{{ ' + origNgModel + ' }}')(scope);
            $rootScope.modals.pInfoModal.temp[tempNgModel] = new Date(interpolatedDate.substring(1, interpolatedDate.indexOf('T')));
          } else {
            $rootScope.modals.pInfoModal.temp[tempNgModel] = $interpolate('{{ ' + origNgModel + ' }}')(scope);
          }

          // show the popup for user to input
          showAttributePopup(type, '$rootScope.modals.pInfoModal.temp.' + tempNgModel, title).then(function(res) {
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
          // remove the prefixing '$rootScope.'
          ngModel = ngModel.substring(ngModel.indexOf('.') + 1);

          return $ionicPopup.show({
            template: '<input type="' + type + '" ng-model="' + ngModel + '">',
            title: title,
            scope: scope,
            buttons: [
              { text: '取消' },
              {
                text: '<b>保存</b>',
                type: 'button-energized',
                onTap: function(e) {
                  var fieldValue = $interpolate('{{ ' + ngModel + ' }}')(scope);
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
    },

    createAddressModal: function(scope, currentAddress, addressType) {
      $ionicModal.fromTemplateUrl('templates/modal/my-address.html', {
        scope: scope,
        animation: 'slide-in-right'
      }).then(function(modal) {
        $rootScope.$root.modals.addressModal = modal;
        modal.show();

        // bind data
        modal.currentAddress = currentAddress;
        if(currentAddress) {
          modal.addressCheckboxes = mmrAddressService.generateAddressCheckboxes(currentAddress);
        }

        modal.isEditing = false;

        // methods
        modal.doHide = function() {
          modal.hide();
        };

        modal.doSelectAddress = function(address, $index) {
          modal.addressCheckboxes = _.map(modal.addressCheckboxes, function(element) {
            return false;
          });
          modal.addressCheckboxes[$index] = true;

          // emit the event and close the modal
          mmrEventing.doChangeAddress({
            address: address,
            type: addressType
          });
          modal.doHide();
        };

        modal.doOpenAddressDetail = function(address) {
          createAddressDetailModal(scope, address);
        };

        modal.doAdd = function() {
          createAddressDetailModal(scope, {}, true);
        };

        function createAddressDetailModal(scope, address, isEditing) {
          $ionicModal.fromTemplateUrl('templates/modal/my-address-detail.html', {
            scope: scope,
            animation: 'slide-in-right'
          }).then(function(modal) {
            $rootScope.$root.modals.addressDetailModal = modal;
            modal.show();

            // cache
            localStorageService.bind($rootScope, 'districts');
            localStorageService.bind($rootScope, 'cities');

            // bind data
            modal.isEditing = isEditing || false;
            modal.address = angular.copy(address);

            // methods
            modal.doHide = function() {
              modal.hide();
            };

            modal.doToggleEditing = function() {
              if(!$rootScope.$root.modals.addressDetailModal.isEditing) {
                $rootScope.$root.modals.addressDetailModal.isEditing = true;
              } else {
                // validate the address

                // save the editings
                $rootScope.$root.modals.addressDetailModal.doHide();
              }
            };

            modal.removeAddress = function() {
              $ionicPopup.confirm({
                title: '确定要删除此条地址吗',
                okText: '删除',
                cancelText: '取消',
                okType: 'button-assertive'
              }).then(function(res) {
                if(res) {
                  // delete the address
                }
              });
            };

            modal.defaultAddress = function() {
              $ionicPopup.confirm({
                title: '确定要将此地址设置为默认地址吗',
                okText: '确定',
                cancelText: '取消'
              }).then(function(res) {
                if(res) {
                  // make the address as default
                }
              });
            };
          });
        }
      });
    },

    createSecurityModal: function(scope) {
      $ionicModal.fromTemplateUrl('templates/modal/my-security.html', {
        scope: scope,
        animation: 'slide-in-right'
      }).then(function(modal) {
        $rootScope.modals.securityModal = modal;
        $rootScope.modals.securityModal.show();

        // bind data


        // methods
        $rootScope.modals.securityModal.doHide = function() {
          modal.hide();
        };

        $rootScope.modals.securityModal.doChangePassword = function() {
          // open the change password modal view
          createChangePasswordModal(scope);
        };

        function createChangePasswordModal(scope) {
          $ionicModal.fromTemplateUrl('templates/modal/my-change-password.html', {
            scope: scope,
            animation: 'slide-in-right'
          }).then(function(modal) {
            $rootScope.modals.changePasswordModal = modal;
            $rootScope.modals.changePasswordModal.show();

            // bind data

            // methods
            $rootScope.modals.changePasswordModal.doHide = function() {
              modal.hide();
            };

            $rootScope.modals.changePasswordModal.doChangePassword = function() {
              // validate current fields

              // show the successful msg when finished
              $ionicPopup.show({
                template: '<div class="m-msg-cong"><img ng-src="img/common/check.png"/><div>' +
                '<span class="energized m-msg-cong-title">恭喜您！</span>' +
                '<span class="m-msg-cong-subtitle">请牢记您的新密码。</span></div></div>',
                title: '修改密码成功',
                scope: scope,
                buttons: [
                  {
                    text: '<b>确定</b>',
                    type: 'button-energized',
                    onTap: function(e) {
                      // event handler when user confirm
                    }
                  }
                ]
              });
            };
          });
        }
      });
    },

    // order detail modal view
    createOrderDetailModal: function(scope, item) {
      $ionicModal.fromTemplateUrl('templates/modal/order-detail.html', {
        scope: scope,
        animation: 'slide-in-right'
      }).then(function(modal) {
        $rootScope.$root.modals.orderDetailModal = modal;
        $rootScope.$root.modals.orderDetailModal.show();

        // bind data
        $rootScope.$root.modals.orderDetailModal.item = item;

        // methods
        $rootScope.$root.modals.orderDetailModal.doHide = function() {
          modal.hide();
        };
      });
    },

    // order receipt list modal view
    createReceiptListModal: function(scope, item) {
      $ionicModal.fromTemplateUrl('templates/modal/receipt-list.html', {
        scope: scope,
        animation: 'slide-in-right'
      }).then(function(modal) {
        $rootScope.$root.modals.receiptListModal = modal;
        modal.show();

        //binding data
        // modal.item = item;
        modal.item = mmrMineFactory.receiptDetails();

        modal.doHide = function() {
          modal.hide();
        };
      });
    },

    // apply service modal view
    createApplyServiceModal: function(scope, item) {
      $ionicModal.fromTemplateUrl('templates/modal/apply-service.html', {
        scope: scope,
        animation: 'slide-in-right'
      }).then(function(modal) {
        $rootScope.$root.modals.applyServiceModal = modal;
        $rootScope.$root.modals.applyServiceModal.show();

        //bind data
        $rootScope.$root.modals.applyServiceModal.item = item;
        $rootScope.$root.modals.applyServiceModal.applyServNum = '01123344';

        //methods
        $rootScope.$root.modals.applyServiceModal.doHide = function() {
          modal.hide();
        };

        $rootScope.$root.modals.applyServiceModal.doSubmit = function(applyServNum) {
          $ionicPopup.show({
            template: '<div class="m-msg-cong">' +
                '<span class="m-msg-cong-subtitle">售后订单处理编号为：'+applyServNum+'</span>' +
                '<span class="m-msg-cong-subtitle">请在个人中心-我的售后中查询处理进度</span></div>',
            title: '您的售后申请已提交',
            scope: scope,
            buttons: [
              {
                text: '<b>查看我的售后</b>',
                    type: 'button-energized',
                    onTap: function(e) {
                      // event handler when user confirm
                    }
              }
            ]
          });
        };
      });
    },

    createItemDetailModal: function(scope, item) {
      var self = this;
      $ionicModal.fromTemplateUrl('templates/modal/item/item-detail.html', {
        scope: scope,
        animation: 'slide-in-right'
      }).then(function(modal) {
        modal.show();

        // bind data
        scope.itemModal = scope.itemModal || {};
        scope.itemModal.item = mmrSearchService.itemDetail(item);
        // bind methods
        scope.itemModal.doHide = function() {
          modal.hide();
        };

        scope.itemModal.doOpenHeaderMenu = function() {

        };

        scope.itemModal.doLoadMoreReviews = function() {
          self.createItemReviews(scope, item);
        };

        scope.itemModal.doEnterShop = function() {
          if (scope.shopDetailModal && !scope.shopDetailModal.scope.$$destroyed) {
            scope.shopDetailModal.shop = item.shop;
            scope.shopDetailModal.show();
          } else{
            self.createShopDetailModal(scope, item.shop);
          }
        };

        // event handlers
        scope.$on('doStateToCart', function($event, data) {
          scope.itemModal.doHide();
          $state.go('tab.cart', {
            tab: item.isReserved ? 0 : 1
          });
        });

        scope.$on('doBuyImmediately', function($event, data) {
          scope.itemModal.showBackdrop = true;
        });

        scope.$on('doCancelBuyImmediately', function($event, data) {
          scope.itemModal.showBackdrop = false;
        });
      });
    },

    createItemReviews: function(scope, item) {
      $ionicModal.fromTemplateUrl('templates/modal/item/item-reviews.html', {
        scope: scope,
        animation: 'slide-in-right'
      }).then(function(modal) {
        modal.show();
        $rootScope.$root.modals.itemReviewsModal = modal;

        // define tabs
        modal.tabs = [
          { text: '全部' },
          { text: '好评' },
          { text: '中评' },
          { text: '差评' }
        ];

        //bind data
        modal.item = mmrSearchService.itemReviews(item);
        // modal.item.review.comments = [];
        modal.tab = 0;

        //comment template
        modal.comment = modal.comment || {};
        modal.comment.rating = getRating(modal.tab);

        // define count of comment
        var all = modal.item.review.comments.length;
        var high = 0, medium = 0, low = 0;
        _.forEach(modal.item.review.comments, function(value, key) {
          switch(Number(value.rating)) {
            case 0:
              high++;
              break;
            case 1:
              medium++;
              break;
            case 2:
              low++;
              break;
          }
        });
        modal.tabs[0].text += '('+all+')';
        modal.tabs[1].text += '('+high+')';
        modal.tabs[2].text += '('+medium+')';
        modal.tabs[3].text += '('+low+')';
        // methods
        modal.doHide = function() {
          $rootScope.$root.modals.itemReviewsModal.hide();
        };

        modal.switchTab = function(tabIdx) {
          modal.comment.rating = getRating(tabIdx);
          modal.tab = tabIdx;
        };

        function getRating(tab) {
          switch(Number(tab)) {
            case 0:
              return '!!';
            case 1:
              return '0';
            case 2:
              return '1';
            case 3:
              return '2';
          }
        }

        // event handlers
        scope.$on('doStateToCart', function($event, data) {
          modal.doHide();
          $state.go('tab.cart', {
            tab: item.isReserved ? 0 : 1
          });
        });
      });
    },

    createGenerateOrderModal: function(scope, orders) {
      var self = this;
      $ionicModal.fromTemplateUrl('templates/modal/generate-order.html', {
        scope: scope,
        animation: 'slide-in-right'
      }).then(function(modal) {
        modal.show();
        $rootScope.$root.modals.genOrderModal = modal;

        // bind data
        $rootScope.$root.modals.genOrderModal.orders = orders;

        // bind methods
        modal.doHide = function() {
          modal.hide();
        };

        modal.doOpenHeaderMenu = function() {

        };

        modal.doModifyDelivery = function() {
          var hideSheet = $ionicActionSheet.show({
            buttons: [
              { text: '送货上门' },
              { text: '自提' }
            ],
            titleText: '修改配送方式',
            cancelText: '取消',
            cancel: function() {
            },
            buttonClicked: function(index) {
              switch(index) {
                case 0:
                modal.orders.delivery = '送货上门';
                  break;
                case 1:
                modal.orders.delivery = '自提';
                  break;
              }

              if ($rootScope.$root.modals.addressModal && !$rootScope.$root.modals.addressModal.scope.$$destroyed) {
                $rootScope.$root.modals.addressModal.currentAddress = orders.addresses.normal;
                $rootScope.$root.modals.addressModal.show();
              } else {
                 self.createAddressModal(scope, orders.addresses.normal, 'normal');
              }


              return true;
            }
          });
        };

        modal.doModifyReceipt = function() {
          var hideSheet = $ionicActionSheet.show({
            buttons: [
              { text: '增值税普通发票' },
              { text: '增值税专用发票' }
            ],
            titleText: '修改发票',
            cancelText: '取消',
            cancel: function() {
            },
            buttonClicked: function(index) {
              switch(index) {
                case 0:
                  modal.orders.receipt = '增值税普通发票';
                  break;
                case 1:
                  modal.orders.receipt = '增值税专用发票';
                  break;
              }

              if ($rootScope.$root.modals.receiptManagementModal && !$rootScope.$root.modals.receiptManagementModal.scope.$$destroyed) {
                $rootScope.$root.modals.receiptManagementModal.index = index;

                if (index === 0) {
                  $rootScope.$root.modals.receiptManagementModal.receipts = mmrMineFactory.receiptDetails()[0];
                }else {
                  $rootScope.$root.modals.receiptManagementModal.receipts = mmrMineFactory.receiptDetails()[1];
                }

                $rootScope.$root.modals.receiptManagementModal.show();
              } else {
                 self.createReceiptManagementModal(scope, index);
              }

              return true;
            }
          });
        };

        modal.doGenerate = function() {
          // calc the deadline payment time
          orders.deadline = new Date(new Date().getTime() + 1800000);

          mmrLoadingFactory.show('正在创建订单, 请稍等...');

          // call the order API to generate a new order
          mmrOrderFactory.generate().then(function(res) {
            mmrLoadingFactory.hide();
            if(res.status && res.status === 200) {
              // broadcast the generate event for cart orders
              if(!orders.isIndependentOrder) {
                mmrEventing.doNewOrderGenerated(orders);
              }

              // redirect to the checkout modal
              self.createCheckoutModal(scope, orders);
            }
          }, function(err) {
            mmrLoadingFactory.hide();
            mmrCommonService.help('错误信息', '生成订单的过程中发生了错误, 请稍后重试');
          });
        };

        // event handler
        $rootScope.$on('doChangeAddress', function($event, data) {
          if(data && data.type && data.address) {
            if(data.type === 'normal') {
              modal.orders.addresses.normal = data.address;
            } else if(data.type === 'quarantine') {
              modal.orders.addresses.quarantine = data.address;
            }
          }
        });

        $rootScope.$on('doCancelPayment', function($event, data) {
          // when the user cancel the payment for this order
          modal.remove();
        });
      });
    },

    createReceiptManagementModal: function(scope, index) {
      var self = this;
      $ionicModal.fromTemplateUrl('templates/modal/receiptManagement.html', {
        scope: scope,
        animation: 'slide-in-right'
      }).then(function(modal) {
        $rootScope.$root.modals.receiptManagementModal = modal;
        modal.show();

        // binding data
        if (index === 0) {
          modal.receipts = mmrMineFactory.receiptDetails()[0];
        }else {
          modal.receipts = mmrMineFactory.receiptDetails()[1];
        }
        modal.index = index;

        //method
        modal.doHide = function() {
          modal.hide();
        };

        modal.doSelectReceipt = function($index, tab) {
          modal.receiptCheckboxes[tab] = _.map(modal.receiptCheckboxes[tab], function(element) {
            return false;
          });
          modal.receiptCheckboxes[tab][$index] = true;

          modal.hide();
        };

        modal.doCreateReceipt = function(tab) {
          self.createReceiptDetailModal(scope, tab);
        };
      });
    },

    createCheckoutModal: function(scope, orders) {
      var self = this;
      $ionicModal.fromTemplateUrl('templates/modal/checkout.html', {
        scope: scope,
        animation: 'slide-in-right'
      }).then(function(modal) {
        modal.show();
        $rootScope.$root.modals.checkoutModal = modal;

        // bind data
        modal.orders = orders;
        modal.payments = [false, false, false];

        // bind methods
        modal.doClose = function() {
          // hint the user
          mmrCommonService.confirm('取消支付', '确定要取消支付吗？(稍后可以在订单页面中再次支付)').then(function(res) {
            if(res) {
              mmrEventing.doCancelPayment(orders);
              modal.remove();
            }
          });
        };

        modal.doShowDepositHint = function() {
          if(modal.payments[0] &&
            $rootScope.$root.pinfo.deposit < orders.money.summary) {
            return true;
          } else {
            return false;
          }
        };

        modal.doOpenHeaderMenu = function() {

        };

        modal.doCheckout = function() {
          self.createPayResultModal(scope, 1);
        };

        // watchers
        scope.$watch(function(scope) {
          return modal.payments[0];
        }, function(newValue, oldValue, scope) {
          if(newValue) {
            // when the deposit is enough
            if($rootScope.$root.pinfo.deposit >= orders.money.summary) {
              modal.payments[1] = false;
              modal.payments[2] = false;
            }
          }
        });

        scope.$watch(function(scope) {
          return modal.payments[1];
        }, function(newValue, oldValue, scope) {
          if(newValue) {
            modal.payments[2] = false;
            if($rootScope.$root.pinfo.deposit >= orders.money.summary) {
              modal.payments[0] = false;
            }
          }
        });

        scope.$watch(function(scope) {
          return modal.payments[2];
        }, function(newValue, oldValue, scope) {
          if(newValue) {
            modal.payments[1] = false;

            // if deposit is enough
            if($rootScope.$root.pinfo.deposit >= orders.money.summary) {
              modal.payments[0] = false;
            }
          }
        });
      });
    },

    createAddReviewModal: function(scope, item) {
      $ionicModal.fromTemplateUrl('templates/modal/addReview.html', {
        scope: scope,
        animation: 'slide-in-right'
      }).then(function(modal) {
        modal.show();
        $rootScope.$root.modals.addReviewModal = modal;

        //bind data
        modal.item = item;
        modal.items = [
          {text: '商品与描述相符'},
          {text: '卖家的服务态度'},
          {text: '物流服务的质量'}
        ];
        //method
        modal.doHide = function() {
          modal.hide();
        };
      });
    },

    createPreferredBrandModal: function(scope, index) {
      $ionicModal.fromTemplateUrl('templates/modal/preferredBrand.html', {
        scope: scope,
        animation: 'slide-in-right'
      }).then(function(modal) {
        modal.show();

        //bind data
        scope.preferredBrandModal = modal;
        modal.index = index;

        modal.items = mmrMineFactory.myFav(0);

        // method
        modal.doHide = function() {
          modal.hide();
        };

        // event handlers
        scope.$on('doStateToCart', function($event, data) {
          modal.doHide();
          $state.go('tab.cart', {
            tab: item.isReserved ? 0 : 1
          });
        });
      });
    },

    createPayResultModal: function(scope, status) {
      $ionicModal.fromTemplateUrl('templates/modal/payResult.html', {
        scope: scope,
        animation: 'slide-in-right'
      }).then(function(modal) {
        modal.show();
        $rootScope.modals.payResultModal = modal;

        //bind data
        modal.status = 0;
        modal.items = mmrMineFactory.myFav(0);

        //methods
        modal.doHide = function() {
          modal.hide();
        };

        modal.doCancelPayment = function() {
          console.log('payment cancel');
        };

        modal.doPayGoOn = function() {
          console.log('pay go on');
        };

        modal.doCheckOrder = function() {

        };

        modal.doBuyMore = function() {
          console.log('buy more');
        };

      });
    },

    createMyFootprintModal: function(scope) {
      $ionicModal.fromTemplateUrl('templates/modal/footprint.html', {
        scope: scope
      }).then(function(modal) {
        modal.show();
        $rootScope.modals.footprintModal = modal;

        //empty content
        modal.isEmpty = true;
        modal.words = ['暂无足迹'];
        modal.additionalClass = 'my-footprint-empty';
        modal.button = {
          text: '去逛逛',
          onTap: function() {
            console.log('log');
          }
        };

        //methods
        modal.doHide = function() {
          modal.hide();
        };

      });
    },

    createNotFoundModal: function(scope) {
      $ionicModal.fromTemplateUrl('templates/modal/404.html', {
        'scope': scope
      }).then(function(modal) {
        modal.show();
        $rootScope.modals.notFoundModal = modal;

        // methods
        modal.doHide = function() {
          modal.hide();
        };
      });
    }

  };

}]);
