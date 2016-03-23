angular.module('mp.commons', [])

.factory('mpWechatService', ['$q', function($q) {

  var wechatConfig = {
    installed: false
  };

  var RESPONSE = {
    'NOT_INSTALLED': {
      code: -1,
      msg: '微信应用未安装'
    },
    'FAILED': {
      code: 0,
      msg: '发送失败'
    },
    'SUCCESSFUL': {
      code: 1,
      msg: '发送成功'
    }
  };

  return {

    // init should be called in the config section
    init: function() {
      var dfd = $q.defer();

      try {
        if(Wechat) {
          Wechat.isInstalled(function (installed) {
            if(installed) {
              wechatConfig.installed = true;
              dfd.resolve(true);
            } else {
              dfd.reject(false);
            }
          }, function (reason) {
            dfd.reject(false);
          });
        } else {
          dfd.reject(false);
        }
      } catch (e) {
        dfd.reject(false);
      }

      return dfd.promise;
    },

    ready: function() {
      return wechatConfig.installed;
    },

    // scene - 0: Session, 1: Timeline, 2: Favorite
    // Example:
    // mpWechatService.shareLink(0, {
    //   title: '周哥正在看着你!',
    //   description: '周哥正在看着你!周哥正在看着你!周哥正在看着你!啊啊啊啊啊',
    //   thumb: 'www/img/temp/testing.png',
    //   webpageUrl: 'http://www.micropoplar.com'
    // }).then(function(res) {
    //   alert(res.msg);
    // }, function(err) {
    //   alert(err.msg + ' - ' + err.reason);
    // })
    shareLink: function(scene, info) {
      var dfd = $q.defer();

      try {
        // make sure wechat has been installed
        if(!wechatConfig.installed) {
         dfd.reject(RESPONSE.NOT_INSTALLED);
        } else {
          // prepare the params
          var params = {};

          params.scene = scene;
          params.message = {};
          params.message.title = info.title;
          params.message.description = info.description;
          params.message.thumb = info.thumb;
          params.message.media = {};
          params.message.media.type = Wechat.Type.LINK;
          params.message.media.webpageUrl = info.webpageUrl;

          Wechat.share(params, function () {
            dfd.resolve(RESPONSE.SUCCESSFUL);
          }, function (reason) {
            var response = angular.copy(RESPONSE.FAILED);
            response.reason = reason;
            dfd.reject(response);
          });
        }
      } catch (e) {
        dfd.reject(RESPONSE.FAILED);
      }

      return dfd.promise;
    }

  };

}]);
