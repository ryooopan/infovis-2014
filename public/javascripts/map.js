
createsvg();

function createsvg() {
  var width = 800;
  var height = 800;

  var color = d3.scale.linear()
    .domain([500000, 13000000])
    .range([255, 0]);
  var diff = d3.scale.linear()
    .domain([-130000, 300000])
    .range([255, 0]);
  var quant = d3.scale.linear()
    .domain([00000, 500000, 5000000, 10000000, 13000000])
    .range(['#fff', '#fff7bc', '#fec44f', '#d95f0e', '#f03b20']);


  var svg = d3.select("body")
    .append("svg")
    .attr({
      "width": width,
      "height": height,
    });

  var populationHash = {};
  var populationHash_2000 = {};
  var populationHash_diff = {};

  JapanPopulationData.Data.forEach( function (d) {
    populationHash[d.Prefecture] = d.Population_2010;
    populationHash_2000[d.Prefecture] = d.Population_2000;    
    populationHash_diff[d.Prefecture] = d.Population_2010 - d.Population_2000;
  });

  d3.json("/data/japan.topojson", function(data) {
    var japan = topojson.feature(data, data.objects.japan);

    // Mercator projection
    var projection = d3.geo.mercator()
      .center([137, 34]) // lat and long
      .translate([width/2, height/2])
      .scale(1500);
    var path = d3.geo.path().projection(projection);

    svg.selectAll("path")
      .data(japan.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", function(d) { 
	/* 
	 *  Scale Color (Red <-> White)	
	return "rgb(255, " + Math.floor(color(populationHash[d.properties.nam_ja])) + ", " + Math.floor(color(populationHash[d.properties.nam_ja])) + ")"; 
	 */
	

	/* 
	 * Diff Color (Red <-> Blue)
	 if ( populationHash_diff[d.properties.nam_ja] > 0 ) {
	 return "rgb(255, " + Math.floor(diff(populationHash_diff[d.properties.nam_ja])) + ", " + Math.floor(diff(populationHash_diff[d.properties.nam_ja])) + ")"; 
	 } else {
	 return "rgb(" + Math.floor(diff(populationHash_diff[d.properties.nam_ja])) + ", " + Math.floor(diff(populationHash_diff[d.properties.nam_ja])) + ", 255"; 
	 }
	 */
	
	/*
	 * Quant Color (5 scale)
	 */
	return quant(populationHash[d.properties.nam_ja]) ;
	// (*/

      })
      .attr("stroke", "#333333")
      .attr("stroke-width", 0.5)
      .on("mouseover", function(d) { 
	showDetails(d.properties.nam_ja); 
      });

    var pref_details = svg.append('text')
      .attr({
	'x': 50,
	'y': 50,
	'font-size': 24,
	'stroke': 'none',
	'fill': 'balck',
      });

    function showDetails(pref) {
      //pref_details.text(pref + ':' + populationHash_diff[pref] + '人');
      pref_details.text(pref + ':' + populationHash[pref] + '人');      
      console.log( quant(populationHash[pref] ) );
    }
      

  });






}
