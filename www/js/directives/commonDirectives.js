angular.module('mmr.directives')

.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/directives/notification-center.html',
    '<a class="button button-icon icon ion-chatbubble-working" ng-click="doCheckNotification()">'
     + '<span class="badge badge-assertive m-badge">{{ count }}</span>');
}])

.directive('notificationCenter', [function() {

  return {
    retrict: 'E',
    replace: true,
    scope: {
      count: '@'
    },
    templateUrl: 'templates/directives/notification-center.html',
    link: function(scope, element, attrs) {

      // on click event
      scope.doCheckNotification = function() {

      };
    }
  };

}]);