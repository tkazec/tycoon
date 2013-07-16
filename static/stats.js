data.forEach(function (d) {
	d.date = new Date(d.date);
});

var svg3 = d3.select("#stats");

var svgSize = {
	realWidth: svg3.attr("width"),
	realHeight: svg3.attr("height"),
	marginTop: 20,
	marginRight: 20,
	marginBottom: 40,
	marginLeft: 60
};

svgSize.width = svgSize.realWidth - svgSize.marginLeft - svgSize.marginRight;
svgSize.height = svgSize.realHeight - svgSize.marginTop - svgSize.marginBottom;

var xScale = d3.time.scale()
	.range([0, svgSize.width])
	.domain([data[0].date, data[data.length -1].date]);

var yScale = d3.scale.linear()
	.range([0, svgSize.height])
	.domain([d3.max(data, function (d) {
		return Math.max(d.cash, d.flow);
	}), d3.min(data, function (d) {
		return Math.min(d.cash, d.flow);
	})])
	.nice();

var xAxis = d3.svg.axis()
	.scale(xScale)
	.orient("bottom")
	.ticks(d3.time.days, 1)
	.tickFormat(d3.time.format("%a"))
	.tickSize(5, 0, 0);

var xAxis2 = d3.svg.axis()
	.scale(xScale)
	.orient("bottom")
	.ticks(d3.time.days, 1)
	.tickFormat(d3.time.format("%-m/%-d"));

var yAxis = d3.svg.axis()
	.scale(yScale)
	.orient("left")
	.tickFormat(d3.format("$,.2f"))
	.tickSize(5, 0, 0);

var xGrid = d3.svg.axis()
	.scale(xScale)
	.orient("bottom")
	.ticks(d3.time.days, 1)
	.tickFormat("")
	.tickSize(-svgSize.height, 0, 0);

var yGrid = d3.svg.axis()
	.scale(yScale)
	.orient("left")
	.tickFormat("")
	.tickSize(-svgSize.width, 0, 0);

var line = d3.svg.line()
	.interpolate("monotone")
	.x(function (d) {
		return xScale(d.date);
	})
	.y(function (d) {
		return yScale(d.cash);
	});

svg3.append("linearGradient")
	.attr("id", "line-gradient")
	.attr("gradientUnits", "userSpaceOnUse")
	.attr("x1", 0).attr("y1", yScale(50))
	.attr("x2", 0).attr("y2", yScale(-50))
	.selectAll("stop")
		.data([{ offset: "0%", color: "#1A9641" }, { offset: "100%", color: "#D7191C" }])
		.enter().append("stop")
			.attr("offset", function (d) { return d.offset; })
			.attr("stop-color", function (d) { return d.color; });

svg3 = svg3.append("g")
	.attr("transform", "translate(" + svgSize.marginLeft + "," + svgSize.marginTop + ")");

svg3.append("g")
	.attr("id", "grid-x")
	.attr("transform", "translate(0," + svgSize.height + ")")
	.call(xGrid);

svg3.append("g")
	.attr("id", "grid-y")
	.call(yGrid);

svg3.append("g")
	.attr("id", "axis-x")
	.attr("transform", "translate(0," + svgSize.height + ")")
	.call(xAxis);

svg3.append("g")
	.attr("id", "axis-x-2")
	.attr("transform", "translate(0," + (svgSize.height + 12) + ")")
	.call(xAxis2);

svg3.append("g")
	.attr("id", "axis-y")
	.call(yAxis);

svg3.append("path")
	.datum(data)
	.attr("d", line)
	.attr("id", "line");