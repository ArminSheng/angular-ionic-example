angular.module('mmr.services')

.factory('mmrAuth', ['$q', '$http', '$rootScope', 'apiService', 'mmrEventing',
  function($q, $http, $rootScope, apiService, mmrEventing) {

  // type:
  // 1: login; 2: register
  function postprocess(res, type) {
    // save the user info locally
    var localUserInfo = $rootScope.$root.pinfo;

    // avatar
    if(res.img && _.startsWith(res.img, './')) {
      localUserInfo.avatar = apiService.API_BASE + res.img.substring(2);
    }
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

    sendCode: function(phone, type) {
      var dfd = $q.defer();

      $http({
        url: apiService.AUTH_SEND_CODE,
        method: 'POST',
        data: {
          phone: phone,
          type: type
        }
      }).then(function(res) {
        if(res.data.status === 1) {
          dfd.resolve();
        } else {
          dfd.reject(res.data.msg);
        }
      }, function(err) {
        dfd.reject();
      });

      return dfd.promise;
    },

    login: function(info) {
      var dfd = $q.defer();

      $http({
        url: apiService.AUTH_USER_LOGIN,
        method: 'POST',
        data: {
          name: info.username,
          pwd: info.password
        }
      }).then(function(res) {
        console.log(res);
        if(res.data.msg === '登录成功') {
          postprocess(res.data.data, 1);
          dfd.resolve(res.data.data);
        } else {
          dfd.reject(res.data.msg);
        }
      }, function(err) {
        dfd.reject();
      });

      return dfd.promise;
    },

    register: function(info) {
      var dfd = $q.defer();

      $http({
        url: apiService.AUTH_USER_REGISTER,
        method: 'POST',
        data: {
          name: info.phone,
          pwd: info.password,
          code: info.code
        }
      }).then(function(res) {
        console.log(res);
        if(res.data.msg === '注册成功') {
          postprocess(res.data.data, 2);
          dfd.resolve(res.data.data);
        } else {
          dfd.reject(res.data.msg);
        }
      }, function(err) {
        console.log(err);
        dfd.reject();
      });

      return dfd.promise;
    }

  };

}]);
