angular.module('mmr.services')

.factory('mmrDataService', ['$q', 'mmrCommonService', 'mmrLoadingFactory',
  function($q, mmrCommonService, mmrLoadingFactory) {

  return {

    request: function() {
      if(arguments && arguments.length === 0) {
        return;
      }

      // convert to array
      var parameters = Array.prototype.slice.call(arguments),
          loadingMsg;
      if(typeof(parameters[parameters.length - 1]) === 'string') {
        loadingMsg = parameters[parameters.length - 1];

        // remove the last element
        parameters.pop();
      }

      mmrLoadingFactory.show(loadingMsg);

      var dfd = $q.defer(),
          results = new Array(parameters.length);


      var errorFlag = false;
      _.forEach(parameters, function(q, idx) {
        q.then(function(res) {
          if(res.status === 0) {
            errorFlag = true;
          } else {
            results[idx] = res.data;
          }
        }, function(err) {
          errorFlag = true;
        });
      });

      $q.all(parameters).then(responseCore);

      function responseCore() {
        mmrLoadingFactory.hide();

        if(errorFlag) {
          dfd.reject();
          mmrCommonService.networkDown();
        } else {
          dfd.resolve(results);
          mmrCommonService.networkUp();
        }
      }

      return dfd.promise;
    },

    sortItems: function(data, sortMethod) {
      return _.sortBy(data, function(o) {
        switch(sortMethod) {
          case 0:
            return o.id;
          case 1:
            return -o.cprice;
          case 2:
            return o.cprice;
          case 3:
            return -o.salesAmount;
          case 4:
            return o.salesAmount;
        }
      });
    }

  };

}]);
