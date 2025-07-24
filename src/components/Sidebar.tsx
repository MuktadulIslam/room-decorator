'use client'

import { useState } from 'react'
import { useColors } from '../contexts/ColorContext'

export default function Sidebar() {
    const { wallColor, floorColor, setWallColor, setFloorColor } = useColors()
    const [selectedTile, setSelectedTile] = useState('marble')
    const [ceilingLightsOn, setCeilingLightsOn] = useState(true)

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
                    Navigate the room using keyboard controls
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
                                value={wallColor}
                                onChange={(e) => setWallColor(e.target.value)}
                                className="w-12 h-12 rounded-lg border-gray-300 cursor-pointer"
                            />
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={wallColor}
                                    onChange={(e) => setWallColor(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                    placeholder="#ffffff"
                                />
                            </div>
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
                            Floor Tiles
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {tileOptions.map((tile) => (
                                <button
                                    key={tile.id}
                                    onClick={() => {
                                        setSelectedTile(tile.id)
                                        setFloorColor(tile.color)
                                    }}
                                    className={`p-3 rounded-lg border-2 transition-all ${selectedTile === tile.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div
                                        className="w-full h-8 rounded mb-2"
                                        style={{ backgroundColor: tile.color }}
                                    />
                                    <div className="text-xs font-medium">{tile.name}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}