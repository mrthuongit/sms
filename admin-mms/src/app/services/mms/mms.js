/**
 * @author v.lugovsky
 * created on 03.05.2016
 */
(function () {
  'use strict';

  angular.module('adminmms.service')
      .service('$MmsService', MmsService);

  /** @ngInject */
  function MmsService($request, $http, localStorageService) {
    var _self = this;

    this.getListMmsByState = function(info, callbackSuccess, callbackError){
      var path ="/api/getListMmsByState";
      var param = {
       state: info.state
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.createMms = function(info, callbackSuccess, callbackError){
      var path ="/api/createMms";
      var param = {
       body: info.body,
       phones: info.phones,
       create_date: info.create_date
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };
  }
})();
