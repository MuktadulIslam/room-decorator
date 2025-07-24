'use client'

import { useState } from 'react'
import { useColors } from '../contexts/ColorContext'

export default function Sidebar() {
    const {
        wallColor,
        floorColor,
        floorBorderColor,
        floorBorderWidth,
        selectedWall,
        setWallColor,
        setFloorColor,
        setFloorBorderColor,
        setFloorBorderWidth,
        applyColorToSelectedWall,
        applyColorToAllWalls,
        applyTextureToSelectedWall,
        applyTextureToAllWalls,
        setFloorTexture,
        setSelectedWall
    } = useColors()
    const [selectedTile, setSelectedTile] = useState('marble')
    const [ceilingLightsOn, setCeilingLightsOn] = useState(true)
    const [currentColor, setCurrentColor] = useState('#d6f1ff')

    const handleImageUpload = (file: File, target: 'wall' | 'floor') => {
        console.log('Uploading file:', file.name, file.type, file.size)
        const reader = new FileReader()
        reader.onload = (e) => {
            const imageUrl = e.target?.result as string
            console.log('File loaded, data URL length:', imageUrl.length)
            console.log('Data URL preview:', imageUrl.substring(0, 100) + '...')

            if (target === 'wall') {
                if (selectedWall) {
                    console.log('Applying texture to selected wall:', selectedWall)
                    applyTextureToSelectedWall(imageUrl)
                } else {
                    console.log('Applying texture to all walls')
                    applyTextureToAllWalls(imageUrl)
                }
            } else {
                console.log('Applying texture to floor')
                setFloorTexture(imageUrl)
            }
        }
        reader.onerror = (error) => {
            console.error('Error reading file:', error)
        }
        reader.readAsDataURL(file)
    }

    const tileOptions = [
        { id: 'marble', name: 'Marble', color: '#f8f8ff' },
        { id: 'wood', name: 'Wood', color: '#deb887' },
        { id: 'ceramic', name: 'Ceramic', color: '#e6e6fa' },
        { id: 'stone', name: 'Stone', color: '#d3d3d3' },
    ]

    return (
        <div className="w-80 bg-white shadow-lg border-r border-gray-200 p-4">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    3D Room Viewer
                </h1>
                <p className="text-gray-600 text-sm">
                    Navigate the room using keyboard controls.<br />
                    Click on walls to select them for individual coloring.
                </p>
            </div>

            <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Room Settings
                </h2>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Wall Color
                        </label>
                        <div className="flex items-center space-x-3">
                            <input
                                type="color"
                                value={currentColor}
                                onChange={(e) => setCurrentColor(e.target.value)}
                                className="w-12 h-12 rounded-lg border-gray-300 cursor-pointer"
                            />
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={currentColor}
                                    onChange={(e) => setCurrentColor(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                    placeholder="#ffffff"
                                />
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            {selectedWall && (
                                <div className="p-2 bg-blue-50 border border-blue-200 rounded-md">
                                    <p className="text-sm text-blue-800">
                                        Selected: {selectedWall.charAt(0).toUpperCase() + selectedWall.slice(1)} Wall
                                    </p>
                                </div>
                            )}

                            <div className="flex space-x-2">
                                <button
                                    onClick={() => selectedWall ? applyColorToSelectedWall(currentColor) : null}
                                    disabled={!selectedWall}
                                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md ${selectedWall
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    Apply to Selected
                                </button>
                                <button
                                    onClick={() => applyColorToAllWalls(currentColor)}
                                    className="flex-1 px-3 py-2 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700"
                                >
                                    Apply to All
                                </button>
                            </div>

                            {selectedWall && (
                                <button
                                    onClick={() => setSelectedWall(null)}
                                    className="w-full px-3 py-2 text-sm font-medium bg-gray-600 text-white rounded-md hover:bg-gray-700"
                                >
                                    Deselect Wall
                                </button>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Wall Texture
                        </label>
                        <div className="space-y-2">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) handleImageUpload(file, 'wall')
                                }}
                                className="hidden"
                                id="wall-texture-upload"
                            />
                            <div className="flex space-x-2">
                                <label
                                    htmlFor="wall-texture-upload"
                                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md cursor-pointer text-center ${selectedWall
                                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                                            : 'bg-gray-300 text-gray-500'
                                        }`}
                                >
                                    {selectedWall ? 'Texture Selected' : 'Select Texture for Selected'}
                                </label>
                                <label
                                    htmlFor="wall-texture-upload"
                                    className="flex-1 px-3 py-2 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer text-center"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        const input = document.createElement('input')
                                        input.type = 'file'
                                        input.accept = 'image/*'
                                        input.onchange = (event) => {
                                            const file = (event.target as HTMLInputElement).files?.[0]
                                            if (file) {
                                                const reader = new FileReader()
                                                reader.onload = (e) => {
                                                    const imageUrl = e.target?.result as string
                                                    applyTextureToAllWalls(imageUrl)
                                                }
                                                reader.readAsDataURL(file)
                                            }
                                        }
                                        input.click()
                                    }}
                                >
                                    Texture All Walls
                                </label>
                            </div>
                            <button
                                onClick={() => {
                                    if (selectedWall) {
                                        applyTextureToSelectedWall(null)
                                    } else {
                                        applyTextureToAllWalls(null)
                                    }
                                }}
                                className="w-full px-3 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Remove Wall Textures
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Floor Color
                        </label>
                        <div className="flex items-center space-x-3">
                            <input
                                type="color"
                                value={floorColor}
                                onChange={(e) => setFloorColor(e.target.value)}
                                className="w-12 h-12 rounded-lg border-gray-300 cursor-pointer"
                            />
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={floorColor}
                                    onChange={(e) => setFloorColor(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                    placeholder="#ffffff"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Floor Border Color
                        </label>
                        <div className="flex items-center space-x-3">
                            <input
                                type="color"
                                value={floorBorderColor}
                                onChange={(e) => setFloorBorderColor(e.target.value)}
                                className="w-12 h-12 rounded-lg border-gray-300 cursor-pointer"
                            />
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={floorBorderColor}
                                    onChange={(e) => setFloorBorderColor(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                    placeholder="#8b8680"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Floor Texture
                        </label>
                        <div className="space-y-2">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) handleImageUpload(file, 'floor')
                                }}
                                className="hidden"
                                id="floor-texture-upload"
                            />
                            <label
                                htmlFor="floor-texture-upload"
                                className="w-full px-3 py-2 text-sm font-medium bg-teal-600 text-white rounded-md hover:bg-teal-700 cursor-pointer block text-center"
                            >
                                Upload Floor Texture
                            </label>
                            <button
                                onClick={() => setFloorTexture(null)}
                                className="w-full px-3 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Remove Floor Texture
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}