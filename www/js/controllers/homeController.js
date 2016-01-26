angular.module('mmr.controllers')

.controller('HomeCtrl', ['$scope', '$rootScope', '$q', '$timeout', '$ionicHistory', '$ionicScrollDelegate', '$ionicSlideBoxDelegate', '$cordovaGeolocation', 'mmrAreaFactory', 'mmrItemFactory', 'mmrCommonService', 'mmrLoadingFactory', 'mmrDataService',
  function($scope, $rootScope, $q, $timeout, $ionicHistory, $ionicScrollDelegate, $ionicSlideBoxDelegate, $cordovaGeolocation, mmrAreaFactory, mmrItemFactory, mmrCommonService, mmrLoadingFactory, mmrDataService) {

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
    mmrDataService.request(
      mmrAreaFactory.banners(),
      mmrAreaFactory.areas(),
      mmrItemFactory.seckilling(),
      mmrItemFactory.homeCommodity()
    ).then(function(res) {
      $scope.banners = res[0];
      $scope.areas = res[1];
      $scope.seckilling = res[2];
      $scope.commodities = res[3];

      // in case the network is restored
      $timeout(function() {
        $ionicSlideBoxDelegate.$getByHandle('bannersSlideBox').update();
      }, 1000);
    }, function(err) {
      console.log(err);
    }).finally(function() {
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    });

  };

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
