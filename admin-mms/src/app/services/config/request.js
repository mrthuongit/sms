/**
 * @author v.lugovsky
 * created on 03.05.2016
 */
(function () {
  'use strict';

  angular.module('adminmms.service')
      .service('$request', request);

  /** @ngInject */
  function request($http, localStorageService ) {
  	var _self = this;
    //_self.host = "http://52.26.134.93";
    _self.host = "http://localhost";
    _self.port= "3030";
    _self.dbName = "thuong";
    _self.password = "abcd1234";
    this.postRequest = function(path, param, callbackSuccess, callbackError){
      var url = _self.host + ":" + _self.port + path;
      param.password = _self.password;
      $http.post(url, param)
      .success(function(data) {
        if(data.result.error){
          callbackError(data.result.message);
        } else{
          callbackSuccess(data);
        }
      })
      .error(function(err) {
        callbackError(err);
      });
    };

  }
})();
