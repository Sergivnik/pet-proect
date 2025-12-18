import React, { useEffect, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Center, Text3D } from '@react-three/drei';
import { Clock, TextureLoader } from 'three';

import Roboto from './Roboto_Regular.json';
import { DOMENNAME } from '../../middlewares/initialState';

export const Text3DComponent = ({ text }) => {
  const groupRef = useRef(null);
  const clock = useRef(new Clock());

  const colorMap = useLoader(
    TextureLoader,
    `${DOMENNAME}/textures/WoodFloor051_2K_Color.png`
  );

  useEffect(() => {
    clock.current.start();
    if (groupRef.current) {
      groupRef.current.position.set(0, 0, -30);
    }
  }, [text]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.position.z += 2 * delta;
  });

  return (
    <Center ref={groupRef}>
      <Text3D
        font={Roboto}
        size={2}
        height={1.5}
        bevelThickness={10}
        castShadow
        letterSpacing={-0.15}
        flatShading
      >
        {text}
        <meshStandardMaterial
          map={colorMap}
          color="white"
          roughness={1}
          metalness={0}
        />
      </Text3D>
    </Center>
  );
};
