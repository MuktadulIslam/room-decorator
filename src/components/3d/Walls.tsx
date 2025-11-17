'use client'

import * as THREE from 'three'
import { useRef, useMemo, useEffect, JSX } from 'react'
import { ThreeEvent } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import Ceiling from './Ceiling'
import Window from './Windows'
import { useColors } from '../../contexts/ColorContext'

export default function Walls() {
    const {
        wallColors,
        wallTextures,
        selectedWall,
        setSelectedWall,
        setDropdownSelectedWall,
        roomDimensions
    } = useColors()

    const wallRefs = useRef<{ [key: string]: THREE.Mesh }>({})

    // Extract room dimensions
    const { width: roomWidth, length: roomLength, height: roomHeight, wallThickness } = roomDimensions

    // Optimize texture loading with useTexture hook and memoization
    const textureUrls = useMemo(() => {
        const urls: { [key: string]: string } = {}
        Object.keys(wallTextures).forEach(wallId => {
            const textureUrl = wallTextures[wallId as keyof typeof wallTextures]
            if (textureUrl) {
                urls[wallId] = textureUrl
            }
        })
        return urls
    }, [wallTextures])

    // Load textures only when URLs change
    const loadedTextures = useMemo(() => {
        const textures: { [key: string]: THREE.Texture | null } = {}
        
        Object.keys(textureUrls).forEach(wallId => {
            try {
                const loader = new THREE.TextureLoader()
                const texture = loader.load(textureUrls[wallId])
                texture.wrapS = THREE.ClampToEdgeWrapping
                texture.wrapT = THREE.ClampToEdgeWrapping
                texture.repeat.set(1, 1)
                texture.offset.set(0, 0)
                texture.flipY = false
                texture.generateMipmaps = false
                texture.minFilter = THREE.LinearFilter
                texture.magFilter = THREE.LinearFilter
                textures[wallId] = texture
            } catch (error) {
                console.error(`Error loading texture for ${wallId}:`, error)
                textures[wallId] = null
            }
        })
        
        return textures
    }, [textureUrls])

    // Dispose old textures when they change
    useEffect(() => {
        return () => {
            Object.values(loadedTextures).forEach(texture => {
                if (texture) {
                    texture.dispose()
                }
            })
        }
    }, [loadedTextures])

    const handleWallClick = (wallId: string) => (event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation()
        if (selectedWall === wallId) {
            setSelectedWall(null)
            setDropdownSelectedWall('all')
        } else {
            setSelectedWall(wallId)
            setDropdownSelectedWall(wallId)
        }
    }

    const getWallColor = (wallId: string) => {
        return wallColors[wallId as keyof typeof wallColors] || wallColors.back
    }

    // Memoize materials to prevent recreation
    const wallMaterials = useMemo(() => {
        const materials: { [key: string]: JSX.Element } = {}
        
        Object.keys(wallColors).forEach(wallId => {
            const texture = loadedTextures[wallId]
            const color = getWallColor(wallId)
            
            if (texture) {
                materials[wallId] = (
                    <meshLambertMaterial
                        key={`${wallId}-textured`}
                        map={texture}
                        transparent={false}
                    />
                )
            } else {
                materials[wallId] = (
                    <meshLambertMaterial
                        key={`${wallId}-colored`}
                        color={color}
                        transparent={false}
                    />
                )
            }
        })
        
        return materials
    }, [wallColors, loadedTextures])

    // Memoize geometries
    const wallGeometry = useMemo(() => 
        new THREE.BoxGeometry(1, 1, 1), 
        []
    )

    return (
        <group>
            {/* Back wall */}
            <mesh
                ref={(ref) => ref && (wallRefs.current['back'] = ref)}
                position={[0, roomHeight / 2, -roomLength / 2]}
                scale={[roomWidth, roomHeight, wallThickness]}
                receiveShadow
                castShadow
                onDoubleClick={handleWallClick('back')}
                geometry={wallGeometry}
            >
                {wallMaterials.back}
            </mesh>

            {/* Left wall */}
            <mesh
                ref={(ref) => ref && (wallRefs.current['left'] = ref)}
                position={[-roomWidth / 2, roomHeight / 2, 0]}
                scale={[wallThickness, roomHeight, roomLength]}
                receiveShadow
                castShadow
                onDoubleClick={handleWallClick('left')}
                geometry={wallGeometry}
            >
                {wallMaterials.left}
            </mesh>

            {/* Right wall */}
            <mesh
                ref={(ref) => ref && (wallRefs.current['right'] = ref)}
                position={[roomWidth / 2, roomHeight / 2, 0]}
                scale={[wallThickness, roomHeight, roomLength]}
                receiveShadow
                castShadow
                onDoubleClick={handleWallClick('right')}
                geometry={wallGeometry}
            >
                {wallMaterials.right}
            </mesh>

            {/* Front wall */}
            <mesh
                ref={(ref) => ref && (wallRefs.current['front'] = ref)}
                position={[0, roomHeight / 2, roomLength / 2]}
                scale={[roomWidth, roomHeight, wallThickness]}
                receiveShadow
                castShadow
                onDoubleClick={handleWallClick('front')}
                geometry={wallGeometry}
            >
                {wallMaterials.front}
            </mesh>

            {/* Windows - reduced complexity */}
            <Window
                position={[-roomWidth / 2, roomHeight * 0.67, -roomLength / 6]}
                rotation={[0, Math.PI / 2, 0]}
                size={[1.5, 1.2]}
            />

            <Window
                position={[roomWidth / 2, roomHeight * 0.67, -roomLength / 6]}
                rotation={[0, -Math.PI / 2, 0]}
                size={[1.5, 1.2]}
            />

            <Window
                position={[roomWidth / 5, roomHeight * 0.67, -roomLength / 2]}
                rotation={[0, 0, 0]}
                size={[2, 1.2]}
            />

            {/* Ceiling */}
            <Ceiling />
        </group>
    )
}