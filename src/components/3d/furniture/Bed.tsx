'use client'
import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'

export default function Bed() {
    const { scene } = useGLTF('./models/bed.glb')
    const clonedScene = useMemo(() => scene.clone(), [scene])

    return <group scale={1.7}>
        <primitive object={clonedScene} />
    </group>
}