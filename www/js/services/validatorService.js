angular.module('mmr.services')

.factory('Validator', [function() {
  var ValidatorAPI = {

    phone: function(cellphone) {
      if(!cellphone || !/^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i.test(cellphone)) {
        return false;
      }

      return true;
    },

    password: function(password) {
      if(!password || !/[0-9|A-Z|a-z]{6,16}/.test(password)) {
        return false;
      }

      return true;
    },

    verifyCode: function(code) {
      if(!code || code.length !== 6 || !/[0-9]{6}/.test(code)) {
        return false;
      }

      return true;
    },

    username: function(username) {
      if(!username || !/^[0-9a-zA-Z\u4e00-\u9fa5_]{3,16}$/.test(username)) {
        return false;
      }

      return true;
    }

  };

  return ValidatorAPI;
}]);