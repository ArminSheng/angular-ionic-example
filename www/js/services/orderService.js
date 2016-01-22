angular.module('mmr.services')

.factory('mmrOrderFactory', ['$http', 'restService', 'mmrCacheFactory',
  function($http, restService, mmrCacheFactory) {

  // mock
  // status:
  // 0: 待付款；1: 待发货；2: 待收货；3: 待自提；4: 完成；5: 关闭；6: 售后；7: 已派车；8: 已出库；21:预定待确认；22：预定已确认
  // order type:
  // 0: 预定；1: 一般
  // refund:
  // 0: 退款到余额；1: 原路返回
  // refunds:
  // 0: 无退款；1: 有退款
  var orders = [
    {
      status: 0,
      statusText: '待付款',
      orderId: 'MMR20160101000001',
      orderType: 1,
      orderTypeText: '一般订单',
      uid: '123',
      price: 2000,
      couponId: '123',
      balance: 0,
      shipment: 20,
      actuallyPaid: 2000,
      unpaid: 0,
      mentioning: 0,
      payBy: '支付宝',
      orderTime: '2016-01-01 12:12:12',
      payTime: '2016-01-01 12:20:12',
      quarantine: '上海市普陀区曹杨路绿地和创中心1306',
      quer1: '',
      quer2: '',
      invoice: true,
      warehouseAudit: true,
      refund: 0,
      refunds: 0,
      refundAmount: 0,
      logisticAudit: true,
      logisticAuditTime: '2016-01-01 13:12:12',
      storeId: '123',
      payNo: 'ALIPAY123456789',
      payDeadline: '2016-01-01 13:12:12',
      mentioningNumber: '888888',
      earnest: 0,  // 预付金额

      subOrders: [
        {
          shopId: 123,
          shopName: '上海双汇有限公司',
          items: [
            {
              name: '苏北草鸭腿950g',
              imagePath: 'img/item/sample.png',
              attribute: '冻品',
              price: 190,
              quantity: 3,
              unitName: '箱'
            },
            {
              name: '苏北草鸭腿950g',
              imagePath: 'img/item/sample.png',
              attribute: '鲜品',
              price: 200,
              quantity: 4,
              unitName: '箱'
            },
            {
              name: '苏北草鸭腿950g',
              imagePath: 'img/item/sample.png',
              attribute: '冻品',
              price: 210,
              quantity: 5,
              unitName: '箱'
            }
          ]
        },
        {
          shopId: 124,
          shopName: '上海JPX有限公司',
          items: [
            {
              name: '苏南草象腿950g',
              imagePath: 'img/item/sample.png',
              attribute: '冻品',
              price: 190,
              quantity: 3,
              unitName: '箱'
            },
            {
              name: '苏南草象腿950g',
              imagePath: 'img/item/sample.png',
              attribute: '鲜品',
              price: 200,
              quantity: 4,
              unitName: '箱'
            },
            {
              name: '苏南草象腿950g',
              imagePath: 'img/item/sample.png',
              attribute: '冻品',
              price: 210,
              quantity: 5,
              unitName: '箱'
            }
          ]
        }
      ]
    },

    {
      status: 0,
      statusText: '待付款',
      orderId: 'MMR20160101000001',
      orderType: 1,
      orderTypeText: '一般订单',
      uid: '123',
      price: 2000,
      couponId: '123',
      balance: 0,
      shipment: 20,
      actuallyPaid: 2000,
      unpaid: 0,
      mentioning: 0,
      payBy: '支付宝',
      orderTime: '2016-01-01 12:12:12',
      payTime: '2016-01-01 12:20:12',
      quarantine: '上海市普陀区曹杨路绿地和创中心1306',
      quer1: '',
      quer2: '',
      invoice: true,
      warehouseAudit: true,
      refund: 0,
      refunds: 0,
      refundAmount: 0,
      logisticAudit: true,
      logisticAuditTime: '2016-01-01 13:12:12',
      storeId: '123',
      payNo: 'ALIPAY123456789',
      payDeadline: '2016-01-01 13:12:12',
      mentioningNumber: '888888',
      earnest: 0,  // 预付金额

      subOrders: [
        {
          shopId: 123,
          shopName: '上海双汇有限公司',
          items: [
            {
              name: '苏北草鸭腿950g',
              imagePath: 'img/item/sample.png',
              attribute: '冻品',
              price: 190,
              quantity: 3,
              unitName: '箱'
            },
            {
              name: '苏北草鸭腿950g',
              imagePath: 'img/item/sample.png',
              attribute: '鲜品',
              price: 200,
              quantity: 4,
              unitName: '箱'
            },
            {
              name: '苏北草鸭腿950g',
              imagePath: 'img/item/sample.png',
              attribute: '冻品',
              price: 210,
              quantity: 5,
              unitName: '箱'
            }
          ]
        },
        {
          shopId: 124,
          shopName: '上海JPX有限公司',
          items: [
            {
              name: '苏南草象腿950g',
              imagePath: 'img/item/sample.png',
              attribute: '冻品',
              price: 190,
              quantity: 3,
              unitName: '箱'
            },
            {
              name: '苏南草象腿950g',
              imagePath: 'img/item/sample.png',
              attribute: '鲜品',
              price: 200,
              quantity: 4,
              unitName: '箱'
            },
            {
              name: '苏南草象腿950g',
              imagePath: 'img/item/sample.png',
              attribute: '冻品',
              price: 210,
              quantity: 5,
              unitName: '箱'
            }
          ]
        }
      ]
    },

    {
      status: 0,
      statusText: '待付款',
      orderId: 'MMR20160101000001',
      orderType: 1,
      orderTypeText: '一般订单',
      uid: '123',
      price: 2000,
      couponId: '123',
      balance: 0,
      shipment: 20,
      actuallyPaid: 2000,
      unpaid: 0,
      mentioning: 0,
      payBy: '支付宝',
      orderTime: '2016-01-01 12:12:12',
      payTime: '2016-01-01 12:20:12',
      quarantine: '上海市普陀区曹杨路绿地和创中心1306',
      quer1: '',
      quer2: '',
      invoice: true,
      warehouseAudit: true,
      refund: 0,
      refunds: 0,
      refundAmount: 0,
      logisticAudit: true,
      logisticAuditTime: '2016-01-01 13:12:12',
      storeId: '123',
      payNo: 'ALIPAY123456789',
      payDeadline: '2016-01-01 13:12:12',
      mentioningNumber: '888888',
      earnest: 0,  // 预付金额

      subOrders: [
        {
          shopId: 123,
          shopName: '上海双汇有限公司',
          items: [
            {
              name: '苏北草鸭腿950g',
              imagePath: 'img/item/sample.png',
              attribute: '冻品',
              price: 190,
              quantity: 3,
              unitName: '箱'
            },
            {
              name: '苏北草鸭腿950g',
              imagePath: 'img/item/sample.png',
              attribute: '鲜品',
              price: 200,
              quantity: 4,
              unitName: '箱'
            },
            {
              name: '苏北草鸭腿950g',
              imagePath: 'img/item/sample.png',
              attribute: '冻品',
              price: 210,
              quantity: 5,
              unitName: '箱'
            }
          ]
        },
        {
          shopId: 124,
          shopName: '上海JPX有限公司',
          items: [
            {
              name: '苏南草象腿950g',
              imagePath: 'img/item/sample.png',
              attribute: '冻品',
              price: 190,
              quantity: 3,
              unitName: '箱'
            },
            {
              name: '苏南草象腿950g',
              imagePath: 'img/item/sample.png',
              attribute: '鲜品',
              price: 200,
              quantity: 4,
              unitName: '箱'
            },
            {
              name: '苏南草象腿950g',
              imagePath: 'img/item/sample.png',
              attribute: '冻品',
              price: 210,
              quantity: 5,
              unitName: '箱'
            }
          ]
        }
      ]
    }
  ];

  return {
    orders: function() {
      // save into cache
      mmrCacheFactory.set('orders', orders);
    },
  };

}]);
