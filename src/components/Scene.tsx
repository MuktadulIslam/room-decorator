'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import * as THREE from 'three'
import Room from './3d/Room'
import Lighting from './3d/Lighting'
import CameraController from './3d/CameraController'

export default function Scene() {
    return (
        <Canvas
            camera={{
                position: [0, 1.6, 3],
                fov: 75,
                near: 0.1,
                far: 100, // Reduced far plane for better performance
            }}
            shadows={{
                enabled: true,
                type: THREE.PCFSoftShadowMap, // Use THREE.js constant instead of string
            }}
            gl={{
                antialias: true,
                alpha: false,
                powerPreference: "high-performance",
                stencil: false,
                depth: true,
            }}
            dpr={[1, 2]} // Limit device pixel ratio for better performance
            performance={{
                min: 0.5, // Minimum target framerate
                max: 1.0, // Maximum target framerate
                debounce: 200, // Debounce time for performance adjustments
            }}
            className="bg-gradient-to-b from-blue-200 to-blue-300"
        >
            <Suspense fallback={null}>
                <CameraController />
                <Lighting />
                <Room />
            </Suspense>
        </Canvas>
    )
}