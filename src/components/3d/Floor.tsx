import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useColors } from '../../contexts/ColorContext';

// Optimized Floor component using a single geometry approach
export default function Floor() {
    const { 
        floorColor, 
        floorBorderColor, 
        floorRotation, 
        roomDimensions,
        tilesWidth,
        tilesLength,
        floorTexture 
    } = useColors();

    const { width: roomWidth, length: roomLength } = roomDimensions;

    // Calculate tile dimensions
    const tileDimensions = useMemo(() => {
        const tilesLengthInFoot = tilesLength / 12;
        const tilesWidthInFoot = tilesWidth / 12;
        const tilesCountInLength = Math.round(roomLength * 3 / tilesLengthInFoot);
        const tilesCountInWidth = Math.round(roomWidth * 3 / tilesWidthInFoot);
        
        return {
            tilesLengthInFoot,
            tilesWidthInFoot,
            tilesCountInLength,
            tilesCountInWidth
        };
    }, [tilesLength, tilesWidth, roomWidth, roomLength]);

    // Create texture with memoization
    const floorTextureMap = useMemo(() => {
        if (!floorTexture) return null;
        
        const loader = new THREE.TextureLoader();
        const texture = loader.load(floorTexture);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }, [floorTexture]);

    // Dispose old texture when it changes
    useEffect(() => {
        return () => {
            if (floorTextureMap) {
                floorTextureMap.dispose();
            }
        };
    }, [floorTextureMap]);

    // Create a canvas texture for the tile pattern
    const tileTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        const size = 128;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;
        
        // Draw border (grout) - full canvas
        ctx.fillStyle = floorBorderColor;
        ctx.fillRect(0, 0, size, size);
        
        // Draw tile - leaving border space
        const borderSize = 3; // Border size in pixels
        ctx.fillStyle = floorColor;
        ctx.fillRect(borderSize, borderSize, size - borderSize * 2, size - borderSize * 2);
        
        // If there's a floor texture, we could overlay it here
        // For now, keeping it simple with solid colors
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.generateMipmaps = false;
        texture.minFilter = THREE.NearestFilter;
        texture.magFilter = THREE.NearestFilter;
        
        return texture;
    }, [floorColor, floorBorderColor]);

    // Create floor geometry
    const floorGeometry = useMemo(() => {
        const { tilesCountInLength, tilesCountInWidth, tilesLengthInFoot, tilesWidthInFoot } = tileDimensions;
        
        const totalWidth = tilesCountInLength * tilesLengthInFoot;
        const totalLength = tilesCountInWidth * tilesWidthInFoot;
        
        const geometry = new THREE.PlaneGeometry(totalWidth, totalLength);
        
        return geometry;
    }, [tileDimensions]);

    // Create material
    const floorMaterial = useMemo(() => {
        const { tilesCountInLength, tilesCountInWidth } = tileDimensions;
        
        // Clone the texture to avoid modifying the original
        const material = new THREE.MeshStandardMaterial({
            map: tileTexture.clone(),
        });
        
        // Set texture repeat to match tile count
        if (material.map) {
            material.map.repeat.set(tilesCountInLength, tilesCountInWidth);
            material.map.needsUpdate = true;
        }
        
        return material;
    }, [tileTexture, tileDimensions]);

    // Dispose materials when they change
    useEffect(() => {
        return () => {
            floorMaterial.dispose();
            if (floorMaterial.map) {
                floorMaterial.map.dispose();
            }
        };
    }, [floorMaterial]);

    // Convert rotation from degrees to radians
    const rotationInRadians = (floorRotation * Math.PI) / 180;

    return (
        <group rotation={[0, rotationInRadians, 0]}>
            <mesh 
                geometry={floorGeometry}
                material={floorMaterial}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0, 0]}
                receiveShadow
            />
        </group>
    );
}