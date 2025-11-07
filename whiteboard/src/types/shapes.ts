export type Tool = 'select' | 'pencil' | 'line' | 'circle' | 'arrow' | 'text';

export interface BaseShape {
  id: string;
  type: 'pencil' | 'line' | 'circle' | 'arrow' | 'text';
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  strokeColor?: string;
  strokeWidth?: number;
  pageId?: string;
}

export interface PencilShape extends BaseShape {
  type: 'pencil';
  points: { x: number; y: number }[];
}

export interface LineShape extends BaseShape {
  type: 'line' | 'arrow';
  x2: number;
  y2: number;
}

export interface CircleShape extends BaseShape {
  type: 'circle';
  radius: number;
}

export interface TextShape extends BaseShape {
  type: 'text';
  content: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
}

export type Shape = PencilShape | LineShape | CircleShape | LineShape | TextShape;
