angular.module('mmr.services')

.factory('mmrSearchService', ['mmrCacheFactory',
  function(mmrCacheFactory) {

  return {

    hotKeywords: function() {
      var hot = ['热词1', '热词2', '热词3', '热词4', '热词5', '热词6', '热词7', '热词8', '热词9', '热词10'];
      mmrCacheFactory.set('hotKeywords', hot);
    }

  };

}]);
