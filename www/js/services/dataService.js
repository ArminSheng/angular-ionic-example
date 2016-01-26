angular.module('mmr.services')

.factory('mmrDataService', ['$q', 'mmrCommonService', 'mmrLoadingFactory',
  function($q, mmrCommonService, mmrLoadingFactory) {

  return {

    request: function() {
      if(arguments && arguments.length === 0) {
        return;
      }

      mmrLoadingFactory.show();

      var dfd = $q.defer(),
          results = new Array(arguments.length);


      var errorFlag = false;
      _.forEach(arguments, function(q, idx) {
        q.then(function(res) {
          if(res.status === 0) {
            errorFlag = true;
          } else {
            results[idx] = res.data;
          }
        }, function(err) {
          errorFlag = true;
        });
      })

      $q.all(arguments).then(responseCore);

      function responseCore() {
        mmrLoadingFactory.hide();

        if(errorFlag) {
          dfd.reject();
          mmrCommonService.networkDown();
        } else {
          dfd.resolve(results);
          mmrCommonService.networkUp();
        }
      };

      return dfd.promise;
    }

  };

}]);
