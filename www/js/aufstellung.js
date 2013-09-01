var svg = d3.select("svg");

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

var ctrlGroup = svg.append("g")
.attr("class", "controller")
.attr("transform", "translate(0,102)");

// controller
ctrlGroup.append("rect")
.attr("width", 96)
.attr("height", 12)
.attr("x", 1)
.attr("y", 0)
.attr("stroke-width", 2);

var stage = ctrlGroup.append("text")
.attr("class", "stage")
.attr("x", 48)
.attr("width", 94)
.attr("y", 7)
.text("Aufstellung");


var previous = ctrlGroup.append("g")
.attr("transform", "translate(4,2)")
.append("polyline")
.attr("points", "0,4,8,8,8,0");

var next = ctrlGroup.append("g")
.attr("transform", "translate(86,2)")
.append("polyline")
.attr("points", "0,8,0,0,8,4");

var nodesLayer = svg.append("g");
nodesLayer.attr("transform", "translate(4,4)");

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

// set initial data
var initialData = [a1, m1, p1, a2, m2, p2];

function update(data) {
  stage.text(data.description);
  a1.x = data.a1[0];
  a1.y = data.a1[1];

  m1.x = data.m1[0];
  m1.y = data.m1[1];

  p1.x = data.p1[0];
  p1.y = data.p1[1];


  a2.x = data.a2[0];
  a2.y = data.a2[1];

  m2.x = data.m2[0];
  m2.y = data.m2[1];

  p2.x = data.p2[0];
  p2.y = data.p2[1];

  updateNodes(initialData);
}


var one = [
{
  description: "Grundaufstellung",
  a1: [1,2],
  m1: [4,1],
  p1: [7,2],
  a2: [8,6],
  m2: [4,8],
  p2: [0,8]
},
{
  description: "Nach Abnahme",
  a1: [1,2],
  m1: [4,1],
  p1: [7,2],
  a2: [8,4],
  m2: [4,5],
  p2: [0,8]
},
{
  description: "Wechsel",
  a1: [6,1],
  m1: [2,1],
  p1: [4,3],
  a2: [8,4],
  m2: [4,5],
  p2: [0,8]
},
{
  description: "Angriff",
  a1: [6,1],
  m1: [2,1],
  p1: [6,7],
  a2: [7,8],
  m2: [5,8],
  p2: [0,8]
},
{
  description: "Verteidigung",
  a1: [8,1],
  m1: [2,2],
  p1: [6,5],
  a2: [7,8],
  m2: [6,8],
  p2: [1,6]
}];

var simulation = {
  current: 0,
  series: one,

  next: function() {
    if( this.current < this.series.length - 1 ) {
      this.current++;
      console.log(this.current);
    }
    update(this.series[this.current]);
  },

  previous: function() {
    if(this.current > 0) {
      this.current--;
    }
    update(this.series[this.current]);
  },

  start: function() {
    update(this.series[this.current]);
  }
};

next.on("click", function() {
  simulation.next();
});

previous.on("click", function() {
  simulation.previous();
});

simulation.start();