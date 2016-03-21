angular.module('mmr.services')

.factory('mmrOrderFactory', ['$q', '$http', '$rootScope', 'restService', 'mmrCacheFactory', 'apiService', 'mmrDataService',
  function($q, $http, $rootScope, restService, mmrCacheFactory, apiService, mmrDataService) {

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

      // addresses
      addresses: {
        normal: {
          receiver: 'JPX',
          cellphone: '18501751020',
          street: '上海市绿心8888'
        },
        receipt: {
          receiver: 'JRX',
          cellphone: '18501751020',
          street: '上海市普陀区曹杨路绿地和创中心8888'
        },
        quarantine: {
          receiver: 'ZZY',
          cellphone: '18501751020',
          street: '上海市普陀区曹杨路绿地和创中心8888'
        }
      },

      money: {
        reserve: '123.55',
        final: '124.33',
        shipment: '100.1',
        coupon: '9999.3',
        actual: '10000.34',
        payback: '445'
      },

      times: {
        order: new Date(),
        reserve: new Date(),
        final: new Date(),
        send: new Date(),
        payback: new Date(),
        service: new Date()
      },

      service: {
        reason: '商品质量问题',
        detail: '不太新鲜，希望可以全部退货不太新鲜，希望可以全部退货不太新鲜，希望可以全部退货不太新鲜，希望可以全部退货不太新鲜，希望可以全部退货',
        photos: [
          {
            src: 'img/item/sample.png',
            sub: 'Title 1'
          },
          {
            src: 'img/item/sample.png',
            sub: 'Title 2'
          },
          {
            src: 'img/item/sample.png',
            sub: 'Title 3'
          },
          {
            src: 'img/item/sample.png',
            sub: 'Title 4'
          },
          {
            src: 'img/item/sample.png',
            sub: 'Title 5'
          }
        ]
      },

      subOrders: [
        {
          shopId: 123,
          name: '上海双汇有限公司',
          subOrderId: 'MMR20160101000001-1',
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
          name: '上海JPX有限公司',
          subOrderId: 'MMR20160101000001-2',
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
      status: 1,
      statusText: '待发货',
      orderId: 'MMR20160101000002',
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

      // addresses
      addresses: {
        normal: {
          receiver: 'JPX',
          cellphone: '18501751020',
          street: '上海市普陀区曹杨路绿地和创中心8888'
        },
        receipt: {
          receiver: 'JRX',
          cellphone: '18501751020',
          street: '上海市普陀区曹杨路绿地和创中心8888'
        },
        quarantine: {
          receiver: 'ZZY',
          cellphone: '18501751020',
          street: '上海市普陀区曹杨路绿地和创中心8888'
        }
      },

      subOrders: [
        {
          shopId: 123,
          name: '上海双汇有限公司',
          subOrderId: 'MMR20160101000002-1',
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
          name: '上海JPX有限公司',
          subOrderId: 'MMR20160101000002-2',
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
      status: 2,
      statusText: '待收货',
      orderId: 'MMR20160101000003',
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

      // addresses
      addresses: {
        normal: {
          receiver: 'JPX',
          cellphone: '18501751020',
          street: '上海市普陀区曹杨路绿地和创中心8888'
        },
        receipt: {
          receiver: 'JRX',
          cellphone: '18501751020',
          street: '上海市普陀区曹杨路绿地和创中心8888'
        },
        quarantine: {
          receiver: 'ZZY',
          cellphone: '18501751020',
          street: '上海市普陀区曹杨路绿地和创中心8888'
        }
      },

      subOrders: [
        {
          shopId: 123,
          name: '上海双汇有限公司',
          subOrderId: 'MMR20160101000003-1',
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
          name: '上海JPX有限公司',
          subOrderId: 'MMR20160101000003-2',
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
      status: 3,
      statusText: '待自提',
      orderId: 'MMR20160101000004',
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

      // addresses
      addresses: {
        normal: {
          receiver: 'JPX',
          cellphone: '18501751020',
          street: '上海市普陀区曹杨路绿地和创中心8888'
        },
        receipt: {
          receiver: 'JRX',
          cellphone: '18501751020',
          street: '上海市普陀区曹杨路绿地和创中心8888'
        },
        quarantine: {
          receiver: 'ZZY',
          cellphone: '18501751020',
          street: '上海市普陀区曹杨路绿地和创中心8888'
        }
      },

      subOrders: [
        {
          shopId: 123,
          name: '上海双汇有限公司',
          subOrderId: 'MMR20160101000004-1',
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
          name: '上海JPX有限公司',
          subOrderId: 'MMR20160101000004-2',
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
      status: 6,
      statusText: '售后中',
      orderId: 'MMR20160101000005',
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

      // addresses
      addresses: {
        normal: {
          receiver: 'JPX',
          cellphone: '18501751020',
          street: '上海市普陀区曹杨路绿地和创中心8888'
        },
        receipt: {
          receiver: 'JRX',
          cellphone: '18501751020',
          street: '上海市普陀区曹杨路绿地和创中心8888'
        },
        quarantine: {
          receiver: 'ZZY',
          cellphone: '18501751020',
          street: '上海市普陀区曹杨路绿地和创中心8888'
        }
      },

      subOrders: [
        {
          shopId: 123,
          name: '上海双汇有限公司',
          subOrderId: 'MMR20160101000005-1',
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
          name: '上海JPX有限公司',
          subOrderId: 'MMR20160101000005-2',
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

  var prepareOrderListVo = function(config) {
    var vo = {};

    if(config) {
      vo.t = config.type || 0;
    } else {
      vo.t = 0;
    }

    vo.uid = $rootScope.$root.pinfo.uid;

    return vo;
  };

  var postprocessOrders = function(orders) {

    _.forEach(orders, function(order) {
      // money information
      order.money = _.mapValues(order.money, function(value) {
        return Number(value);
      });

      // item image paths
      order.subOrders = _.values(order.subOrders);
      _.forEach(order.subOrders, function(subOrder) {
        _.forEach(subOrder.items, function(item) {
          item.imagePath = processImagePath(item.imagePath);
        });
      });
    });

    function processImagePath(imagePath) {
      if(imagePath && _.startsWith(imagePath, './')) {
        imagePath = apiService.API_BASE + imagePath.substring(2);
      } else {
        imagePath = 'img/item/sample.png';
      }

      return imagePath;
    }
  };

  return {
    orders: function() {
      // save into cache
      // mmrCacheFactory.set('orders', orders);
      return [];
    },

    // [Mock Usage]
    generate: function() {
      return $http({
        url: restService.API_REST + 'c_order/generate',
        method: 'POST'
      });
    },

    generate2: function(info) {
      return $http({
        url: apiService.ORDER_GENERATE,
        method: 'POST',
        data: info
      });
    },

    fetchOrderList: function(config) {
      var dfd = $q.defer();

      mmrDataService.request($http({
        url: apiService.ORDER_LIST,
        method: 'POST',
        data: prepareOrderListVo(config)
      }), '正在加载订单列表...').then(function(res) {
        res = res[0];

        if(res instanceof Array) {
          postprocessOrders(res);
        } else {
          res = [];
        }

        dfd.resolve(res);
      }, function(err) {
        dfd.reject(err);
      });

      return dfd.promise;
    }
  };

}]);
