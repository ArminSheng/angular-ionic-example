angular.module('mmr.directives')

.directive('searchListKeyword', ['$rootScope', '$ionicPopup',
  function($rootScope, $ionicPopup) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      keywords: '='
    },
    templateUrl: 'templates/directives/search/search-list-keyword.html',
    link: function(scope, element, attrs) {

      scope.doSelectSearchKeyword = function(keyword) {
        console.log(keyword);
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

    }
  };
}]);
