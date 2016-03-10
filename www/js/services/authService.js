angular.module('mmr.services')

.factory('mmrAuth', ['$q', '$http', 'apiService',
  function($q, $http, apiService) {

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
      $http({
        url: apiService.AUTH_USER_LOGIN,
        method: 'POST',
        data: {
          name: info.phone,
          pwd: info.password
        }
      }).then(function(res) {
        console.log(res);
      }, function(err) {

      });
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
        if(res.data.status === 1) {
          dfd.resolve(res.data);
        } else {
          dfd.reject(res.data.msg);
        }
      }, function(err) {
        dfd.reject();
      });

      return dfd.promise;
    }

  };

}]);
