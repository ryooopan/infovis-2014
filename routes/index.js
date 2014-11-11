
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.time = function(req, res){
  res.render('time', { title: '2014-11-10: Time Series Data' });
};

exports.map = function(req, res){
  res.render('map', { title: '2014-11-10: Time Series Data' });
};

exports.us = function(req, res){
  res.render('us', { title: '2014-11-10: Time Series Data' });
};
