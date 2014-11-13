
var width = 1000;
var height = 600;
var offset = 40;
var currentYear = 1820;
var color = d3.scale.category10();
var dragging = false;
var highlight;

var incomeScale = d3.scale.log()
  .domain([100, 100000])
  .range([0, width]);
var lifeScale = d3.scale.linear()
  .domain([10, 90])
  .range([height, 0]);
var populationScale = d3.scale.sqrt()
  .domain([0, 1e9])
  .range([1, 50]);
var regionScale = d3.scale.category10();
var sliderScale = d3.scale.linear()
  .domain([0, 1000])
  .range([1800, 2009]);
var yearScale = d3.scale.linear()
  .domain([1800, 2009])
  .range([0, 1000]);

var incomeAxis = d3.svg.axis()
  .orient('bottom')
  .scale(incomeScale)
  .ticks(5, d3.format(',d'));
var lifeAxis = d3.svg.axis()
  .orient('left')
  .scale(lifeScale);

var svg = d3.select('body').append('svg')
  .attr({
    'width': width + 2*offset,
    'height': height + 2*offset,
    'transform': 'translate(' + offset + ',' + offset + ')',
  });

var g = svg.selectAll('g')
  .data([{x: 100, y : 20}])
  .enter()
  .append('g')
  .attr("height", 200)
  .attr("widht", 300)
  .attr('transform', 'translate(20, 10)');

var rect = g.append('rect')
  .attr('y', 17)
  .attr("height", 5)
  .attr("width", width)
  .attr('fill', '#C0C0C0');

var sliderDefault = {
  'r': 10,
  'fill': '#555',
}
var sliderActive = { 
  'r': 20,
  'fill': '#2399F5',
}

var slider = g.append("circle")
  .attr(sliderDefault)
  .attr("cx", function(d) { return d.x; })
  .attr("cy", function(d) { return d.y; })
  .on('mouseover', function(d) { 
    d3.select(this)
      .transition()
      .ease('out')
      .attr(sliderActive);
  })
  .on('mouseout', function(d) { 
    if (dragging == false) {
      d3.select(this)
	.transition()
	.ease('out')
	.attr(sliderDefault);
    }
  });

svg.append('g')
  .attr({
    'class': 'incomeAxis',
    'fill': 'none',
    'stroke': 'black',
    'shape-rendering': 'crispEdges',
    'transform': 'translate(0,' + height + ')',
  })
  .call(incomeAxis);

svg.append('g')
  .attr({
    'class': 'lifeAxis',
    'fill': 'none',
    'stroke': 'black',
    'shape-rendering': 'crispEdges',
  })
  .call(lifeAxis);

svg.selectAll('g').selectAll('text')
  .attr({
    'fill': 'black',
    'stroke': 'none',
  });

svg.selectAll('g').selectAll('text')
  .attr({
    'class': 'incomeLabel',
    'text-anchor': 'end',
    'x': width,
    'y': height - 10,
    'fill': 'black',
  })
  .text('income per capita (USD)');

svg.append('text')
  .attr({
    'class': 'lifeLabel',
    'text-anchor': 'end',
    'y': 15,
    'transform': 'rotate(-90)',
    'text': 'Life expectancy (years)'
  });  

var countryLabel = svg.append('text')
  .attr({
    'class': 'countryLabel',
    'font-size': 30,
    'x': 100,
    'y': 200,
  })
  .style({
    'z-index': 100,
  })
  .text('');

var yearLabel = svg.append('text')
  .attr({
    'class': 'yearLabel',
    'text-anchor': 'end',
    'font-size': 50,
    'x': width,
    'y': height - 35,
  })
  .text(currentYear);


var regions = [
  'America',
  'Europe & Central Asia',
  'East Asia & Pacific', 
  'Middle East & North Africa', 
  'South Asia',
  'Sub-Saharan Africa', 
]

for(var i=0 ; i < regions.length ; i++) {
  svg.append('text')
    .attr({
      'class': 'regionLabel',
      'data-region': regionScale(regions[i]),
      'text-anchor': 'center',
      'font-size': 15,
      'fill': regionScale(regions[i]),
      'x': width - 120, 
      'y': 60 + 30 * i,
    })
    .style('cursor', 'pointer')
    .text(regions[i])
  
    .on('click', function(d) { 
      var currentRegion = 
	d3.selectAll('.circle')
	.style('opacity', '0.1')
	.attr('stroke', 'white');
      d3.selectAll('[data-region="' + regionScale(d3.select(this).text()) + '"]')
	.style('opacity', '1');
      countryLabel.text('');
    });
}


