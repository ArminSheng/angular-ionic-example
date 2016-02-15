angular.module('mmr.services')

.factory('mmrSearchService', ['mmrCacheFactory',
  function(mmrCacheFactory) {

  // mock data
  function getItemDetail(item) {
    item.category = '禽产品';
    item.fav = false;

    item.isNonStandard = true;
    if(item.id % 2 === 0) {
      item.isReserved = true;
    } else {
      item.isReserved = false;
    }

    item.inventoryAmount = 10000;

    item.spec = '约2000只每箱';
    item.place = '内蒙古 满洲里市';
    item.attribute = '冻品';

    item.review = {
      rate: 92,
      number: 7,
      last: {
        name: '185****1020',
        date: '2016-01-11 20:25',
        content: '肉特别新鲜。'
      }
    };

    if(item.id % 2 === 0) {
      item.shop = {
        id: 123,
        logoPath: 'img/item/sample.png',
        name: '上海双汇食品有限公司',
        open: '2015年11月11日',
        ratings: {
          description: 4.8,
          service: 4.6,
          logistics: 4.2
        }
      };
    } else {
      item.shop = {
        id: 124,
        logoPath: 'img/item/sample.png',
        name: '上海丸子食品有限公司',
        open: '2015年11月11日',
        ratings: {
          description: 4.8,
          service: 4.6,
          logistics: 4.2
        }
      };
    }

    item.banners = [
      { path: 'img/item/sample.png' },
      { path: 'img/item/sample.png' },
      { path: 'img/item/sample.png' },
      { path: 'img/item/sample.png' }
    ];

    item.detailImages = [
      { path: 'img/item/item-detail-1.png' },
      { path: 'img/item/item-detail-2.png' },
      { path: 'img/item/item-detail-3.png' }
    ];

    return item;
  }

  return {

    hotKeywords: function() {
      var hot = ['热词1', '热词2', '热词3', '热词4', '热词5', '热词6', '热词7', '热词8', '热词9', '热词10'];
      mmrCacheFactory.set('hotKeywords', hot);
    },

    itemDetail: function(item) {
      return getItemDetail(item);
    }

  };

}]);
