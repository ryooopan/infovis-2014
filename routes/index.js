
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('history', { title: 'Express' });
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