d3.json('/data/nations.json', function(nations) {
  // https://github.com/mbostock/d3/wiki/Arrays
  var bisect = d3.bisector(function(d) { return d[0]; });

  var tooltip = d3.select("body")
    .append("div")
    .style({
      'position': 'absolute',
      'z-index': '10',
      'visibility': 'hidden',
    })
    .text("a simple tooltip");

  var circle = svg.append('g')
    .attr({
      'class': 'circles',
    })
    .selectAll('.circle')
    .data(interpolateData())
    .enter()
    .append('circle')
    .attr({
      'class': 'circle',
      'data-region': function(d) { return regionScale(d.region) },
      'data-name': function(d) { return d.name },
      'fill': 'white',
      'stroke': 'white',
    })
    .call(position)
    .sort(order)

    .on('mouseover', function(d) { 
      tooltip.style("visibility", "visible"); 
    })

    .on("mousemove", function(d) { 
      d3.select(this)
	.transition()
	.attr({
	  'r': populationScale(d.population) + 10,
	});
      tooltip.text(d.name + ',' + d.region + ', income: ' + d.income + ', life: ' + d.lifeExpectancy )
	.style({
	  'top': ( d3.event.pageY - 10 ) + 'px' ,
	  'left': ( d3.event.pageX+10 ) + 'px'  ,
	  'color': regionScale(d.region) ,
	  'background-color': 'white',
	});
    })

    .on('mouseout', function(d) { 
      d3.select(this)
	.transition()
	.attr({
	  'r': populationScale(d.population) ,
	});
      tooltip.style("visibility", "hidden"); 
    } )

    .on('click', function(d) { 
      d3.selectAll('.circle')
	.style('opacity', '0.2')
	.attr('stroke', 'white');
      d3.select(this)
	.style('opacity', '1')
	.attr('stroke', 'black');
      highlight = d3.select(this);
      countryLabel.text(d.name)
	.attr({
	  'x': highlight.attr('cx') ,
	  'y': highlight.attr('cy') ,
	  'fill': regionScale(d.region),
	});

    });

  // accept key events
  d3.select('body')
    .on('keydown', function() { keyDown(d3.event.keyCode); } )


  var drag = d3.behavior.drag()
  //.origin(Object)
    .on("drag", dragMove)
    .on('dragend', dragEnd);

  slider.call(drag);

  function dragMove(d) {
    dragging = true;
    d3.select(this)
      .attr({
	'opacity': 0.6,
	'cx': d.x = Math.max(0, Math.min(width, d3.event.x)),
	'cy': d.y = 20,
      });
    dragYear(d.x);
  }

  function dragYear(p) {
    currentYear = sliderScale(p);
    updateYear();
  }
  
  function dragEnd() {
    dragging = false;
    d3.select(this)
      .transition()
      .ease('out')
      .attr(sliderDefault)
      .attr('opacity', 1);
  }  

  function keyDown(key) {
    // 39: right arrow, 37: left arrow 
    if( (key == 37 || key == 75) && currentYear != 1800) {
      --currentYear;
    } else if( (key == 39 || key == 74) && currentYear != 2009) {
      ++currentYear;
    } else if(key == 27) {
      d3.selectAll('.circle')
	.style('opacity', '1')
	.attr('stroke', 'white');
      countryLabel.text('');
    }
    updateYear();
  }

  function updateYear() {
    yearLabel.text(Math.round(currentYear) );
    circle.data(interpolateData(currentYear), function(d) { return d.name; } ).call(position).sort(order);
    slider.attr('cx', yearScale(currentYear) );
    if (highlight != undefined) {
      countryLabel.attr({
	'x': highlight.attr('cx') ,
	'y': highlight.attr('cy') ,
      });
    }
  }

  function updateLabel() {

  }

  function position(p) {
    p.attr({
      'cx'  : function(d) { return incomeScale(d.income) } ,
      'cy'  : function(d) { return lifeScale(d.lifeExpectancy); } ,
      'r'   : function(d) { return populationScale(d.population); } ,
      'fill': function(d) { return regionScale(d.region); },
    });
  }

  function order(a, b) {
    // bring smaller circles to the front
    return b.population - a.population;
  }

  function interpolateValues(values, year) {
    var i = bisect.left(values, year, 0, values.length - 1);
    var a = values[i];
    if (i > 0) {
      var b = values[i - 1];
      var t = (year - a[0]) / (b[0] - a[0]);
      return Math.round(a[1] * (1 - t) + b[1] * t);
    }
    return a[1];
  }

  function interpolateData() {
    return nations.map(
      function(d) { 
	return {
	  name: d.name,
	  region: d.region,
	  income: interpolateValues(d.income, currentYear),
	  population: interpolateValues(d.population, currentYear),
	  lifeExpectancy: interpolateValues(d.lifeExpectancy, currentYear)
	};
      }
    );
  }
  
});

