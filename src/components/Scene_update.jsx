import React from 'react'
import { useGLTF } from '@react-three/drei'

export function Scene(props) {
  const { nodes, materials } = useGLTF('./models/Scene_update-transformed.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.SM_Background.geometry} material={materials['Material.002']} position={[53.803, -13.827, -0.225]} rotation={[Math.PI / 2, 0, 1.575]} scale={39.412} />
      <mesh geometry={nodes.SM_BarCounter.geometry} material={materials.M_BarCounter} position={[-1.182, -0.009, -3.999]} rotation={[-Math.PI, 0.004, -Math.PI]} scale={1.116} />
      <group position={[0.628, 2.28, -6.725]} rotation={[0, 1.567, 0]} scale={1.339}>
        <mesh geometry={nodes.Cylinder002.geometry} material={materials.PaletteMaterial001} />
        <mesh geometry={nodes.Cylinder002_1.geometry} material={materials.PaletteMaterial002} />
        <mesh geometry={nodes.Cylinder002_2.geometry} material={materials.PaletteMaterial003} />
      </group>
      <mesh geometry={nodes.SM_Floor.geometry} material={materials['M_Sci-fi_Floor']} position={[1.932, -0.009, 2.929]} rotation={[-Math.PI, 0.004, -Math.PI]} scale={1.116} />
      <mesh geometry={nodes.SM_Led.geometry} material={materials['M_Sci-fi_shelf']} position={[-0.628, 0.97, -4.48]} rotation={[-Math.PI, 0.004, 0]} scale={-1.116} />
      <mesh geometry={nodes.SM_Neon_NightClub.geometry} material={materials.M_NightClub} position={[-0.469, 2.904, -7.015]} rotation={[1.57, 0.229, 0.004]} scale={0.663} />
      <group position={[3.185, -0.009, -3.746]} rotation={[0, 1.567, 0]} scale={1.116}>
        <mesh geometry={nodes.Cube003.geometry} material={materials['M_Sci-fi_Light_02']} />
        <mesh geometry={nodes.Cube003_1.geometry} material={materials.M_Poster} />
      </group>
      <mesh geometry={nodes['SM_Sci-fi_Armchair003'].geometry} material={materials['M_Sci-fi_Armchair']} position={[-2.293, -0.009, -1.337]} rotation={[0, -0.004, 0]} scale={1.116} />
      <mesh geometry={nodes['SM_Sci-fi_Light'].geometry} material={materials['M_Sci-fi_Light']} position={[1.81, 1.391, -0.041]} rotation={[-Math.PI, 0.004, -Math.PI]} scale={1.116} />
      <mesh geometry={nodes['SM_Sci-fi_shelf001'].geometry} material={materials.PaletteMaterial004} position={[3.232, -0.009, -7.04]} rotation={[-Math.PI, 0.004, -Math.PI]} scale={1.116} />
      <mesh geometry={nodes['SM_Sci-fi_Stool'].geometry} material={materials['M_Sci-fi_Stool']} position={[-1.098, -0.009, -3.292]} rotation={[-Math.PI, 0.004, -Math.PI]} scale={1.116} />
      <mesh geometry={nodes['SM_Sci-fi_Table'].geometry} material={materials['M_Sci-fi_Table']} position={[-3.076, -0.009, -0.057]} rotation={[-Math.PI, 0.004, -Math.PI]} scale={1.116} />
      <mesh geometry={nodes.SM_Wall_01.geometry} material={materials.M_Wall} position={[3.044, -0.009, 3.798]} rotation={[-Math.PI, 0.004, -Math.PI]} scale={1.116} />
      <mesh geometry={nodes.SM_WallWindow.geometry} material={materials.M_WallWindow} position={[3.059, -0.009, -0.051]} rotation={[-Math.PI, 0.004, -Math.PI]} scale={1.116} />
    </group>
  )
}

useGLTF.preload('./models/Scene_update-transformed.glb')