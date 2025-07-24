'use client'

import * as THREE from 'three'

export default function Ceiling() {
    // Create ceiling texture
    const ceilingTexture = new THREE.TextureLoader().load('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iY2VpbGluZyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9IiNmZmZmZmYiLz48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSIjZjBmMGYwIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNjZWlsaW5nKSIvPjwvc3ZnPg==')
    ceilingTexture.wrapS = ceilingTexture.wrapT = THREE.RepeatWrapping
    ceilingTexture.repeat.set(8, 6)

    const ceilingThickness = 0.15

    return (
        <group>
            {/* Main ceiling - 3D box */}
            <mesh position={[0, 3 + ceilingThickness / 2, 0]} receiveShadow castShadow>
                <boxGeometry args={[10, ceilingThickness, 8]} />
                <meshLambertMaterial map={ceilingTexture} />
            </mesh>

            {/* Ceiling trim/molding around the edges */}
            <mesh position={[0, 3 - 0.05, -4]} castShadow>
                <boxGeometry args={[10, 0.1, 0.1]} />
                <meshLambertMaterial color="#e8e8e8" />
            </mesh>

            <mesh position={[0, 3 - 0.05, 4]} castShadow>
                <boxGeometry args={[10, 0.1, 0.1]} />
                <meshLambertMaterial color="#e8e8e8" />
            </mesh>

            <mesh position={[-5, 3 - 0.05, 0]} castShadow>
                <boxGeometry args={[0.1, 0.1, 8]} />
                <meshLambertMaterial color="#e8e8e8" />
            </mesh>

            <mesh position={[5, 3 - 0.05, 0]} castShadow>
                <boxGeometry args={[0.1, 0.1, 8]} />
                <meshLambertMaterial color="#e8e8e8" />
            </mesh>
        </group>
    )
}