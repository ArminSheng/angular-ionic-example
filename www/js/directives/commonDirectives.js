angular.module('mmr.directives')

.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/directives/notification-center.html',
    '<a class="button button-icon icon ion-chatbubble-working" ng-click="doCheckNotification()">' +
    '<span class="badge badge-assertive m-badge" ng-if="$root.authenticated && $root.notificationCount > 0">{{ count }}</span>');

  $templateCache.put('templates/directives/common/back-to-top-area.html',
    '<div class="m-back-to-top-area" ng-class="{\'activated\': show}" ng-click="scrollToTop({})">' +
    '<img class="m-back-to-top-img" ng-src="img/common/to-top.png"></img>' +
    '</div>');

  // fav icon
  $templateCache.put('templates/directives/common/fav-icon.html',
    '<div class="m-fav-icon" ng-class="{{ additionalClass }}" ng-click="toggleFavStatus({{id}})">' +
    '<span class="m-fav-icon-img"><i class="icon" ng-class="{\'ion-ios-star-outline\': !fav, \'ion-ios-star\': fav}"></i></span>' +
    '<span class="m-fav-icon-text">{{ fav ? \'取消收藏\' : \'关注收藏\' }}</span>' +
    '</div>');

  $templateCache.put('templates/directives/common/position-list.html',
    '<div class="m-position-list">' +
    '<div class="m-fixd-item">当前到货地址： 上海市</div>' +
    '<div class="m-fixd-item">全部城市</div>' +
    '<div class="m-positon-item" ng-click="doSelectPos($index, item, currentCity)" ng-repeat="item in items">' +
    '<span class="m-positon-item-text">{{ item }}</span>' +
    '<span ng-if="index === $index" class="select-checkmark icon ion-ios-checkmark energized"></span>' +
    '</div></div>'
    );

  $templateCache.put('templates/directives/common/no-more-content.html',
    '<div class="m-no-more-content">' +
    '<span class="m-no-more-content-text">{{ content }}</span>' +
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

.directive('notificationCenter', ['$state', 'mmrAuth',
  function($state, mmrAuth) {

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
        if(!mmrAuth.redirectIfNotLogin()) {
          $state.go(scope.target);
        }
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
      isShow: '=',
      clickToDismiss: '='
    },
    templateUrl: 'templates/directives/common/backdrop.html',
    link: function(scope, element, attrs) {
      if(angular.isUndefined(scope.clickToDismiss)) {
        scope.clickToDismiss = true;
      }

      scope.doHideBackdrop = function($event) {
        if(scope.clickToDismiss) {
          scope.isShow = false;
          mmrEventing.doHideBackdrop();
        }

        $event.preventDefault();
        $event.stopPropagation();
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

      scope.counter = 0;
      scope.doSelectItem = function(outerIdx, innerIdx, item, exclusively) {
        // init and assignment
        item.selected = item.selected || false;
        if(item.selected) {
          item.selected = false;
          scope.tags[outerIdx].selected[item.id] = false;
          scope.counter -= 1;
        } else {
          item.selected = true;
          scope.tags[outerIdx].selected[item.id] = true;
          scope.counter += 1;
        }

        // unselect others if exclusively
        if(exclusively && item.selected) {
          _.forEach(scope.tags[outerIdx].items, function(element, idx) {
            if(element.selected && idx !== innerIdx) {
              element.selected = false;
              scope.tags[outerIdx].selected[element.id] = false;
              scope.counter -= 1;
            }
          });
        }

        if(item.selected) {
          mmrEventing.doBroadcastScreenEvent(scope.eventPrefix + 'SelectItem', {
            outer: outerIdx,
            inner: innerIdx,
            item: item,
            exclusively: exclusively
          });
        }
      };

      scope.doResetScreen = function() {
        mmrEventing.doBroadcastScreenEvent(scope.eventPrefix + 'Reset', {});
        scope.counter = 0;
      };

      scope.doConfirmScreen = function() {
        mmrEventing.doBroadcastScreenEvent(scope.eventPrefix + 'Confirm', {});
      };

      scope.getCounter = function() {
        if(scope.counter > 9) {
          return '9+';
        } else {
          return scope.counter;
        }
      };
    }
  };

}])

