'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface WallColors {
    back: string
    left: string
    right: string
    front: string
}

interface WallTextures {
    back: string | null
    left: string | null
    right: string | null
    front: string | null
}

interface ColorContextType {
    wallColor: string
    wallColors: WallColors
    wallTextures: WallTextures
    floorColor: string
    floorBorderColor: string
    floorBorderWidth: number
    floorTexture: string | null
    floorTileTextures: Record<string, string | null>
    selectedWall: string | null
    selectedTile: string | null
    setWallColor: (color: string) => void
    setWallColors: (colors: Partial<WallColors>) => void
    setWallTextures: (textures: Partial<WallTextures>) => void
    setIndividualWallColor: (wallId: string, color: string) => void
    setIndividualWallTexture: (wallId: string, texture: string | null) => void
    setFloorColor: (color: string) => void
    setFloorBorderColor: (color: string) => void
    setFloorBorderWidth: (width: number) => void
    setFloorTexture: (texture: string | null) => void
    setFloorTileTexture: (tileKey: string, texture: string | null) => void
    setSelectedWall: (wallId: string | null) => void
    setSelectedTile: (tileKey: string | null) => void
    applyColorToSelectedWall: (color: string) => void
    applyColorToAllWalls: (color: string) => void
    applyTextureToSelectedWall: (texture: string | null) => void
    applyTextureToAllWalls: (texture: string | null) => void
    applyTextureToSelectedTile: (texture: string | null) => void
}

const ColorContext = createContext<ColorContextType | undefined>(undefined)

export function ColorProvider({ children }: { children: ReactNode }) {
    const [wallColor, setWallColor] = useState('#d6f1ff')
    const [wallColors, setWallColors] = useState<WallColors>({
        back: '#d6f1ff',
        left: '#d6f1ff',
        right: '#d6f1ff',
        front: '#d6f1ff'
    })
    const [wallTextures, setWallTextures] = useState<WallTextures>({
        back: null,
        left: null,
        right: null,
        front: null
    })
    const [floorColor, setFloorColor] = useState('#d7d4cc')
    const [floorBorderColor, setFloorBorderColor] = useState('#8b8680')
    const [floorBorderWidth, setFloorBorderWidth] = useState(0.05)
    const [floorTexture, setFloorTexture] = useState<string | null>(null)
    const [floorTileTextures, setFloorTileTextures] = useState<Record<string, string | null>>({})
    const [selectedWall, setSelectedWall] = useState<string | null>(null)
    const [selectedTile, setSelectedTile] = useState<string | null>(null)

    const setIndividualWallColor = (wallId: string, color: string) => {
        setWallColors(prev => ({
            ...prev,
            [wallId]: color
        }))
    }

    const setIndividualWallTexture = (wallId: string, texture: string | null) => {
        setWallTextures(prev => ({
            ...prev,
            [wallId]: texture
        }))
    }

    const setFloorTileTexture = (tileKey: string, texture: string | null) => {
        setFloorTileTextures(prev => ({
            ...prev,
            [tileKey]: texture
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
            front: color
        })
    }

    const applyTextureToSelectedWall = (texture: string | null) => {
        if (selectedWall) {
            setIndividualWallTexture(selectedWall, texture)
        }
    }

    const applyTextureToAllWalls = (texture: string | null) => {
        setWallTextures({
            back: texture,
            left: texture,
            right: texture,
            front: texture
        })
    }

    const applyTextureToSelectedTile = (texture: string | null) => {
        if (selectedTile) {
            setFloorTileTexture(selectedTile, texture)
        }
    }

    return (
        <ColorContext.Provider value={{
            wallColor,
            wallColors,
            wallTextures,
            floorColor,
            floorBorderColor,
            floorBorderWidth,
            floorTexture,
            floorTileTextures,
            selectedWall,
            selectedTile,
            setWallColor,
            setWallColors,
            setWallTextures,
            setIndividualWallColor,
            setIndividualWallTexture,
            setFloorColor,
            setFloorBorderColor,
            setFloorBorderWidth,
            setFloorTexture,
            setFloorTileTexture,
            setSelectedWall,
            setSelectedTile,
            applyColorToSelectedWall,
            applyColorToAllWalls,
            applyTextureToSelectedWall,
            applyTextureToAllWalls,
            applyTextureToSelectedTile
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