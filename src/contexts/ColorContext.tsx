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

interface RoomDimensions {
    width: number    // Room width (left to right)
    length: number   // Room length (front to back)
    height: number   // Room height (floor to ceiling)
    wallThickness: number // Wall thickness
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
    tilesWidth: number
    tilesLength: number
    selectedWall: string | null
    selectedTile: string | null
    dropdownSelectedWall: string
    roomDimensions: RoomDimensions
    setWallColor: (color: string) => void
    setWallColors: (colors: WallColors | ((prev: WallColors) => WallColors)) => void
    setWallTextures: (textures: WallTextures | ((prev: WallTextures) => WallTextures)) => void
    setIndividualWallColor: (wallId: string, color: string) => void
    setIndividualWallTexture: (wallId: string, texture: string | null) => void
    setFloorColor: (color: string) => void
    setFloorBorderColor: (color: string) => void
    setFloorBorderWidth: (width: number) => void
    setFloorTexture: (texture: string | null) => void
    setFloorTileTexture: (tileKey: string, texture: string | null) => void
    setTilesWidth: (width: number) => void
    setTilesLength: (length: number) => void
    setSelectedWall: (wallId: string | null) => void
    setSelectedTile: (tileKey: string | null) => void
    setDropdownSelectedWall: (wallId: string) => void
    setRoomDimensions: (dimensions: RoomDimensions | ((prev: RoomDimensions) => RoomDimensions)) => void
    setRoomWidth: (width: number) => void
    setRoomLength: (length: number) => void
    setRoomHeight: (height: number) => void
    setWallThickness: (thickness: number) => void
    applyColorToSelectedWall: (color: string) => void
    applyColorToAllWalls: (color: string) => void
    applyColorToDropdownSelectedWall: (color: string) => void
    applyTextureToSelectedWall: (texture: string | null) => void
    applyTextureToAllWalls: (texture: string | null) => void
    applyTextureToSelectedTile: (texture: string | null) => void
}

const ColorContext = createContext<ColorContextType | undefined>(undefined)

export function ColorProvider({ children }: { children: ReactNode }) {
    const [wallColor, setWallColor] = useState('#539fc6')
    const [wallColors, setWallColors] = useState<WallColors>({
        back: '#539fc6',
        left: '#539fc6',
        right: '#539fc6',
        front: '#539fc6'
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
    const [tilesWidth, setTilesWidth] = useState(12) // Default 12 inches
    const [tilesLength, setTilesLength] = useState(12) // Default 12 inches
    const [selectedWall, setSelectedWall] = useState<string | null>(null)
    const [selectedTile, setSelectedTile] = useState<string | null>(null)
    const [dropdownSelectedWall, setDropdownSelectedWall] = useState<string>('all')

    // Room dimensions state
    const [roomDimensions, setRoomDimensions] = useState<RoomDimensions>({
        width: 15,      // Default 10 units wide
        length: 12,      // Default 8 units long
        height: 4,      // Default 3 units high
        wallThickness: 0.2  // Default 0.2 units thick
    })

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

    // Room dimension setters
    const setRoomWidth = (width: number) => {
        setRoomDimensions(prev => ({ ...prev, width }))
    }

    const setRoomLength = (length: number) => {
        setRoomDimensions(prev => ({ ...prev, length }))
    }

    const setRoomHeight = (height: number) => {
        setRoomDimensions(prev => ({ ...prev, height }))
    }

    const setWallThickness = (thickness: number) => {
        setRoomDimensions(prev => ({ ...prev, wallThickness: thickness }))
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
        if (dropdownSelectedWall && dropdownSelectedWall !== 'all') {
            setIndividualWallTexture(dropdownSelectedWall, texture)
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

    const applyColorToDropdownSelectedWall = (color: string) => {
        if (dropdownSelectedWall === 'all') {
            applyColorToAllWalls(color)
        } else {
            setIndividualWallColor(dropdownSelectedWall, color)
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
            tilesWidth,
            tilesLength,
            selectedWall,
            selectedTile,
            dropdownSelectedWall,
            roomDimensions,
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
            setTilesLength,
            setTilesWidth,
            setSelectedWall,
            setSelectedTile,
            setDropdownSelectedWall,
            setRoomDimensions,
            setRoomWidth,
            setRoomLength,
            setRoomHeight,
            setWallThickness,
            applyColorToSelectedWall,
            applyColorToAllWalls,
            applyColorToDropdownSelectedWall,
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