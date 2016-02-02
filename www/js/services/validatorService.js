angular.module('mmr.services')

.factory('Validator', ['$ionicPopup', function($ionicPopup) {
  var ValidatorAPI = {

    phone: function(cellphone, popupWhenFailure) {
      if(!cellphone || !/^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i.test(cellphone)) {

        if(popupWhenFailure) {
          $ionicPopup.alert({
            title: '手机号格式验证失败',
            template: '手机号的格式应该符合中国大陆地区手机号码的格式',
            okType: 'button-energized'
          });
        }

        return false;
      }

      return true;
    },

    password: function(password, popupWhenFailure) {
      if(!password || !/[0-9|A-Z|a-z]{6,16}/.test(password)) {

        if(popupWhenFailure) {
          $ionicPopup.alert({
            title: '密码格式验证失败',
            template: '密码的长度应该在6-16之间，且只能包含英文或者数字',
            okType: 'button-energized'
          });
        }

        return false;
      }

      return true;
    },

    verifyCode: function(code, popupWhenFailure) {
      if(!code || code.length !== 6 || !/[0-9]{6}/.test(code)) {

        if(popupWhenFailure) {
          $ionicPopup.alert({
            title: '验证码格式验证失败',
            template: '验证码的长度应该为6，且只能包含数字',
            okType: 'button-energized'
          });
        }

        return false;
      }

      return true;
    },

    username: function(username, popupWhenFailure) {
      if(!username || !/^[0-9a-zA-Z\u4e00-\u9fa5_]{3,16}$/.test(username)) {

        if(popupWhenFailure) {
          $ionicPopup.alert({
            title: '用户名格式验证失败',
            template: '用户名的长度应该在3-16之间，且只能包含汉字，英文或者数字',
            okType: 'button-energized'
          });
        }

        return false;
      }

      return true;
    },

    qq: function(qq, popupWhenFailure) {
      if(!qq || !/^[0-9]{5,10}$/.test(qq)) {

        if(popupWhenFailure) {
          $ionicPopup.alert({
            title: 'QQ号格式验证失败',
            template: 'QQ号的位数应该在5-10位之间，且只能是数字',
            okType: 'button-energized'
          });
        }

        return false;
      }

      return true;
    },

    email: function(email, popupWhenFailure) {
      if(!email || !/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i.test(email)) {

        if(popupWhenFailure) {
          $ionicPopup.alert({
            title: '邮箱格式验证失败',
            template: '请输入合法的邮箱',
            okType: 'button-energized'
          });
        }

        return false;
      }

      return true;
    },

    number: function(number, upperLimit, popupWhenFailure) {
      number = Number(number);
      if(!_.isNumber(number) || _.isNaN(number)) {

        if(popupWhenFailure) {
          $ionicPopup.alert({
            title: '数值不正确',
            template: '请输入合法的数值',
            okType: 'button-energized'
          });
        }

        return false;
      }

      // check whether within in the correct range
      if(number > upperLimit) {
        if(popupWhenFailure) {
          $ionicPopup.alert({
            title: '数值超过了库存值',
            template: '请输入不超过库存值的数值',
            okType: 'button-energized'
          });
        }

        return false;
      }

      return true;
    }

  };

  return ValidatorAPI;
}]);
