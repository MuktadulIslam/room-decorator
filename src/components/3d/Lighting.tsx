'use client'

import CeilingLights from './CeilingLights'

export default function Lighting() {
    return (
        <>
            {/* Ambient light for overall room illumination */}
            <ambientLight intensity={0.6} />
            {/* Ceiling lights component */}
            <CeilingLights />
        </>
    )
}