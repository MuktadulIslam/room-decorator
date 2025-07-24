import dynamic from 'next/dynamic'
import Sidebar from '../components/Sidebar'
import Scene from '../components/Scene'


export default function Home() {
  return (
    <main className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 relative">
        <Scene />
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded-lg text-sm">
          <div className="mb-2 font-semibold">Controls:</div>
          <div>← → : Rotate left/right</div>
          <div>↑ ↓ : Move forward/backward</div>
          <div>U D : Look up/down</div>
        </div>
      </div>
    </main>
  )
}