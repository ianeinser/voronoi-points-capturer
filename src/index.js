import { Delaunay } from "d3-delaunay";

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.font = "30px Arial";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var sites = [];
var delaunay, voronoi;

var mouseX = 0;
var mouseY = 0;

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

canvas.addEventListener(
  "mousemove",
  function(evt) {
    var mousePos = getMousePos(canvas, evt);
    mouseX = mousePos.x;
    mouseY = mousePos.y;
    //console.log("Mouse is moving");
  },
  false
);

canvas.addEventListener(
  "dblclick",
  function(evt) {
    var mousePos = getMousePos(canvas, evt);
    console.log("Added site");
    ctx.fillRect(mousePos.x, mousePos.y, 4, 4);
    ctx.fill();
    sites.push([mousePos.x, mousePos.y]);
    //console.log(sites);
    drawSites();
  },
  false
);

canvas.addEventListener(
  "click",
  function(evt) {
    var mousePos = getMousePos(canvas, evt);
    console.log(countCells());
  },
  false
);

function point(x, y) {
  this.x = x;
  this.y = y;
}

function drawSites() {
  //console.log("Inside draw");
  // for (var i = 0; i < 10; i++) {
  //   var tempPoint = [
  //     randInt(0, window.innerWidth),
  //     randInt(0, window.innerWidth)
  //   ];
  //   sites.push(tempPoint);
  // }
  //console.log(sites);
  delaunay = Delaunay.from(sites);
  voronoi = delaunay.voronoi([0, 0, window.innerWidth, window.innerHeight]);

  //console.log(voronoi.vectors);
  draw();
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandNum() {
  return Math.random();
}

function init() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  sites = [];

  drawSites();
}

function findCellfromPoint(x, y, debug) {
  var it = voronoi.cellPolygons(); //Iterator of cell polygons
  var result = it.next(); //Next

  var numCell = 0;

  while (!result.done) {
    if (debug) {
      //console.log(numCell);
    }
    if (voronoi.contains(numCell, x, y)) {
      return numCell;
    }
    numCell++;
    result = it.next();
  }
}

function countCells() {
  var it = voronoi.cellPolygons(); //Iterator of cell polygons
  var result = it.next(); //Next

  var numCell = 0;

  while (!result.done) {
    numCell++;
    result = it.next();
  }
  console.log("Diagram contains " + numCell + " cells.");
}

function colorCells() {
  var it = voronoi.cellPolygons(); //Iterator of cell polygons
  var result = it.next(); //Next

  var numCell = 0;

  while (!result.done) {
    voronoi.renderCell(numCell, ctx);
    //console.log(voronoi.cellPolygon(7));
    ctx.fillStyle = "lightblue";
    ctx.fill();
    numCell++;
    result = it.next();
  }
}

function draw() {
  //ctx.globalCompositeOperation = "destination-over";
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  // colorCells();

  ctx.beginPath();
  delaunay.render(ctx);
  ctx.strokeStyle = "lightgray";
  ctx.stroke();

  ctx.beginPath();
  voronoi.render(ctx);
  ctx.strokeStyle = "green";
  ctx.stroke();
  ctx.beginPath();

  //voronoi.update();
  //var inCell = findCellfromPoint(mouseX, mouseY, false);
  //voronoi.renderCell(inCell, ctx);
  //console.log(voronoi.cellPolygon(7));
  //ctx.fillStyle = "Green";
  //ctx.fill();

  //draw();

  // clear canvas

  ctx.fillText("X: " + mouseX + " Y: " + mouseY, 10, 10);
  ctx.fillStyle = "Black";
  ctx.fill();

  window.requestAnimationFrame(draw);
}

window.onresize = function(event) {
  init();
};
init();
