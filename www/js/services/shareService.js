angular.module('mmr.services')

.factory('mmrShare', ['WAP_BASE',
  function(WAP_BASE) {

  return {

    prepareWechatLink: function(item) {
      var vo = {};

      vo.title = '[' + item.category + '] ' + item.title;
      vo.description = '买卖肉为您提供新鲜的肉制品和快捷的送货服务';
      vo.thumb = 'www/img/logo.png';
      vo.webpageUrl = WAP_BASE + '#/tab/item/' + item.id;

      return vo;
    }

  };

}]);
