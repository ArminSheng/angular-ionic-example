// MMR App
angular.module('mmr', ['ngAnimate', 'ionic', 'mmr.controllers', 'mmr.services', 'mmr.directives', 'ngCordova', 'angular-md5', 'LocalStorageModule'])

.constant('SITE_BASE', 'http://demo.0lz.net/buttin/www/')
.constant('REST_BASE', 'http://192.168.1.126:8081/mmr/')

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

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(['$ionicConfigProvider', '$stateProvider', '$urlRouterProvider', '$httpProvider', 'localStorageServiceProvider',
  function($ionicConfigProvider, $stateProvider, $urlRouterProvider, $httpProvider, localStorageServiceProvider) {
  $ionicConfigProvider.tabs.style('standard');
  $ionicConfigProvider.tabs.position('bottom');

  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

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
        controller: 'HomeCtrl',
        resolve: {
          banners: function(mmrAreaFactory) {
            return mmrAreaFactory.banners().then(function(res) {
              return res;
            }, function(err) {
              return err;
            });
          },
          areas: function(mmrAreaFactory) {
            return mmrAreaFactory.areas().then(function(res) {
              return res;
            }, function(err) {
              return err;
            });
          },
          seckilling: function(mmrItemFactory) {
            return mmrItemFactory.seckilling().then(function(res) {
              return res;
            }, function(err) {
              return err;
            });
          },
          homeCommodity: function(mmrItemFactory) {
            return mmrItemFactory.homeCommodity().then(function(res) {
              return res;
            }, function(err) {
              return err;
            })
          }
        }
      }
    }
  })

  .state('tab.categories', {
    url: '/categories',
    views: {
      'tab-categories': {
        templateUrl: 'templates/categories.html',
        controller: 'CategoryCtrl'
      }
    }
  })

  .state('tab.cart', {
    url: '/cart',
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
        controller: 'MineCtrl',
        resolve: {
          recommendedItems: function(mmrItemFactory) {
            return mmrItemFactory.recommend().then(function(res) {
              return res;
            }, function(err) {
              return err;
            });
          }
        }
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

  // config local storage
  localStorageServiceProvider
    .setPrefix('mmr')
    .setNotify(true, true);
}]);
