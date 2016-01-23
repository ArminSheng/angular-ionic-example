angular.module('mmr.services')

// common services defined below
.factory('mmrScrollService', ['$rootScope', '$ionicScrollDelegate',
  function($rootScope, $ionicScrollDelegate) {

  // record all scroll handler -> lastTops array
  var lastTopsMappings = {};

  return {

    onScroll: function(handler, scope, onDowning, onUping, onNegative) {
      var scrollHandler = $ionicScrollDelegate.$getByHandle(handler);
      if(scrollHandler) {
        var moveData = scrollHandler.getScrollPosition().top,
            lastTops;

        if(!lastTopsMappings[handler]) {
          lastTops = lastTopsMappings[handler] = [];
        } else {
          lastTops = lastTopsMappings[handler];
        }

        if(lastTops.length < 3) {
          lastTops.push(moveData);
        } else {
          lastTops.shift();
          lastTops.push(moveData);
        }

        var status = 'downing';

        if(lastTops.length === 3) {
          // when downing
          if(lastTops[2] >= lastTops[0]) {
            status = 'downing';
            if(typeof(onDowning) === 'function') {
              onDowning(scope);
            }
          } else { // when uping
            status = 'uping';
            if(typeof(onUping) === 'function') {
              onUping(scope);
            }
          }
        }

        // when negative
        if(moveData <= 0) {
          status = 'negative';
          if(typeof(onNegative) === 'function') {
            onNegative(scope);
          }
        }

        return status;
      }
    }

  };

}]);
