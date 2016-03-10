angular.module('mmr.controllers')

.controller('CategoryCtrl', ['$scope', '$rootScope', '$timeout', '$stateParams', '$ionicScrollDelegate', 'localStorageService', 'mmrDataService', 'mmrEventing', 'mmrItemFactory', 'mmrCacheFactory', 'mmrScrollService',
  function($scope, $rootScope, $timeout, $stateParams, $ionicScrollDelegate, localStorageService, mmrDataService, mmrEventing, mmrItemFactory, mmrCacheFactory, mmrScrollService) {

  $timeout(function() {
    var keyword = $stateParams.keyword;
    if(keyword && keyword !== 'init') {
      $scope.doSearch(keyword);
    } else {
      $scope.initialize();
    }
  }, 100);

  // sort related
  $scope.sortEventName = 'eventCategorySort';
  $scope.sortActivated = false;
  $scope.sortMethod = 0;

  // screen related
  $scope.screenEventPrefix = 'eventCategoryScreen';
  $scope.screenActivated = false;

  // menu related
  $scope.currentLevel = '';
  $scope.menuOpened = false;
  $scope.menuHeight = 0;

  // options bar related
  $scope.optionsBarOpened = true;

  // scroll related
  $scope.showBacktoTopBtn = false;

  // search related
  $scope.searchResults = [];
  $scope.searchInputFocused = false;
  $scope.searchCurrentPage = 0;
  $scope.searchCurrentKeyword = '';

  // methods
  $scope.initialize = function() {
    mmrDataService.request(mmrItemFactory.search({
      page: $scope.searchCurrentPage
    })).then(function(res) {
      $scope.searchResults = res[0];
      $scope.searchCurrentPage += 1;
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
    // make sure the menu items will be rendered when open the menu
    $timeout(function() {
      if(open) {
        mmrEventing.doRefreshCategoryMenu();
      }

      $scope.menuOpened = open;

      // control the tab
      if(open) {
        $rootScope.$root.ui.tabsHidden = true;
      } else {
        $rootScope.$root.ui.tabsHidden = false;
      }
    }, 200);
  };

  $scope.doTapBackdrop = function() {
    // reset all
    $scope.sortActivated = false;
    $scope.swipeMenu(false);
  };

  // inifinite scroll related
  $scope.moreDataCanBeLoaded = function() {
    if($scope.searchCurrentPage < 5) {
      return true;
    }
    return false;
  };

  $scope.loadMore = function() {
    $scope.isLoadingMore = true;

    mmrDataService.request(mmrItemFactory.search({
      page: $scope.searchCurrentPage,
      keyword: $scope.searchCurrentKeyword,
      sort: $scope.sortMethod
    })).then(function(res) {
      $scope.searchResults = $scope.searchResults.concat(res[0]);
      $scope.searchCurrentPage += 1;
      $scope.isLoadingMore = false;
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }, function(err) {

    });
  };

  // scroll related
  var lastTops = [];
  $scope.onScroll = function() {
    var threshold = 150;
    mmrScrollService.onScroll({
      handler: 'searchScroll',
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
        });
      }
    });

    // hide the menu if opened
    if($scope.menuOpened) {
      $scope.menuOpened = false;
    }
  };

  $scope.scrollToTop = function() {
    $ionicScrollDelegate.scrollTop(true);
    $scope.showBacktoTopBtn = false;
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

  $scope.doSubmitSearchRequest = function(keyword) {
    mmrEventing.doSelectSearchHistory({
      text: keyword
    });
  };

  $scope.doSearch = function(keyword) {
    // put the keyword into the input control
    $scope.searchKeyword = keyword;

    // send the search request
    $scope.searchCurrentKeyword = keyword;
    $scope.searchCurrentPage = 0;
    $scope.isLoadingMore = false;

    mmrDataService.request(mmrItemFactory.search({
      page: $scope.searchCurrentPage,
      keyword: keyword,
      sort: $scope.sortMethod
    })).then(function(res) {
      $scope.searchResults = res[0];
      $scope.searchCurrentPage += 1;

      // scroll to the top
      $scope.scrollToTop();
    }, function(err) {

    });

    // update the search history
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

    // hide the keyboard
    try {
      if(cordova && cordova.plugins && cordova.plugins.Keyboard) {
        $timeout(function() {
          cordova.plugins.Keyboard.close();
        }, 100);
      }
    } catch (e) {
      if (e instanceof ReferenceError) {
        // take necessary steps
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
    $scope.sortMethod = data;
    $scope.searchResults = mmrDataService.sortItems($scope.searchResults, $scope.sortMethod);
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

  // handler on history keyword click
  $scope.$on('doSelectSearchHistory', function($event, data) {
    $scope.doSearch(data.text);
    $scope.doBlurSearchInput();
  });
}])

.controller('CategoryMenuCtrl', ['$scope', function($scope) {

}]);
