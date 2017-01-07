'use strict';

// Register `phoneList` component, along with its associated controller and template
angular.
  module('worldMap').
  component('worldMap', {
    templateUrl: 'world-map/world-map.template.html',
      controller: ['$http', function PhoneListController($http) {
      var self = this;
      //set default order property for drop down list
      this.orderProp = '-importance';


      $http.get('experiences/experience.json').then(function(response) {
      self.experiences = response.data;
      self.newList=self.experiences;
      //aquire a list of skills from experience.json
      var skills=response.data.map(function(a) {return a.skills;});
      var skillList=[];
      //make an array for every skill 
      for (var ii in skills) {
        for (var jj in skills[ii]){
          var skill=skills[ii][jj];
          if (skillList.indexOf(skill) === -1) {
            skillList.push(skill);
          };

        };
      };
      self.skillList = skillList;


      //For checkbox boolean control
      //initialise skill properites selected as false
      var skillProp={};
      skillList.forEach(function(val, i){
        skillProp[val]=false;
      });
      self.skillProp=skillProp;
      });
      //run function when checkbox is ticked

      self.fooChanged = function(){
        //initialise skills filter for filtering CV list
        var skillFilter=[];
        //determine if something was selected
        var somethingSelected=_.contains(self.skillProp, true);
        if (somethingSelected === true) {
          //if selected, create a new array with the skills that were selected
          //_.each(self.skillProp, function(val,key){if (val){skillFilter.concat(key);} })
          _.each(self.skillProp, function(val,key){if (val){skillFilter.push(key);} })
          console.log('something Selected');
        } else {
          console.log('none selected');
          skillFilter=[];
        };
        var newList=[];
        for ( var ii in self.experiences) {
          //create a manual filter here to reset self.experiences
          var skillDiff=_.difference(self.experiences[ii].skills, skillFilter);
          console.log(skillDiff);
          if (skillDiff.length === self.experiences[ii].skills.length - skillFilter.length) {
            newList.push(self.experiences[ii]);
            console.log('delete');
          }
        };
        self.skillFilter=skillFilter.join(" ");
        self.newList=newList;
      };

      }]
  });
