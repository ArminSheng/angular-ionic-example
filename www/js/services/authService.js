angular.module('mmr.services')

.factory('mmrAuth', ['$q', '$http', '$rootScope', 'apiService', 'mmrEventing', 'mmrDataService', '$cordovaFileTransfer', 'mmrCommonService',
  function($q, $http, $rootScope, apiService, mmrEventing, mmrDataService, $cordovaFileTransfer, mmrCommonService) {

  function processAvatar(originalPath) {
    var result;

    if(originalPath && _.startsWith(originalPath, './')) {
      result = apiService.API_BASE + originalPath.substring(2);
    } else {
      result = 'img/mine/avatar-bak.png';
    }

    // replace all "
    result = _.replace(result, '\"', '');

    return result;
  }

  // type:
  // 1: login; 2: register
  function postprocess(res, type) {
    // save the user info locally
    var localUserInfo = $rootScope.$root.pinfo;

    // avatar
    localUserInfo.avatar = processAvatar(res.img);
    // uid
    localUserInfo.uid = res.id;
    // phone
    localUserInfo.phone = res.phone;
    // username
    localUserInfo.username = res.name;
    // realname
    localUserInfo.realname = res.real_name;
    // email
    localUserInfo.email = res.email;
    // qq
    localUserInfo.qq = res.qq;
    // birthday
    localUserInfo.birthday = new Date(res.birthday);
    // deposit
    localUserInfo.deposit = Number(res.cash);

    $rootScope.$root.pinfoBackend = res;

    // change the auth status
    $rootScope.$root.authenticated = true;

    switch(type) {
      case 1:
        mmrEventing.doLoginSuccessfully();
        break;
      case 2:
        mmrEventing.doRegisterSuccessfully();
        break;
    }
  }

  function buildPInfoVo(info) {
    var vo = {};

    vo.id = $rootScope.$root.pinfo.uid;

    if(_.has(info, 'username')) {
      vo.name = info.username;
    }

    if(_.has(info, 'realname')) {
      vo.real_name = info.realname;
    }

    if(_.has(info, 'qq')) {
      vo.qq = info.qq;
    }

    if(_.has(info, 'email')) {
      vo.email = info.email;
    }

    // birthday has the form "2015-01-01"
    if(_.has(info, 'birthday')) {
      vo.birthday = info.birthday;
    }

    return vo;
  }

  return {

    // return false means not redirect
    redirectIfNotLogin: function(fromState) {
      // check whether user has been authenticated
      if(!$rootScope.$root.authenticated) {
        mmrEventing.doOpenLogin(fromState);
        return true;
      }

      return false;
    },

    logout: function() {
      // remove all personal information
      $rootScope.$root.notificationCount = 0;

      $rootScope.$root.authenticated = false;
      $rootScope.$root.pinfoBackend = {};
      $rootScope.$root.pinfo = {};

      $rootScope.$root.addresses = [];
      $rootScope.$root.receipts = {
        'usual': [],
        'special': [],
        'noSpecial': true
      };

      $rootScope.$root.modals = {};
      $rootScope.$root.cart = {
        totalCount: 0,
        amounts: {
          '0': 0,
          '1': 0
        },
        counts: {
          '0': 0,
          '1': 0
        },
        allChecked: {
          '0': false,
          '1': false
        },
        checkedCounts: {
          '0': 0,
          '1': 0
        },
        checkedAmounts: {
          '0': 0,
          '1': 0
        },

        // items count: id ---> count
        itemsCount: {

        },

        // items ID ---> true : exists
        itemsId: {

        },

        // shops and items
        reservedOrders: [

        ],

        normalOrders: [

        ]
      };

      $rootScope.$root.states = {
        current: undefined,
        last: undefined,
        beforeLogin: undefined
      };

      $rootScope.$root.orderCounters = {}
    },

    sendCode: function(phone, type) {
      var dfd = $q.defer();

      mmrDataService.request($http({
        url: apiService.AUTH_SEND_CODE,
        method: 'POST',
        data: {
          phone: phone,
          type: type
        }
      }), '验证码发送中...').then(function(res) {
        res = res[0];
        if(res.status === 1) {
          dfd.resolve();
        } else {
          dfd.reject(res.msg);
        }
      }, function(err) {
        dfd.reject();
      });

      return dfd.promise;
    },

    login: function(info) {
      var dfd = $q.defer();

      mmrDataService.request($http({
        url: apiService.AUTH_USER_LOGIN,
        method: 'POST',
        data: {
          name: info.username,
          pwd: info.password
        }
      }), '登录验证中...').then(function(res) {
        res = res[0];
        if(res.msg === '登录成功') {
          postprocess(res.data, 1);
          dfd.resolve(res.data);
        } else {
          dfd.reject(res.msg);
        }
      }, function(err) {
        dfd.reject();
      });

      return dfd.promise;
    },

    register: function(info) {
      var dfd = $q.defer();

      mmrDataService.request($http({
        url: apiService.AUTH_USER_REGISTER,
        method: 'POST',
        data: {
          name: info.phone,
          pwd: info.password,
          code: info.code
        }
      }), '新用户注册中...').then(function(res) {
        res = res[0];
        if(res.msg === '注册成功') {
          postprocess(res.data, 2);
          dfd.resolve(res.data);
        } else {
          dfd.reject(res.msg);
        }
      }, function(err) {
        console.log(err);
        dfd.reject();
      });

      return dfd.promise;
    },

    password: function(info) {
      var dfd = $q.defer();

      mmrDataService.request($http({
        url: apiService.AUTH_USER_PASSWORD,
        method: 'POST',
        data: {
          id: info.id,
          pwd: info.password,
          code: info.code
        }
      }), '密码重设中...').then(function(res) {
        res = res[0];
        if(res.msg === '修改成功') {
          dfd.resolve();
        } else {
          dfd.reject(res.msg);
        }
      }, function(err) {
        console.log(err);
        dfd.reject();
      });

      return dfd.promise;
    },

    pinfo: function(info) {
      var dfd = $q.defer();

      mmrDataService.request($http({
        url: apiService.AUTH_USER_INFO_EDIT,
        method: 'POST',
        data: buildPInfoVo(info)
      }), '用户信息更新中...').then(function(res) {
        res = res[0];
        if(res.status === 1 && res.msg === '更新成功') {
          dfd.resolve();
        } else {
          dfd.reject(res.msg);
        }
      }, function(err) {
        console.log(err);
        dfd.reject();
      });

      return dfd.promise;
    },

    avatar: function(imageURI) {
      // upload the image to server
      $cordovaFileTransfer.upload(apiService.AUTH_USER_UPLOAD_AVATAR, imageURI, {
        mimeType: 'image/png',
        fileKey: 'img',
        params: {
          uid: $rootScope.$root.pinfo.uid
        }
      }).then(function(result) {
        // reassign the latest avatar url
        if(result.responseCode === 200) {
          $rootScope.$root.pinfo.avatar = processAvatar(result.response);
        } else {
          mmrCommonService.help('错误提示', '在上传头像时发生了错误, 错误代码: ' + result.responseCode);
        }
        // $rootScope.$root.pinfo.avatar = REST_BASE + 'user_uploaded/' +filename ;
      }, function(err) {
        // reassign the latest avatar url
        mmrCommonService.help('错误提示', '在上传头像时发生了错误');
      }, function (progress) {
        // constant progress updates
      });
    }

  };

}]);
