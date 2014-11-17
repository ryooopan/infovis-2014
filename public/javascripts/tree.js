
var margin = {top: 20, right: 120, bottom: 20, left: 120},
width = 960 - margin.right - margin.left,
height = 800 - margin.top - margin.bottom;
    
var i = 0;
var duration = 750;

var tree = d3.layout.tree()
  .size([height, width - 160]);

var diagonal = d3.svg.diagonal()
  .projection(function(d) { return [d.y, d.x]; });

var svg = d3.select('body').append('svg')
  .attr('width', width + margin.right + margin.left)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


population_list.children.forEach(collapse);
update(population_list);


function collapse(d) {
  if (d.children) {
    d._children = d.children;
    d._children.forEach(collapse);
    d.children = null;
  }
}


function update(source) {

  var nodes = tree.nodes(population_list).reverse();
  var links = tree.links(nodes);
  
  var node = svg.selectAll('g.node')
    .data(nodes, function(d) { return d.id || (d.id = ++i); });
  
  var nodeEnter = node.enter().append('g')
    .attr('class', 'node')
    .attr('transform', function(d) { 
      return 'translate(0, 100)' ; //'translate(' + source.y0 + ',' + source.x0 + ')'; 
    })
    .on('click', click);
  

  nodeEnter.append('circle')
    .attr('r', 1e-6)
    .style('fill', function(d) { return d._children ? 'lightsteelblue' : '#fff'; });
  
  nodeEnter.append('text')
    .attr('x', function(d) { return d.children || d._children ? -10 : 10; })
    .attr('dy', '.35em')
    .attr('text-anchor', function(d) { return d.children || d._children ? 'end' : 'start'; })
    .text(function(d) { return d.name + ' : ' + d.size ; })
    .style('fill-opacity', 1e-6);

  var nodeUpdate = node.transition()
    .duration(duration)
    .attr('transform', function(d) { return 'translate(' + d.y + ',' + d.x + ')'; });

  nodeUpdate.select('circle')
    .attr('r', function(d) { return d.size / 1000000; } )
    .style('fill', function(d) { return d._children ? 'lightsteelblue' : '#fff'; });

  nodeUpdate.select('text')
    .style('fill-opacity', 1);

  var nodeExit = node.exit().transition()
    .duration(duration)
    .attr('transform', 'translate(0, 1000)') //function(d) { return 'translate(' + source.y + ',' + source.x + ')'; })
    .remove();
  
  nodeExit.select('circle')
    .attr('r', 1e-6);
  
  nodeExit.select('text')
    .style('fill-opacity', 1e-6);
  
  var link = svg.selectAll('path.link')
    .data(links, function(d) { return d.target.id; });
  
  // Enter any new links at the parent's previous position.
  link.enter().insert('path', 'g')
    .attr('class', 'link')
    .attr('d', function(d) {
      var o = {x: 1000, y: 0} ;//{x: source.x0, y: source.y0};
      return diagonal({source: o, target: o});
    });

  // Transition links to their new position.
  link.transition()
    .duration(duration)
    .attr('d', diagonal);
  
  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
    .duration(duration)
    .attr('d', function(d) {
      var o = {x: source.x, y: source.y};
      return diagonal({source: o, target: o});
    })
    .remove();
  
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}


function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}

/*
  var link = svg.selectAll('path.link')
  .data(links)
  .enter()
  .append('path')
  .attr({
    'class': 'link',
    'd': diagonal
  });

var node = svg.selectAll('g.node')
  .data(nodes)
  .enter().append('g')
  .attr('class', 'node')
  .attr('transform', function(d) { return 'translate(' + d.y + ',' + d.x + ')'; })

node.append('circle')
  .attr('r', 4.5);

node.append('text')
  .attr('dx', function(d) { return d.children ? -8 : 8; })
  .attr('dy', 3)
  .attr('text-anchor', function(d) { return d.children ? 'end' : 'start'; })
  .text(function(d) { return d.name; });

d3.select(self.frameElement).style('height', height + 'px');


*/
