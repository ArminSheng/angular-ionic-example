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
        content: '肉特别新鲜。',
        avatar: 'img/mine/avatar-bak.png',
        rating: '0'
      },
      comments: []
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

  function getItemReviews(item) {
    item.review.comments = [
        {
          name: '18616151234',
          date: '2015-05-01 21:00',
          content: '肉很新鲜',
          avatar: 'img/mine/avatar-bak.png',
          rating: '0'
        },
        {
          name: '18612341234',
          date: '2015-05-01 20:10',
          content: '肉很新鲜',
          avatar: 'img/mine/avatar-bak.png',
          rating: '0'
        },
        {
          name: '18612341234',
          date: '2015-05-01 20:20',
          content: '一般般吧，不太好吃',
          avatar: 'img/mine/avatar-bak.png',
          rating: '1'
        },
        {
          name: '18612341234',
          date: '2015-05-01 20:30',
          content: '一般般吧，不太好吃',
          avatar: 'img/mine/avatar-bak.png',
          rating: '1'
        },
        {
          name: '18612341234',
          date: '2015-05-01 20:40',
          content: '大概三分之一已经软了，不新鲜，肉质不行，其他三分之二还可以。',
          avatar: 'img/mine/avatar-bak.png',
          rating: '2'
        },
        {
          name: '18612341234',
          date: '2015-05-01 20:50',
          content: '大概三分之一已经软了，不新鲜，肉质不行，其他三分之二还可以。',
          avatar: 'img/mine/avatar-bak.png',
          rating: '2'
        }
    ];
    item.review.comments.push(item.review.last);

    return item;
  }

  return {

    hotKeywords: function() {
      var hot = ['热词1', '热词2', '热词3', '热词4', '热词5', '热词6', '热词7', '热词8', '热词9', '热词10'];
      mmrCacheFactory.set('hotKeywords', hot);
    },

    itemDetail: function(item) {
      return getItemDetail(item);
    },

    itemReviews: function(item) {
      return getItemReviews(item);
    }
  };

}]);
