angular.module('mmr.services')

.factory('mmrModal', ['$rootScope', '$timeout', '$interpolate', '$ionicModal', '$ionicPopup', 'localStorageService', 'Validator',
  function($rootScope, $timeout, $interpolate, $ionicModal, $ionicPopup, localStorageService, Validator) {

  return {

    createLoginModal: function(scope) {
      $ionicModal.fromTemplateUrl('templates/modal/login.html', {
        scope: scope
      }).then(function(modal) {
        scope.loginModal = modal;
        $rootScope.modals.loginModal = modal;

        scope.loginModal.show();

        // binding data
        scope.loginModal.data = {
          username: '',
          password: '',
          code: ''
        };

        scope.loginModal.viewMode = 1;

        scope.loginModal.doHideLogin = function() {
          scope.loginModal.hide();
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

        scope.loginModal.doFetchCode = function() {

        };

        scope.loginModal.doLogin = function() {
          // show the bind modal if necessary
          if($rootScope.$root.isOldUser) {
            $ionicModal.fromTemplateUrl('templates/modal/bind-old-user.html', {
              scope: scope
            }).then(function(modal) {
              scope.bindModal = modal;
              scope.bindModal.show();

              // data bindings
              scope.bindModal.data = {
                phone: '',
                code: ''
              };

              // methods for the bind modal
              scope.bindModal.doBind = function() {

              };

              scope.bindModal.doHideBind = function() {
                scope.bindModal.hide();
              };
            });
          }
        };

        scope.loginModal.doRegister = function() {
          mmrEventing.doOpenRegister();
        };
      });
    },

    createPersonalInfoModal: function(scope) {
      $ionicModal.fromTemplateUrl('templates/modal/personal-info.html', {
        scope: scope
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

    createAddressModal: function(scope) {
      $ionicModal.fromTemplateUrl('templates/modal/my-address.html', {
        scope: scope
      }).then(function(modal) {
        $rootScope.modals.addressModal = modal;
        $rootScope.modals.addressModal.show();

        // bind data
        $rootScope.modals.addressModal.isEditing = false;

        // methods
        $rootScope.modals.addressModal.doHide = function() {
          modal.hide();
        };

        $rootScope.modals.addressModal.doOpenAddressDetail = function(address) {
          createAddressDetailModal(scope, address);
        };

        $rootScope.modals.addressModal.doAdd = function() {
          createAddressDetailModal(scope, {}, true);
        };

        function createAddressDetailModal(scope, address, isEditing) {
          $ionicModal.fromTemplateUrl('templates/modal/my-address-detail.html', {
            scope: scope,
            animation: 'slide-in-right'
          }).then(function(modal) {
            $rootScope.modals.addressDetailModal = modal;
            $rootScope.modals.addressDetailModal.show();

            // cache
            localStorageService.bind($rootScope, 'districts');
            localStorageService.bind($rootScope, 'cities');

            // bind data
            $rootScope.modals.addressDetailModal.isEditing = isEditing || false;
            $rootScope.modals.addressDetailModal.address = angular.copy(address);

            // methods
            $rootScope.modals.addressDetailModal.doHide = function() {
              modal.hide();
            };

            $rootScope.modals.addressDetailModal.doToggleEditing = function() {
              if(!$rootScope.modals.addressDetailModal.isEditing) {
                $rootScope.modals.addressDetailModal.isEditing = true;
              } else {
                // validate the address

                // save the editings
                $rootScope.modals.addressDetailModal.doHide();
              }
            };

            $rootScope.modals.addressDetailModal.removeAddress = function() {
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

            $rootScope.modals.addressDetailModal.defaultAddress = function() {
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
        scope: scope
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
        $rootScope.modals.orderDetailModal = modal;
        $rootScope.modals.orderDetailModal.show();

        // bind data
        $rootScope.modals.orderDetailModal.item = item;

        // methods
        $rootScope.modals.orderDetailModal.doHide = function() {
          modal.hide();
        };
      });
    }

  };

}]);
