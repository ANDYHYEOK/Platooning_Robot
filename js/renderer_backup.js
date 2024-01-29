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

// 로봇의 머티리얼 생성
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3); // 1x1x1 크기의 상자
// 머티리얼을 사용하여 로봇의 3D 모델 생성
var robot = new THREE.Mesh(geometry, material);

// 이미 생성된 로봇의 색상을 초록색으로 변경
robot.material.color.set(0x00ff00);
// AMCL 토픽 구독
// 로봇 객체를 Viewer에 추가
viewer.scene.add(robot);
viewer.renderer.setClearColor(0x9b9b9b);
// Subscribe to TF topic
tfClient.subscribe("base_link", function (tf) {
  robot.position.x = tf.translation.x;
  robot.position.y = tf.translation.y;
  robot.position.z = tf.translation.z;

  viewer.scene.add(robot);
});
////////////////
viewer.scene.add(
  new Circle({
    origin: new THREE.Vector3(goal[0], goal[1], 0.05),
    material: new THREE.MeshBasicMaterial({ color: 0xff0000 }),
  })
);
//////////////////////

const blackGrid = new ROS3D.Grid({
  color: 0x000000,
  cellSize: 1,
  num_cells: 100,
});

viewer.addObject(blackGrid);
// viewer.camera.position.z =55;
