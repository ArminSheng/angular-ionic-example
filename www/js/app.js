// MMR App
angular.module('mmr', ['ngAnimate', 'ionic', 'ion-gallery', 'mmr.controllers', 'mmr.services', 'mmr.directives', 'ngCordova', 'angular-md5', 'ngImgCrop', 'LocalStorageModule'])

.constant('REST_BASE', 'http://115.29.161.170:8081/mmr/')
// .constant('REST_BASE', 'http://192.168.1.135:8081/mmr/')
.constant('API_BASE', 'http://demo.0lz.net/mmrou/')

.provider('restService', ['REST_BASE', function(REST_BASE) {
  this.data = {
    'API_REST': REST_BASE
  };

  this.$get = function() {
    return this.data;
  };
}])

.provider('apiService', ['API_BASE', function(API_BASE) {
  this.data = {
    'API_BASE': API_BASE
  };

  this.$get = function() {
    // Auth related
    this.data.AUTH_SEND_CODE = this.data.API_BASE + 'api-user-sendcode.html';
    this.data.AUTH_USER_LOGIN = this.data.API_BASE + 'api-user-login.html';
    this.data.AUTH_USER_REGISTER = this.data.API_BASE + 'api-user-register.html';
    this.data.AUTH_USER_PASSWORD = this.data.API_BASE + 'api-user-safe.html';
    this.data.AUTH_USER_INFO_EDIT = this.data.API_BASE + 'api-user-edit.html';
    this.data.AUTH_USER_UPLOAD_AVATAR = this.data.API_BASE + 'api-user-img.html';

    // Search related
    this.data.SEARCH_INDEX = this.data.API_BASE + 'api-search-index.html';
    this.data.SEARCH_SECKILLING = this.data.API_BASE + 'api-search-seckilling.html';
    this.data.SEARCH_RECOMMEND = this.data.API_BASE + 'api-search-index.html';

    // Item related
    this.data.ITEM_DETAIL = this.data.API_BASE + 'api-search-detail.html';

    // Metadata related
    this.data.META_LOCATION = this.data.API_BASE + 'api-metadata-getCity.html';
    this.data.META_GEO = this.data.API_BASE + 'api-metadata-geo.html';

    // Cart related
    this.data.CART_INDEX = this.data.API_BASE + 'api-cart-getList.html';
    this.data.CART_MODIFY = this.data.API_BASE + 'api-cart-addition.html';
    this.data.CART_DELETE = this.data.API_BASE + 'api-cart-del.html';

    // Order related
    this.data.ORDER_GENERATE = this.data.API_BASE + 'api-order-create.html';
    this.data.ORDER_LIST = this.data.API_BASE + 'api-order-getList.html';

    // Favorite related
    this.data.FOOTPRINT_LIST = this.data.API_BASE + 'api-footprint-getList.html';
    this.data.FOOTPRINT_ADD = this.data.API_BASE + 'api-footprint-addition.html';
    this.data.FOOTPRINT_DELETE = this.data.API_BASE + 'api-footprint-del.html';

    // Address related
    this.data.ADDRESS_LIST = this.data.API_BASE + 'api-address-getList.html';
    this.data.ADDRESS_WAREHOUSE = this.data.API_BASE + 'api-address-getWarehouse.html';
    this.data.ADDRESS_ADD = this.data.API_BASE + 'api-address-addition.html';
    this.data.ADDRESS_EDIT = this.data.API_BASE + 'api-address-edit.html';
    this.data.ADDRESS_DELETE = this.data.API_BASE + 'api-address-del.html';

    // Receipt related
    this.data.RECEIPT_LIST = this.data.API_BASE + 'api-invoice-getList.html';
    this.data.RECEIPT_ADD = this.data.API_BASE + 'api-invoice-addition.html';
    this.data.RECEIPT_DELETE = this.data.API_BASE + 'api-invoice-del.html';
    this.data.RECEIPT_CALC = this.data.API_BASE + 'api-invoice-calc.html';

    // Payment related
    this.data.PAYMENT_ACTION = this.data.API_BASE + 'api-payment-doPay.html';
    this.data.PAYMENT_INTERFACE_LIST = this.data.API_BASE + 'api-payment-getList.html';
    this.data.PAYMENT_DEPOSIT_LIST = this.data.API_BASE + 'api-user-deposit.html';

    return this.data;
  };
}])

