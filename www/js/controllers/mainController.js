angular.module('mmr.controllers')

.controller('MainCtrl', ['$scope', '$rootScope', '$ionicHistory', '$interval', 'mmrCommonService', 'mmrMetaFactory', 'mmrLoadingFactory', 'mmrSearchService',
  function($scope, $rootScope, $ionicHistory, $interval, mmrCommonService, mmrMetaFactory, mmrLoadingFactory, mmrSearchService) {

  // back related
  $scope.myGoBack = function() {
    $rootScope.$root.ui.tabsHidden = false;
    $ionicHistory.goBack();
  };

  // system wide configuration and data
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
    networkDownStates: {

    },

    // UI related
    ui: {
      tabsHidden: false,
      heights: {
        statusBarHeight: 20,
        headerBarHeight: 44,
        optionsBarHeight: 42
      }
    },

    // platform related
    platform: undefined,

    // important modals
    modals: {

    },

    // search related
    search: {
      keywords: [
        { text: '羊肉5', detail: '', time: new Date() },
        { text: '羊肉4', detail: '', time: new Date() },
        { text: '羊肉3', detail: '', time: new Date() },
        { text: '羊肉2', detail: '', time: new Date() },
        { text: '羊肉1', detail: '', time: new Date() }
      ]
    },

    // cart related
    cart: {
      amount: 1244.3,
      totalCount: 10,
      reservedCount: 7,
      normalCount: 3,
      checkedCount: 6,

      // items count: id ---> count
      itemsCount: {

      }
    }
  };

  $rootScope.modals = $rootScope.modals || {};

  $rootScope.sorters = $rootScope.sorters || {};
  $rootScope.sorters.common = [
    { 'text': '智能排序' },
    { 'text': '价格从高到低' },
    { 'text': '价格从低到高' },
    { 'text': '销量从高到低' },
    { 'text': '销量从低到高' }
  ];

  // send heartbeat every 30s
  $interval(function() {
    mmrCommonService.networkCheck();
  }, 30000);

  // retrieve meta data
  mmrMetaFactory.brands();
  mmrMetaFactory.attributes();
  mmrMetaFactory.classification();
  mmrMetaFactory.citiesAndDisctricts();

  // hot items
  mmrSearchService.hotKeywords();

  // emit status change events
  $rootScope.$on('$stateChangeStart', function () {
    console.log('start state change');
    $rootScope.$broadcast('loading.show');
  });

  $rootScope.$on('$stateChangeSuccess', function () {
    console.log('end state change');
    $rootScope.$broadcast('loading.hide');
  });

  // respond to the loading related events
  $rootScope.$on('loading.show', function() {
    console.log('show loading');
    mmrLoadingFactory.show();
  });

  $rootScope.$on('loading.hide', function() {
    console.log('hide loading');
    mmrLoadingFactory.hide();
  });

  $rootScope.$on('doIncreaseItem', function($event, itemId) {
    var mappings = $rootScope.$root.cart.itemsCount;
    mappings[itemId] = mappings[itemId] || 0;
    mappings[itemId] = mappings[itemId] + 1;
  });

  $rootScope.$on('doDecreaseItem', function($event, itemId) {
    var mappings = $rootScope.$root.cart.itemsCount;
    mappings[itemId] = mappings[itemId] || 0;
    if(mappings[itemId] && mappings[itemId] > 0) {
      mappings[itemId] = mappings[itemId] - 1;
    }
  });

}]);
