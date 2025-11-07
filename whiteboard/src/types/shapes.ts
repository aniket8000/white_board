export type Tool = "select" | "pencil" | "line" | "circle" | "arrow" | "text";

// Common fields shared by all shapes
export interface BaseShape {
  id: string;
  type: "pencil" | "line" | "circle" | "arrow" | "text";
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  strokeColor?: string;
  strokeWidth?: number;
  pageId?: string;
}

// Pencil shape keeps track of freehand points
export interface PencilShape extends BaseShape {
  type: "pencil";
  points: { x: number; y: number }[];
}

// Line and arrow both have end coordinates
export interface LineShape extends BaseShape {
  type: "line" | "arrow";
  x2: number;
  y2: number;
}

// Circle has radius
export interface CircleShape extends BaseShape {
  type: "circle";
  radius: number;
}

// Text shape with styling
export interface TextShape extends BaseShape {
  type: "text";
  content: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
}

// Single Shape type for all possible shapes
export type Shape =
  | PencilShape
  | LineShape
  | CircleShape
  | TextShape;
