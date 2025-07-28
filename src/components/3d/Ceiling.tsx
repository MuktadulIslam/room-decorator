'use client'

import * as THREE from 'three'
import { useColors } from '../../contexts/ColorContext'

export default function Ceiling() {
    const { roomDimensions } = useColors()
    const { width: roomWidth, length: roomLength, height: roomHeight } = roomDimensions

    // Create ceiling texture
    const ceilingTexture = new THREE.TextureLoader().load('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iY2VpbGluZyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9IiNmZmZmZmYiLz48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSIjZjBmMGYwIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNjZWlsaW5nKSIvPjwvc3ZnPg==')
    ceilingTexture.wrapS = ceilingTexture.wrapT = THREE.RepeatWrapping
    ceilingTexture.repeat.set(roomWidth * 0.8, roomLength * 0.6)

    const ceilingThickness = 0.15

    return (
        <group>
            {/* Main ceiling - 3D box */}
            <mesh position={[0, roomHeight + ceilingThickness / 2, 0]} receiveShadow castShadow>
                <boxGeometry args={[roomWidth, ceilingThickness, roomLength]} />
                <meshLambertMaterial map={ceilingTexture} />
            </mesh>

            {/* Ceiling trim/molding around the edges */}
            <mesh position={[0, roomHeight - 0.05, -roomLength / 2]} castShadow>
                <boxGeometry args={[roomWidth, 0.1, 0.1]} />
                <meshLambertMaterial color="#e8e8e8" />
            </mesh>

            <mesh position={[0, roomHeight - 0.05, roomLength / 2]} castShadow>
                <boxGeometry args={[roomWidth, 0.1, 0.1]} />
                <meshLambertMaterial color="#e8e8e8" />
            </mesh>

            <mesh position={[-roomWidth / 2, roomHeight - 0.05, 0]} castShadow>
                <boxGeometry args={[0.1, 0.1, roomLength]} />
                <meshLambertMaterial color="#e8e8e8" />
            </mesh>

            <mesh position={[roomWidth / 2, roomHeight - 0.05, 0]} castShadow>
                <boxGeometry args={[0.1, 0.1, roomLength]} />
                <meshLambertMaterial color="#e8e8e8" />
            </mesh>
        </group>
    )
}