angular.module('mmr.controllers')

.controller('CategoryCtrl', ['$scope', '$rootScope', '$timeout', '$ionicScrollDelegate', 'localStorageService', 'mmrDataService', 'mmrEventing', 'mmrItemFactory', 'mmrCacheFactory',
  function($scope, $rootScope, $timeout, $ionicScrollDelegate, localStorageService, mmrDataService, mmrEventing, mmrItemFactory, mmrCacheFactory) {

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
  $scope.getScrollPosition = function() {
    var moveData = $ionicScrollDelegate.getScrollPosition().top;
    if(lastTops.length < 3) {
      lastTops.push(moveData);
    } else {
      lastTops.shift();
      lastTops.push(moveData);
    }

    if(lastTops.length === 3) {
      if(lastTops[2] >= lastTops[0]) {
        $rootScope.$root.ui.tabsHidden = true;
        $scope.optionsBarOpened = false;
      } else {
        $rootScope.$root.ui.tabsHidden = false;
        $scope.optionsBarOpened = true;
      }
    }

    if(moveData <= 0) {
      $rootScope.$root.ui.tabsHidden = false;
      $scope.optionsBarOpened = true;
    }

    $scope.$apply(function(){
      if(moveData > 150){
        $scope.showBacktoTopBtn=true;
      }else{
        $scope.showBacktoTopBtn=false;
      }
    }); //apply

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

  // watchers
  $scope.$watch(function(scope) {
    return scope.classifications[scope.currentLevel];
  }, function(newValue, oldValue, scope) {
    // calculate the actual height for the menu
    $('.m-cat-menu-content .scroll').height((50 * (newValue.length + 2)) + 'px');

    // calculate the actual occupied/visible height for the menu
    $('.m-cat-menu-content').height(calcMenuVisibleHeight());
  });

  $scope.$watch(function(scope) {
    return scope.optionsBarOpened;
  }, function(newValue, oldValue, scope) {
    // calculate the actual occupied/visible height for the menu
    $('.m-cat-menu-content').height(calcMenuVisibleHeight());
  });

  $scope.$watch(function(scope) {
    return scope.searchInputFocused;
  }, function(newValue, oldValue, scope) {
    // calculate the actual occupied/visible height for the menu
    if(newValue) {
      $('.m-cat-search').height(calcSearchPanelVisibleHeight(10));
    }
  });

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

  var barHeight = 44,
      filterOptionsHeight = 42,
      statusBarHeight = 20;
  function calcMenuVisibleHeight() {
    var result = $(window).height() - barHeight;
    if($rootScope.$root.platform === 'ios') {
      result -= statusBarHeight;
    }

    if($scope.optionsBarOpened) {
      result -= filterOptionsHeight;
    }

    return result + 'px';
  }

  function calcSearchPanelVisibleHeight(offset) {
    var result = $(window).height() - barHeight;
    if($rootScope.$root.platform === 'ios') {
      result -= statusBarHeight;
    }

    if(offset) {
      result += offset;
    }

    return result + 'px';
  }

  $scope.initialize();
}])

.controller('CategoryMenuCtrl', ['$scope', function($scope) {

}]);
