angular.module('mmr.directives')

.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/directives/notification-center.html',
    '<a class="button button-icon icon ion-chatbubble-working" ng-click="doCheckNotification()">' +
    '<span class="badge badge-assertive m-badge">{{ count }}</span>');

  $templateCache.put('templates/directives/common/back-to-top-area.html',
    '<div class="m-back-to-top-area" ng-class="{\'activated\': show}" ng-click="scrollToTop({})">' +
    '<img class="m-back-to-top-img" ng-src="img/common/to-top.png"></img>' +
    '</div>');

  // fav icon
  $templateCache.put('templates/directives/common/fav-icon.html',
    '<div class="m-fav-icon" ng-class="{{ additionalClass }}" ng-click="toggleFavStatus()">' +
    '<span class="m-fav-icon-img"><i class="icon" ng-class="{\'ion-ios-star-outline\': !fav, \'ion-ios-star\': fav}"></i></span>' +
    '<span class="m-fav-icon-text">{{ fav ? \'取消收藏\' : \'关注收藏\' }}</span>' +
    '</div>');
}])

.directive('backToTopArea', [function() {

  return {
    retrict: 'E',
    replace: true,
    scope: {
      show: '=',
      scrollToTop: '&',
      additionalClass: '@'
    },
    templateUrl: 'templates/directives/common/back-to-top-area.html',
    link: function(scope, element, attrs) {
      if(scope.additionalClass) {
        element.addClass(scope.additionalClass);
      }
    }
  };

}])

.directive('notificationCenter', ['$state', function($state) {

  return {
    retrict: 'E',
    replace: true,
    scope: {
      count: '@',
      target: '@'
    },
    templateUrl: 'templates/directives/notification-center.html',
    link: function(scope, element, attrs) {

      // on click event
      scope.doCheckNotification = function() {
        $state.go(scope.target);
      };
    }
  };

}])

.directive('filterTabs', [function() {

  return {
    retrict: 'E',
    replace: true,
    scope: {
      tabs: '=',
      currentTab: '@',
      action: '&'
    },
    templateUrl: 'templates/directives/common/filter-tabs.html',
    link: function(scope, element, attrs) {
      scope.switchTab = function(tab) {
        scope.action({'tab': tab});
      };
    }
  };

}])

.directive('networkDown', [function() {

  return {
    retrict: 'E',
    replace: true,
    scope: false,
    templateUrl: 'templates/directives/common/network-down.html',
    link: function(scope, element, attrs) {
      scope.doReload = function() {
        scope.initialize();
      };
    }
  };

}])

.directive('animationCallback', [function() {

  return {
    restrict: 'A',
    scope: false,
    link: function(scope, element, attrs) {
      element.bind('oatransitionend transitionend webkitTransitionEnd', function() {
        // define callback logic below
      });
    }
  };

}])

.directive('backdrop', ['mmrEventing', function(mmrEventing) {
  return {
    retrict: 'E',
    replace: 'true',
    scope: {
      isShow: '='
    },
    templateUrl: 'templates/directives/common/backdrop.html',
    link: function(scope, element, attrs) {
      scope.doHideBackdrop = function() {
        scope.isShow = false;
        mmrEventing.doHideBackdrop();
      };
    }
  };
}])

.directive('sorter', ['mmrEventing', function(mmrEventing) {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      eventName: '@',
      sorters: '=',
      sortActivated: '=',
      activateSort: '&',
      additionalClass: '@'
    },
    templateUrl: 'templates/directives/common/sorter.html',
    link: function(scope, element, attrs) {
      scope.selectedSortIndex = 0;

      scope.doSelectSorter = function(idx) {
        mmrEventing.doSelectSorter(scope.eventName, idx);
        scope.selectedSortIndex = idx;
        scope.sortActivated = false;
      };
    }
  };

}])

.directive('screener', ['$rootScope', 'mmrEventing',
  function($rootScope, mmrEventing) {

  var calcContentHeight = function() {
    // minus barHeight and optionsHeight and some offset
    var result = $(window).height() - 44 - 42 - 20;
    if($rootScope.$root.platform === 'ios') {
      result -= 20;
    }

    return result;
  };

  return {
    restrict: 'E',
    replace: true,
    scope: {
      eventPrefix: '@',
      tags: '=',
      screenActivated: '=',
      activateScreen: '&',
      additionalClass: '@'
    },
    templateUrl: 'templates/directives/common/screener.html',
    link: function(scope, element, attrs) {
      element.find('.m-screen-container-scroll').height(calcContentHeight());

      scope.doSelectItem = function(outerIdx, innerIdx, item) {
        // init and assignment
        item.selected = item.selected || false;
        if(item.selected) {
          item.selected = false;
        } else {
          item.selected = true;
        }

        mmrEventing.doBroadcastScreenEvent(scope.eventPrefix + 'SelectItem', {
          outer: outerIdx,
          inner: innerIdx,
          item: item
        });
      };

      scope.doResetScreen = function() {
        mmrEventing.doBroadcastScreenEvent(scope.eventPrefix + 'Reset', {});
      };

      scope.doConfirmScreen = function() {
        mmrEventing.doBroadcastScreenEvent(scope.eventPrefix + 'Confirm', {});
      };
    }
  };

}])

.directive('categoryMenu', ['$rootScope', function($rootScope) {

  function calcMenuVisibleHeight(scope, offset) {
    var result = $(window).height() - $rootScope.$root.ui.heights.headerBarHeight;
    if($rootScope.$root.platform === 'ios') {
      result -= $rootScope.$root.ui.heights.statusBarHeight;
    }

    if(scope.optionsBarOpened) {
      result -= $rootScope.$root.ui.heights.optionsBarHeight;
    }

    var offsetNumber = _.parseInt(offset);
    if(offsetNumber && _.isNumber(offsetNumber)) {
      result -= offsetNumber;
    }

    return result + 'px';
  }

  return {
    restrict: 'E',
    replace: true,
    scope: {
      menuOpened: '=',
      optionsBarOpened: '=',
      swipeMenu: '&',
      items: '=',
      additionalClass: '@',
      offset: '@'
    },
    templateUrl: 'templates/directives/common/category-menu.html',
    link: function(scope, element, attrs) {
      console.log(scope.offset);

      // watchers
      scope.$watch(function(scope) {
        return scope.items;
      }, function(newValue, oldValue, scope) {
        // calculate the actual height for the menu
        $('.m-cat-menu-content .scroll').height((50 * (newValue.length + 2)) + 'px');

        // calculate the actual occupied/visible height for the menu
        $('.m-cat-menu-content').height(calcMenuVisibleHeight(scope, scope.offset));
      });

      scope.$watch(function(scope) {
        return scope.optionsBarOpened;
      }, function(newValue, oldValue, scope) {
        // calculate the actual occupied/visible height for the menu
        $('.m-cat-menu-content').height(calcMenuVisibleHeight(scope, scope.offset));
      });

    }
  };

}])

.directive('favIcon', [function() {

  return {

    restrict: 'E',
    replace: true,
    scope: {
      fav: '=',
      additionalClass: '@'
    },
    templateUrl: 'templates/directives/common/fav-icon.html',
    link: function(scope, element, attrs) {
      scope.toggleFavStatus = function() {
        scope.fav = !scope.fav;
      };
    }

  };

}]);
