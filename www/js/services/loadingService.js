angular.module('mmr.services')

.factory('mmrLoadingFactory', ['$ionicLoading',
  function($ionicLoading) {

  return {
    show: function() {
      $ionicLoading.show({
        template: '正在加载中...'
      });
    },

    hide: function() {
      $ionicLoading.hide();
    }
  };

}]);