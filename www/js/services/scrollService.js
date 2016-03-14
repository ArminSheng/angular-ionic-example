angular.module('mmr.services')

// common services defined below
.factory('mmrScrollService', ['$rootScope', '$ionicScrollDelegate',
  function($rootScope, $ionicScrollDelegate) {

  // record all scroll handler -> lastTops array
  var lastTopsMappings = {};

  return {

    /**
    / handler: the handler name defined on the ion-content and the like
    / onDowning: callback when scrolling down
    / onUping: callback when scrolling up
    / onNegative: callback when scrolling position is negative
    / threshold: trigger onMeetThreshold callback when passing this threshold
    / onThreshold: callback when threshold is met, should pass a boolean indicating whether it is now greater than threshold or not
    */
    onScroll: function(config) {
      if(config.handler) {
        var handler = config.handler;
        var scrollHandler = $ionicScrollDelegate.$getByHandle(handler);
        if(scrollHandler && scrollHandler.getScrollPosition()) {
          var moveData = scrollHandler.getScrollPosition().top,
              lastTops;

          // header hold on related
          if (config.offHeight &&  moveData <= config.offHeight) {
            if (typeof(config.offTop) === 'function') {
              config.offTop();
            }
          }

          if (config.offHeight &&  moveData > config.offHeight) {
            if (typeof(config.onTop) === 'function') {
              config.onTop();
            }
          }

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
              if(typeof(config.onDowning) === 'function') {
                config.onDowning();
              }
            } else { // when uping
              status = 'uping';
              if(typeof(config.onUping) === 'function') {
                config.onUping();
              }
            }
          }

          // when negative
          if(moveData <= 0) {
            status = 'negative';
            if(typeof(config.onNegative) === 'function') {
              config.onNegative();
            }
          }

          if(config.threshold && typeof(config.onThreshold) === 'function') {
            config.onThreshold((moveData > config.threshold) ? true : false);
          }

          return status;
        }

      }

    }

  };

}]);
