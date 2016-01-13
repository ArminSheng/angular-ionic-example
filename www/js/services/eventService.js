angular.module('mmr.services')

.factory('mmrEventing', ['$rootScope', function($rootScope) {

  return {

    doOpenLogin: function(data) {
      $rootScope.$broadcast('eventOpenLogin', data);
    },

    doOpenRegister: function(data) {
      $rootScope.$broadcast('eventOpenRegister', data);
    },

    // inside category view
    doOpenFilters: function(data) {
      $rootScope.$broadcast("eventOpenFilters", data);
    }

  };

}]);