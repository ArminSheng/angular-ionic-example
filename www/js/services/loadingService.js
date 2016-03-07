angular.module('mmr.services')

.factory('mmrLoadingFactory', ['$ionicLoading',
  function($ionicLoading) {

  return {
    show: function(text) {
      $ionicLoading.show({
        template: text || '正在加载中...',
        duration: 10000
      });
    },

    hide: function() {
      $ionicLoading.hide();
    }
  };

}]);
