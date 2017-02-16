/**
 * @author v.lugovsky
 * created on 03.05.2016
 */
(function () {
  'use strict';

  angular.module('mms.service', [])
      .service('$MmsService', mms);

  /** @ngInject */
  function mms($request) {
    this.start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    this.end = new Date();
    var _sefl = this;
    this.getListMmsByState = function(info, callbackSuccess, callbackError){
      var path ="/api/getListMmsByState";
      var param = {
       state: info.state
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

    this.updateMms = function(info, callbackSuccess, callbackError){
      var path ="/api/updateStateMms";
      var param = {
       mms: info.mms,
       state: "done",
       send_date: moment(new Date).format("DD-MM-YYYY hh:mm")
      };
      $request.postRequest(path, param, callbackSuccess, callbackError);
    };

  }
})();
