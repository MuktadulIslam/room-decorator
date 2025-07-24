import React from 'react';
import * as THREE from 'three';
import { Plane } from '@react-three/drei';
import { TiledFloorProps, FloorTileProps } from './types';
import { useColors } from '../../contexts/ColorContext';

// Floor tile component
function FloorTile({ position, color, borderColor, texture, tileKey }: FloorTileProps) {
  const { setSelectedTile } = useColors();

  const handleClick = () => {
    setSelectedTile(tileKey);
  };

  const borderWidth = 0.01; // Width of the border/grout lines
  const tileSize = 1 - borderWidth;

  return (
    <group position={position}>
      {/* Border/grout lines */}
      <Plane
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        args={[1, 1]}
        onClick={handleClick}
      >
        <meshStandardMaterial color={borderColor} />
      </Plane>

      {/* Main tile surface */}
      <Plane
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.001, 0]}
        args={[tileSize, tileSize]}
        onClick={handleClick}
      >
        <meshStandardMaterial
          color={color}
          map={texture ? new THREE.TextureLoader().load(texture) : null}
        />
      </Plane>
    </group>
  );
}

// Tiled floor component
function TiledFloor({ width, length, color, borderColor }: TiledFloorProps) {
  const { floorTileTextures } = useColors();
  const tiles: React.JSX.Element[] = [];

  for (let x = 0; x < length; x++) {
    for (let z = 0; z < width; z++) {
      const posX = x - length / 2 + 0.5;
      const posZ = z - width / 2 + 0.5;
      const tileKey = `tile-${x}-${z}`;

      tiles.push(
        <FloorTile
          key={tileKey}
          tileKey={tileKey}
          position={[posX, 0.01, posZ]}
          color={color}
          borderColor={borderColor}
          texture={floorTileTextures[tileKey] || null}
        />
      );
    }
  }

  return <group position={[0, 0, 0]}>{tiles}</group>;
}

// Main Floor component that uses TiledFloor
export default function Floor() {
  const { floorColor, floorBorderColor, floorBorderWidth } = useColors();

  return (
    <TiledFloor
      width={8}
      length={10}
      color={floorColor}
      borderColor={floorBorderColor}
    />
  );
}