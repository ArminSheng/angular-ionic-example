angular.module('mmr.services', [])

// common services defined below
.factory('mmrCommonService', ['$rootScope', '$ionicPopup', '$http', 'restService',
  function($rootScope, $ionicPopup, $http, restService) {

  return {

    networkCheck: function() {
      console.log('check network status');
      $http({
        url: restService['API_REST'] + 'c_heartbeat/',
        method: 'GET'
      }).then(function(res) {
        if(res) {
          // network is normal
        } else {
          if($rootScope.$root.network) {
            this.networkCheck();
          }
        }
      })
    },

    networkDown: function() {
      $rootScope.$root.network = false;
      $ionicPopup.alert({
        title: '网络异常',
        template: '请检查网络通信是否通畅'
      });
    },

    // show help information
    help: function(title, template) {
      $ionicPopup.alert({
        title: title,
        template: template
      });
    }

  };

}]);