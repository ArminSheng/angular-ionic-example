// MMR App
angular.module('mmr', ['ngAnimate', 'ionic', 'ion-gallery', 'mmr.controllers', 'mmr.services', 'mmr.directives', 'ngCordova', 'angular-md5', 'ngImgCrop', 'LocalStorageModule'])

.constant('SITE_BASE', 'http://demo.0lz.net/buttin/www/')
// .constant('REST_BASE', 'http://115.29.161.170:8081/mmr/')
.constant('REST_BASE', 'http://192.168.1.136:8081/mmr/')
.constant('API_BASE', 'http://demo.0lz.net/mmrou/')

.provider('siteService', ['SITE_BASE', function(SITE_BASE) {
  this.data = {
    'API_GET_VERIFY_CODE': 'http://demo.0lz.net/buttin/www/server/message',
    'API_VERIFY_CODE': 'http://demo.0lz.net/buttin/www/reg/verify_code',
    'API_RESET_PASSWORD': 'http://demo.0lz.net/buttin/www/reg/modifypwd',
    'API_CHANGE_PASSWORD': 'http://demo.0lz.net/buttin/www/reg/resetpwd',
    'API_LOGIN': 'http://demo.0lz.net/buttin/www/login/execution',
    'API_LOGOUT': 'http://demo.0lz.net/buttin/www/login/dropout',
    'API_REGISTER': 'http://demo.0lz.net/buttin/www/reg/reg_db'
  };

  this.$get = function() {
    return this.data;
  };
}])

.provider('restService', ['REST_BASE', function(REST_BASE) {
  this.data = {
    'API_REST': REST_BASE
  };

  this.$get = function() {
    return this.data;
  };
}])

.run(function($rootScope, $ionicPlatform) {
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
        args[5] = 5000; // Default timeout in milliseconds
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
    url: '/categories/:keyword',
    params: {
      keyword: 'hello'
    },
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
  })

  .state('404', {
    url: '/404',
    views: {
      '404': {
        templateUrl: 'templates/404.html',
        controller: 'NotFoundCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  // $urlRouterProvider.otherwise('/tab/home');
  $urlRouterProvider.otherwise('/404');

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