.run(function($rootScope, $ionicPlatform, $cordovaGeolocation, mmrMetaFactory) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      if(window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
    }

    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    if(ionic.Platform.isAndroid()) {
      $rootScope.$root.platform = 'android';
    } else if(ionic.Platform.isIOS()) {
      if(window.cordova) {
        $rootScope.$root.platform = 'ios';
      } else {
        $rootScope.$root.platform = 'browser';
      }
    }

    // geo location
    // load geo position
    // var posOptions = { timeout: 5000, enableHighAccuracy: false };

    // $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
    //   var latitude  = position.coords.latitude;
    //   var longitude = position.coords.longitude;

    //   // get current location
    //   mmrMetaFactory.location(longitude + ',' + latitude);
    // }, function(err) {
    //   // error
    //   console.log(err);
    // });

    // prepare the camera
    // TODO
  });

  // add utils for the whole app
  window.mmr = window.mmr || {};
  window.mmr.random = window.mmr.random || {};
  window.mmr.random.randomBoolean = function() {
    if(Math.random() > 0.5) {
      return true;
    } else {
      return false;
    }
  };

})

.config(['$ionicConfigProvider', '$stateProvider', '$urlRouterProvider', '$httpProvider', 'localStorageServiceProvider', '$provide', 'ionGalleryConfigProvider',
  function($ionicConfigProvider, $stateProvider, $urlRouterProvider, $httpProvider, localStorageServiceProvider, $provide, ionGalleryConfigProvider) {
  $ionicConfigProvider.tabs.style('standard');
  $ionicConfigProvider.tabs.position('bottom');

  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

  // add default global timeout
  $provide.decorator('$httpBackend', function($delegate) {
    return function (splat) {
      var args = arguments;
      if (typeof timeout === 'undefined') {
        args[5] = 10000; // Default timeout in milliseconds
      }
      return $delegate.apply($delegate, args);
    };
  });

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:


  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('tab.notification-home', {
    url: '/notification',
    views: {
      'tab-home': {
        templateUrl: 'templates/notification-center.html',
        controller: 'NotificationCtrl'
      }
    }
  })

  .state('tab.categories', {
    url: '/categories/:cid',
    views: {
      'tab-categories': {
        templateUrl: 'templates/categories.html',
        controller: 'CategoryCtrl'
      }
    }
  })

  .state('tab.cart', {
    url: '/cart/:tab',
    views: {
      'tab-cart': {
        templateUrl: 'templates/cart.html',
        controller: 'CartCtrl'
      }
    }
  })

  .state('tab.mine', {
    url: '/mine',
    views: {
      'tab-mine': {
        templateUrl: 'templates/mine.html',
        controller: 'MineCtrl'
      }
    }
  })

  .state('tab.notification-mine', {
    url: '/notification',
    views: {
      'tab-mine': {
        templateUrl: 'templates/notification-center.html',
        controller: 'NotificationCtrl'
      }
    }
  })

  .state('tab.config-mine', {
    url: '/config',
    views: {
      'tab-mine': {
        templateUrl: 'templates/mine-configuration.html',
        controller: 'ConfigCtrl'
      }
    }
  })

  .state('tab.orders-mine', {
    url: '/orders/:orderType',
    views: {
      'tab-mine': {
        templateUrl: 'templates/mine-orders.html',
        controller: 'OrderCtrl'
      }
    }
  });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

  // config local storage
  localStorageServiceProvider
    .setPrefix('mmr')
    .setNotify(true, true);

  // config the ion gallery
  ionGalleryConfigProvider.setGalleryConfig({
    action_label: '关闭',
    toggle: true,
    row_size: 5
  });
}]);
