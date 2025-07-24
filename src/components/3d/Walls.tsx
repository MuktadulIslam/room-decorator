'use client'

import * as THREE from 'three'
import Ceiling from './Ceiling'
import Window from './Windows'

export default function Walls() {
    // Create a simple texture for walls
    const wallTexture = new THREE.TextureLoader().load('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDEwIDAgTCAwIDAgMCAxMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZGRkIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNmOGY4ZjgiLz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')
    wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping
    wallTexture.repeat.set(4, 2)

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
            <mesh position={[0, 1.5, -4 - wallThickness / 2]} receiveShadow castShadow>
                <primitive object={createWallWithOpenings(10, 3, [{ x: 2, y: 0.5, width: 2, height: 1.2 }])} />
                <meshLambertMaterial map={wallTexture} />
            </mesh>

            {/* Left wall with window opening */}
            <mesh position={[-5 - wallThickness / 2, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow castShadow>
                <primitive object={createWallWithOpenings(8, 3, [{ x: 1, y: 0.5, width: 1.5, height: 1.2 }])} />
                <meshLambertMaterial map={wallTexture} />
            </mesh>

            {/* Right wall with window opening */}
            <mesh position={[5 + wallThickness / 2, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow castShadow>
                <primitive object={createWallWithOpenings(8, 3, [{ x: -1, y: 0.5, width: 1.5, height: 1.2 }])} />
                <meshLambertMaterial map={wallTexture} />
            </mesh>

            {/* Front wall left section */}
            <mesh position={[-2.5, 1.5, 4 + wallThickness / 2]} receiveShadow castShadow>
                <boxGeometry args={[5, 3, wallThickness]} />
                <meshLambertMaterial map={wallTexture} />
            </mesh>

            {/* Front wall right section */}
            <mesh position={[2.5, 1.5, 4 + wallThickness / 2]} receiveShadow castShadow>
                <boxGeometry args={[5, 3, wallThickness]} />
                <meshLambertMaterial map={wallTexture} />
            </mesh>

            {/* Door frame top */}
            <mesh position={[0, 2.8, 4 + wallThickness / 2]} receiveShadow castShadow>
                <boxGeometry args={[2, 0.4, wallThickness]} />
                <meshLambertMaterial map={wallTexture} />
            </mesh>

            {/* Add windows using the reusable Window component */}
            <Window
                position={[-5, 2, 1]}
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