// 클릭한 목표 위치
var targetPose;
var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
// 이전에 그려진 라인을 저장하는 변수를 정의합니다. 처음에는 null로 초기화합니다.
var previousLine = null;
var previousNum = null;
viewer.renderer.domElement.addEventListener(
  "dblclick",
  function (event) {
    // 클릭한 좌표를 정규화합니다.
    var mouse = new THREE.Vector2();

    // 현재의 클라이언트 좌표를 가져옵니다.
    var clientX = event.clientX;
    var clientY = event.clientY;

    // 클라이언트 좌표를 적절한 방식으로 정규화합니다.
    var rect = viewer.renderer.domElement.getBoundingClientRect();
    mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    // 레이캐스터를 업데이트하고, 교차하는 객체를 가져옵니다.
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, viewer.camera);
    var intersects = raycaster.intersectObjects(viewer.scene.children);

    if (intersects.length > 0) {
      // 첫 번째 교차하는 객체의 좌표를 출력합니다.
      console.log("Scene coordinate:", intersects[0].point);
      targetPose = { x: intersects[0].point.x, y: intersects[0].point.y };

      // 이전에 그려진 라인이 있다면 씬에서 제거합니다.
      if (previousLine !== null || previousNum) {
        viewer.scene.remove(previousLine);
        viewer.scene.remove(previousNum);
      }

      // 클릭한 좌표와 로봇 사이에 직선을 그립니다.
      var material = new THREE.LineDashedMaterial({
        color: 808000,
        dashSize: 100,
        gapSize: 3,
      });
      var geometry = new THREE.Geometry();
      geometry.vertices.push(robot.position);
      geometry.vertices.push(intersects[0].point);
      var line = new THREE.Line(geometry, material);
      viewer.scene.add(line);
      // 선의 길이를 계산합니다.
      var lineLength = robot.position.distanceTo(intersects[0].point);

      // 선의 중앙에 텍스트를 추가합니다.
      var loader = new THREE.FontLoader();
      loader.load(
        "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
        function (font) {
          var textGeometry = new THREE.TextGeometry(lineLength.toFixed(2), {
            font: font,
            size: 0.2, // 텍스트 크기를 조절합니다.
            height: 0.02, // 텍스트 높이를 조절합니다.
          });

          var textMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // 초록색
          var textMesh = new THREE.Mesh(textGeometry, textMaterial);

          // 텍스트를 선의 중앙에 배치합니다.
          var midpoint = new THREE.Vector3()
            .addVectors(robot.position, intersects[0].point)
            .multiplyScalar(0.5);
          textMesh.position.set(midpoint.x, midpoint.y, midpoint.z);

          viewer.scene.add(textMesh);
          previousNum = textMesh;
        }
      );
      // 새로 그린 라인을 previousLine 변수에 저장합니다.
      previousLine = line;
    }
    event.preventDefault();
  },
  false
);






document.getElementById("go").addEventListener("click", function () {
  if (targetPose) {
    // '/move_base/goal' 토픽에 대한 Publisher를 생성합니다.
    var goalPublisher = new ROSLIB.Topic({
      ros: ros,
      name: "/move_base/goal",
      messageType: "move_base_msgs/MoveBaseActionGoal",
    });

    // 메시지 생성
    var goalMessage = new ROSLIB.Message({
      goal_id: {
        stamp: {
          secs: 0,
          nsecs: 0,
        },
        id: "",
      },
      goal: {
        target_pose: {
          header: {
            seq: 0,
            stamp: {
              secs: 0,
              nsecs: 0,
            },
            frame_id: "map",
          },
          pose: {
            position: {
              x: targetPose.x, // 그리드 좌표를 실제 좌표로 변환
              y: targetPose.y,
              z: 0,
            },
            orientation: {
              x: 0,
              y: 0,
              z: 0,
              w: 1,
            },
          },
        },
      },
    });

    goalPublisher.publish(goalMessage);
    console.log("Published navigation goal:", targetPose);
  } else {
    console.log("No target pose. Please click on the map.");
  }
});
