'use client'

import * as THREE from 'three'

export default function Floor() {
    // Create tile texture
    const tileTexture = new THREE.TextureLoader().load('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0idGlsZSIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cmVjdCB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNmNWY1ZjUiLz48cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHg9IjEiIHk9IjEiIGZpbGw9IiNmZmZmZmYiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ1cmwoI3RpbGUpIi8+PC9zdmc+')
    tileTexture.wrapS = tileTexture.wrapT = THREE.RepeatWrapping
    tileTexture.repeat.set(10, 8)

    return (
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[10, 8]} />
            <meshLambertMaterial map={tileTexture} />
        </mesh>
    )
}