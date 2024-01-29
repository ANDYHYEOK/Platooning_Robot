// Create the main viewer.
var viewer2d = new ROS2D.Viewer({
  divID: "map2d",
  width: 292,
  height: 280,
});

// Setup the map client.
var gridClient = new ROS2D.OccupancyGridClient({
  ros: ros,
  rootObject: viewer2d.scene,
});
const a = 6
// Scale the canvas to fit to the map
gridClient.on("change", function () {
  viewer2d.scaleToDimensions(
    gridClient.currentGrid.width/a,
    gridClient.currentGrid.height/a
  );
  viewer2d.shift(
    -50/a+3,-50/a+2
  );
});
