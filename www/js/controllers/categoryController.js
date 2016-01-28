angular.module('mmr.controllers')

.controller('CategoryCtrl', ['$scope', '$rootScope', '$timeout', '$ionicScrollDelegate', 'localStorageService', 'mmrDataService', 'mmrEventing', 'mmrItemFactory', 'mmrCacheFactory', 'mmrScrollService',
  function($scope, $rootScope, $timeout, $ionicScrollDelegate, localStorageService, mmrDataService, mmrEventing, mmrItemFactory, mmrCacheFactory, mmrScrollService) {

  // sort related
  $scope.sortEventName = 'eventCategorySort';
  $scope.sortActivated = false;

  // screen related
  $scope.screenEventPrefix = 'eventCategoryScreen';
  $scope.screenActivated = false;

  // menu related
  $scope.currentLevel = 0;
  $scope.menuOpened = false;
  $scope.menuHeight = 0;

  // options bar related
  $scope.optionsBarOpened = true;

  // scroll related
  $scope.showBacktoTopBtn = false;

  // search related
  $scope.searchResults = [];
  $scope.searchInputFocused = false;

  // methods
  $scope.initialize = function() {
    mmrDataService.request(mmrItemFactory.search()).then(function(res) {
      $scope.searchResults = res[0];
    }, function(err) {

    });
  };

  $scope.activateSort = function() {
    $scope.screenActivated = false;
    $scope.sortActivated = !$scope.sortActivated;

    // close menu
    $scope.swipeMenu(false);
  };

  $scope.activateScreen = function() {
    $scope.sortActivated = false;
    $scope.screenActivated = !$scope.screenActivated;

    // close menu
    $scope.swipeMenu(false);

    // hide the bottom tabs
    $rootScope.$root.ui.tabsHidden = true;
  };

  $scope.swipeMenu = function(open) {
    $scope.menuOpened = open;

    // control the tab
    if(open) {
      $rootScope.$root.ui.tabsHidden = true;
    } else {
      $rootScope.$root.ui.tabsHidden = false;
    }
  };

  $scope.doTapBackdrop = function() {
    // reset all
    $scope.sortActivated = false;
    $scope.swipeMenu(false);
  };

  // scroll related
  var lastTops = [];
  $scope.onScroll = function() {
    var threshold = 150;
    mmrScrollService.onScroll({
      handler: 'searchScroll',
      scope: $scope,
      onDowning: function() {
        $rootScope.$root.ui.tabsHidden = true;
        $scope.optionsBarOpened = false;
      },
      onUping: function() {
        $rootScope.$root.ui.tabsHidden = false;
        $scope.optionsBarOpened = true;
      },
      onNegative: function() {
        $rootScope.$root.ui.tabsHidden = false;
        $scope.optionsBarOpened = true;
      },
      threshold: threshold,
      onThreshold: function(isGreaterThanThreshold) {
        $scope.$apply(function() {
          if(isGreaterThanThreshold) {
            $scope.showBacktoTopBtn = true;
          } else {
            $scope.showBacktoTopBtn = false;
          }
        }); //apply
      }
    })

    // hide the menu if opened
    if($scope.menuOpened) {
      $scope.menuOpened = false;
    }
  };

  $scope.scrollToTop = function() {
    $ionicScrollDelegate.scrollTop(true);
    $scope.showBacktoTopBtn = false;
  };

  // search related
  $scope.doSelectCategory = function(item) {
    // close menu
    $timeout(function() {
      $scope.swipeMenu(false);
    }, 500);
  };

  $scope.doFocusSearchInput = function() {
    $scope.searchInputFocused = true;
    $rootScope.$root.ui.tabsHidden = true;

    // hide the sort/screen
    $scope.sortActivated = false;
    $scope.screenActivated = false;
  };

  $scope.doBlurSearchInput = function($event) {
    $scope.searchInputFocused = false;
    $rootScope.$root.ui.tabsHidden = false;
  };

  $scope.doSearch = function(keyword) {
    var keywords = $rootScope.$root.search.keywords;
    // try to find the existing if any
    var existed = _.find(keywords, { text: keyword });
    if(existed) {
      // update the time
      existed.time = new Date();

      // sort the keywords by time
      keywords = _.sortBy(keywords, function(o) {
        return -o.time.getTime();
      });
    } else {
      // try to add new one into queue
      keywords.unshift({
        text: keyword,
        detail: '',
        time: new Date()
      });

      if(keywords.length > 15) {
        keywords.pop();
      }
    }
  };

  // cache bindings
  $scope.tags = [
    { title: '品牌', items: mmrCacheFactory.get('brands') },
    { title: '产品属性', items: mmrCacheFactory.get('attributes') }
  ];

  localStorageService.bind($scope, 'classifications');
  localStorageService.bind($scope, 'hotKeywords');

  // watchers

  // event handlers
  $scope.$on($scope.sortEventName, function($event, data) {
    // after selecting the new sorting method
  });

  $scope.$on($scope.screenEventPrefix + 'SelectItem', function($event, data) {

  });

  $scope.$on($scope.screenEventPrefix + 'Reset', function($event, data) {
    // make all selected flag to false
    _.forEach($scope.tags, function(tag) {
      _.forEach(tag.items, function(item) {
        item.selected = false;
      });
    });
  });

  $scope.$on($scope.screenEventPrefix + 'Confirm', function($event, data) {
    // confirm logic

    // hide the screen popup
    $scope.activateScreen();
  });

  $scope.initialize();
}])

.controller('CategoryMenuCtrl', ['$scope', function($scope) {

}]);
