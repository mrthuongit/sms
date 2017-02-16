/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.mms', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('mms', {
          url: '/mms',
          templateUrl: 'app/pages/mms/mms.html',
          title: 'Message',
          sidebarMeta: {
            icon: 'ion-android-home',
            order: 0,
          },
          controller: 'MmsCtrl'
        });
  }

})();
