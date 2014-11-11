
createsvg();

function createsvg() {
  var width = 800;
  var height = 800;

  var color = d3.scale.linear()
    .domain([0, 0.05, 0.1, 0.2, 0.3])
    .range(['#fff', '#fff7bc', '#fec44f', '#d95f0e', '#f03b20']);


  var svg = d3.select("body")
    .append("svg")
    .attr({
      "width": width,
      "height": height,
    });

  var unemploymentHash = {};
  
  var dataset;
  d3.csv('/data/us_unemployment_rate.csv', function(error, data) {
    dataset = data;
    console.log(dataset);
  });

  d3.json("/data/us-counties.topojson", function(data) {
    var us = topojson.feature(data, data.objects.counties);

    var unempHash = getHash(dataset);
    function getHash(data) {
      var hash = {};
      for(var i = 0; i < data.length; i++) { 
	var county = data[i]['County'];
	var unemployment = data[i]['Unemployment'];
	hash[county] = unemployment;
      } 
      return hash;
    }

    console.log(unempHash);

    // Mercator projection
    var projection = d3.geo.albersUsa()
      .translate([width/2, height/2])
      .scale(1000);
    var path = d3.geo.path()
      .projection(projection);

    svg.selectAll("path")
      .data(us.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", function(d) { 
	return color(unempHash[d.id]);
      })
      .attr("stroke", "#333333")
      .attr("stroke-width", 0.5)
      .on("mouseover", function(d) { 
	showDetails(d.id); 
      });

    var details = svg.append('text')
      .attr({
	'x': 50,
	'y': 50,
	'font-size': 24,
	'stroke': 'none',
	'fill': 'balck',
      });

    function showDetails(id) {
      //pref_details.text(pref + ':' + populationHash_diff[pref] + '人');
      details.text('Unemployment Rate:' + unempHash[id]);      
    }
      

  });






}
