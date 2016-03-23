angular.module('mmr.controllers')

.controller('ItemWrapperCtrl', ['$rootScope', '$scope', '$state', '$stateParams', 'mmrModal', 'mmrItemFactory', 'mmrCommonService',
  function($rootScope, $scope, $state, $stateParams, mmrModal, mmrItemFactory, mmrCommonService) {

  $rootScope.$root.ui.tabsHidden = true;

  $scope.initialize = function() {
    mmrItemFactory.openItemDetail({ id: $stateParams.id }).then(function(res) {
      mmrModal.createItemDetailModal($scope, res[0], true);
    }, function(err) {
      mmrCommonService.help('错误提示', err).then(function() {
        $rootScope.$root.ui.tabsHidden = false;
        $state.go('tab.home');
      });
    }).finally(function() {

    });
  };

  $scope.initialize();

}]);
