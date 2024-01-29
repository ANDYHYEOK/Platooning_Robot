var ros = new ROSLIB.Ros({
  url: "ws://localhost:9090",
});

var viewer = new ROS3D.Viewer({
  divID: "mapDiv",
  width: 1536,
  height: 1080,
  antialias: true,
});

var gridClient = new ROS3D.OccupancyGridClient({
  ros: ros,
  rootObject: viewer.scene,
  continuous: false,
});



ROS3D.OccupancyGrid.prototype.getColor = function (index, row, col, value) {
  var grayscale = 255 - (value * 255) / 100; // Transform occupancy value to grayscale
  return [
    (grayscale * this.color.r) / 30,
    (grayscale * this.color.g) / 30,
    (grayscale * this.color.b) / 30,
    255,
  ];
};

// TF Client Configuration
var tfClient = new ROSLIB.TFClient({
  ros: ros,
  angularThres: 0.01,
  transThres: 0.01,
  rate: 10.0,
  fixedFrame: "map",
});


const blackGrid = new ROS3D.Grid({
  color: 0x000000,
  cellSize: 1,
  num_cells: 100,
});

viewer.addObject(blackGrid);

