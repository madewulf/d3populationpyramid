d3.json("belgium.json", function(error, json) {
  if (error) return console.warn(error);
  data = json;
  pyramid(data[2016]);

});

function pyramid(data)
{
  var originalData = data;
  var width = 420,
    barHeight = 20;

  var arr = [];
  var femaleArr = [];
  for (var key in data.male)
  {
    arr.push(data.male[key]);
    femaleArr.push(data.female[key]);
  }

  data = arr;

  var x = d3.scaleLinear()
    .domain([0, 1])
    .range([0, width]);

  var chart = d3.select(".chart")
    .attr("width", width)
    .attr("height", barHeight * data.length);

  var bar = chart.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

  bar.append("rect")
    .attr("width", function(d,i) {

      var percentage = d/originalData.both[i];

      return x(percentage/2);
    })
    .attr("height", barHeight - 1)
    .attr("transform", "translate("+ width/2 +  ",0)")
    .attr("class","male");

  bar.append("rect")
    .attr("width", function(d,i) {
      var percentage = (originalData.both[i] -femaleArr[i])/originalData.both[i];
      return x(percentage/2);
    })
    .attr("height", barHeight - 1)
    .attr("transform", function(d, i) {
      var percentage = d/originalData.both[i];
      var dx = x(0.5)-x(percentage/2);
      return "translate("+ dx +  ",0)"; })
    .attr("class","female");

  bar.append("text")
    .attr("x", function(d, i) {
      var percentage = d/originalData.both[i];
      return x(percentage/2) - 3 + width/2;
     })
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .text(function(d) { return d; });
}
