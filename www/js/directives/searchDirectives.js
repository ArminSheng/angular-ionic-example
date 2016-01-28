angular.module('mmr.directives')

.directive('searchListKeyword', ['$rootScope', '$ionicPopup',
  function($rootScope, $ionicPopup) {

  function calcSearchPanelVisibleHeight(offset) {
    var result = $(window).height() - $rootScope.$root.ui.heights.headerBarHeight;
    if($rootScope.$root.platform === 'ios') {
      result -= $rootScope.$root.ui.heights.statusBarHeight;
    }

    if(offset) {
      result += offset;
    }

    return result + 'px';
  }

  return {
    restrict: 'E',
    replace: true,
    scope: {
      hotKeywords: '=',
      keywords: '=',
      searchInputFocused: '='
    },
    templateUrl: 'templates/directives/search/search-list-keyword.html',
    link: function(scope, element, attrs) {

      scope.doSelectSearchKeyword = function(keyword) {

      };

      scope.doDeleteSearchRecord = function() {
        $ionicPopup.confirm({
          title: '确定要删除搜索记录吗',
          template: '你确定要删除搜索记录吗？',
          cancelText: '取消',
          okText: '删除',
          okType: 'button-energized'
        }).then(function(res) {
          if(res) {
            // confirm to delete
            $rootScope.$root.search.keywords = [];
          } else {
            // not to delete
          }
        });
      };

      scope.$watch(function(scope) {
        return scope.searchInputFocused;
      }, function(newValue, oldValue, scope) {
        // calculate the actual occupied/visible height for the menu
        if(newValue) {
          $('.m-cat-search').height(calcSearchPanelVisibleHeight(10));
        }
      });

    }
  };
}]);
