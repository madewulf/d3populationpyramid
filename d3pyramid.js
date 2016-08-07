d3.json("belgium2.json", function (error, json) {
  if (error) return console.warn(error);
  data = json;
  pyramid(data[0].d);
});

function pyramid(data) {
  var width = window.innerWidth,
    barHeight = 20;

  var maleArr = data.m;
  var femaleArr = data.f;

  data = maleArr;
  var pointCount = data.length;

  var sum = 0;
  for (var i = 0; i < pointCount; i++) {
    sum += maleArr[i] + femaleArr[i];
  }

  /*Bars */
  var femaleX = d3.scaleLinear()
    .domain([0.1, 0])
    .range([0, width / 2]);
  var maleX = d3.scaleLinear()
    .domain([0, 0.1])
    .range([0, width / 2]);
  var chartHeight = barHeight * (pointCount + 1);
  var chart = d3.select(".chart")
    .attr("width", width)
    .attr("height", barHeight * (pointCount + 1));

  var bar = chart.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", function (d, i) {
      return "translate(0," + (pointCount - 1 - i) * barHeight + ")";
    });

  bar.append("rect")
    .attr("width", function (d, i) {
      var percentage = d / (sum);
      return maleX(percentage);
    })
    .attr("height", barHeight - 1)
    .attr("transform", "translate(" + width / 2 + ",0)")
    .attr("class", "male");

  bar.append("rect")
    .attr("width", function (d, i) {
      var percentage = (femaleArr[i]) / sum;
      return femaleX(0.1 - percentage);
    })
    .attr("height", barHeight - 1)
    .attr("transform", function (d, i) {
      var percentage = femaleArr[i] / sum;
      return "translate(" + femaleX(percentage) + ",0)";
    })
    .attr("class", "female");


  /*Line*/

  var generator = d3.line()
    .x(function (d, i) {
      console.log(d, i);
      var percentage = (femaleArr[i]) / sum;
      return maleX(0.1 - percentage);
    })
    .y(function (d, i) { return chartHeight - (i+1) * barHeight - barHeight/2 });

  chart.append('path')
    .data([femaleArr])
    .attr("d", generator)
    .attr("class", "popPath");

  /*Axes */
  var maleXAxis = d3.axisBottom().ticks(4)
    .scale(maleX);
  var femaleXAxis = d3.axisBottom().ticks(4)
    .scale(femaleX);
  var bottomY = (pointCount ) * barHeight;
  chart.append("g").attr("transform", "translate(" + width / 2 + "," + bottomY + ")").call(maleXAxis);
  chart.append("g").attr("transform", "translate(0," + bottomY + ")").call(femaleXAxis);

  var yScale =  d3.scaleLinear()
    .domain([100, 0])
    .range([0, barHeight * (pointCount)]);
  var yAxis  = d3.axisRight().ticks(20).tickPadding(15)
    .scale(yScale);
  chart.append("g").call(yAxis);
}
