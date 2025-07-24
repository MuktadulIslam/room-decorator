'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function CameraController() {
    const { camera } = useThree()
    const keysPressed = useRef<Set<string>>(new Set())

    const rotationSpeed = 0.1
    const moveSpeed = 0.1
    const verticalLookSpeed = 0.1

    const yaw = useRef(0)
    const pitch = useRef(0)

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            keysPressed.current.add(event.code)
        }

        const handleKeyUp = (event: KeyboardEvent) => {
            keysPressed.current.delete(event.code)
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [])

    useFrame(() => {
        const keys = keysPressed.current

        // Rotation (left/right arrows)
        if (keys.has('ArrowLeft')) {
            yaw.current += rotationSpeed
        }
        if (keys.has('ArrowRight')) {
            yaw.current -= rotationSpeed
        }

        // Vertical look (U/D keys)
        if (keys.has('KeyU')) {
            pitch.current = Math.min(pitch.current + verticalLookSpeed, Math.PI / 3)
        }
        if (keys.has('KeyD')) {
            pitch.current = Math.max(pitch.current - verticalLookSpeed, -Math.PI / 3)
        }

        // Movement (up/down arrows)
        const direction = new THREE.Vector3()

        if (keys.has('ArrowUp')) {
            direction.z -= moveSpeed
        }
        if (keys.has('ArrowDown')) {
            direction.z += moveSpeed
        }

        // Apply rotation to camera
        camera.rotation.set(pitch.current, yaw.current, 0, 'YXZ')

        // Apply movement relative to camera's rotation
        if (direction.length() > 0) {
            direction.applyQuaternion(camera.quaternion)
            camera.position.add(direction)

            // Keep camera above ground
            camera.position.y = Math.max(camera.position.y, 0.5)

            // Boundary limits (keep within room)
            camera.position.x = Math.max(-4.5, Math.min(4.5, camera.position.x))
            camera.position.z = Math.max(-3.5, Math.min(3.5, camera.position.z))
        }
    })

    return null
}