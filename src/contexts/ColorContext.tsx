'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface WallColors {
    back: string
    left: string
    right: string
    frontLeft: string
    frontRight: string
    doorFrame: string
}

interface ColorContextType {
    wallColor: string
    wallColors: WallColors
    floorColor: string
    selectedWall: string | null
    setWallColor: (color: string) => void
    setWallColors: (colors: Partial<WallColors>) => void
    setIndividualWallColor: (wallId: string, color: string) => void
    setFloorColor: (color: string) => void
    setSelectedWall: (wallId: string | null) => void
    applyColorToSelectedWall: (color: string) => void
    applyColorToAllWalls: (color: string) => void
}

const ColorContext = createContext<ColorContextType | undefined>(undefined)

export function ColorProvider({ children }: { children: ReactNode }) {
    const [wallColor, setWallColor] = useState('#d6f1ff')
    const [wallColors, setWallColors] = useState<WallColors>({
        back: '#d6f1ff',
        left: '#d6f1ff',
        right: '#d6f1ff',
        frontLeft: '#d6f1ff',
        frontRight: '#d6f1ff',
        doorFrame: '#d6f1ff'
    })
    const [floorColor, setFloorColor] = useState('#d7d4cc')
    const [selectedWall, setSelectedWall] = useState<string | null>(null)

    const setIndividualWallColor = (wallId: string, color: string) => {
        setWallColors(prev => ({
            ...prev,
            [wallId]: color
        }))
    }

    const applyColorToSelectedWall = (color: string) => {
        if (selectedWall) {
            setIndividualWallColor(selectedWall, color)
        }
    }

    const applyColorToAllWalls = (color: string) => {
        setWallColor(color)
        setWallColors({
            back: color,
            left: color,
            right: color,
            frontLeft: color,
            frontRight: color,
            doorFrame: color
        })
    }

    return (
        <ColorContext.Provider value={{
            wallColor,
            wallColors,
            floorColor,
            selectedWall,
            setWallColor,
            setWallColors,
            setIndividualWallColor,
            setFloorColor,
            setSelectedWall,
            applyColorToSelectedWall,
            applyColorToAllWalls
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