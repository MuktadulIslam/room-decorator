'use client'

import { useMemo } from 'react'
import { useColors } from '../../contexts/ColorContext'

export default function CeilingLights() {
    const { roomDimensions } = useColors()
    const { width: roomWidth, length: roomLength, height: roomHeight } = roomDimensions

    // Reduce number of lights for better performance
    const lightPositions = useMemo(() => {
        const lightSpacingX = roomWidth / 2
        const lightSpacingZ = roomLength / 3

        return [
            [-lightSpacingX / 2, roomHeight - 0.2, -lightSpacingZ / 2],
            [lightSpacingX / 2, roomHeight - 0.2, -lightSpacingZ / 2],
            [-lightSpacingX / 2, roomHeight - 0.2, lightSpacingZ / 2],
            [lightSpacingX / 2, roomHeight - 0.2, lightSpacingZ / 2],
        ]
    }, [roomWidth, roomLength, roomHeight])

    // Shared geometry for light fixtures
    const lightGeometry = useMemo(() => (
        <cylinderGeometry args={[0.15, 0.15, 0.05, 8]} />
    ), [])

    const lightMaterial = useMemo(() => (
        <meshLambertMaterial color="#d0d0d0" />
    ), [])

    return (
        <group>
            {lightPositions.map((position, index) => (
                <group key={index}>
                    {/* Light fixture housing - reduced segments for performance */}
                    <mesh position={[position[0], position[1] + 0.1, position[2]]} castShadow>
                        {lightGeometry}
                        {lightMaterial}
                    </mesh>

                    {/* Single point light per fixture - no spotlight to reduce complexity */}
                    <pointLight
                        position={[position[0], position[1] - 0.1, position[2]]}
                        intensity={0.6}
                        distance={Math.max(roomWidth, roomLength) * 0.9}
                        decay={2}
                        color="#ffffff"
                        castShadow={index < 2} // Only first 2 lights cast shadows
                        shadow-mapSize={[512, 512]} // Reduce shadow map size
                    />
                </group>
            ))}
        </group>
    )
}