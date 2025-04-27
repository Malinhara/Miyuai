import { Environment, SpotLight } from "@react-three/drei";
import { Suspense, useRef, useEffect } from "react";
import { Avatar } from "./Avatar";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { Scene } from "./Scene_update";
import { useControls } from "leva";

const BloomEffect = () => {
  const { scene, camera, gl, size } = useThree();
  const composer = useRef();

  useEffect(() => {
    const pixelRatio = gl.getPixelRatio();
    const renderTarget = new THREE.WebGLRenderTarget(
      size.width * pixelRatio,
      size.height * pixelRatio
    );

    composer.current = new EffectComposer(gl, renderTarget);
    const renderPass = new RenderPass(scene, camera);
    composer.current.addPass(renderPass);

    const unrealBloomPass = new UnrealBloomPass(
      new THREE.Vector2(size.width * pixelRatio, size.height * pixelRatio),
      1, 
      0.4, 
      0.8 
    );
    composer.current.addPass(unrealBloomPass);

    gl.autoClear = false;

    return () => {
      composer.current?.dispose();
      renderTarget.dispose();
    };
  }, [scene, camera, gl, size]);

  useFrame(() => {
    if (composer.current) {
      composer.current.render();
    }
  }, 1);

  return null;
};

export const Experience = () => {
  const { posX, posY, posZ, rotX, rotY, rotZ } = useControls("Avatar Controls", {
    posX: { value: 0, min: 0, max: 5, step: 0 },
    posY: { value: 0, min: 0, max: 0, step: 0 },
    posZ: { value: 0, min: 0, max: 0, step: 0 },
    rotX: { value: 0, min: -Math.PI, max: Math.PI, step: 0 },
    rotY: { value: 0, min: -Math.PI, max: Math.PI, step: 0 },
    rotZ: { value: 0, min: -Math.PI, max: Math.PI, step: 0 },
  });

  return (
    <>
      <Environment preset="night" />
      <ambientLight intensity={0.06} />

      <group position={[0, -1.3, 0]}>
        <SpotLight position={[-3, 2.8, 2]} angle={0.8} penumbra={1} intensity={9} color="#da8aff" />
        <SpotLight intensity={4} angle={1} penumbra={1} decay={1.4} color="#fff" position={[2.5, 2.5, 2]} />
        <SpotLight intensity={5} angle={1} penumbra={0.5} color="#da8aff" position={[1.5, 2.9, -4]} />
        <SpotLight intensity={5} angle={1} penumbra={0.5} color="#da8aff" position={[-1.5, 2.9, -4]} />
        
        <Avatar 
          position={[0.25, posY, -0.25]} 
          rotation={[rotX, rotY, rotZ]} 
        />
        
        <Scene />
      </group>
      
      <BloomEffect />
    </>
  );
};