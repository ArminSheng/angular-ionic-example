angular.module('mmr.services')

.factory('mmrNotificationFactory', ['$http', 'restService', 'mmrCacheFactory',
  function($http, restService, mmrCacheFactory) {

  // mock
  var notificationsType0 = [
    { time: new Date(), type: 0, timeBuy: new Date(), timeSent: new Date() },
    { time: new Date(), type: 0, timeBuy: new Date(), timeSent: new Date() },
    { time: new Date(), type: 0, timeBuy: new Date(), timeSent: new Date() },
    { time: new Date(), type: 0, timeBuy: new Date(), timeSent: new Date() },
    { time: new Date(), type: 0, timeBuy: new Date(), timeSent: new Date() },
  ],
    notificationsType1 = [
    { time: new Date(), type: 1, text: '这是一条系统消息1' },
    { time: new Date(), type: 1, text: '这是一条系统消息2' },
    { time: new Date(), type: 1, text: '这是一条系统消息3' },
    { time: new Date(), type: 1, text: '这是一条系统消息4' },
    { time: new Date(), type: 1, text: '这是一条系统消息5' }
  ];

  return {
    notifications: function() {
      // save into cache
      mmrCacheFactory.set('notifications', {
        '0': notificationsType0,
        // '1': notificationsType1
        '1': []   //test empty content
      });
    },
  };

}]);