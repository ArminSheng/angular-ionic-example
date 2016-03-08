angular.module('mmr.controllers')

.controller('MainCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$ionicHistory', '$interval', 'mmrCommonService', 'mmrMetaFactory', 'mmrLoadingFactory', 'mmrSearchService', 'mmrCartService', 'mmrEventing', 'mmrCacheFactory',
  function($scope, $rootScope, $state, $stateParams, $ionicHistory, $interval, mmrCommonService, mmrMetaFactory, mmrLoadingFactory, mmrSearchService, mmrCartService, mmrEventing, mmrCacheFactory) {

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
      avatar: 'img/mine/avatar-bak.png',
      phone: '18501751020',
      username: 'destiny1020',
      email: 'destiny.jiang@gmail.com',
      qq: '277727633',
      birthday: new Date('1987-10-20'),
      deposit: 10.0,
      oldUserAccounts: [
        'mmr-mmr-mmr1@mmr.com',
        'mmr-mmr-mmr2@mmr.com',
        'mmr-mmr-mmr3@mmr.com'
      ]
    },
    addresses: [
      { 'id': 1, 'receiver': '姜瑞翔', 'cellphone': '18501751020', 'phoneArea': '021', 'phone': '45678900', 'city': '上海市', 'district': '普陀区', 'street': '曹杨路绿地和创中心1306室', isDefault: true, isReceiptDefault: false, isQuarantineDefault: false },
      { 'id': 2, 'receiver': '姜瑞翔', 'cellphone': '18501751020', 'phoneArea': '021', 'phone': '45678900', 'city': '上海市', 'district': '普陀区', 'street': '曹杨路绿地和创中心1308室', isDefault: false, isReceiptDefault: true, isQuarantineDefault: false },
      { 'id': 3, 'receiver': '姜瑞翔', 'cellphone': '18501751020', 'phoneArea': '021', 'phone': '45678900', 'city': '上海市', 'district': '普陀区', 'street': '曹杨路绿地和创中心1309室', isDefault: false, isReceiptDefault: false, isQuarantineDefault: true },
      { 'id': 4, 'receiver': '姜瑞翔', 'cellphone': '18501751020', 'phoneArea': '021', 'phone': '45678900', 'city': '上海市', 'district': '普陀区', 'street': '曹杨路绿地和创中心1307室', isDefault: false, isReceiptDefault: false, isQuarantineDefault: false },
      { 'id': 5, 'receiver': '姜瑞翔', 'cellphone': '18501751020', 'phoneArea': '021', 'phone': '45678900', 'city': '上海市', 'district': '普陀区', 'street': '曹杨路绿地和创中心1310室', isDefault: false, isReceiptDefault: false, isQuarantineDefault: false }
    ],

    // network related
    network: true,
    networkDownStates: {

    },

    // category related
    category: {
      stack: [],
      items: []
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
      totalCount: 0,
      amounts: {
        '0': 0,
        '1': 0
      },
      counts: {
        '0': 0,
        '1': 0
      },
      allChecked: {
        '0': false,
        '1': false
      },
      checkedCounts: {
        '0': 0,
        '1': 0
      },
      checkedAmounts: {
        '0': 0,
        '1': 0
      },

      // items count: id ---> count
      itemsCount: {

      },

      // items ID ---> true : exists
      itemsId: {

      },

      // shops and items
      reservedOrders: [
        // {
        //   id: 123,
        //   name: '上海双汇有限公司',
        //   items: [
        //     {
        //       id: 1,
        //       name: 'xxx',
        //       imagePath: 'xxx',
        //       attribute: '冻品',
        //       price: 190,
        //       quantity: 3,
        //       unitName: '箱'
        //     }
        //   ]
        // }
      ],

      normalOrders: [

      ]
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

  // retrieve cart item number
  $rootScope.getCartItemCount = function() {
    if($rootScope.$root.cart.totalCount >= 100) {
      return '99+';
    }

    return $rootScope.$root.cart.totalCount;
  };

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
    console.log($state.current.name);
    $rootScope.$broadcast('loading.show');
  });

  $rootScope.$on('$stateChangeSuccess', function () {
    console.log('end state change');
    console.log($state.current.name);

    if($state.current.name === 'tab.cart') {
      $rootScope.$root.ui.tabsHidden = false;
    }
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

  $rootScope.$on('doIncreaseItemCount', function($event, data) {
    var mappings = $rootScope.$root.cart.itemsCount;
    mappings[data.item.id] = mappings[data.item.id] || 0;
    mappings[data.item.id] = mappings[data.item.id] + 1;

    changeCartItems(data.item, mappings[data.item.id]);
  });

  $rootScope.$on('doDecreaseItemCount', function($event, data) {
    var mappings = $rootScope.$root.cart.itemsCount;
    mappings[data.item.id] = mappings[data.item.id] || 0;
    if(mappings[data.item.id] && mappings[data.item.id] > 0) {
      mappings[data.item.id] = mappings[data.item.id] - 1;
    }

    changeCartItems(data.item, mappings[data.item.id]);
  });

  $rootScope.$on('doSetItemCount', function($event, data) {
    var mappings = $rootScope.$root.cart.itemsCount;
    mappings[data.item.id] = mappings[data.item.id] || 0;
    mappings[data.item.id] = data.newCount;

    changeCartItems(data.item, mappings[data.item.id]);
  });

  $rootScope.$on('doAddItemToCart', function($event, data) {
    var mappings = $rootScope.$root.cart.itemsCount;

    changeCartItems(data.item, mappings[data.item.id], true);

    // popup the msg
    // mmrCommonService.help('添加成功', '您选择的商品已成功添加到购物车');
  });

  // event handlers
  $rootScope.$on('doSetCategoryItems', function($event, data) {
    if(data.shouldPush) {
      $rootScope.$root.category.stack.push(data.level);
    }

    var cache = mmrCacheFactory.get('classifications');
    $rootScope.$root.category.items = cache[data.level];
  });

  $rootScope.$on('doCategoryItemsBack', function($event, data) {
    var stack = $rootScope.$root.category.stack;
    if(stack.length > 1) {
      // remove the current level
      stack.pop();
      mmrEventing.doSetCategoryItems(stack[stack.length - 1], false);
    }
  });

  function changeCartItems(item, newCount, canAdd) {
    var shopItems, needRemoveShop;
    var itemsIdMapping = $rootScope.$root.cart.itemsId;
    var tab = item.isReserved ? 0 : 1;
    if(item.isReserved) {
      // reserve case
      shopItems = findShopItems($rootScope.$root.cart.reservedOrders, item);
      needRemoveShop = changeCartItemsCore(shopItems.items, item, newCount, itemsIdMapping, canAdd);

      if(needRemoveShop) {
        $rootScope.$root.cart.reservedOrders.splice(shopItems.idx, 1);
      }

      if(newCount === 0) {
        updateQuantity(item, newCount);
        mmrCartService.updateCheckedInformation(tab);
      }
    } else {
      // non-reserve case
      shopItems = findShopItems($rootScope.$root.cart.normalOrders, item);
      needRemoveShop = changeCartItemsCore(shopItems.items, item, newCount, itemsIdMapping, canAdd);

      if(needRemoveShop) {
        $rootScope.$root.cart.normalOrders.splice(shopItems.idx, 1);
      }

      if(newCount === 0) {
        updateQuantity(item, newCount);
        mmrCartService.updateCheckedInformation(tab);
      }
    }
  }

  function changeCartItemsCore(shopItems, item, newCount, itemsIdMapping, canAdd) {
    var isEmpty = false;

    shopItems.id = shopItems.id || item.shop.id;
    shopItems.name = shopItems.name || item.shop.item;
    shopItems.items = shopItems.items || [];

    // remove reserved item from items
    if(newCount === 0) {
      var removedIdx = _.findIndex(shopItems.items, function(o) { return o.id === item.id; });
      if(removedIdx >= 0) {
        shopItems.items.splice(removedIdx, 1);
        // remove mapping from itemsId
        itemsIdMapping[item.id] = false;
        if(shopItems.items.length === 0) {
          isEmpty = true;
        }
      }
    } else {
      // add or change quantity
      var changeIdx = _.findIndex(shopItems.items, function(o) { return o.id === item.id; });
      if(changeIdx >= 0) {
        // change quantity
        updateQuantity(shopItems.items[changeIdx], newCount);
      } else if(canAdd) {
        // add item
        addNewCartItem(shopItems.items, item, newCount, itemsIdMapping);
      }
    }

    return isEmpty;
  }

  function addNewCartItem(itemArray, item, newCount, itemsIdMapping) {
    // construct the cart item instance
    var cartItem = {};

    cartItem.id = item.id;
    cartItem.name = item.title;
    cartItem.imagePath = item.banners[0].path || ''; // first banner image as default
    cartItem.attribute = item.attribute;
    cartItem.price = item.cprice;
    cartItem.quantity = newCount;
    cartItem.unitName = item.unitName;
    cartItem.isReserved = item.isReserved;
    cartItem.shop = item.shop;

    itemArray.push(cartItem);

    // put item id into itemsId mappings
    itemsIdMapping[item.id] = true;

    updateQuantity(cartItem, newCount, true);

    return cartItem;
  }

  function findShopItems(shopItemsArray, item) {
    var shopIdx = _.findIndex(shopItemsArray, function(o) { return o.id === item.shop.id; });
    if(shopIdx >= 0) {
      return { idx: shopIdx, items: shopItemsArray[shopIdx] };
    } else {
      // create a new one and return it
      var newShopItems = {};

      newShopItems.id = item.shop.id;
      newShopItems.name = item.shop.name;
      newShopItems.items = [];

      shopItemsArray.push(newShopItems);
      return { idx: shopItemsArray.length - 1, items: newShopItems };
    }
  }

  function updateQuantity(item, newCount, directAdd) {
    var offset = 0,
        category = item.isReserved ? 0 : 1;
    if(directAdd) {
      offset = newCount;
    } else {
      offset = newCount - item.quantity;
    }

    $rootScope.$root.cart.totalCount += offset;
    $rootScope.$root.cart.counts[category] += offset;
    $rootScope.$root.cart.amounts[category] += (offset * item.price);

    // update itself
    item.quantity = newCount;
  }

}]);
