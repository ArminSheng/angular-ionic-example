angular.module('mmr.controllers')

.controller('HomeCtrl', ['$scope', '$rootScope', '$q', '$ionicHistory', '$cordovaGeolocation', 'mmrCommonService', 'mmrLoadingFactory', 'banners', 'areas', 'seckilling', 'homeCommodity',
  function($scope, $rootScope, $q, $ionicHistory, $cordovaGeolocation, mmrCommonService, mmrLoadingFactory, banners, areas, seckilling, homeCommodity) {

  if(banners.data && areas.data) {
    $scope.banners = banners.data;
    $scope.areas = areas.data;
  } else {
    // use backup images and hint the network error
    mmrCommonService.networkDown();
  }

  // seckilling processing
  $scope.seckilling = seckilling.data;
  $scope.commodities = homeCommodity.data;

  initialize();
  function initialize() {
    var path = './upload/20151231/20151231085342270.jpg';

    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
      var latitude  = position.coords.latitude;
      var long = position.coords.longitude;
      console.log(latitude, longitude)
      $scope.pos = position;
    }, function(err) {
      // error
      console.log(err);
      $scope.err = err;
    });
  }

}]);