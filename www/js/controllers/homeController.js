angular.module('mmr.controllers')

.controller('HomeCtrl', ['$scope', '$rootScope', '$q', '$timeout', '$ionicHistory', '$ionicScrollDelegate', '$ionicSlideBoxDelegate', '$cordovaGeolocation', 'mmrAreaFactory', 'mmrItemFactory', 'mmrCommonService', 'mmrLoadingFactory',
  function($scope, $rootScope, $q, $timeout, $ionicHistory, $ionicScrollDelegate, $ionicSlideBoxDelegate, $cordovaGeolocation, mmrAreaFactory, mmrItemFactory, mmrCommonService, mmrLoadingFactory) {

  $scope.initialize = function() {
    // load geo position
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
      var latitude  = position.coords.latitude;
      var longitude = position.coords.longitude;
      console.log(latitude, longitude);
      $scope.pos = position;
    }, function(err) {
      // error
      console.log(err);
      $scope.err = err;
    });

    // load data
    mmrLoadingFactory.show();

    var errorFlag = false,
        promises = [];
    var q1 = mmrAreaFactory.banners();
    promises.push(q1);
    q1.then(function(res) {
      if(res.status === 0) {
        errorFlag = true;
        return;
      }

      $scope.banners = res.data;

      // in case the network is restored
      $timeout(function() {
        $ionicSlideBoxDelegate.$getByHandle('bannersSlideBox').update();
      }, 1000);
    }, function(err) {
      errorFlag = true;
    });

    var q2 = mmrAreaFactory.areas();
    promises.push(q2);
    q2.then(function(res) {
      if(res.status === 0) {
        errorFlag = true;
        return;
      }

      $scope.areas = res.data;
    }, function(err) {
      errorFlag = true;
    });

    var q3 = mmrItemFactory.seckilling();
    promises.push(q3);
    q3.then(function(res) {
      if(res.status === 0) {
        errorFlag = true;
        return;
      }

      $scope.seckilling = res.data;
    }, function(err) {
      errorFlag = true;
    });

    var q4 = mmrItemFactory.homeCommodity();
    promises.push(q4);
    q4.then(function(res) {
      if(res.status === 0) {
        errorFlag = true;
        return;
      }

      $scope.commodities = res.data;
    }, function(err) {
      errorFlag = true;
    });

    $q.all(promises).then(response, response);

    function response() {
      mmrLoadingFactory.hide();

      if(errorFlag) {
        mmrCommonService.networkDown();
      } else {
        mmrCommonService.networkUp();
      }
    }
  }

  $timeout(function(){
    return false; // <--- comment this to "fix" the problem
    var sv = $ionicScrollDelegate.$getByHandle('seckilling-horizontal').getScrollView();

    var container = sv.__container;

    var originaltouchStart = sv.touchStart;
    var originalmouseDown = sv.mouseDown;
    var originaltouchMove = sv.touchMove;
    var originalmouseMove = sv.mouseMove;

    container.removeEventListener('touchstart', sv.touchStart);
    container.removeEventListener('mousedown', sv.mouseDown);
    document.removeEventListener('touchmove', sv.touchMove);
    document.removeEventListener('mousemove', sv.mousemove);


    sv.touchStart = function(e) {
      e.preventDefault = function(){};
      originaltouchStart.apply(sv, [e]);
    };

    sv.touchMove = function(e) {
      e.preventDefault = function(){};
      originaltouchMove.apply(sv, [e]);
    };

    sv.mouseDown = function(e) {
      e.preventDefault = function(){};
      originalmouseDown.apply(sv, [e]);
    };

    sv.mouseMove = function(e) {
      e.preventDefault = function(){};
      originalmouseMove.apply(sv, [e]);
    };

    container.addEventListener("touchstart", sv.touchStart, false);
    container.addEventListener("mousedown", sv.mouseDown, false);
    document.addEventListener("touchmove", sv.touchMove, false);
    document.addEventListener("mousemove", sv.mouseMove, false);
  });

  $scope.initialize();
}]);
