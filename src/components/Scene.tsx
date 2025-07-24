'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import Room from './3d/Room'
import Lighting from './3d/Lighting'
import CameraController from './3d/CameraController'
import { OrbitControls } from '@react-three/drei'

export default function Scene() {
    return (
        <Canvas
            camera={{
                position: [0, 1.6, 3],
                fov: 75,
                near: 0.1,
                far: 1000,
            }}
            shadows
            className="bg-gradient-to-b from-blue-200 to-blue-300"
        >
            {/* <OrbitControls /> */}
            <Suspense fallback={null}>
                <CameraController />
                <Lighting />
                <Room />
            </Suspense>
        </Canvas>
    )
}