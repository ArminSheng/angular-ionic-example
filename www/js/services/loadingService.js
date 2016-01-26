angular.module('mmr.services')

.factory('mmrLoadingFactory', ['$ionicLoading',
  function($ionicLoading) {

  return {
    show: function() {
      $ionicLoading.show({
        template: '正在加载中...',
        duration: 10000
      });
    },

    hide: function() {
      $ionicLoading.hide();
    }
  };

}]);
