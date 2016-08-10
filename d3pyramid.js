var data;
var json;
d3.json("belgium2.json", function (error, j) {
  json = j;
  if (error) return console.warn(error);
  data = json[0].d;
  pyramid();
});

var width;
var maleArr;
var femaleArr;
var barHeight;
var pointCount;
var sum;
var femaleX;
var maleX;
var chartHeight;
var data;
var femaleGenerator;
var maleGenerator;
var bar;

function maleWidth(d, i) {
  var percentage = maleArr[i] / (sum);
  return maleX(percentage);
}

function femaleWidth(d, i) {
  var percentage = (femaleArr[i]) / sum;
  return femaleX(0.1 - percentage);
}

function femaleTransform(d, i) {
  var percentage = femaleArr[i] / sum;
  return "translate(" + femaleX(percentage) + ",0)";
}

function pyramid() {

  width = window.innerWidth,
    barHeight = 20;
  setupData();


  /*Bars */
  femaleX = d3.scaleLinear()
    .domain([0.1, 0])
    .range([0, width / 2]);
  maleX = d3.scaleLinear()
    .domain([0, 0.1])
    .range([0, width / 2]);
  chartHeight = barHeight * (pointCount + 1);
  var chart = d3.select(".chart")
    .attr("width", width)
    .attr("height", barHeight * (pointCount + 1));

  bar = chart.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr('class', "bar")
    .attr("transform", function (d, i) {
      return "translate(0," + (pointCount - 1 - i) * barHeight + ")";
    });

   bar.append("rect").attr("class", "male");
   bar.append("rect").attr("class", "female");

  d3.selectAll(".male").attr("width", maleWidth)
    .attr("height", barHeight - 1)
    .attr("transform", "translate(" + width / 2 + ",0)");

  d3.selectAll(".female")
    .attr("width", femaleWidth)
    .attr("height", barHeight - 1)
    .attr("transform", femaleTransform);

  /*Line*/

  femaleGenerator = d3.line()
    .x(function (d, i) {
      var percentage = (femaleArr[i]) / sum;
      return maleX(0.1 - percentage);
    })
    .y(function (d, i) {
      return chartHeight - (i + 1) * barHeight
    });

  chart.append('path')
    .data([femaleArr])
    .attr('id', 'femaleLine')
    .attr("d", femaleGenerator)
    .attr("class", "popPath");

  maleGenerator = d3.line()
    .x(function (d, i) {
      var percentage = (maleArr[i]) / sum;
      return width / 2 + femaleX(0.1 - percentage);
    })
    .y(function (d, i) {
      return chartHeight - (i + 1) * barHeight
    });

  chart.append('path')
    .data([maleArr])
    .attr('id', 'maleLine')
    .attr("d", maleGenerator)
    .attr("class", "popPath");

  /*Axes */
  var maleXAxis = d3.axisBottom().ticks(4)
    .scale(maleX);
  var femaleXAxis = d3.axisBottom().ticks(4)
    .scale(femaleX);
  var bottomY = (pointCount ) * barHeight;
  chart.append("g").attr("transform", "translate(" + width / 2 + "," + bottomY + ")").call(maleXAxis);
  chart.append("g").attr("transform", "translate(0," + bottomY + ")").call(femaleXAxis);

  var yScale = d3.scaleLinear()
    .domain([100, 0])
    .range([0, barHeight * (pointCount)]);
  var yAxis = d3.axisRight().ticks(20).tickPadding(15)
    .scale(yScale);
  chart.append("g").call(yAxis);
}

function setupData() {
  maleArr = data.m;
  femaleArr = data.f;

  data = maleArr;
  pointCount = data.length;

  sum = 0;
  for (var i = 0; i < pointCount; i++) {
    sum += maleArr[i] + femaleArr[i];
  }
}

function changeData() {
  data = json[100].d;
  setupData();
  d3.select("#maleLine").transition().duration(750).attr("d", maleGenerator);
  d3.select("#femaleLine").transition().duration(750).attr("d", femaleGenerator);

  d3.selectAll(".male")
    .data(data)
    .transition().duration(750)
    .attr("width", maleWidth)
    .attr("height", barHeight - 1)
    .attr("transform", "translate(" + width / 2 + ",0)");

  d3.selectAll(".female")
    .data(data)
    .transition().duration(750)
    .attr("width", femaleWidth)
    .attr("height", barHeight - 1)
    .attr("transform", femaleTransform);
}

var button = d3.select("#changeButton");
button.on('click', changeData)