angular.module('mmr.services')

.factory('mmrMineFactory', ['$http', 'restService', 'mmrCacheFactory',
  function($http, restService, mmrCacheFactory) {

  // mock
  var details = [
    { time: new Date(), direction: 'in', orderId: '20151223123456', amount: 200 },
    { time: new Date(), direction: 'out', orderId: '20151223123457', amount: 300 },
    { time: new Date(), direction: 'in', orderId: '20151223123458', amount: 400 },
    { time: new Date(), direction: 'out', orderId: '20151223123459', amount: 500.66 },
    { time: new Date(), direction: 'in', orderId: '20151223123460', amount: 700.33 },
    { time: new Date(), direction: 'out', orderId: '20151223123461', amount: 100.11 }
  ];

  var couponUnused = [
    { status: 0, periodStart: '2015-11-01', periodEnd: '2016-12-31', amount: 99, requirementAmount: 399, range: '禽类产品', compaign: '双11狂欢节' },
    { status: 0, periodStart: '2015-11-01', periodEnd: '2016-12-31', amount: 99, requirementAmount: 399, range: '禽类产品', compaign: '双11狂欢节' },
    { status: 0, periodStart: '2015-11-01', periodEnd: '2016-12-31', amount: 99, requirementAmount: 399, range: '禽类产品', compaign: '双11狂欢节' },
    { status: 0, periodStart: '2015-11-01', periodEnd: '2016-12-31', amount: 99, requirementAmount: 399, range: '禽类产品', compaign: '双11狂欢节' },
    { status: 0, periodStart: '2015-11-01', periodEnd: '2016-12-31', amount: 99, requirementAmount: 399, range: '禽类产品', compaign: '双11狂欢节' }
  ],

  couponUsed = [
    { status: 1, periodStart: '2015-11-01', periodEnd: '2016-12-31', amount: 99, requirementAmount: 399, range: '禽类产品', compaign: '双11狂欢节', usedTime: '2015-12-31 14:30:33' },
    { status: 1, periodStart: '2015-11-01', periodEnd: '2016-12-31', amount: 99, requirementAmount: 399, range: '禽类产品', compaign: '双11狂欢节', usedTime: '2015-12-31 14:30:33' },
    { status: 1, periodStart: '2015-11-01', periodEnd: '2016-12-31', amount: 99, requirementAmount: 399, range: '禽类产品', compaign: '双11狂欢节', usedTime: '2015-12-31 14:30:33' },
    { status: 1, periodStart: '2015-11-01', periodEnd: '2016-12-31', amount: 99, requirementAmount: 399, range: '禽类产品', compaign: '双11狂欢节', usedTime: '2015-12-31 14:30:33' },
    { status: 1, periodStart: '2015-11-01', periodEnd: '2016-12-31', amount: 99, requirementAmount: 399, range: '禽类产品', compaign: '双11狂欢节', usedTime: '2015-12-31 14:30:33' }
  ],

  couponExpired = [
    { status: 2, periodStart: '2015-11-01', periodEnd: '2015-12-31', amount: 99, requirementAmount: 399, range: '禽类产品', compaign: '双11狂欢节' },
    { status: 2, periodStart: '2015-11-01', periodEnd: '2015-12-31', amount: 99, requirementAmount: 399, range: '禽类产品', compaign: '双11狂欢节' },
    { status: 2, periodStart: '2015-11-01', periodEnd: '2015-12-31', amount: 99, requirementAmount: 399, range: '禽类产品', compaign: '双11狂欢节' },
    { status: 2, periodStart: '2015-11-01', periodEnd: '2015-12-31', amount: 99, requirementAmount: 399, range: '禽类产品', compaign: '双11狂欢节' },
    { status: 2, periodStart: '2015-11-01', periodEnd: '2015-12-31', amount: 99, requirementAmount: 399, range: '禽类产品', compaign: '双11狂欢节' }
  ];

  return {
    depositDetails: function() {
      // save into cache
      mmrCacheFactory.set('depositDetails', details);
      return details;
    },

    couponDetails: function() {
      // save into cache
      mmrCacheFactory.set('couponDetails.unused', couponUnused);
      mmrCacheFactory.set('couponDetails.used', couponUsed);
      mmrCacheFactory.set('couponDetails.expired', couponExpired);

      return [couponUnused, couponUsed, couponExpired];
    }
  };

}]);