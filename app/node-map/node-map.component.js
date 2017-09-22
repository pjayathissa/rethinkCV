'use strict';

// Register `phoneList` component, along with its associated controller and template
angular.
  module('nodeMap').
  component('nodeMap', {
    templateUrl: 'node-map/node-map.template.html',
      controller: ['$http', function PhoneListController($http) {
      var self = this;
      //set default order property for drop down list
      console.log('hello');

    	$http.get('node-map/node-map.json').then(function(response) {
    	var jsonData = response.data;
  		console.log(jsonData)

      var myFlower = new CodeFlower("#visualization", 300, 200);
	  myFlower.update(jsonData);
	  console.log(myFlower)
		});
      }]
  });
