'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface ColorContextType {
    wallColor: string
    floorColor: string
    setWallColor: (color: string) => void
    setFloorColor: (color: string) => void
}

const ColorContext = createContext<ColorContextType | undefined>(undefined)

export function ColorProvider({ children }: { children: ReactNode }) {
    const [wallColor, setWallColor] = useState('#d6f1ff')
    const [floorColor, setFloorColor] = useState('#d7d4cc')

    return (
        <ColorContext.Provider value={{
            wallColor,
            floorColor,
            setWallColor,
            setFloorColor
        }}>
            {children}
        </ColorContext.Provider>
    )
}

export function useColors() {
    const context = useContext(ColorContext)
    if (context === undefined) {
        throw new Error('useColors must be used within a ColorProvider')
    }
    return context
}