angular.module('mmr.services')

.factory('mmrEventing', ['$rootScope', function($rootScope) {

  return {

    doOpenFilters: function(data) {
      $rootScope.$broadcast("eventOpenFilters", {
        data: data
      });
    }

  };

}]);