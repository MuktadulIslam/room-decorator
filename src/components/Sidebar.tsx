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
        dropdownSelectedWall,
        setWallColor,
        setFloorColor,
        setFloorBorderColor,
        setFloorBorderWidth,
        applyColorToSelectedWall,
        applyColorToAllWalls,
        applyColorToDropdownSelectedWall,
        applyTextureToSelectedWall,
        applyTextureToAllWalls,
        setFloorTexture,
        setSelectedWall,
        setDropdownSelectedWall
    } = useColors()
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
                if (dropdownSelectedWall === 'all') {
                    console.log('Applying texture to all walls')
                    applyTextureToAllWalls(imageUrl)
                } else {
                    console.log('Applying texture to selected wall:', dropdownSelectedWall)
                    applyTextureToSelectedWall(imageUrl)
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
        <div className="w-96 bg-white shadow-lg border-r border-gray-200 p-2 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 mb-4">
                Room Settings
            </h2>

            <div className="w-full h-auto p-2 bg-blue-500/30 rounded-lg space-y-2">
                <h2 className='text-xl font-bold mb-4'>Wall Decoration</h2>
                <div className='flex gap-4 w-full h-auto items-center'>
                    <label htmlFor='room-wall-selection' className="block flex-1 text-base font-bold text-gray-700">
                        Wall Selection
                    </label>
                    <select
                        id='room-wall-selection'
                        value={dropdownSelectedWall}
                        onChange={(e) => setDropdownSelectedWall(e.target.value)}
                        className="w-48 px-3 py-1.5 border border-black rounded-md text-base"
                    >
                        <option value="all">All Walls</option>
                        <option value="left">Left Wall</option>
                        <option value="right">Right Wall</option>
                        <option value="front">Front Wall</option>
                        <option value="back">Back Wall</option>
                    </select>
                </div>

                <div className='flex gap-4 w-full h-auto items-center'>
                    <label htmlFor='room-wall-color' className="block flex-1 text-base font-bold text-gray-700">
                        Wall Color
                    </label>
                    <div className="w-48 py-0 flex items-center gap-4 border border-black rounded-md">
                        <input
                            type="color"
                            id='room-wall-color'
                            value={currentColor}
                            onChange={(e) => {
                                const newColor = e.target.value
                                setCurrentColor(newColor)
                                applyColorToDropdownSelectedWall(newColor)
                            }}
                            className="h-8 w-8 shrink-0 rounded-lg border-gray-300 cursor-pointer"
                        />
                        <input
                            type="text"
                            value={currentColor}
                            onChange={(e) => {
                                const newColor = e.target.value
                                setCurrentColor(newColor)
                                if (newColor.match(/^#[0-9A-F]{6}$/i)) {
                                    applyColorToDropdownSelectedWall(newColor)
                                }
                            }}
                            className="text-base flex-1"
                            placeholder="#539fc6"
                        />
                    </div>

                </div>

                <div className='w-full h-auto flex gap-2 items-center'>
                    <label className="w-40 block text-base font-bold text-gray-700 mb-2">
                        Wall Texture
                    </label>
                    <div className="flex gap-2 w-full h-auto">
                        <div className='flex-1'>
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
                            <label
                                htmlFor="wall-texture-upload"
                                className="w-full px-1 py-2 text-sm font-medium bg-purple-600 text-white rounded-md hover:bg-purple-700 cursor-pointer block text-center"
                            >
                                Add Texture
                            </label>
                        </div>
                        <div className='flex-1'>
                            <button
                                onClick={() => {
                                    if (dropdownSelectedWall === 'all') {
                                        applyTextureToAllWalls(null)
                                    } else {
                                        applyTextureToSelectedWall(null)
                                    }
                                }}
                                className="w-full px-1 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Remove Texture
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            <div className="w-full h-auto p-2 bg-blue-500/30 rounded-lg space-y-2">
                <h2 className='text-xl font-bold mb-4'>Floor Decoration</h2>
                <div className='flex gap-4 w-full h-auto items-center'>
                    <label className="block flex-1 text-base font-bold text-gray-700">
                        Floor Color
                    </label>
                    <div className="w-48 py-0 flex items-center gap-4 border border-black rounded-md">
                        <input
                            type="color"
                            value={floorColor}
                            onChange={(e) => setFloorColor(e.target.value)}
                            className="w-8 h-8 shrink-0 rounded-lg border-gray-300 cursor-pointer"
                        />
                        <input
                            type="text"
                            value={floorColor}
                            onChange={(e) => setFloorColor(e.target.value)}
                            className="text-base flex-1"
                            placeholder="#ffffff"
                        />
                    </div>
                </div>

                <div className='flex gap-4 w-full h-auto items-center'>
                    <label className="block flex-1 text-base font-bold text-gray-700">
                        Floor Border Color
                    </label>
                    <div className="w-48 py-0 flex items-center gap-4 border border-black rounded-md">
                        <input
                            type="color"
                            value={floorBorderColor}
                            onChange={(e) => setFloorBorderColor(e.target.value)}
                            className="w-8 h-8 shrink-0 rounded-lg border-gray-300 cursor-pointer"
                        />
                        <input
                            type="text"
                            value={floorBorderColor}
                            onChange={(e) => setFloorBorderColor(e.target.value)}
                            className="text-base flex-1"
                            placeholder="#8b8680"
                        />
                    </div>
                </div>

                <div className='w-full h-auto flex gap-2 items-center'>
                    <label className="w-40 block text-base font-bold text-gray-700 mb-2">
                        Floor Texture
                    </label>
                    <div className="flex gap-2 w-full h-auto">
                        <div className='flex-1'>
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
                                className="w-full px-1 py-2 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer block text-center"
                            >
                                Add Texture
                            </label>
                        </div>
                        <div className='flex-1'>
                            <button
                                onClick={() => setFloorTexture(null)}
                                className="w-full px-1 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Remove Texture
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}