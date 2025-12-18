import React from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { Text3DComponent } from './textComponent.jsx';

export default function ThreeScene({ text }) {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 3, 20]} near={30} far={45} />
      <directionalLight color="white" position={[0, 0, 55]} />
      <Text3DComponent text={text} />
    </Canvas>
  );
}
