
/*
 * GET home page.
 */

exports.index = function(req, res){
  var cheerio = require('cheerio');
  var request = require('request');
  res.render('index');
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

exports.network = function(req, res){
  res.render('network');
};

