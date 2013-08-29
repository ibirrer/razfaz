
var width = 10;
var height = 10;

var svg = d3.select("svg");
var stage = d3.select(".stage");

// court
svg.append("rect")
.attr("class", "court")
.attr("width", 98)
.attr("height", 98)
.attr("x", 0)
.attr("y", 0)
.attr("stroke-width", 0);

// 6 meter
svg.append("rect")
.attr("class", "court-inner")
.attr("width", 94)
.attr("height", 58)
.attr("x", 2)
.attr("y", 2)
.attr("stroke-width", 0);

// 3 meter line
svg.append("rect")
.attr("class", "court-inner")
.attr("width", 94)
.attr("height", 34)
.attr("x", 2)
.attr("y", 62)
.attr("stroke-width", 0);

var nodesLayer = svg.append("g");
nodesLayer.attr("transform", "translate(4,4)");

var a1 = {
  name: "A1",
  type: "A",
  position: 1,
  x: 1,
  y: 2
};

var m1 = {
  name: "M1",
  type: "M",
  position: 6,
  x: 4,
  y: 1
};

var p1 = {
  name: "P1",
  type: "P",
  position: 5,
  x: 7,
  y: 2
};

var a2 = {
  name: "A2",
  type: "A",
  position: 4,
  x: 8,
  y: 6
};

var m2 = {
  name: "M2",
  type: "M",
  position: 3,
  x: 4,
  y: 8
};

var p2 = {
  name: "P2",
  type: "P",
  position: 2,
  x: 0,
  y: 8
};

// see http://stackoverflow.com/questions/479591/svg-positioning
var translateFunction = function(d) {
  var x = d.x * 10;
  var y = d.y * 10;
  return "translate(" + x + "," + y + ")";
};

var updateNodes = function(nodes) {
  var existingNodes = nodesLayer
  .selectAll("g.node")
  .data(nodes);

  // update nodes as needed
  existingNodes.transition().duration(800)
  .attr("transform", translateFunction);

  // create new nodes as needed
  var newNodesGroup = existingNodes.enter()
  .append("g").attr("class", "node");

  var newNode = newNodesGroup.append("rect")
  .attr("width", 10)
  .attr("height", 10)
  .attr("rx", 10)
  .attr("ry", 10);

  newNodesGroup.append("rect")
  .attr("class", "node-inner")
  .attr("x", 1.5)
  .attr("y", 1.5)
  .attr("width", 7)
  .attr("height", 7)
  .attr("rx", 7)
  .attr("ry", 7);

  newNodesGroup.append("text")
  .attr("x", 2.8)
  .attr("y", 6.2)
  .text(function(d) { return d.type + d.position });

  newNodesGroup.attr("id", function(d) { return d.name } )
  .attr("transform", translateFunction);
};

// set initial data
var data = [a1, m1, p1, a2, m2, p2];

// Abnahme
stage.text("Abnahme");
updateNodes(data);

// Nach Abnahme
setTimeout(function() {
  m2.x = 4;
  m2.y = 5;

  a2.x = 8;
  a2.y = 4;

  stage.text("Nach Abnahme");
  updateNodes(data);
}, 2000);

// Wechsel
setTimeout(function() {
  a1.x = 6;
  a1.y = 1;

  m1.x = 2;
  m1.y = 1;

  p1.x = 4;
  p1.y = 3;

  stage.text("Wechsel");
  updateNodes(data);
}, 4000);

// Angriff
setTimeout(function() {
  a2.x = 7;
  a2.y = 8;

  m2.x = 5;
  m2.y = 8;

  p1.x = 6;
  p1.y = 7;

  stage.text("Angriff");
  updateNodes(data);
}, 6000);


// Verteidigung
setTimeout(function() {
  m2.x = 6;
  m2.y = 8;

  p1.x = 6;
  p1.y = 5;

  p2.x = 1;
  p2.y = 6;

  a1.x = 8;
  a1.y = 1;

  m1.x = 2;
  m1.y = 2;

  stage.text("Verteidigung");
  updateNodes(data);
}, 8000);
