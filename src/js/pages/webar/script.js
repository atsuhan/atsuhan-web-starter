import runAR from '@/js/lib/8thwall/runAR';
import Stats from '@/js/lib/stats/StatsTicker';
import threeHelpers from '@/js/lib/three/ThreeHelpers';
import ThreeGround from '@/js/lib/three/meshes/ThreeGround';
import ThreeVideoPlane from '@/js/lib/three/meshes/ThreeVideoPlane';
import XrThreeBase from '@/js/lib/8thwall/XrThreeBase';
import ThreeDirectionalLight from '../../lib/three/lights/ThreeDirectionalLight';
import ThreeAmbientLight from '../../lib/three/lights/ThreeAmbientLight';
import ThreePostprocessingBloom from '../../lib/three/postprocessing/ThreePostprocessingBloom';
import threeRaycaster from '../../lib/three/ThreeRaycaster';

let _stats = null;
let _videoEl = document.querySelector('.videos__hoshino');
let _threeAmbientLight = null;
let _threeDirectionalLight = null;
let _threeGround = null;
let _threeVideoPlane = null;
let _xrThreeBase = null;
let _threePostprocessing = null;

const onStart = () => {
  _xrThreeBase = new XrThreeBase();
  _stats = new Stats();

  // three helper
  threeHelpers.initAxisHelper('centerAxis', _xrThreeBase.scene);
  //threeHelpers.initGridHelper('groundGrid', _xrThreeBase.scene);
  threeHelpers.addHelpers();

  // Ground
  _threeGround = new ThreeGround();
  _threeGround.add(_xrThreeBase.scene);

  // VideoPlane
  _threeVideoPlane = new ThreeVideoPlane({
    videoEl: _videoEl
  });
  _threeVideoPlane.init();
  window.addEventListener('touchstart', e => {
    const rayPos = threeRaycaster.getRayIntersectPos(e, _xrThreeBase.camera, [
      _threeGround.mesh
    ]);
    _threeVideoPlane.move(rayPos);
    _threeVideoPlane.lookAtAxisY(_xrThreeBase.camera);
    if (!_threeVideoPlane.parent) {
      _videoEl.play();
      _threeVideoPlane.setScaleVideoAspect(2);
      _threeVideoPlane.addTo(_xrThreeBase.scene);
    }
  });

  // Directional Light
  _threeDirectionalLight = new ThreeDirectionalLight({
    force: 0.5
  });
  _threeDirectionalLight.move(new THREE.Vector3(0, 10, 10));
  _threeDirectionalLight.addTo(_xrThreeBase.scene);

  // Ambient Light
  _threeAmbientLight = new ThreeAmbientLight({
    force: 0.4
  });
  _threeAmbientLight.addTo(_xrThreeBase.scene);

  // postprocessing
  _threePostprocessing = new ThreePostprocessingBloom({
    renderer: _xrThreeBase.renderer,
    camera: _xrThreeBase.camera,
    scene: _xrThreeBase.scene
  });
};

const onUpdate = () => {
  _threePostprocessing.update();
  _stats.update();
};

runAR(getCustomPipeline);
function getCustomPipeline() {
  return {
    name: 'WebARMock',
    onStart,
    onUpdate
  };
}
