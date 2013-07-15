var fs = require("fs");

var ff = require("ff");
var jade = require("jade");
var less = require("less");
var moment = require("moment");

var daily = require(process.argv[3]);
var monthly = require(process.argv[4]);
var data = [];

var f = ff(function () {
	var now = moment().startOf("day");
	var cur = now.clone().subtract("months", 1);
	
	var cash = 0;
	var flow = monthly.reduce(function (p, c) {
		return p + c.$;
	}, 0) / now.diff(cur, "days");
	
	while (cur < now) {
		var today = cur.format("YYYY-MM-DD");
		var change = daily.filter(function (t) {
			return t.date === today
		}).reduce(function (p, c) {
			return p + c.$;
		}, 0);
		
		data.push({
			date: cur.toJSON(),
			cash: cash += flow + change,
			flow: flow + change
		});
		
		cur.add("days", 1);
	}
}, function () {
	less.render("@import 'stats';", {
		paths: [__dirname + "/static"],
		compress: true
	}, f.slot());
	
	fs.readFile(__dirname + "/static/d3.js", "utf8", f.slot());
	fs.readFile(__dirname + "/static/stats.js", "utf8", f.slot());
}, function (css, d3, js) {
	jade.renderFile(__dirname + "/static/stats.jade", {
		css: css,
		js: d3 + js,
		data: data
	}, f.slot());
}, function (html) {
	fs.writeFile(process.argv[2], html, f.slot());
}).cb(function (err) {
	console.log("All done! Exited with:", err);
});