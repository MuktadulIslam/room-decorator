'use client'

import Walls from './Walls'
import Floor from './Floor'
import Furniture from './Furniture'

export default function Room() {
    return (
        <group>
            <Walls />
            <Floor />
            <Furniture />
        </group>
    )
}