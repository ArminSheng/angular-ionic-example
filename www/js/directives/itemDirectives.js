angular.module('mmr.directives')

.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/directives/item-remain-time.html',
    '<span class="m-sec-killing-item-remain-time"></span>');
}])

.directive('seckillingList', [function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      items: '='
    },
    templateUrl: 'templates/directives/item-list-seckilling.html',
    link: function(scope, element, attrs) {

    }
  };
}])

.directive('recommendList', [function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      items: '='
    },
    templateUrl: 'templates/directives/item-list-recommending.html',
    link: function(scope, element, attrs) {

    }
  }
}])

.directive('itemRemainTime', ['$interval', function($interval) {
  var dayMillis = 86400000,
      hourMillis = 3600000,
      minuteMillis = 60000,
      secondMillis = 1000;

  var translate = function(millis) {
    if(millis > 0) {
      var dayRemain = Math.floor(millis / dayMillis),
          hourRemain = Math.floor(millis / hourMillis % 24),
          minuteRemain = Math.floor(millis / minuteMillis % 60),
          secondRemain = Math.floor(millis / secondMillis % 60);

      return '剩余<span style="color: red">' + dayRemain +
      '</span>天<span style="color: red">' + hourRemain +
      '</span>时<span style="color: red">' + minuteRemain +
      '</span>分<span style="color: red">' + secondRemain + '</span>秒';
    } else {
      return '已经过期';
    }
  };

  return {
    retrict: 'E',
    replace: true,
    scope: {
      time: '='
    },
    templateUrl: 'templates/directives/item-remain-time.html',
    link: function(scope, element, attrs) {
      var remainingMillis = new Date(scope.time).getTime() - new Date().getTime();

      if(remainingMillis > 0) {
        $interval(function() {
          scope.remainTime = translate(remainingMillis);
          element.html(scope.remainTime);
          remainingMillis = new Date(scope.time).getTime() - new Date().getTime();
        }, 1000, Math.ceil(remainingMillis / 1000));
      }
    }
  }
}])

.directive('commodityGrid', [function() {

  return {
    retrict: 'E',
    replace: true,
    scope: {
      items: '=',
      banner: '@'
    },
    templateUrl: 'templates/directives/commodity-grid.html',
    link: function(scope, element, attrs) {

    }
  };

}]);