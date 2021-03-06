// code to read data and create the map 
// Modified from example file by @mbostock (https://github.com/mbostock)
// Check this link for original example: http://bl.ocks.org/d3noob/5193723

var width = window.innerWidth,
    height = window.innerHeight;

var projection = d3.geo.mercator()
    .center([10, 65])
    .scale(200)
    .rotate([-5,0])
    .translate([.5* width, .09 * height]);

var svg = d3.select('#wrapper')
	.append("svg")
    .attr("width", width)
    .attr("height", .7 * height);

var path = d3.geo.path()
    .projection(projection);

var g = svg.append("g");

var circle_radius = 1.2; 
var circle_stroke = .6;
var font_size = "1.5px";

// circle colors based on data source
var circle_colors = {
					"CSWD" : "blue",
					"CWEC" : "orange",
					"CZ01RV2" : "green",
					"CZ02RV2" : "green",
					"CZ03RV2" : "green",
					"CZ04RV2" : "green",
					"CZ05RV2" : "green",
					"CZ06RV2" : "green",
					"CZ07RV2" : "green",
					"CZ08RV2" : "green",
					"CZ09RV2" : "green",
					"CZ10RV2" : "green",
					"CZ11RV2" : "green",
					"CZ12RV2" : "green",
					"CZ13RV2" : "green",
					"CZ14RV2" : "green",
					"CZ15RV2" : "green",
					"CZ16RV2" : "green",
					"CityUHK" : "green",
					"ETMY" : "grey",
					"IGDG" : "grey",
					"IMGW" : "grey",
					"INETI" : "grey",
					"ISHRAE" : "grey",
					"ITMY" : "grey",
					"IWEC" : "brown",
					"KISR" : "grey",
					"MSI" : "grey",
					"NIWA" : "grey",
					"RMY" : "grey",
					"SWEC" : "grey",
					"SWERA" : "red",
					"TMY" : "pink",
					"TMY2" : "yellow",
					"TMY3" : "#e6550d"
					};
					
// load and display the World
d3.json("./json/world-110m2.json", function(error, topology) {
//d3.json("https://dl.dropboxusercontent.com/u/16228160/world-110m2.json", function(error, topology) {

// load and display the cities
d3.csv("./data/epw_weather_data.csv", function(error, data) {
//d3.csv("https://dl.dropboxusercontent.com/u/16228160/epw_weather_data.csv", function(error, data) {
    
	// add countries
	g.selectAll("path")
		  .data(topojson.object(topology, topology.objects.countries)
			  .geometries)
		.enter()
		  .append("path")
		  .attr("d", path)
		  
	// add city names
    g.selectAll("text")
       .data(data)
       .enter()
			.append("text") // append text
			.attr("x", function(d) {return projection([d.lon, d.lat])[0];})
			.attr("y", function(d) {return projection([d.lon, d.lat])[1];})
			.attr("dy", -(circle_radius + circle_stroke)) // set y position of bottom of text
			.style("fill", "black") // fill the text with the colour black
			.style("font-size", font_size)
			.attr("text-anchor", "middle") // set anchor y justification
			.text(function(d) {return d.station_name;}); // display station name - I should find a better way to do this!

	
	// add circles
	g.selectAll("circle")
       .data(data)
       .enter()
			.append("a")
			.attr("xlink:href", function(d){return d.http_link;})
			.append("g:circle")
			.attr("cx", function(d) {return projection([d.lon, d.lat])[0];})
			.attr("cy", function(d) {return projection([d.lon, d.lat])[1];})
       		.attr("r", circle_radius)
       		//.style("stroke", function(d) { return circle_colors[d.data_source];})
	   		.style("fill", function(d) { return circle_colors[d.data_source];})
	   		.style("opacity", .5)
	   		.style("stroke-width", circle_stroke);
		
		//tooltip
		$('g circle').tipsy({ 
			gravity: 'w', 
			html: true, 
			title: function(d) {
			  var d = this.__data__;
			  return '<span style="font size:18px"> Station Name: ' + d.station_name + '<br> Data Source: ' + d.data_source + '<br><span>' +
					 '<span> Latitude: ' + d.lat + '<br> Longitude: ' + d.lon + '<br><br><span>' +
					 '<span> #Hours of Strong Cold Stress: ' + d.strong_cold_stress + '<br> #Hours of Moderate Cold Stress: ' + d.moderate_cold_stress + '<br><span>' +
					 '<span> #Hours of Slight Cold Stress: ' + d.slight_cold_stress + '<br> #Hours of Comfort: ' + d.no_thermal_stress + '<br><span>' +
					 '<span> #Hours of Slight Heat Stress: ' + d.slight_heat_stress + '<br> #Hours of Moderate Heat Stress: ' + d.moderate_heat_stress + '<br><span>' +
					 '<span> #Hours of Strong Heat Stress: ' + d.strong_heat_stress + '<br><span>'; 
			}
      });
});

});
	// zoom and pan
	var zoom = d3.behavior.zoom()
		.on("zoom",function() {
			g.attr("transform","translate("+ 
				d3.event.translate.join(",")+")scale("+d3.event.scale+")");
			g.selectAll("circle")
				.attr("d", path.projection(projection));
			g.selectAll("path")  
				.attr("d", path.projection(projection)); 

  });

svg.call(zoom)