angular.module('mmr.directives')

.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/directives/item-remain-time.html',
    '<span class="m-sec-killing-item-remain-time"></span>');

  $templateCache.put('templates/directives/item/item-detail-images.html',
    '<div class="m-item-detail-images">' +
    '<div class="m-item-detail-image" ng-repeat="image in images"><img ng-src="{{ image.path }}"/></div>' +
    '</div>');
}])

.directive('seckillingList', ['mmrModal', function(mmrModal) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      items: '='
    },
    templateUrl: 'templates/directives/item-list-seckilling.html',
    link: function(scope, element, attrs) {
      scope.doOpenDetail = function(item) {
        mmrModal.createItemDetailModal(scope, item);
      };
    }
  };
}])

.directive('recommendList', ['mmrModal', function(mmrModal) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      items: '='
    },
    templateUrl: 'templates/directives/item-list-recommending.html',
    link: function(scope, element, attrs) {
      scope.doOpenDetail = function(item) {
        mmrModal.createItemDetailModal(scope, item);
      };
    }
  };
}])

.directive('itemRemainTime', ['$interval', function($interval) {
  var dayMillis = 86400000,
      hourMillis = 3600000,
      minuteMillis = 60000,
      secondMillis = 1000;

  var translate = function(millis, prefix, ignoreZero) {
    if(millis > 0) {
      var dayRemain = Math.floor(millis / dayMillis),
          hourRemain = Math.floor(millis / hourMillis % 24),
          minuteRemain = Math.floor(millis / minuteMillis % 60),
          secondRemain = Math.floor(millis / secondMillis % 60);

      var result = prefix;
      var ignoreStop = false;
      if(dayRemain > 0) {
        result += ('<span style="color: red">' + dayRemain + '</span>天');
        ignoreStop = true;
      }
      if(hourRemain > 0 || ignoreStop) {
        result += ('<span style="color: red">' + hourRemain + '</span>时');
        ignoreStop = true;
      }
      if(minuteRemain > 0 || ignoreStop) {
        result += ('<span style="color: red">' + minuteRemain + '</span>分');
        ignoreStop = true;
      }
      if(secondRemain > 0 || ignoreStop) {
        result += ('<span style="color: red">' + secondRemain + '</span>秒');
      }

      return result;
    } else {
      return '已经过期';
    }
  };

  return {
    retrict: 'E',
    replace: true,
    scope: {
      time: '=',
      prefix: '@',
      ignoreZero: '@'
    },
    templateUrl: 'templates/directives/item-remain-time.html',
    link: function(scope, element, attrs) {
      if(!angular.isDefined(scope.prefix)) {
        scope.prefix = '剩余';
      }
      if(!angular.isDefined(scope.ignoreZero)) {
        scope.ignoreZero = false;
      } else {
        if(scope.ignoreZero === 'true') {
          scope.ignoreZero = true;
        } else {
          scope.ignoreZero = false;
        }
      }

      var remainingMillis = new Date(scope.time).getTime() - new Date().getTime(),
          intervalPromise;

      if(remainingMillis > 0) {
        intervalPromise = $interval(function() {
          scope.remainTime = translate(remainingMillis, scope.prefix, scope.ignoreZero);
          element.html(scope.remainTime);
          remainingMillis = new Date(scope.time).getTime() - new Date().getTime();
        }, 1000, Math.ceil(remainingMillis / 1000));
      }

      // event handler
      scope.$on('$destroy', function($event) {
        if(intervalPromise) {
          $interval.cancel(intervalPromise);
        }
      });

      // watchers
      scope.$watch(function(scope) {
        return scope.prefix;
      }, function(newValue, oldValue, scope) {

      });
    }
  };
}])

.directive('commodityGrid', ['$state', 'mmrModal', function($state, mmrModal) {

  return {
    retrict: 'E',
    replace: true,
    scope: {
      items: '=',
      banner: '@',
      keyword: '@'
    },
    templateUrl: 'templates/directives/commodity-grid.html',
    link: function(scope, element, attrs) {
      scope.doCheckMore = function() {
        $state.go('tab.categories', {
          keyword: scope.keyword
        });
      };

      scope.doOpenDetail = function(item) {
        mmrModal.createItemDetailModal(scope, item);
      };
    }
  };

}])

.directive('searchResultList', ['mmrModal', 'mmrCartService',
  function(mmrModal, mmrCartService) {

  return {
    retrict: 'E',
    replace: true,
    scope: {
      items: '='
    },
    templateUrl: 'templates/directives/search-result-list.html',
    link: function(scope, element, attrs) {
      scope.doOpenDetail = function(item) {
        mmrModal.createItemDetailModal(scope, item);
      };

      scope.doChangeNumber = function(item, offset) {
        item.cartAmount = item.cartAmount || 0;
        item.cartAmount += offset;
        if(item.cartAmount < 0) {
          item.cartAmount = 0;
        }
      };
    }
  };

}])

.directive('collectProductList', ['mmrModal', function(mmrModal) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      items: '='
    },
    templateUrl: 'templates/directives/collect-product-list.html',
    link: function(scope, element, attrs) {
      scope.doChangeNumber = function(item, offset) {
        item.cartAmount = item.cartAmount || 0;
        item.cartAmount += offset;
        if(item.cartAmount < 0) {
          item.cartAmount = 0;
        }
      };

      scope.doOpenDetail = function(item) {
        mmrModal.createItemDetailModal(scope, item);
      };
    }
  };
}])

.directive('collectShopList', ['mmrModal', function(mmrModal) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      items: '='
    },
    templateUrl: 'templates/directives/collect-shop-list.html',
    link: function(scope, element, attrs) {
      scope.doOpenShopDetail = function(item) {
        if (scope.shopDetailModal && !scope.shopDetailModal.scope.$$destroyed) {
          scope.shopDetailModal.shop = item;
          scope.shopDetailModal.show();
        } else{
          mmrModal.createShopDetailModal(scope, item);
        }

      };
    }
  };
}])

.directive('itemDetailImages', [function() {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      images: '='
    },
    templateUrl: 'templates/directives/item/item-detail-images.html',
    link: function(scope, element, attrs) {

    }
  };

}])

.directive('itemReviewRating', [function() {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      item: '=',
      shop: '@'
    },
    templateUrl: 'templates/directives/item/item-review-rating.html',
    link: function(scope, element, attrs) {
      scope.switchRadio = function(selected) {
        scope.selected = selected;
      };
    }
  };

}])

.directive('itemReviewStar', [function() {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      item: '='
    },
    templateUrl: 'templates/directives/item/item-review-star.html',
    link: function(scope, element, attrs) {
      scope.selectStar = function(index) {
        scope.selected = index;
      };
    }
  };

}])

.directive('bottomDirectBuy', [function() {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      item: '='
    },
    templateUrl: 'templates/directives/item/bottom-direct-buy.html',
    link: function(scope, element, attrs) {
      scope.doCloseImmediateBuy = function() {
        element.removeClass('activated');
      };

      scope.$on('doBuyImmediately', function($event, data) {
        element.addClass('activated');
      });
    }
  };

}]);
