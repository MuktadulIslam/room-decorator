'use client'

import * as THREE from 'three'
import { useRef, useMemo } from 'react'
import { useLoader } from '@react-three/fiber'
import { ThreeEvent } from '@react-three/fiber'
import Ceiling from './Ceiling'
import Window from './Windows'
import { useColors } from '../../contexts/ColorContext'

export default function Walls() {
    const { wallColors, wallTextures, selectedWall, setSelectedWall } = useColors()
    const wallRefs = useRef<{ [key: string]: THREE.Mesh }>({})

    const handleWallClick = (wallId: string) => (event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation()
        setSelectedWall(selectedWall === wallId ? null : wallId)
    }

    const getWallColor = (wallId: string) => {
        return wallColors[wallId as keyof typeof wallColors] || wallColors.back
    }

    const getWallOpacity = (wallId: string) => {
        return selectedWall === wallId ? 0.8 : 1.0
    }

    // Pre-load all wall textures using hooks
    const wallTextureMap = useMemo(() => {
        const textures: { [key: string]: THREE.Texture | null } = {}
        Object.keys(wallTextures).forEach(wallId => {
            const textureUrl = wallTextures[wallId as keyof typeof wallTextures]
            if (textureUrl) {
                try {
                    const loader = new THREE.TextureLoader()
                    const tex = loader.load(textureUrl,
                        // onLoad callback
                        (texture) => {
                            console.log(`Texture loaded for ${wallId}:`, textureUrl)
                            // Single image covers entire wall - no repetition
                            tex.wrapS = THREE.ClampToEdgeWrapping
                            tex.wrapT = THREE.ClampToEdgeWrapping
                            tex.repeat.set(1, 1)
                            tex.offset.set(0, 0)
                            tex.flipY = true
                            tex.generateMipmaps = false
                            tex.minFilter = THREE.LinearFilter
                            tex.magFilter = THREE.LinearFilter
                            tex.needsUpdate = true
                        },
                        // onProgress callback
                        undefined,
                        // onError callback
                        (error) => {
                            console.error(`Failed to load texture for ${wallId}:`, error)
                        }
                    )
                    // Initial settings (will be overridden in onLoad)
                    tex.wrapS = THREE.ClampToEdgeWrapping
                    tex.wrapT = THREE.ClampToEdgeWrapping
                    tex.repeat.set(1, 1)
                    tex.offset.set(0, 0)
                    tex.flipY = false
                    tex.generateMipmaps = false
                    tex.minFilter = THREE.LinearFilter
                    tex.magFilter = THREE.LinearFilter
                    textures[wallId] = tex
                } catch (error) {
                    console.error(`Error creating texture for ${wallId}:`, error)
                    textures[wallId] = null
                }
            } else {
                textures[wallId] = null
            }
        })
        return textures
    }, [wallTextures])

    const createWallMaterial = (wallId: string) => {
        const textureMap = wallTextureMap[wallId]
        const color = getWallColor(wallId)
        const opacity = getWallOpacity(wallId)

        console.log(`Creating material for ${wallId}:`, {
            hasTexture: !!textureMap,
            color,
            opacity,
            textureUrl: wallTextures[wallId as keyof typeof wallTextures]
        })

        if (textureMap) {
            return (
                <meshLambertMaterial
                    key={`${wallId}-textured-${wallTextures[wallId as keyof typeof wallTextures]}`}
                    map={textureMap}
                    transparent={selectedWall === wallId}
                    opacity={opacity}
                />
            )
        } else {
            return (
                <meshLambertMaterial
                    key={`${wallId}-colored-${color}`}
                    color={color}
                    transparent={selectedWall === wallId}
                    opacity={opacity}
                />
            )
        }
    }

    const wallThickness = 0.2

    // Helper function to manually set UVs for the front face
    const setFrontFaceUVs = (geometry: THREE.ExtrudeGeometry) => {
        const pos = geometry.attributes.position;
        const uvs = [];

        // Get bounding box to normalize UVs
        geometry.computeBoundingBox();
        const bbox = geometry.boundingBox!;
        const width = bbox.max.x - bbox.min.x;
        const height = bbox.max.y - bbox.min.y;

        // For extruded geometry, we need to identify front face vertices
        // Front face vertices have the maximum z value
        const maxZ = bbox.max.z;

        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            const z = pos.getZ(i);

            // Only set proper UVs for front face vertices
            if (Math.abs(z - maxZ) < 0.001) {
                // Normalize to 0-1 range
                const u = (x - bbox.min.x) / width;
                const v = (y - bbox.min.y) / height;
                uvs.push(u, v);
            } else {
                // Keep default UVs for other faces
                uvs.push(0, 0);
            }
        }

        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        return geometry;
    }

    // Create wall geometry with window openings
    const createWallWithOpenings = (wallWidth: number, wallHeight: number, openings: Array<{ x: number, y: number, width: number, height: number }>) => {
        const wallShape = new THREE.Shape()
        wallShape.moveTo(-wallWidth / 2, -wallHeight / 2)
        wallShape.lineTo(wallWidth / 2, -wallHeight / 2)
        wallShape.lineTo(wallWidth / 2, wallHeight / 2)
        wallShape.lineTo(-wallWidth / 2, wallHeight / 2)
        wallShape.lineTo(-wallWidth / 2, -wallHeight / 2)

        // Create holes for windows
        openings.forEach(opening => {
            const hole = new THREE.Path()
            hole.moveTo(opening.x - opening.width / 2, opening.y - opening.height / 2)
            hole.lineTo(opening.x + opening.width / 2, opening.y - opening.height / 2)
            hole.lineTo(opening.x + opening.width / 2, opening.y + opening.height / 2)
            hole.lineTo(opening.x - opening.width / 2, opening.y + opening.height / 2)
            hole.lineTo(opening.x - opening.width / 2, opening.y - opening.height / 2)
            wallShape.holes.push(hole)
        })

        const geometry = new THREE.ExtrudeGeometry(wallShape, {
            depth: wallThickness,
            bevelEnabled: false,
            UVGenerator: {
                generateTopUV: function (geometry, vertices, indexA, indexB, indexC) {
                    return [
                        new THREE.Vector2(0, 0),
                        new THREE.Vector2(1, 0),
                        new THREE.Vector2(1, 1)
                    ];
                },
                generateSideWallUV: function (geometry, vertices, indexA, indexB, indexC, indexD) {
                    return [
                        new THREE.Vector2(0, 0),
                        new THREE.Vector2(1, 0),
                        new THREE.Vector2(1, 1),
                        new THREE.Vector2(0, 1)
                    ];
                }
            }
        })

        // Manually fix UVs for proper texture mapping
        return setFrontFaceUVs(geometry)
    }

    return (
        <group>
            {/* Back wall - 3D element */}
            <mesh
                ref={(ref) => ref && (wallRefs.current['back'] = ref)}
                position={[0, 1.5, -4]}
                receiveShadow
                castShadow
                onDoubleClick={handleWallClick('back')}
            >
                <boxGeometry args={[10, 3, wallThickness]} />
                {createWallMaterial('back')}
            </mesh>

            {/* Left wall - 3D element */}
            <mesh
                ref={(ref) => ref && (wallRefs.current['left'] = ref)}
                position={[-5, 1.5, 0]}
                receiveShadow
                castShadow
                onDoubleClick={handleWallClick('left')}
            >
                <boxGeometry args={[wallThickness, 3, 8]} />
                {createWallMaterial('left')}
            </mesh>

            {/* Right wall - 3D element */}
            <mesh
                ref={(ref) => ref && (wallRefs.current['right'] = ref)}
                position={[5, 1.5, 0]}
                receiveShadow
                castShadow
                onDoubleClick={handleWallClick('right')}
            >
                <boxGeometry args={[wallThickness, 3, 8]} />
                {createWallMaterial('right')}
            </mesh>

            {/* Front wall - 3D element */}
            <mesh
                ref={(ref) => ref && (wallRefs.current['front'] = ref)}
                position={[0, 1.5, 4]}
                receiveShadow
                castShadow
                onDoubleClick={handleWallClick('front')}
            >
                <boxGeometry args={[10, 3, wallThickness]} />
                {createWallMaterial('front')}
            </mesh>

            {/* Add windows using the reusable Window component */}
            <Window
                position={[-5, 2, -1]}
                rotation={[0, Math.PI / 2, 0]}
                size={[1.5, 1.2]}
            />

            <Window
                position={[5, 2, -1]}
                rotation={[0, -Math.PI / 2, 0]}
                size={[1.5, 1.2]}
            />

            <Window
                position={[2, 2, -4]}
                rotation={[0, 0, 0]}
                size={[2, 1.2]}
            />

            {/* 3D Ceiling component */}
            <Ceiling />
        </group>
    )
}