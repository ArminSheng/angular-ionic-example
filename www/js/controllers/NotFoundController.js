angular.module('mmr.controllers')

.controller('NotFoundCtrl', ['$scope', '$rootScope', '$state', '$ionicHistory',
	function($scope, $rootScope, $state, $ionicHistory) {

		$rootScope.$root.ui.tabsHidden = true;
		$scope.doBack = function() {
			$rootScope.$root.ui.tabsHidden = false;
    	$ionicHistory.goBack();
		};
}]);