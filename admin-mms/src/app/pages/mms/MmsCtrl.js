/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.mms')
    .controller('MmsCtrl', MmsCtrl);

  /** @ngInject */
  function MmsCtrl($scope, $MmsService, $uibModal) {
    var modalNewMms;
    $scope.new_mms = {};
    $scope.listMms = [];
    var _init = function(){
      $MmsService.getListMmsByState({state: false}, function(result){
        $scope.listMms = result.result.data;
      }, function(error){});
    };
    _init();
    $scope.openNewMms = function(){
      $scope.new_mms = {};
      modalNewMms = $uibModal.open({
        animation: true,
        templateUrl: "app/pages/mms/widgets/popup.new.mms.html",
        scope: $scope
      });
    };

    $scope.createNewMms = function(){
      if($scope.new_mms.body && $scope.new_mms.phones){
        $scope.new_mms.create_date = moment(new Date()).format("DD-MM-YYYY hh:mm");
        $MmsService.createMms($scope.new_mms, function(result){
          modalNewMms.dismiss();
          _init();
        }, function(error){})
      }
    }
  }

})();