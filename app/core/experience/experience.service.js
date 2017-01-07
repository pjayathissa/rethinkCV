'use strict';

angular.
  module('core.experience').
  factory('Experience', ['$resource',
    function($resource) {
      return $resource('experiences/:experienceId.json', {}, {
        query: {
          method: 'GET',
          params: {experienceId: 'experiences'},
          isArray: true
        }
      });
    }
  ]);
