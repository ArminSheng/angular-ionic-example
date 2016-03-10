angular.module('mmr.services')

.factory('mmrAuth', ['$q', '$http', 'apiService',
  function($q, $http, apiService) {

  return {

    sendCode: function(phone, type) {
      console.log(apiService, phone, type);
      $http({
        url: apiService.AUTH_SEND_CODE,
        method: 'POST',
        params: {
          phone: phone,
          type: type
        }
      }).then(function(res) {
        console.log(res);
      }, function(err) {

      });
    },

    login: function(info) {
      $http({
        url: apiService.AUTH_USER_LOGIN,
        method: 'POST',
        params: {
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
        params: {
          name: info.phone,
          pwd: info.password,
          code: info.code
        }
      }).then(function(res) {
        console.log(res);
        // dfd.resolve();
      }, function(err) {
        dfd.reject();
      });

      return dfd.promise;
    }

  };

}]);
