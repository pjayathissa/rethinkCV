'use strict';

angular.
  module('core.phone').
  factory('Phone', ['$resource',
    function($resource) {
      return $resource('experiences/:phoneId.json', {}, {
        query: {
          method: 'GET',
          params: {phoneId: 'phones'},
          isArray: true
        }
      });
    }
  ]);
