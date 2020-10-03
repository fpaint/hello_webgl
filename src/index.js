import './styles.css';
import * as Three from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import sky from './textures/sky.jpg';
import rock_texture from './textures/rock.jpg';

// const Three = ThreeLib()

class Textures {
  constructor() {
    this.loader = new Three.TextureLoader() 
  }
  set_to(object, filename) {
    this.loader.load(filename, (texture) => {
      object.material.map = texture
      object.material.needsUpdate = true
      object.material.map.needsUpdate = true
    })
  }
}

const textures = new Textures;

const load_sky = (filename, renderer, scene) => {
  const loader = new Three.TextureLoader();
  const texture = loader.load(filename, () => {
    const rt = new Three.WebGLCubeRenderTarget(texture.image.height);
    rt.fromEquirectangularTexture(renderer, texture);
    scene.background = rt;
  });
}

const init = (node) => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const scene = new Three.Scene();
  const renderer = new Three.WebGLRenderer({antialias: true});
  const blank = new Three.MeshPhongMaterial();
  renderer.setSize(width, height);
  node.appendChild(renderer.domElement);

  const axesHelper = new Three.AxesHelper( 5 );
  scene.add(axesHelper);

  const camera = new Three.PerspectiveCamera( 75, width / height, 0.1, 1000 );
  camera.position.z = 5;
  camera.lookAt(0, 0)
//  camera.rotation.x = 0.5 * Math.PI;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.update();

  const light = new Three.HemisphereLight(0xffffbb, 0x080820, 1 );
  scene.add(light);

  load_sky(sky, renderer, scene)

  const plane_geometry = new Three.PlaneGeometry(10, 10);
  const plane = new Three.Mesh(plane_geometry)
  plane.rotation.x = -0.5 * Math.PI
  scene.add(plane)
  textures.set_to(plane, rock_texture);

  const geometry = new Three.DodecahedronGeometry(2.0);
  const dode = new Three.Mesh( geometry );
  scene.add(dode);
  textures.set_to(dode, rock_texture);

  const animate = () => {
    requestAnimationFrame( animate );
    dode.rotation.x += 0.01;
    dode.rotation.y += 0.01;
    renderer.render( scene, camera );
  }
  animate();
}

document.body.onload = () => { init(document.getElementById('app')) };