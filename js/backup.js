const ROSLIB = require("roslib");

var ros = new ROSLIB.Ros({
  url: "ws://localhost:9090",
});

var viewer = new ROS3D.Viewer({
  divID: "mapDiv",
  width: 800,
  height: 600,
  antialias: true,
});

var gridClient = new ROS3D.OccupancyGridClient({
  ros: ros,
  rootObject: viewer.scene,
  continuous: true,
});

ROS3D.OccupancyGrid.prototype.getColor = function (index, row, col, value) {
  var grayscale = 255 - (value * 255) / 100; // Transform occupancy value to grayscale
  return [
    (grayscale * this.color.r) / 255,
    (grayscale * this.color.g) / 255,
    (grayscale * this.color.b) / 255,
    255,
  ];
};

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
var amclPoseSubscriber = new ROSLIB.Topic({
  ros: ros,
  name: "/amcl_pose",
  messageType: "geometry_msgs/PoseWithCovarianceStamped",
});
amclPoseSubscriber.subscribe(function (message) {
  // 메시지에서 위치 정보 추출
  var position = message.pose.pose.position;
  var orientation = message.pose.pose.orientation;

  // 로봇 위치 업데이트
  robot.position.x = position.x;
  robot.position.y = position.y;
  robot.position.z = position.z;

  // 로봇 방향(회전) 업데이트
  robot.quaternion.set(
    orientation.x,
    orientation.y,
    orientation.z,
    orientation.w
  );

  // 위치와 방향 업데이트에 대한 로그 출력
  console.log("Updated robot position:", robot.position);
  console.log("Updated robot quaternion:", robot.quaternion);
});
// AMCL 토픽 구독
// 로봇 객체를 Viewer에 추가
viewer.scene.add(robot);
var amclPoseSubscriber = new ROSLIB.Topic({
  ros: ros,
  name: "/amcl_pose",
  messageType: "geometry_msgs/PoseWithCovarianceStamped",
});
amclPoseSubscriber.subscribe(function (message) {
  // 메시지에서 위치 정보 추출
  var position = message.pose.pose.position;
  var orientation = message.pose.pose.orientation;

  // 로봇 위치 업데이트
  robot.position.x = position.x;
  robot.position.y = position.y;
  robot.position.z = position.z;

  // 로봇 방향(회전) 업데이트
  robot.quaternion.set(
    orientation.x,
    orientation.y,
    orientation.z,
    orientation.w
  );

  // 위치와 방향 업데이트에 대한 로그 출력
  console.log("Updated robot position:", robot.position);
  console.log("Updated robot quaternion:", robot.quaternion);
});

function createGrid(size, step) {
  const grid = new THREE.Group();

  const gridColor = 0xCCCCCC;
  const gridMaterial = new THREE.LineBasicMaterial({ color: gridColor });

  for (let i = -size; i <= size; i += step) {
    const verticalGeometry = new THREE.Geometry();
    const horizontalGeometry = new THREE.Geometry();

    verticalGeometry.vertices.push(new THREE.Vector3(i, -size, 0));
    verticalGeometry.vertices.push(new THREE.Vector3(i, size, 0));

    horizontalGeometry.vertices.push(new THREE.Vector3(-size, i, 0));
    horizontalGeometry.vertices.push(new THREE.Vector3(size, i, 0));

    const verticalLine = new THREE.Line(verticalGeometry, gridMaterial);
    const horizontalLine = new THREE.Line(horizontalGeometry, gridMaterial);

    grid.add(verticalLine);
    grid.add(horizontalLine);
  }

  return grid;
}
// 맵 resolution에 따라 그리드 크기 및 간격 설정
const mapResolution = 0.5; // 맵 resolution에 따라 조절
const gridSize = 100; // 그리드 전체 크기 설정
const gridStep = 1.0 / mapResolution; // 간격 계산

// 그리드 생성
const grid = createGrid(gridSize, gridStep);

// 그리드를 Viewer에 추가
viewer.scene.add(grid);







viewer.start();
