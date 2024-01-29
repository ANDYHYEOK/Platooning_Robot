var globalPlanSubscriber = new ROSLIB.Topic({
  ros: ros,
  name: "/move_base/GlobalPlanner/plan",
  messageType: "nav_msgs/Path",
});

var currentPathLine; // 현재 그려진 경로를 추적하기 위한 변수

globalPlanSubscriber.subscribe(function (message) {
  // 새로운 경로를 수신했으므로 이전 경로를 삭제
  if (currentPathLine) {
    viewer.scene.remove(currentPathLine);
  }

  var path = message.poses; // 새로운 경로 포인트 목록
  currentPathLine = drawPathOnMap(path); // 경로 그리기

  // 현재 그려진 경로를 업데이트
  viewer.scene.add(currentPathLine);
});

// function drawPathOnMap(path) {
//   // 경로를 그리기 위한 Three.js 객체 생성
//   var pathMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 }); // 빨간색 선
//   var pathGeometry = new THREE.Geometry();
//   console.log(path.length)
//   // 경로 포인트를 Three.js 좌표로 변환하여 경로에 추가
//   for (var i = 0; i < path.length; i++) {
//     var pose = path[i].pose;
//     var position = pose.position;
//     pathGeometry.vertices.push(
//       new THREE.Vector3(position.x, position.y, position.z)
//     );
//     if (i == path.length){
      
//     }
//   }

//   // 경로를 렌더링할 Three.js Line 객체 생성
//   var pathLine = new THREE.Line(pathGeometry, pathMaterial);

//   return pathLine; // 생성된 경로를 반환
// }
function drawPathOnMap(path) {
  // 경로를 그리기 위한 Three.js 객체 생성
  var pathMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 }); // 빨간색 선
  var pathGeometry = new THREE.Geometry();
  console.log(path.length)
  // 경로 포인트를 Three.js 좌표로 변환하여 경로에 추가
  for (var i = 0; i < path.length; i++) {
    var pose = path[i].pose;
    var position = pose.position;
    pathGeometry.vertices.push(
      new THREE.Vector3(position.x, position.y, position.z)
    );
  }

  // 경로를 렌더링할 Three.js Line 객체 생성
  var pathLine = new THREE.Line(pathGeometry, pathMaterial);

  // // 마지막 경로 포인트의 위치 추출
  // var lastPoint = path[path.length - 1];
  // var lastPosition = lastPoint.pose.position;

  // // 이미지 텍스처 로드
  // var textureLoader = new THREE.TextureLoader();
  // textureLoader.load(
  //   "/home/wego/Desktop/6 month/js/Group 15949.png",
  //   function (texture) {
  //     // 이미지를 표시할 평면 생성
  //     var imageGeometry = new THREE.PlaneGeometry(0.5, 0.5); // 이미지의 크기에 따라 조절
  //     var imageMaterial = new THREE.MeshBasicMaterial({
  //       map: texture,
  //       transparent: true,
  //     });
  //     var imagePlane = new THREE.Mesh(imageGeometry, imageMaterial);

  //     // 이미지를 마지막 경로 포인트 위치에 배치
  //     imagePlane.position.copy(lastPosition);

  //     // 이미지를 경로와 함께 3D 화면에 추가
  //     var imageObject = new THREE.Object3D();
  //     imageObject.add(imagePlane);
  //     pathLine.add(imageObject); // 경로에 이미지를 추가

  //     // 이미지가 로드되었으므로 화면 업데이트
  //   }
  // );

  return pathLine; // 생성된 경로를 반환
}