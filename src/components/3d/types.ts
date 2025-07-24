export interface FloorTileProps {
  position: [number, number, number];
  color: string;
  borderColor: string;
  texture?: string | null;
  tileKey: string;
}

export interface TiledFloorProps {
  width: number;
  length: number;
  color: string;
  borderColor: string;
  tileTextures?: Record<string, string | null>;
}