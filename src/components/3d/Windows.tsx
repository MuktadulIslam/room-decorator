'use client'

interface WindowProps {
    position: [number, number, number]
    rotation?: [number, number, number]
    size: [number, number]
}

export default function Window({ position, rotation = [0, 0, 0], size }: WindowProps) {
    const [width, height] = size
    const frameDepth = 0.25
    const frameThickness = 0.08
    const mullionSize = 0.025

    return (
        <group position={position} rotation={rotation}>
            {/* Main window frame structure */}
            <group>
                {/* Outer frame - Top */}
                <mesh position={[0, height / 2 + frameThickness / 2, 0]} castShadow receiveShadow>
                    <boxGeometry args={[width + frameThickness * 2, frameThickness, frameDepth]} />
                    <meshLambertMaterial color="#654321" />
                </mesh>

                {/* Outer frame - Bottom */}
                <mesh position={[0, -height / 2 - frameThickness / 2, 0]} castShadow receiveShadow>
                    <boxGeometry args={[width + frameThickness * 2, frameThickness, frameDepth]} />
                    <meshLambertMaterial color="#654321" />
                </mesh>

                {/* Outer frame - Left */}
                <mesh position={[-width / 2 - frameThickness / 2, 0, 0]} castShadow receiveShadow>
                    <boxGeometry args={[frameThickness, height, frameDepth]} />
                    <meshLambertMaterial color="#654321" />
                </mesh>

                {/* Outer frame - Right */}
                <mesh position={[width / 2 + frameThickness / 2, 0, 0]} castShadow receiveShadow>
                    <boxGeometry args={[frameThickness, height, frameDepth]} />
                    <meshLambertMaterial color="#654321" />
                </mesh>

                {/* Inner frame ledges for glass */}
                <mesh position={[0, height / 2 - 0.01, frameDepth / 4]} castShadow>
                    <boxGeometry args={[width - 0.02, 0.02, frameDepth / 2]} />
                    <meshLambertMaterial color="#5a3e1a" />
                </mesh>
                <mesh position={[0, -height / 2 + 0.01, frameDepth / 4]} castShadow>
                    <boxGeometry args={[width - 0.02, 0.02, frameDepth / 2]} />
                    <meshLambertMaterial color="#5a3e1a" />
                </mesh>
                <mesh position={[-width / 2 + 0.01, 0, frameDepth / 4]} castShadow>
                    <boxGeometry args={[0.02, height - 0.02, frameDepth / 2]} />
                    <meshLambertMaterial color="#5a3e1a" />
                </mesh>
                <mesh position={[width / 2 - 0.01, 0, frameDepth / 4]} castShadow>
                    <boxGeometry args={[0.02, height - 0.02, frameDepth / 2]} />
                    <meshLambertMaterial color="#5a3e1a" />
                </mesh>
            </group>

            {/* Glass panes with realistic materials */}
            <group>
                {/* Top-left pane */}
                <mesh position={[-width / 4, height / 4, frameDepth / 2 - 0.02]}>
                    <planeGeometry args={[width / 2 - mullionSize, height / 2 - mullionSize]} />
                    <meshPhysicalMaterial
                        color="#f0f8ff"
                        transparent
                        opacity={0.08}
                        transmission={0.95}
                        thickness={0.1}
                        roughness={0.02}
                        metalness={0}
                        reflectivity={0.1}
                        ior={1.52}
                        envMapIntensity={1}
                    />
                </mesh>

                {/* Top-right pane */}
                <mesh position={[width / 4, height / 4, frameDepth / 2 - 0.02]}>
                    <planeGeometry args={[width / 2 - mullionSize, height / 2 - mullionSize]} />
                    <meshPhysicalMaterial
                        color="#f0f8ff"
                        transparent
                        opacity={0.08}
                        transmission={0.95}
                        thickness={0.1}
                        roughness={0.02}
                        metalness={0}
                        reflectivity={0.1}
                        ior={1.52}
                        envMapIntensity={1}
                    />
                </mesh>

                {/* Bottom-left pane */}
                <mesh position={[-width / 4, -height / 4, frameDepth / 2 - 0.02]}>
                    <planeGeometry args={[width / 2 - mullionSize, height / 2 - mullionSize]} />
                    <meshPhysicalMaterial
                        color="#f0f8ff"
                        transparent
                        opacity={0.08}
                        transmission={0.95}
                        thickness={0.1}
                        roughness={0.02}
                        metalness={0}
                        reflectivity={0.1}
                        ior={1.52}
                        envMapIntensity={1}
                    />
                </mesh>

                {/* Bottom-right pane */}
                <mesh position={[width / 4, -height / 4, frameDepth / 2 - 0.02]}>
                    <planeGeometry args={[width / 2 - mullionSize, height / 2 - mullionSize]} />
                    <meshPhysicalMaterial
                        color="#f0f8ff"
                        transparent
                        opacity={0.08}
                        transmission={0.95}
                        thickness={0.1}
                        roughness={0.02}
                        metalness={0}
                        reflectivity={0.1}
                        ior={1.52}
                        envMapIntensity={1}
                    />
                </mesh>
            </group>

            {/* Window mullions (grid pattern) */}
            <group position={[0, 0, frameDepth / 2 - 0.01]}>
                {/* Vertical center mullion */}
                <mesh castShadow>
                    <boxGeometry args={[mullionSize, height - frameThickness, mullionSize * 2]} />
                    <meshLambertMaterial color="#4a3218" />
                </mesh>

                {/* Horizontal center mullion */}
                <mesh castShadow>
                    <boxGeometry args={[width - frameThickness, mullionSize, mullionSize * 2]} />
                    <meshLambertMaterial color="#4a3218" />
                </mesh>

                {/* Mullion intersection piece */}
                <mesh position={[0, 0, 0.005]} castShadow>
                    <boxGeometry args={[mullionSize * 1.5, mullionSize * 1.5, mullionSize]} />
                    <meshLambertMaterial color="#3d2815" />
                </mesh>
            </group>

            {/* Window sill with realistic stone texture */}
            <mesh position={[0, -height / 2 - frameThickness - 0.06, frameDepth / 3]} castShadow receiveShadow>
                <boxGeometry args={[width + frameThickness * 2 + 0.1, 0.12, 0.2]} />
                <meshLambertMaterial color="#e8e8e8" />
            </mesh>

            {/* Sill drip edge */}
            <mesh position={[0, -height / 2 - frameThickness - 0.12, frameDepth / 2 - 0.05]} castShadow>
                <boxGeometry args={[width + frameThickness * 2 + 0.12, 0.02, 0.02]} />
                <meshLambertMaterial color="#d0d0d0" />
            </mesh>

            {/* Window trim/casing */}
            <group>
                {/* Header trim */}
                <mesh position={[0, height / 2 + frameThickness + 0.04, frameDepth / 2]} castShadow receiveShadow>
                    <boxGeometry args={[width + frameThickness * 2 + 0.15, 0.08, 0.03]} />
                    <meshLambertMaterial color="#ffffff" />
                </mesh>

                {/* Side trim pieces */}
                <mesh position={[-width / 2 - frameThickness - 0.05, height / 4, frameDepth / 2]} castShadow receiveShadow>
                    <boxGeometry args={[0.06, height / 2 + frameThickness + 0.08, 0.03]} />
                    <meshLambertMaterial color="#ffffff" />
                </mesh>

                <mesh position={[width / 2 + frameThickness + 0.05, height / 4, frameDepth / 2]} castShadow receiveShadow>
                    <boxGeometry args={[0.06, height / 2 + frameThickness + 0.08, 0.03]} />
                    <meshLambertMaterial color="#ffffff" />
                </mesh>
            </group>

            {/* Window hardware - realistic handles */}
            <group position={[width / 3, -height / 6, frameDepth / 2 + 0.02]}>
                {/* Handle base */}
                <mesh castShadow>
                    <cylinderGeometry args={[0.015, 0.015, 0.06, 8]} />
                    <meshLambertMaterial color="#b8860b" />
                </mesh>

                {/* Handle lever */}
                <mesh position={[0.03, 0, 0.035]} rotation={[0, 0, Math.PI / 6]} castShadow>
                    <boxGeometry args={[0.06, 0.01, 0.015]} />
                    <meshLambertMaterial color="#daa520" />
                </mesh>

                {/* Handle end cap */}
                <mesh position={[0.055, 0, 0.035]} castShadow>
                    <sphereGeometry args={[0.008, 8, 6]} />
                    <meshLambertMaterial color="#b8860b" />
                </mesh>
            </group>

            {/* Window latch */}
            <mesh position={[0, -height / 4, frameDepth / 2 + 0.015]} castShadow>
                <boxGeometry args={[0.04, 0.02, 0.01]} />
                <meshLambertMaterial color="#708090" />
            </mesh>

            {/* Weatherstripping */}
            <group>
                <mesh position={[0, height / 2 - 0.005, frameDepth / 4]}>
                    <boxGeometry args={[width - 0.01, 0.01, 0.01]} />
                    <meshLambertMaterial color="#2c2c2c" />
                </mesh>
                <mesh position={[0, -height / 2 + 0.005, frameDepth / 4]}>
                    <boxGeometry args={[width - 0.01, 0.01, 0.01]} />
                    <meshLambertMaterial color="#2c2c2c" />
                </mesh>
                <mesh position={[-width / 2 + 0.005, 0, frameDepth / 4]}>
                    <boxGeometry args={[0.01, height - 0.01, 0.01]} />
                    <meshLambertMaterial color="#2c2c2c" />
                </mesh>
                <mesh position={[width / 2 - 0.005, 0, frameDepth / 4]}>
                    <boxGeometry args={[0.01, height - 0.01, 0.01]} />
                    <meshLambertMaterial color="#2c2c2c" />
                </mesh>
            </group>

            {/* Glass reflections */}
            <mesh position={[0, 0, frameDepth / 2 + 0.001]}>
                <planeGeometry args={[width - frameThickness, height - frameThickness]} />
                <meshBasicMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.03}
                />
            </mesh>
        </group>
    )
}