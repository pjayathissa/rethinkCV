'use strict';

angular.
  module('phonecatApp').
  config(['$locationProvider' ,'$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/phones', {
          template: '<phone-list></phone-list>'
        }).
        when('/standard-list', {
          template: '<standard-list></standard-list>'
        }).
        when('/world-map', {
          template: '<world-map val="data"></world-map>'
        }).
        when('/node-map', {
          template: '<node-map></node-map>'
        }).
        when('/about', {
          template: '<about></about>'
        }).
        when('/phones/:phoneId', {
          template: '<phone-detail></phone-detail>'
        }).
        when('/experiences/:experienceId', {
          template: '<experience-detail></experience-detail>'
        }).
        otherwise('/standard-list');
    }
  ]);
