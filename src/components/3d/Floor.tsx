import React from 'react';
import * as THREE from 'three';
import { Plane } from '@react-three/drei';
import { TiledFloorProps, FloorTileProps } from './types';
import { useColors } from '../../contexts/ColorContext';

// Floor tile component
function FloorTile({ position, color, borderColor, texture, tileKey, tileSize }: FloorTileProps) {
  const { setSelectedTile } = useColors();

  const handleClick = () => {
    setSelectedTile(tileKey);
  };

  const borderWidth = 0.01; // Width of the border/grout lines
  const [tileSizeLength, tileSizeWidth] = tileSize || [1, 1];
  const actualTileLength = tileSizeLength - borderWidth;
  const actualTileWidth = tileSizeWidth - borderWidth;

  return (
    <group position={position}>
      {/* Border/grout lines */}
      <Plane
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        args={[tileSizeLength, tileSizeWidth]}
        onClick={handleClick}
      >
        <meshStandardMaterial color={borderColor} />
      </Plane>

      {/* Main tile surface */}
      <Plane
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.001, 0]}
        args={[actualTileLength, actualTileWidth]}
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
  const { floorTexture, tilesWidth, tilesLength } = useColors();
  const tiles: React.JSX.Element[] = [];

  const tilesLenghtInFoot = tilesLength / 12;
  const tilesWidthInFoot = tilesWidth / 12;
  const tilesCountInLength = Math.round(length / tilesLenghtInFoot);
  const tilesCountInWidth = Math.round(width / tilesWidthInFoot);

  for (let x = 0; x < tilesCountInLength; x++) {
    for (let z = 0; z < tilesCountInWidth; z++) {
      const posX = (x - tilesCountInLength / 2 + 0.5) * tilesLenghtInFoot;
      const posZ = (z - tilesCountInWidth / 2 + 0.5) * tilesWidthInFoot;
      const tileKey = `tile-${x}-${z}`;

      tiles.push(
        <FloorTile
          key={tileKey}
          tileKey={tileKey}
          position={[posX, 0.01, posZ]}
          color={color}
          borderColor={borderColor}
          texture={floorTexture}
          tileSize={[tilesLenghtInFoot, tilesWidthInFoot]}
        />
      );
    }
  }

  return <group position={[0, 0, 0]}>{tiles}</group>;
}

// Main Floor component that uses TiledFloor
export default function Floor() {
  const { floorColor, floorBorderColor, floorBorderWidth } = useColors();

  // Fixed room dimensions - these represent the actual room size
  const roomWidth = 8;  // Room width in units
  const roomLength = 10; // Room length in units

  return (
    <TiledFloor
      width={roomWidth * 3}
      length={roomLength * 3}
      color={floorColor}
      borderColor={floorBorderColor}
    />
  );
}