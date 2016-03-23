angular.module('mmr.services')

.factory('mmrShare', [function() {

  return {

    prepareWechatLink: function(item) {
      var vo = {};

      vo.title = '[' + item.category + '] ' + item.title;
      vo.description = '买卖肉为您提供新鲜的肉制品和快捷的送货服务';
      vo.thumb = 'www/img/logo.png';
      vo.webpageUrl = 'http://www.micropoplar.com';

      return vo;
    }

  };

}]);