.directive('categoryMenu', ['$rootScope', '$timeout', 'mmrMetaFactory', 'mmrEventing',
  function($rootScope, $timeout, mmrMetaFactory, mmrEventing) {

  // menu level stack
  var stack = [];

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
      // click handlers
      scope.doReturn = function() {
        mmrEventing.doCategoryItemsBack();
      };

      scope.doSelectCategory = function(item) {
        mmrMetaFactory.classification({
          gen: item.id,
          gid: item.gid + 1
        });

        // broadcast search by category menu event
        mmrEventing.doSelectCategoryMenu(item);

        // $timeout(function() {
        //   scope.swipeMenu(false);
        // }, 500);
      };

      // watchers
      scope.$watch(function(scope) {
        return scope.optionsBarOpened;
      }, function(newValue, oldValue, scope) {
        // calculate the actual occupied/visible height for the menu
        $('.m-cat-menu-content').height(calcMenuVisibleHeight(scope, scope.offset));
      });

      // event handlers
      scope.$on('doRefreshCategoryMenu', function($event, data) {
        // calculate the actual height for the menu
        var controlMenusCount = 2;
        if($rootScope.$root.category.stack.length <= 1) {
          controlMenusCount = 1;
        }

        $('.m-cat-menu-content .scroll').height((50 * (scope.items.length + controlMenusCount)) + 'px');

        // calculate the actual occupied/visible height for the menu
        $('.m-cat-menu-content').height(calcMenuVisibleHeight(scope, scope.offset));
      });
    }
  };

}])

.directive('favIcon', ['$rootScope', 'mmrDataService', 'mmrItemFactory', function($rootScope, mmrDataService, mmrItemFactory) {

  return {

    restrict: 'E',
    replace: true,
    scope: {
      fav: '=',
      id: '=',
      additionalClass: '@'
    },
    templateUrl: 'templates/directives/common/fav-icon.html',
    link: function(scope, element, attrs) {
      scope.toggleFavStatus = function(id) {

        if (!scope.fav === true) {
          mmrDataService.request(mmrItemFactory.footprintAdd({
            uid: $rootScope.$root.pinfo.uid,
            id: id,
            type: 3
          })).then(function(res) {

            if (res[0].status === '1') {
              scope.fav = !scope.fav;
            }
          });
        } else {
          mmrDataService.request(mmrItemFactory.footprintDelete({
            uid: $rootScope.$root.pinfo.uid,
            id: id,
            type: 3,
            fav: false
          })).then(function(res) {
            if (res[0].status === '1') {
              scope.fav = !scope.fav;
            }
          });
        }

      };
    }

  };

}])

.directive('positionList', ['mmrEventing', function(mmrEventing) {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      items: '=',
      currentCity: '='
    },
    templateUrl: 'templates/directives/common/position-list.html',
    link: function(scope, element, attrs) {
      scope.index = 1;

      // emit event data
      var data = {};

      scope.doSelectPos = function(idx, item) {
        scope.index = idx;
        scope.selectPos = false;

        // bind emit data
        data.idx = idx;
        data.item = item;
        mmrEventing.doSelectPos(data);
      };

      scope.$on('doSelectPos', function() {
        console.log('log');
      });
    }
  };

}])

.directive('emptyContent', ['$rootScope', function($rootScope) {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      words: '=',
      button: '=',
      additionalClass: '@'
    },
    templateUrl: 'templates/directives/common/empty-content.html',
    link: function(scope, element, attrs) {
      if ($rootScope.$root.platform == "android") {
        scope.isAndroid = true;
      }
    }
  };

}])

.directive('noMoreContent', [function() {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      content: '='
    },
    templateUrl: 'templates/directives/common/no-more-content.html',
    link: function(scope, element, attrs) {
      if(!scope.content) {
        scope.content = '到底了, 没有商品啦 :)';
      }
    }
  };

}]);
