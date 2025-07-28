'use client'

import { useColors } from '../../contexts/ColorContext'

export default function CeilingLights() {
    const { roomDimensions } = useColors()
    const { width: roomWidth, length: roomLength, height: roomHeight } = roomDimensions

    // Calculate light positions based on room dimensions
    // Create a 2x3 grid that scales with room size
    const lightSpacingX = roomWidth / 3 // Divide width into 3 sections
    const lightSpacingZ = roomLength / 4 // Divide length into 4 sections

    const lightPositions = [
        [-lightSpacingX / 2, roomHeight - 0.2, -lightSpacingZ], // Row 1
        [lightSpacingX / 2, roomHeight - 0.2, -lightSpacingZ],
        [-lightSpacingX / 2, roomHeight - 0.2, 0],    // Row 2  
        [lightSpacingX / 2, roomHeight - 0.2, 0],
        [-lightSpacingX / 2, roomHeight - 0.2, lightSpacingZ],  // Row 3
        [lightSpacingX / 2, roomHeight - 0.2, lightSpacingZ],
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
                        distance={Math.max(roomWidth, roomLength) * 0.8}
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
                        distance={roomHeight * 2}
                        decay={2}
                        color="#ffffff"
                        castShadow
                    />
                </group>
            ))}
        </group>
    )
}