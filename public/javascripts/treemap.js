
var width = 600;
var height = 600;

var color = d3.scale.category20(["Kanto-Kansai", "Kanto Area", "Tokyo", "Kansai Area", "Osaka"]);

var treemap = d3.layout.treemap()
  .size([width, height])
  .mode('slice-dice')
  .value( function(d) {
    return d.size;
  })
  .sort( function comparator(a, b) {
    return a.value - b.value;
  });

var svg = d3.select('#canvas')
  .append('svg')
  .attr({
    'width': width,
    'height': height,
  });

population_list.children.forEach(toggleAll);
toggle(population_list);
update(population_list);

function update(source) {
  var prefs = treemap.nodes(population_list);

  svg.selectAll('rect').remove();
  svg.selectAll('text').remove();

  var svg_prefs = svg.selectAll('rect').data(prefs);
  svg_prefs.enter()
    .append('rect')
    .attr({
      'x': function(d) { 
	return d.x;
      },
      'y': function(d) { 
	return d.y; 
      },
      'width': function(d) { 
	return (d.added) ? 0 : d.dx - 1;
      },
      'height': function(d) { 
	return (d.added) ? 0 : d.dy - 1;
      },
      'fill-opacity': function(d) {
	d.children ? 0 : 1;
      },
      'pref': function(d) { 
	return (d.children) ? 0 : 1;
      },
      'fill': function(d) { 
	return (d.parent) ? color(d.parent.name) : color(d.name); 
      },
      'stroke': '#fff',
      'stroke-width': 1,
    })

    .style('cursor', function(d) {
      return (d._children) ? 'pointer' : '';
    })

    .on('mouseover', function(d) {
      if(d._children) {
	d3.select(this).attr('fill-opacity', 0.5);
      }
    })

    .on('mouseout', function(d) {
      d3.select(this).attr('fill-opacity', 1);
    })

    .on('click', function(d) {
      if(d._children) {
	toggle(d); 
	update(d);
      }
    });
  
  d3.select('body')
    .on('keydown', function(d) {
      if(d3.event.keyCode == 27) {
	population_list.children.forEach(toggleAll);
	toggle(population_list);
	update(population_list);
      }
    });

  svg_prefs.transition()
    .duration(500)
    .ease("linear")
    .attr({
      "x": function(d) { 
	return d.x; 
      },
      "y": function(d) { 
	return d.y; 
      },
      "width": function(d) { 
	return d.dx-1; 
      },
      "height": function(d) { 
	return d.dy-1; 
      },
    });

  var prefs_text = svg.selectAll('text').data(prefs)
    .enter()
    .append('text')
    .attr({
      'x': function(d) { return d.x + 10; },
      'y': function(d) { return d.y + 20; },
    })
    .text( function(d) { 
      return (!d.children) ? d.name + ' : ' + d.size : '' 
    });

  prefs.forEach( function(d) {
    d.added = false;
  });

}


function back(d) {
  console.log(d);
  toggle(d);
}

function toggle(d) {
  if(d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;

    d.children.forEach(function(d2) {
      d2.added = true;
    });
  }
}

function toggleAll(d) {
  if (d.children) {
    d.children.forEach(toggleAll);
    toggle(d);
  }
}
