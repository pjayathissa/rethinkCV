'use strict';

// Register `phoneList` component, along with its associated controller and template
angular.
  module('worldMap').
  component('worldMap', {
    templateUrl: 'world-map/world-map.template.html',
      controller: ['$http', function PhoneListController($http) {
      var self = this;
      //set default order property for drop down list
      


      $http.get('experiences/experience.json').then(function(response) {
      self.experiences = response.data;
      self.newList=self.experiences;
      //aquire a list of countries from experience.json
      var countries=response.data.map(function(a) {return a.country;});
      var countryCount=_.countBy(countries);
      var countryXP = new Object();
      //Aquire list of experiences per country
      for (var ii in countryCount){
        countryXP[ii]=[];
        for (var jj in response.data){
          if (response.data.hasOwnProperty(jj)){
            if (response.data[jj].country == ii){
              countryXP[ii].push(response.data[jj].name)
            }
          }
        };
      };


      var config = {"label0":"label 0","label1":"label 1","color0":"#99ccff","color1":"#0050A1",
      "width":960,"height":960}

      var width = config.width,
      height = config.height;


      function Interpolate(start, end, steps, count) {
        var s = start,
        e = end,
        final = s + (((e - s) / steps) * count);
        return Math.floor(final);
      }

      function Color(_r, _g, _b) {
        var r, g, b;
        var setColors = function(_r, _g, _b) {
          r = _r;
          g = _g;
          b = _b;
        };

        setColors(_r, _g, _b);
        this.getColors = function() {
          var colors = {
            r: r,
            g: g,
            b: b
          };
          return colors;
        };
      }

      function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      }

      function valueFormat(d) {
        if (d > 1000000000) {
          return Math.round(d / 1000000000 * 10) / 10 + "B";
        } else if (d > 1000000) {
          return Math.round(d / 1000000 * 10) / 10 + "M";
        } else if (d > 1000) {
          return Math.round(d / 1000 * 10) / 10 + "K";
        } else {
          return d;
        }
      }

      

      var projection = d3.geo.mercator()
      .scale((width + 1) / 2 / Math.PI)
      .translate([width / 2, height / 2])
      .precision(.1);

      var path = d3.geo.path()
      .projection(projection);

      var graticule = d3.geo.graticule();
      
      var svg = d3.select("#canvas-svg").append("svg")
      .attr("width", width)
      .attr("height", height);


      svg.append("path")
      .datum(graticule)
      .attr("class", "graticule")
      .attr("d", path);

      var COLOR_COUNTS = Math.max.apply(null, _.values(countryCount)) +1;

      var COLOR_FIRST = config.color0, COLOR_LAST = config.color1;

      var rgb = hexToRgb(COLOR_FIRST);

      var COLOR_START = new Color(rgb.r, rgb.g, rgb.b);

      rgb = hexToRgb(COLOR_LAST);
      var COLOR_END = new Color(rgb.r, rgb.g, rgb.b);

      var startColors = COLOR_START.getColors(),
      endColors = COLOR_END.getColors();

      var colors = [];

      for (var i = 0; i < COLOR_COUNTS; i++) {
        var r = Interpolate(startColors.r, endColors.r, COLOR_COUNTS, i);
        var g = Interpolate(startColors.g, endColors.g, COLOR_COUNTS, i);
        var b = Interpolate(startColors.b, endColors.b, COLOR_COUNTS, i);
        colors.push(new Color(r, g, b));
      }

      var MAP_KEY = config.data0;
      var MAP_VALUE = config.data1;



      var g = svg.append("g");


      
      d3.json("world-map/world-topo-min.json", function(error, world) {
        var countries = topojson.feature(world, world.objects.countries).features;

        svg.append("path")
        .datum(graticule)
        .attr("class", "choropleth")
        .attr("d", path);

        g.append("path")
        .datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
        .attr("d", path)
        .attr("class", "equator")

        var country = g.selectAll(".country").data(countries);

        country.enter().insert("path")
        .attr("class", "country")
        .attr("d", path)
        .attr("title", function(d) { return d.properties.name; })
        .style("fill", function(d) {

          if (countryCount[d.properties.name]) {
            var c=countryCount[d.properties.name];

            var color = colors[c].getColors();
            return "rgb(" + color.r + "," + color.g +
              "," + color.b + ")";
      } else {
        //console.log("else statement triggered")
        return "#ccc";
      }
    })
        .on("mousemove", function(d) {
          var html = "";


          html += "<div class=\"tooltip_kv\">";
          html += "<span class=\"tooltip_key\">";
          html += d.properties.name;
          html += "</span>";
          html += "<span class=\"tooltip_value\">";
          html += "Projects: "
          //Display number of projects in that country
          html += (countryCount[d.properties.name] ? valueFormat(countryCount[d.properties.name]) : "0");
          html += " <br>";
          //Display names of projects in that country
          for (ii in countryXP[d.properties.name]) {
            html += countryXP[d.properties.name][ii];
            html += "<br>";
          };
          html += "</span>";
          html += "</div>";

          $("#tooltip-container").html(html);
          $(this).attr("fill-opacity", "0.8");
          $("#tooltip-container").show();

          


          var map_width = $('.choropleth')[0].getBoundingClientRect().width;

          if (d3.event.pageX < map_width / 2) {
            d3.select("#tooltip-container")
            .style("top", (d3.event.layerY -90) + "px")
            .style("left", (d3.event.layerX + 15) + "px");

          } else {
            var tooltip_width = $("#tooltip-container").width();
            d3.select("#tooltip-container")
            .style("top", (d3.event.layerY -90 ) + "px")
            .style("left", (d3.event.layerX - tooltip_width - 30) + "px");
          }
        })
        .on("mouseout", function() {
          $(this).attr("fill-opacity", "1.0");
          $("#tooltip-container").hide();
        });

        

g.append("path")
.datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
.attr("class", "boundary")
.attr("d", path);

svg.attr("height", config.height * 2.2 / 3);
});

d3.select(self.frameElement).style("height", (height * 2.3 / 3) + "px");



      //make an array for every skill 
      });
      //run function when checkbox is ticked


      }]
  });