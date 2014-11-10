
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.time = function(req, res){
  res.render('time', { title: '2014-11-10: Time Series Data' });
};

