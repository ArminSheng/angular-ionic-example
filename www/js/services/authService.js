angular.module('mmr.services')

.factory('mmrAuth', ['$q', '$http', '$rootScope', 'apiService', 'mmrEventing', 'mmrDataService',
  function($q, $http, $rootScope, apiService, mmrEventing, mmrDataService) {

  // type:
  // 1: login; 2: register
  function postprocess(res, type) {
    // save the user info locally
    var localUserInfo = $rootScope.$root.pinfo;

    // avatar
    if(res.img && _.startsWith(res.img, './')) {
      localUserInfo.avatar = apiService.API_BASE + res.img.substring(2);
    } else {
      localUserInfo.avatar = 'img/mine/avatar-bak.png';
    }
    // uid
    localUserInfo.uid = res.id;
    // phone
    localUserInfo.phone = res.phone;
    // username
    localUserInfo.username = res.name;
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
      $rootScope.$root.authenticated = false;
      $rootScope.$root.pinfoBackend = {};
      $rootScope.$root.pinfo = {};
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
          console.log(res.data);
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
        console.log(res);
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
    }

  };

}]);
