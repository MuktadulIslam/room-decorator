'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { useColors } from '../../contexts/ColorContext'

export default function CameraController() {
    const { camera, gl } = useThree()
    const { roomDimensions } = useColors()
    const keysPressed = useRef<Set<string>>(new Set())
    const isMouseDown = useRef(false)
    const mouseX = useRef(0)
    const mouseY = useRef(0)

    const rotationSpeed = 0.08
    const moveSpeed = 0.08
    const verticalLookSpeed = 0.08
    const mouseRotationSpeed = 0.002

    const yaw = useRef(0)
    const pitch = useRef(0)

    // Calculate boundaries based on room dimensions
    const { width: roomWidth, length: roomLength, wallThickness } = roomDimensions

    const margin = 0.5
    const maxX = roomWidth / 2 - wallThickness - margin
    const minX = -roomWidth / 2 + wallThickness + margin
    const maxZ = roomLength / 2 - wallThickness - margin
    const minZ = -roomLength / 2 + wallThickness + margin

    // Throttled event handlers for better performance
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        keysPressed.current.add(event.code)
    }, [])

    const handleKeyUp = useCallback((event: KeyboardEvent) => {
        keysPressed.current.delete(event.code)
    }, [])

    const handleMouseDown = useCallback((event: MouseEvent) => {
        if (event.button === 0) {
            isMouseDown.current = true
            mouseX.current = event.clientX
            mouseY.current = event.clientY
            gl.domElement.style.cursor = 'grabbing'
        }
    }, [gl])

    const handleMouseUp = useCallback((event: MouseEvent) => {
        if (event.button === 0) {
            isMouseDown.current = false
            gl.domElement.style.cursor = 'grab'
        }
    }, [gl])

    const handleMouseMove = useCallback((event: MouseEvent) => {
        if (isMouseDown.current) {
            const deltaX = event.clientX - mouseX.current
            const deltaY = event.clientY - mouseY.current

            yaw.current -= deltaX * mouseRotationSpeed
            pitch.current -= deltaY * mouseRotationSpeed
            pitch.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch.current))

            mouseX.current = event.clientX
            mouseY.current = event.clientY
        }
    }, [])

    const handleWheel = useCallback((event: WheelEvent) => {
        event.preventDefault()
        const direction = new THREE.Vector3(0, 0, event.deltaY * 0.001)
        direction.applyQuaternion(camera.quaternion)
        direction.y = 0

        const newPosition = camera.position.clone().add(direction)
        newPosition.x = Math.max(minX, Math.min(maxX, newPosition.x))
        newPosition.z = Math.max(minZ, Math.min(maxZ, newPosition.z))
        newPosition.y = camera.position.y

        camera.position.copy(newPosition)
    }, [camera, minX, maxX, minZ, maxZ])

    useEffect(() => {
        const canvas = gl.domElement
        
        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)
        canvas.addEventListener('mousedown', handleMouseDown)
        window.addEventListener('mouseup', handleMouseUp)
        window.addEventListener('mousemove', handleMouseMove)
        canvas.addEventListener('wheel', handleWheel, { passive: false })

        canvas.style.cursor = 'grab'

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
            canvas.removeEventListener('mousedown', handleMouseDown)
            window.removeEventListener('mouseup', handleMouseUp)
            window.removeEventListener('mousemove', handleMouseMove)
            canvas.removeEventListener('wheel', handleWheel)
        }
    }, [handleKeyDown, handleKeyUp, handleMouseDown, handleMouseUp, handleMouseMove, handleWheel, gl])

    useFrame(() => {
        const keys = keysPressed.current

        // Rotation
        if (keys.has('ArrowLeft')) {
            yaw.current += rotationSpeed
        }
        if (keys.has('ArrowRight')) {
            yaw.current -= rotationSpeed
        }

        // Vertical look
        if (keys.has('KeyU')) {
            pitch.current = Math.min(pitch.current + verticalLookSpeed, Math.PI / 3)
        }
        if (keys.has('KeyD')) {
            pitch.current = Math.max(pitch.current - verticalLookSpeed, -Math.PI / 3)
        }

        // Movement
        const direction = new THREE.Vector3()

        if (keys.has('ArrowUp')) {
            direction.z -= moveSpeed
        }
        if (keys.has('ArrowDown')) {
            direction.z += moveSpeed
        }

        // Apply rotation to camera
        camera.rotation.set(pitch.current, yaw.current, 0, 'YXZ')

        // Apply movement
        if (direction.length() > 0) {
            const currentY = camera.position.y
            direction.applyQuaternion(camera.quaternion)
            direction.y = 0
            camera.position.add(direction)
            camera.position.y = currentY

            // Boundary limits
            camera.position.x = Math.max(minX, Math.min(maxX, camera.position.x))
            camera.position.z = Math.max(minZ, Math.min(maxZ, camera.position.z))
        }
    })

    return null
}