angular.module('mmr.services')

.factory('mmrModal', ['$rootScope', '$interval', '$timeout', '$interpolate', '$state', '$ionicModal', '$ionicPopup', '$ionicListDelegate', 'localStorageService', 'Validator', 'mmrMineFactory', 'mmrItemFactory', 'mmrCacheFactory', 'mmrEventing', 'mmrScrollService', '$ionicScrollDelegate', 'mmrSearchService', '$ionicActionSheet', 'mmrAddressService', 'mmrCommonService', 'mmrOrderFactory', 'mmrLoadingFactory', 'mmrAuth', 'apiService', 'mmrDataService', 'mmrCartService', 'mmrReceiptService', 'mmrPayment', 'dateFilter', 'mmrUser',
  function($rootScope, $interval, $timeout, $interpolate, $state, $ionicModal, $ionicPopup, $ionicListDelegate, localStorageService, Validator, mmrMineFactory, mmrItemFactory, mmrCacheFactory, mmrEventing, mmrScrollService, $ionicScrollDelegate, mmrSearchService, $ionicActionSheet, mmrAddressService, mmrCommonService, mmrOrderFactory, mmrLoadingFactory, mmrAuth, apiService, mmrDataService, mmrCartService, mmrReceiptService, mmrPayment, dateFilter, mmrUser) {

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

            if($rootScope.$root.states.beforeLogin) {
              $state.go($rootScope.$root.states.beforeLogin);
              $rootScope.$root.states.beforeLogin = undefined;
            }
          }
        });

        scope.$on('$destroy', function($event) {
          if(intervalPromise) {
            $interval.cancel(intervalPromise);
          }
        });
      });
    },

    createMyReceiptModal: function(scope, selectedReceipt, initIdx) {
      var self = this;
      $ionicModal.fromTemplateUrl('templates/modal/my-receipt.html', {
        scope: scope,
      }).then(function(modal) {
        $rootScope.modals.receiptModal = modal;
        modal.show();

        // empty content
        modal.ec = {};
        modal.ec.words = ['暂无发票'];
        modal.ec.additionalClass = 'my-receipt-empty';

        modal.tab = initIdx - 1;
        modal.switchTab = function(tabIdx) {
          if(selectedReceipt) {
            return false;
          }

          modal.tab = tabIdx;
        };

        // send request
        mmrReceiptService.fetchReceiptList().then(function(res) {
          // prepare the checkboxes
          if(selectedReceipt) {
            modal.selectedReceipt = selectedReceipt;
            modal.receiptCheckboxes = mmrReceiptService.generateReceiptCheckboxes(selectedReceipt, initIdx);
          }
        }, function(err) {

        });

        //methods
        modal.doHideReceipt = function() {
          modal.hide();
        };

        modal.getExplain = function(receipt) {
          switch(Number(receipt.status)) {
            case 0:
              return '审核中';
            case 1:
              return '审核通过';
            case 2:
              return '审核失败';
            case 3:
              return '失败';
          }
        };

        modal.checkEmpty = function() {
          var container = $rootScope.$root.receipts[modal.tab === 0 ? 'usual' : 'special'];
          return !container || container.length === 0;
        };

        modal.doAdd = function(tab) {
          self.createReceiptDetailModal(scope, tab);
        };

        modal.remove = function(receipt) {
          // check whether can be removed
          if(_.has(receipt, 'taxpayer') && receipt.status == 0) {
            mmrCommonService.help('删除提示', '此发票正处于审核过程中, 无法删除');
            $ionicListDelegate.closeOptionButtons();
            return;
          }

          // confirm to remove
          mmrCommonService.confirm('确认删除', '确定要删除此条发票信息吗').then(function(res) {
            if(res) {
              mmrReceiptService.removeReceipt(receipt).then(function(res) {
                mmrCommonService.help('删除成功', '此发票已成功被删除');
              }, function(err) {
                mmrCommonService.help('删除失败', '删除此发票时发生了错误');
              })
            } else {
              $ionicListDelegate.closeOptionButtons();
            }
          })
        };

        modal.check = function(receipt) {
          receipt.showDetail = !receipt.showDetail;
        };

        modal.doSelectReceipt = function(receipt, $index) {
          if(selectedReceipt) {
            modal.receiptCheckboxes = _.map(modal.receiptCheckboxes, function(element) {
              return false;
            });
            modal.receiptCheckboxes[$index] = true;

            // emit the event and close the modal
            mmrEventing.doChangeReceipt({
              receipt: receipt
            });
            modal.doHideReceipt();
          }
        };
      });
    },

    createReceiptDetailModal: function(scope, tab) {
      var receiptTemplate = (tab === 0) ? 'receipt-usual-detail' : 'receipt-special-detail';

      $ionicModal.fromTemplateUrl('templates/modal/' + receiptTemplate + '.html', {
        scope: scope,
        animation: 'slide-in-right'
      }).then(function(modal) {
        $rootScope.modals.receiptDetailModal = modal;
        modal.show();

        if(tab === 0) {
          modal.usual = {
            type: 1
          };
        } else {
          modal.special = {
            type: 2
          };
        }

        //methods
        modal.doHideReceiptUsl = function() {
          modal.remove();
        };

        modal.doCreateReceipt = function(receipt) {
          // validate the receipt
          if(mmrReceiptService.validateReceipt(receipt)) {
            // hint the user it is not editable after creating
            mmrCommonService.confirm('注意事项', '发票一旦创建不可编辑，请确认信息无误并点击确认').then(function(res) {
              if(res) {
                // save data
                mmrReceiptService.createReceipt(receipt).then(function(res) {
                  mmrCommonService.help('创建成功', '成功创建了新的发票');
                  modal.doHideReceiptUsl();
                }, function(err) {
                  mmrCommonService.help('创建错误', '创建发票时发生了错误');
                });
              } else {
                // cancel process
              }
            });
          }
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
          if(tab === 0) {
            mmrDataService.request(mmrItemFactory.footprintList({
              uid: $rootScope.$root.pinfo.uid,
              type: 3
            })).then(function(res) {
              if (res[0] === 'null') {
                modal.myFavItems = null;
                modal.isEmpty = true;
              } else {
                modal.myFavItems = res[0];
                modal.isEmpty = false;
              }
          }, function(err) {

          });
          } else {
            mmrDataService.request(mmrItemFactory.footprintList({
              uid: $rootScope.$root.pinfo.uid,
              type: 4
            })).then(function(res) {
              if (!Array.isArray(res[0])) {
                modal.myFavShops = null;
                modal.isEmpty = true;
              } else {
                modal.myFavShops = res[0];
                modal.isEmpty = false;
              }
            }, function(err) {

            });
          }

          // sorter and screener initialize
          modal.isShow = false;
          modal.sortActivated = false;
          modal.screenActivated = false;

          // empty content related
          modal.words = ['您还没有任何收藏，快去收藏吧！'];
          modal.additionalClass = tab === 0 ? 'm-collect-empty-product' : 'm-collect-empty-shop';

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
          modal.remove();
        };

        // search related
        modal.searchResults = [];
        modal.searchInputFocused = false;
        scope.searchNoResult = false;
        scope.page = 1;
        scope.isLoadingMore = false;

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
          modal.menuOpened = false;
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

        // options bar related
        scope.optionsBarOpened = true;
        scope.onTop = false;
        modal.onScroll = function() {
          mmrScrollService.onScroll({
            handler: 'shopItemsScroll',
            threshold: 150,
            offHeight: 42,
            onDowning: function() {
              scope.optionsBarOpened = false;
            },
            onUping: function() {
              scope.optionsBarOpened = true;
            },
            onNegative: function() {
              scope.optionsBarOpened = true;
            },
            onTop: function() {
              scope.onTop = true;
            },
            offTop: function() {
              scope.onTop = false;
            },
            onThreshold: function(isGreaterThanThreshold) {
              scope.$apply(function() {
                if(isGreaterThanThreshold) {
                  scope.showBacktoTopBtn = true;
                } else {
                  scope.showBacktoTopBtn = false;
                }
              });
            }
          });
        };

        // inifinite scroll related
        scope.moreDataCanBeLoaded = function() {
          if(!scope.searchNoResult) {
            return true;
          }

          return false;
        };

        scope.loadMore = function() {
          scope.isLoadingMore = true;

          mmrDataService.request(mmrItemFactory.search({
            sid: item.id,
            page: scope.page
          })).then(function(res) {
            if(res[0] !== 'null' && res[0] instanceof Array) {
              modal.items = modal.items.concat(res[0]);
              scope.page += 1;
              scope.searchNoResult = false;
            } else {
              scope.searchNoResult = true;
            }
            scope.isLoadingMore = false;
            scope.$broadcast('scroll.infiniteScrollComplete');
          }, function(err) {

          });
        };

        modal.switchTab = function(tabIdx) {
          modal.tab = tabIdx;
        };

        // TODO: refactor, make doGetCartCount a common method
        modal.doGetCartCount = function() {
          if($rootScope.$root.cart.totalCount >= 100) {
            return '99+';
          }

          return $rootScope.$root.cart.totalCount;
        };

        modal.doTransToCart = function() {
          mmrEventing.doStateToCart();
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

        scope.$on('doStateToCart', function($event, data) {
          modal.doHide();
          $state.go('tab.cart', {
            tab: 1
          });
        });

        init();
        function init() {
          mmrDataService.request(mmrItemFactory.search({
            sid: item.id
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
          // check whether this feature is supported
          if($rootScope.$root.platform === 'browser') {
            return;
          }

          // whether the user has login
          if(!$rootScope.$root.authenticated) {
            mmrCommonService.help('状态异常', '请检查登录状态');
            return;
          }

          mmrUser.doChangeAvatar();
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
                sendRequest(targetField, res);
              } else {
                // when the validation is failed
              }
            } else {
              // when validation is not needed, save the attribute into server
              sendRequest(targetField, res);
            }

            function sendRequest(targetField, targetValue) {
              // convert date to string
              if(targetValue instanceof Date) {
                targetValue = dateFilter(targetValue, 'yyyy-MM-dd');
              }

              var vo = {};
              vo[targetField] = targetValue;

              mmrAuth.pinfo(vo).then(function() {
                $rootScope.$root.pinfo[targetField] = targetValue;
              }, function(err) {

              });
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
      var self = this;

      $ionicModal.fromTemplateUrl('templates/modal/my-address.html', {
        scope: scope,
        animation: 'slide-in-right'
      }).then(function(modal) {
        $rootScope.$root.modals.addressModal = modal;
        modal.show();

        // bind data
        if(currentAddress) {
          modal.currentAddress = currentAddress;
          modal.addressCheckboxes = mmrAddressService.generateAddressCheckboxes(currentAddress);
        }

        modal.isEditing = false;

          // empty content related
        modal.ec = {};
        modal.ec.words = ['暂时还没有地址噢, 赶快去创建一个吧 :)'];
        modal.ec.additionalClass = 'm-addresses-empty';

        // send request
        mmrAddressService.fetchAddressList().then(function(res) {
          // process the result list if necessary
        }, function(err) {

        });

        // methods
        modal.doHide = function() {
          modal.hide();
        };

        modal.doSelectAddress = function(address, $index) {
          if(currentAddress) {
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
          }
        };

        modal.doOpenAddressDetail = function(address, $index, forceEdit) {
          if(currentAddress && !forceEdit) {
            modal.doSelectAddress(address, $index);
          } else {
            self.createAddressDetailModal(scope, address, false, true);
          }
        };

        modal.doAdd = function() {
          self.createAddressDetailModal(scope, {}, true);
        };
      });
    },

    createAddressDetailModal: function(scope, address, isEditing, isUpdating, isDirectUse) {
      $ionicModal.fromTemplateUrl('templates/modal/my-address-detail.html', {
        scope: scope,
        animation: 'slide-in-right'
      }).then(function(modal) {
        $rootScope.$root.modals.addressDetailModal = modal;
        modal.show();

        // bind data
        modal.isEditing = isEditing || false;
        modal.isUpdating = isUpdating || false;
        modal.isDirectUse = isDirectUse || false;
        modal.address = angular.copy(address);

        // methods
        modal.doHide = function() {
          modal.remove();
        };

        modal.doToggleEditing = function() {
          if(!modal.isEditing) {
            modal.isEditing = true;
          } else {
            // validate the address
            if(mmrAddressService.validateAddress(modal.address)) {
              if(!modal.address.id) {
                // save the address
                mmrAddressService.createAddress(modal.address).then(function(res) {
                  if(res.id) {
                    if(modal.isDirectUse) {
                      mmrEventing.doUseNewlyCreatedAddress(res);
                    }

                    mmrCommonService.help('创建成功', '新的地址已经创建成功');
                    modal.doHide();
                  }
                }, function(err) {

                });
              } else {
                // update the address
                mmrAddressService.updateAddress(modal.address).then(function(res) {
                  if(res.id) {
                    mmrCommonService.help('更新成功', '新的地址已经更新成功');
                    modal.doHide();
                  }
                }, function(err) {

                });
              }
            }
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
              mmrAddressService.removeAddress(modal.address.id).then(function() {
                mmrCommonService.help('删除成功', '地址已经删除成功');
                modal.doHide();
              }, function(err) {

              });
            }
          });
        };

        modal.defaultAddress = function(setDefault) {
          var title = setDefault ? '确定要将此地址设置为默认地址吗' : '确定要取消此地址为默认地址吗';
          $ionicPopup.confirm({
            title: title,
            okText: '确定',
            cancelText: '取消',
            okType: 'button-energized'
          }).then(function(res) {
            if(res) {
              modal.address.isDefault = setDefault;
              if(!modal.isEditing) {
                // save the address
                mmrAddressService.updateAddress(modal.address).then(function(res) {
                  if(res.id) {
                    mmrCommonService.help('更新默认地址成功', '此地址已经被设置为默认地址');
                    modal.doHide();
                  }
                }, function(err) {

                });
              }
            }
          });
        };
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
            modal.sendCodeBtn = '获取验证码';
            modal.password = {
              code: '',
              next: '',
              nextConfirm: ''
            };

            // methods
            $rootScope.modals.changePasswordModal.doHide = function() {
              modal.hide();
            };

            $rootScope.modals.changePasswordModal.doChangePassword = function() {
              // validate current fields
              if(Validator.verifyCode(modal.password.code, true) &&
                 Validator.password(modal.password.next, true) &&
                 Validator.password(modal.password.nextConfirm, true)) {
                // check whether two passwords are the same
                if(modal.password.next === modal.password.nextConfirm) {
                  // check uid
                  var uid = $rootScope.$root.pinfo.uid;
                  if(!uid) {
                    mmrCommonService.help('用户状态异常', '您可能没有登录, 请重新登录');
                  } else {
                    // send request
                    mmrAuth.password({
                      id: uid,
                      password: modal.password.next,
                      code: modal.password.code
                    }).then(function() {
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
                    }, function(errMsg) {
                      // password modify failed
                      mmrCommonService.help('修改失败', errMsg);
                    });
                  }
                } else {
                  mmrCommonService.help('两次密码不一致', '请确保两次输入的密码相同');
                }
              }
            };

            $rootScope.modals.changePasswordModal.doSendCode = function() {
              // check whether phone exists
              if(Validator.phone($rootScope.$root.pinfo.phone, true)) {
                // 6 means change password
                mmrAuth.sendCode($rootScope.$root.pinfo.phone, 6).then(function() {
                  // change the btn text
                  var remainingSeconds = 60;
                  modal.sendCodeBtn = remainingSeconds + '秒';
                  intervalPromise = $interval(function() {
                    remainingSeconds -= 1;
                    if(remainingSeconds === 0) {
                      modal.sendCodeBtn = '获取验证码';
                    } else {
                      modal.sendCodeBtn = remainingSeconds + '秒';
                    }
                  }, 1000, 60);
                }, function() {
                  // sent failed
                  mmrCommonService.help('网络异常', '验证码发送失败, 请稍后重试');
                });
              }
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
    createReceiptListModal: function(scope, orders, type) {
      $ionicModal.fromTemplateUrl('templates/modal/receipt-list.html', {
        scope: scope
      }).then(function(modal) {
        $rootScope.$root.modals.receiptListModal = modal;
        modal.show();

        //binding data
        modal.receiptType = (type === '增值税普通发票') ? 1 : 2;
        modal.orders = orders;
        modal.calcResults = undefined;

        // binding methods
        modal.check = function(receipt) {
          receipt.showDetail = !receipt.showDetail
        };

        modal.doHide = function() {
          modal.hide();
        };

        // send request
        mmrReceiptService.calcReceipt(_.flatten(_.map(orders, function(order) {
          return order.items;
        })), modal.receiptType).then(function(res) {
          modal.calcResults = res;
          console.log(modal.calcResults);
        }, function(err) {
          mmrCommonService.help('获取信息错误', err);
        });
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
        scope.itemModal.item = item;

        // bind methods
        scope.itemModal.doHide = function() {
          modal.remove();
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
        modal.orders = orders;
        modal.selectedReceipt = undefined;

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
              if(modal.addressIdx === index) {
                return true;
              }

              modal.addressIdx = index;
              if(index === 1) {
                modal.orders.addresses.normal = undefined;
              } else {
                modal.orders.addresses.normal = _.find($rootScope.$root.addresses, function(address) {
                  return address.isDefault;
                });
              }

              switch(index) {
                case 0:
                  modal.orders.delivery = '送货上门';
                  if ($rootScope.$root.modals.addressModal && !$rootScope.$root.modals.addressModal.scope.$$destroyed) {
                    $rootScope.$root.modals.addressModal.currentAddress = orders.addresses.normal;
                    $rootScope.$root.modals.addressModal.show();
                  } else {
                     self.createAddressModal(scope, orders.addresses.normal, 'normal');
                  }
                  break;
                case 1:
                  modal.orders.delivery = '自提';
                  // send request to load warehouse information
                  $timeout(function() {
                    mmrAddressService.fetchWarehouseList().then(function(res) {
                      if(res.msg instanceof Array && res.msg.length > 0) {
                        // show the warehouse to let user choose
                        var candidates = _.map(res.msg, function(warehouse) {
                          return {
                            text: warehouse.house_name + '-' + warehouse.address,
                            id: warehouse.id,
                            name: warehouse.house_name,
                            address: warehouse.address,
                            self: true
                          };
                        });
                        $ionicActionSheet.show({
                          buttons: candidates,
                          titleText: '选择自提点',
                          cancelText: '取消',
                          cancel: function() {
                            // fall back to the delivery
                            fallbackToDelivery();
                          },
                          buttonClicked: function(index) {
                            mmrEventing.doSelectSelfPickAddress(candidates[index]);
                            return true;
                          }
                        });
                      } else {
                        mmrCommonService.help('无法选择自提', '当前城市暂不支持自提方式，请选择送货上门');
                        fallbackToDelivery();
                      }
                    }, function(err) {
                      mmrCommonService.help('发生错误', '在获取自提点信息期间发生了错误，请重试');
                      fallbackToDelivery();
                    });
                  }, 500);
                  break;
              }

              return true;
            }
          });
        };

        modal.doModifyReceipt = function() {
          var hideSheet = $ionicActionSheet.show({
            buttons: [
              { text: '不需要发票' },
              { text: '增值税普通发票' },
              { text: '增值税专用发票' }
            ],
            titleText: '修改发票',
            cancelText: '取消',
            cancel: function() {
            },
            buttonClicked: function(index) {
              if(modal.receiptIdx === index) {
                return true;
              }

              modal.receiptIdx = index;

              // remove current selected receipt
              modal.orders.selectedReceipt = undefined;

              switch(index) {
                case 0:
                  modal.orders.receipt = '不需要发票';
                  break;
                case 1:
                  modal.orders.receipt = '增值税普通发票';
                  break;
                case 2:
                  modal.orders.receipt = '增值税专用发票';
                  break;
              }

              if(index === 1 || index === 2) {
                // cancel the receipt address
                mmrEventing.doToggleReceiptAddress(false);
                // if ($rootScope.$root.modals.receiptManagementModal && !$rootScope.$root.modals.receiptManagementModal.scope.$$destroyed) {
                //   $rootScope.$root.modals.receiptManagementModal.index = index;

                //   if (index === 0) {
                //     $rootScope.$root.modals.receiptManagementModal.receipts = $rootScope.$root.receipts.usual;
                //   } else {
                //     $rootScope.$root.modals.receiptManagementModal.receipts = $rootScope.$root.receipts.special;
                //   }

                //   $rootScope.$root.modals.receiptManagementModal.show();
                // } else {
                //    self.createReceiptManagementModal(scope, index);
                // }
              } else if(index === 0) {
                // cancel the receipt address
                mmrEventing.doToggleReceiptAddress(true);
              }

              return true;
            }
          });
        };

        modal.doSelectReceipt = function() {
           // open the receipt selection view
          self.createMyReceiptModal(scope, modal.orders.selectedReceipt || {}, modal.receiptIdx);
        },

        modal.doModifyQuarantine = function() {
          if(!orders.quarantine) {
            mmrEventing.doToggleQuarantineAddress(false);
            orders.quarantine = true;
          } else {
            mmrEventing.doToggleQuarantineAddress(true);
            orders.quarantine = false;
          }

        },

        modal.doGenerate = function() {
          // check validity
          var checkResult = checkValidity();

          if(checkResult.hasError) {
            mmrCommonService.help('订单无法生成', checkResult.errorMsg);
            return;
          }

          // calc the deadline payment time
          orders.deadline = new Date(new Date().getTime() + 1800000);

          mmrLoadingFactory.show('正在创建订单, 请稍等...');

          // call the order API to generate a new order
          var itemIds = getOrderItemIds(orders.orders);
          mmrOrderFactory.generate2(generateOrderVo(orders, itemIds)).then(function(res) {
            mmrLoadingFactory.hide();
            if(res.status && res.status === 200 &&
              res.data.msg === '订单生成成功' &&
              res.data.status === 1) {
              // broadcast the generate event for cart orders
              if(!orders.isIndependentOrder) {
                // order object & generated order text id
                mmrEventing.doNewOrderGenerated({
                  orders: orders,
                  id: res.data.data,
                  itemIds: itemIds
                });
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

        $rootScope.$on('doChangeReceipt', function($event, data) {
          if(data && data.receipt) {
            modal.orders.selectedReceipt = data.receipt;
            console.log(data.receipt);
          }
        });

        $rootScope.$on('doCancelPayment', function($event, data) {
          // when the user cancel the payment for this order
          modal.remove();
        });

        // private functions
        function generateOrderVo(orders, itemIds) {
          var vo = {};

          vo.ids = mmrCartService.cartIds(itemIds);
          vo.type = 2; // buy by cart
          vo.mentioning = 0; // 0: not self-pick; 1: self-pick
          vo.address = 56 // address id
          vo.invoice_id = 26;
          vo.address_invoice = 56;
          vo.order_type = orders.isReserved ? 0 : 1; // 0: reserve; 1: normal
          vo.uid = $rootScope.$root.pinfo.uid;

          return vo;
        }

        // return an array of item ids
        function getOrderItemIds(orders) {
          // parameter orders is an array
          var processItems = _.flatten(_.concat(_.map(orders, function(order) {
            return order.items;
          })));

          var ids = _.map(processItems, function(item) {
            return item.id;
          });

          return ids;
        }

        // return obj:
        // hasError, errorMsg
        function checkValidity() {
          console.log(modal.orders);

          // check address
          if(orders.delivery === '送货上门' && !orders.addresses.normal) {
            return {
              hasError: true,
              errorMsg: '请提供送货上门收货地址'
            };
          }

          if(orders.delivery === '自提' && !orders.addresses.normal) {
            return {
              hasError: true,
              errorMsg: '请选择自提地址'
            };
          }

          // check receipt address
          if(orders.receipt !== '不需要发票' && !orders.addresses.receipt) {
            return {
              hasError: true,
              errorMsg: '请选择发票寄送地址'
            };
          }

          // check quarantine address
          if(orders.quarantine &&
            (!orders.addresses.quarantine.quarantine ||
            _.trim(orders.addresses.quarantine.quarantine) === '')) {
            return {
              hasError: true,
              errorMsg: '请选择检疫证寄送地址'
            };
          }

          // check receipt
          if(orders.receipt !== '不需要发票' &&
            (!orders.selectedReceipt || !orders.selectedReceipt.id)) {
            return {
              hasError: true,
              errorMsg: '请选择需要使用的发票'
            };
          }

          return {
            hasError: true
          };
        }

        function fallbackToDelivery() {
          modal.addressIdx = 0;
          modal.orders.delivery = '送货上门';
          modal.orders.addresses.normal = _.find($rootScope.$root.addresses, function(address) {
            return address.isDefault;
          });
        }
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
          modal.receipts = $rootScope.$root.receipts.usual;
        } else {
          modal.receipts = $rootScope.$root.receipts.special;
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
          mmrPayment.doAction().then(function(res) {
            console.log(res);
            $ionicPopup.show({
              template: res,
              title: '即将跳转到快钱支付网关',
              scope: scope,
              buttons: [
                {
                  text: '<b>确定</b>',
                  type: 'button-energized',
                  onTap: function(e) {
                    // event handler when user confirm
                    console.log('hahahah');
                    $('form[name="kqPay"]')[0].submit();
                  }
                }
              ]
            });
          }, function(err) {

          });
          // self.createPayResultModal(scope, 1);
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

        init();

        //bind data
        scope.preferredBrandModal = modal;
        modal.index = index;
        // modal.items = mmrMineFactory.myFav(0);

        // method
        modal.doHide = function() {
          modal.hide();
        };

        modal.doGetCartCount = function() {
          if($rootScope.$root.cart.totalCount >= 100) {
            return '99+';
          }

          return $rootScope.$root.cart.totalCount;
        };

        modal.doTransToCart = function() {
          mmrEventing.doStateToCart();
        };

        // event handlers
        scope.$on('doStateToCart', function($event, data) {
          modal.doHide();
          $state.go('tab.cart', {
            tab: 1
          });
        });

        function init() {
          mmrDataService.request(mmrItemFactory.search({
            'new': 1
          })).then(function(res) {
            modal.items = res[0];
          }, function(err) {

          });
        }
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

        // modal name
        modal.name = 'footprint';
        modal.footprintResults = [];

        // search related
        modal.searchVo = {
          type: 1,
          p: 0
        };

        //empty content
        modal.ec = {};
        modal.ec.words = ['暂无足迹'];
        modal.ec.additionalClass = 'my-footprint-empty';
        modal.ec.button = {
          text: '去逛逛',
          onTap: function() {
            // trans to home view
            modal.hide();
            $state.go('tab.home');
          }
        };

        //methods
        modal.doHide = function() {
          modal.hide();
        };

        // invokers for item list
        modal.removeHandler = function(item) {
          // TODO
          mmrItemFactory.footprintDelete({
            id: item.id,
            type: 1
          }).then(function(res) {
            if(res.status == 1 && res.msg === '操作成功') {
              // remove the footprint
              _.remove(modal.footprintResults, function(element) {
                return element.id === item.id;
              });

              // release the operations area
              $ionicListDelegate.closeOptionButtons();
            }
          }, function(err) {
            console.log(err);
          });
        };

        modal.infinitePredicate = function(size) {
          // TODO: default to use
          if(size % 10 > 0) {
            return false;
          } else {
            return true;
          }
        };

        modal.infiniteHandler = function() {
          requestData();
        };

        // event handler
        scope.$on('modal.shown', function($event, modalInstance) {
          if(modalInstance.name === modal.name) {
            requestData();
          }
        });

        // private functions
        function requestData() {
          mmrItemFactory.footprintList(modal.searchVo).then(function(res) {
            // res is the result footprint array
            if(res &&
               res instanceof Array &&
               res.length > 0) {
              modal.footprintResults = modal.footprintResults.concat(res);
              modal.searchVo.p = modal.searchVo.p + 1;
            }
          }, function(err) {

          }).finally(function() {
            if(modal.footprintResults.length === 0) {
              modal.isEmpty = true;
            } else {
              modal.isEmpty = false;
            }

            scope.$broadcast('scroll.infiniteScrollComplete');
          });
        }
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
