
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('history', { title: 'Information Visulization with D3.js' });
};

exports.history = function(req, res){
  res.render('history');
};

exports.japan = function(req, res){
  res.render('japan');
};

exports.us = function(req, res){
  res.render('us');
};

exports.tree = function(req, res){
  res.render('tree');
};

exports.treemap = function(req, res){
  res.render('treemap');
};
