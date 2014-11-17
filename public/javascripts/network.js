var width = 800;
var height = 600;
var nodes = {};
var color = d3.scale.category10();

links.forEach(function(link) {

  if( !(link.source in nodes) ) {
    nodes[link.source] = {name: link.source, target: link.target, type: link.type};
    link.source = nodes[link.source];
  } else {
    link.source = nodes[link.source];
  }

  link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
});
	      
var svg = d3.select('body').append('svg')
  .attr('width', width)
  .attr('height', height);

svg.append('arrowhead')
  .selectAll('marker')
  .data(['suit', 'licensing', 'resolved'])
  .enter()
  .append('marker')
  .attr('id', function(d) { return d; })
  .attr('viewBox', '0 -5 10 10')
  .attr('refX', 15)
  .attr('refY', -1.5)
  .attr('markerWidth', 6)
  .attr('markerHeight', 6)
  .attr('orient', 'auto')
  .append('svg:path')
  .attr('d', 'M0,-5L10,0L0,5');

var label = svg.append('text')
  .attr('x', 10)
  .attr('dy', 50)
  .attr('font-size', '30px');

var graph = d3.layout.force()
  .nodes(d3.values(nodes))
  .links(links)
  .size([width, height])
  .linkDistance(function(d) { 
    return 10 * d.source.weight ; 
  })
  .charge(-800)
  .linkStrength(0.5)
  .friction(0.5)
  .gravity(0.1)
  .on('tick', tick)
  .start();

var link = svg.selectAll('.link')
  .data(graph.links())
  .enter()
  .append('line')
  .attr('fill', 'none')
  .attr('stroke-width', '2px')
  .attr("class", function(d) { return "link " + d.source.type; })
  .attr("marker-end", function(d) { return "url(#" + d.source.type + ")"; });
  /*
  .attr('stroke', function(d) {
    return color(d.source.type);
  })
  */


var node = svg.selectAll('node')
  .data(graph.nodes())
  .enter()
  .append('g')
  .attr('fill', function(d) {
    return '#999';//color(d.type);
  })
  .on('mouseover', function(d) {
    label.text(d.name)
      .attr('fill', function() { return color(d.type); } );
    console.log(d.name);
  })
  .on('click', function(d) {    
    d.fixed = !d.fixed;
  })
  .call(graph.drag);

node.append('circle')
  .attr('stroke', '#fff')
  .attr('r', function(d) {
    return 8 + d.weight * 1.5;
  });

node.append('text')
  .attr('x', 10)
  .attr('dy', 20)
  .attr('font', '10px san-serif')
  .attr('fill', '#333')
  .text(function(d) { return d.name; });

function tick(){
  link.attr('x1', function(d) { return d.source.x; })
    .attr('y1', function(d) { return d.source.y; })
    .attr('x2', function(d) { return d.target.x; })
    .attr('y2', function(d) { return d.target.y; });

  node.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; } );
}

