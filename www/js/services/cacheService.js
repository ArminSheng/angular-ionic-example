angular.module('mmr.services')

.factory('mmrCacheFactory', ['localStorageService',
  function(localStorageService) {

  return {

    set: function(key, value) {
      return localStorageService.set(key, value);
    },

    get: function(key) {
      return localStorageService.get(key);
    },

    remove: function(key) {
      return localStorageService.remove(key);
    },

    clear: function() {
      return localStorageService.clearAll();
    }

  };

}]);