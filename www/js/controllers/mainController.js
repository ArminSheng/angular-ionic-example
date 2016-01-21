angular.module('mmr.controllers')

.controller('MainCtrl', ['$scope', '$rootScope', '$ionicHistory', '$interval', 'mmrCommonService', 'mmrMetaFactory',
  function($scope, $rootScope, $ionicHistory, $interval, mmrCommonService, mmrMetaFactory) {

  $scope.myGoBack = function() {
    $rootScope.$root.ui.tabsHidden = false;
    $ionicHistory.goBack();
  };

  $rootScope.$root = {
    // notification related
    notificationCount: 5,

    // auth related
    isOldUser: true,
    authenticated: true,
    pinfo: {
      phone: '18501751020',
      username: 'destiny1020',
      email: 'destiny.jiang@gmail.com',
      qq: '277727633',
      birthday: new Date('1987-10-20'),
      deposit: 200.0,
      oldUserAccounts: [
        'mmr-mmr-mmr1@mmr.com',
        'mmr-mmr-mmr2@mmr.com',
        'mmr-mmr-mmr3@mmr.com'
      ]
    },
    addresses: [
      { 'receiver': '姜瑞翔', 'cellphone': '18501751020', 'phoneArea': '021', 'phone': '45678900', 'city': '上海市', 'district': '普陀区', 'street': '曹杨路绿地和创中心1306室', isDefault: true },
      { 'receiver': '姜瑞翔', 'cellphone': '18501751020', 'phoneArea': '021', 'phone': '45678900', 'city': '上海市', 'district': '普陀区', 'street': '曹杨路绿地和创中心1308室', isDefault: false },
      { 'receiver': '姜瑞翔', 'cellphone': '18501751020', 'phoneArea': '021', 'phone': '45678900', 'city': '上海市', 'district': '普陀区', 'street': '曹杨路绿地和创中心1309室', isDefault: false },
      { 'receiver': '姜瑞翔', 'cellphone': '18501751020', 'phoneArea': '021', 'phone': '45678900', 'city': '上海市', 'district': '普陀区', 'street': '曹杨路绿地和创中心1307室', isDefault: false },
      { 'receiver': '姜瑞翔', 'cellphone': '18501751020', 'phoneArea': '021', 'phone': '45678900', 'city': '上海市', 'district': '普陀区', 'street': '曹杨路绿地和创中心1310室', isDefault: false }
    ],

    // network related
    network: true,

    // UI related
    ui: {
      tabsHidden: false
    },

    // platform related
    platform: undefined
  };

  $rootScope.modals = $rootScope.modals || {};

  // send heartbeat every 30s
  $interval(function() {
    mmrCommonService.networkCheck();
  }, 30000);

  // retrieve meta data
  mmrMetaFactory.brands();
  mmrMetaFactory.attributes();
  mmrMetaFactory.classification();
  mmrMetaFactory.citiesAndDisctricts();

}]);