/**
 * @author v.lugovsky
 * created on 03.05.2016
 */
(function () {
  'use strict';

  angular.module('mms.service')
      .service('$request', request);

  /** @ngInject */
  function request($http, $ionicLoading) {
  	var _self = this;
    //_self.host = "http://52.24.18.179";
    //_self.host = "http://192.168.1.97";
    _self.host = "http://192.168.100.20";
    _self.port= "3030";
    _self.password = "abcd1234";
    this.postRequest = function(path, param, callbackSuccess, callbackError){
      var url = _self.host + ":" + _self.port + path;
      $ionicLoading.show({
        template: 'Loading...',
        duration: 3000
      });
      param.password = _self.password;
      $http.post(url, param)
      .success(function(data) {
        $ionicLoading.hide();
        if(!data.result){
          callbackSuccess(null);
        } else{
          if(data.result.error){
            callbackError(data.result);
          } else{
            callbackSuccess(data.result);
          }
        }
      })
      .error(function(err) {
        $ionicLoading.hide();
        callbackError(err);
      });
    };

  }
})();
