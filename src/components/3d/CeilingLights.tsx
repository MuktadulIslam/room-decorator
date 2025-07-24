'use client'

export default function CeilingLights() {
    // Light positions in 2x3 grid
    const lightPositions = [
        [-2.5, 2.8, -1.5], // Row 1
        [2.5, 2.8, -1.5],
        [-2.5, 2.8, 0],    // Row 2  
        [2.5, 2.8, 0],
        [-2.5, 2.8, 1.5],  // Row 3
        [2.5, 2.8, 1.5],
    ]

    return (
        <group>
            {lightPositions.map((position, index) => (
                <group key={index}>
                    {/* Light fixture housing */}
                    <mesh position={[position[0], position[1] + 0.1, position[2]]} castShadow>
                        <cylinderGeometry args={[0.15, 0.15, 0.05, 16]} />
                        <meshLambertMaterial color="#d0d0d0" />
                    </mesh>

                    {/* Point light */}
                    <pointLight
                        position={[position[0], position[1] - 0.1, position[2]]}
                        intensity={0.4}
                        distance={4}
                        decay={2}
                        color="#ffffff"
                        castShadow
                    />

                    {/* Soft spotlight for better coverage */}
                    <spotLight
                        position={[position[0], position[1], position[2]]}
                        target-position={[position[0], 0, position[2]]}
                        intensity={0.3}
                        angle={Math.PI / 4}
                        penumbra={0.5}
                        distance={6}
                        decay={2}
                        color="#ffffff"
                        castShadow
                    />
                </group>
            ))}
        </group>
    )
}