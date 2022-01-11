import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  name = 'Angular';
  tolerance = 5;

  ngOnInit() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    const renderer_domElement = renderer.domElement;
    document.body.appendChild(renderer_domElement);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const sphereGeometry = new THREE.SphereGeometry(100, 100, 100);

    const wireframe = new THREE.WireframeGeometry(sphereGeometry);

    const line = new THREE.LineSegments(wireframe);
    line.material.depthTest = false;
    line.material.opacity = 0.25;
    line.material.transparent = true;

    scene.add(line);
    var draw = false;
    const oldCoord = new THREE.Vector2();
    var oldAngle,
      CANADD = false,
      TOLERANCE = 5;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function createCube(position: object) {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.copy(position);
      scene.add(cube);
    }
    function onMouseMove(event) {
      // calculate mouse position in normalized device coordinates
      // (-1 to +1) for both components
      oldCoord.x = mouse.x;
      oldCoord.y = mouse.y;

      mouse.x =
        ((event.clientX - renderer_domElement.offsetLeft) /
          renderer_domElement.clientWidth) *
          2 -
        1;
      mouse.y =
        -(
          (event.clientY - renderer_domElement.offsetTop) /
          renderer_domElement.clientHeight
        ) *
          2 +
        1;
      if (!oldCoord.x && !oldCoord.y) {
        oldCoord.x = mouse.x;
        oldCoord.y = mouse.y;
      } else {
        var angleDeg =
          (Math.atan2(mouse.y - oldCoord.y, mouse.x - oldCoord.x) * 180) /
          Math.PI;
        if (oldAngle) {
          let diffAngle = oldAngle - angleDeg;
          if (diffAngle < 0) diffAngle *= -1;
          if (diffAngle > TOLERANCE) CANADD = true;
        }
        oldAngle = angleDeg;
      }
    }

    function onMouseDown(event) {
      draw = true;
    }
    function onMouseUp(event) {
      draw = false;
    }
    function render() {
      window.requestAnimationFrame(render);
      // update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);

      // calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects(scene.children);

      for (let i = 0; i < intersects.length; i++) {
        //intersects[ i ].object.material.color.set( 0xff0000 );
        cube.position.copy(intersects[i].point);
        if (draw && CANADD) {
          createCube(intersects[i].point);
          CANADD = false;
        }
      }

      renderer.render(scene, camera);
    }

    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('mousedown', onMouseDown, false);
    window.addEventListener('mouseup', onMouseUp, false);

    render();
  }
}
