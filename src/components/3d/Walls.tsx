'use client'

import * as THREE from 'three'
import { useRef } from 'react'
import { ThreeEvent } from '@react-three/fiber'
import Ceiling from './Ceiling'
import Window from './Windows'
import { useColors } from '../../contexts/ColorContext'

export default function Walls() {
    const { wallColors, selectedWall, setSelectedWall } = useColors()
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

    const wallThickness = 0.2

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

        return new THREE.ExtrudeGeometry(wallShape, {
            depth: wallThickness,
            bevelEnabled: false
        })
    }

    return (
        <group>
            {/* Back wall with window opening */}
            <mesh
                ref={(ref) => ref && (wallRefs.current['back'] = ref)}
                position={[0, 1.5, -4 - wallThickness / 2]}
                receiveShadow
                castShadow
                onDoubleClick={handleWallClick('back')}
            >
                <primitive object={createWallWithOpenings(10, 3, [{ x: 2, y: 0.5, width: 2, height: 1.2 }])} />
                <meshLambertMaterial
                    color={getWallColor('back')}
                    transparent={selectedWall === 'back'}
                    opacity={getWallOpacity('back')}
                />
            </mesh>

            {/* Left wall with window opening */}
            <mesh
                ref={(ref) => ref && (wallRefs.current['left'] = ref)}
                position={[-5 - wallThickness / 2, 1.5, 0]}
                rotation={[0, Math.PI / 2, 0]}
                receiveShadow
                castShadow
                onDoubleClick={handleWallClick('left')}
            >
                <primitive object={createWallWithOpenings(8, 3, [{ x: 1, y: 0.5, width: 1.5, height: 1.2 }])} />
                <meshLambertMaterial
                    color={getWallColor('left')}
                    transparent={selectedWall === 'left'}
                    opacity={getWallOpacity('left')}
                />
            </mesh>

            {/* Right wall with window opening */}
            <mesh
                ref={(ref) => ref && (wallRefs.current['right'] = ref)}
                position={[5 + wallThickness / 2, 1.5, 0]}
                rotation={[0, -Math.PI / 2, 0]}
                receiveShadow
                castShadow
                onDoubleClick={handleWallClick('right')}
            >
                <primitive object={createWallWithOpenings(8, 3, [{ x: -1, y: 0.5, width: 1.5, height: 1.2 }])} />
                <meshLambertMaterial
                    color={getWallColor('right')}
                    transparent={selectedWall === 'right'}
                    opacity={getWallOpacity('right')}
                />
            </mesh>

            {/* Front wall left section */}
            <mesh
                ref={(ref) => ref && (wallRefs.current['frontLeft'] = ref)}
                position={[-2.5, 1.5, 4 + wallThickness / 2]}
                receiveShadow
                castShadow
                onDoubleClick={handleWallClick('frontLeft')}
            >
                <boxGeometry args={[5, 3, wallThickness]} />
                <meshLambertMaterial
                    color={getWallColor('frontLeft')}
                    transparent={selectedWall === 'frontLeft'}
                    opacity={getWallOpacity('frontLeft')}
                />
            </mesh>

            {/* Front wall right section */}
            <mesh
                ref={(ref) => ref && (wallRefs.current['frontRight'] = ref)}
                position={[2.5, 1.5, 4 + wallThickness / 2]}
                receiveShadow
                castShadow
                onDoubleClick={handleWallClick('frontRight')}
            >
                <boxGeometry args={[5, 3, wallThickness]} />
                <meshLambertMaterial
                    color={getWallColor('frontRight')}
                    transparent={selectedWall === 'frontRight'}
                    opacity={getWallOpacity('frontRight')}
                />
            </mesh>

            {/* Door frame top */}
            <mesh
                ref={(ref) => ref && (wallRefs.current['doorFrame'] = ref)}
                position={[0, 2.8, 4 + wallThickness / 2]}
                receiveShadow
                castShadow
                onDoubleClick={handleWallClick('doorFrame')}
            >
                <boxGeometry args={[2, 0.4, wallThickness]} />
                <meshLambertMaterial
                    color={getWallColor('doorFrame')}
                    transparent={selectedWall === 'doorFrame'}
                    opacity={getWallOpacity('doorFrame')}
                />
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