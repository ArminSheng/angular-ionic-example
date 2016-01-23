angular.module('mmr.controllers')

.controller('HomeCtrl', ['$scope', '$rootScope', '$q', '$timeout', '$ionicHistory', '$ionicScrollDelegate', '$ionicSlideBoxDelegate', '$cordovaGeolocation', 'mmrAreaFactory', 'mmrItemFactory', 'mmrCommonService', 'mmrLoadingFactory', 'seckilling', 'homeCommodity',
  function($scope, $rootScope, $q, $timeout, $ionicHistory, $ionicScrollDelegate, $ionicSlideBoxDelegate, $cordovaGeolocation, mmrAreaFactory, mmrItemFactory, mmrCommonService, mmrLoadingFactory, seckilling, homeCommodity) {

    // use backup images and hint the network error
    // mmrCommonService.networkDown();

  // seckilling processing
  $scope.seckilling = seckilling.data;
  $scope.commodities = homeCommodity.data;

  initialize();
  function initialize() {
    // load geo position
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
      var latitude  = position.coords.latitude;
      var longitude = position.coords.longitude;
      console.log(latitude, longitude)
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
      $scope.banners = res.data;
      $ionicSlideBoxDelegate.$getByHandle('bannersSlideBox').update();
    }, function(err) {
      errorFlag = true;
    });

    var q2 = mmrAreaFactory.areas();
    promises.push(q2);
    q2.then(function(res) {
      $scope.areas = res.data;
    }, function(err) {
      errorFlag = true;
    });

    var q3 = mmrItemFactory.seckilling();
    promises.push(q3);
    q3.then(function(res) {
      $scope.seckilling = res.data;
    }, function(err) {
      errorFlag = true;
    });

    var q4 = mmrItemFactory.homeCommodity();
    promises.push(q4);
    q4.then(function(res) {
      $scope.commodities = res.data;
    }, function(err) {
      errorFlag = true;
    });

    $q.all(promises).then(response, response);

    function response() {
      mmrLoadingFactory.hide();

      if(errorFlag) {
        mmrCommonService.networkDown();
      }
    }
  }

  $timeout(function(){
    // return false; // <--- comment this to "fix" the problem
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
      e.preventDefault = function(){}
      originaltouchStart.apply(sv, [e]);
    }

    sv.touchMove = function(e) {
      e.preventDefault = function(){}
      originaltouchMove.apply(sv, [e]);
    }

    sv.mouseDown = function(e) {
      e.preventDefault = function(){}
      originalmouseDown.apply(sv, [e]);
    }

    sv.mouseMove = function(e) {
      e.preventDefault = function(){}
      originalmouseMove.apply(sv, [e]);
    }

    container.addEventListener("touchstart", sv.touchStart, false);
    container.addEventListener("mousedown", sv.mouseDown, false);
    document.addEventListener("touchmove", sv.touchMove, false);
    document.addEventListener("mousemove", sv.mouseMove, false);
  });

}]);
