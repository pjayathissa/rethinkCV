'use strict';

// Register `phoneDetail` component, along with its associated controller and template
angular.
  module('experienceDetail').
  component('experienceDetail', {
    templateUrl: 'experience-detail/experience-detail.template.html',
    controller: ['$routeParams', 'Experience',
      function PhoneDetailController($routeParams, Experience) {
        var self = this;
        self.experience = Experience.get({experienceId: $routeParams.experienceId}, function(setExperience) {
          self.setImage(setExperience.images[0]);
        });

        self.setImage = function setImage(imageUrl) {
          self.mainImageUrl = imageUrl;
        };
      }
    ]
  });
