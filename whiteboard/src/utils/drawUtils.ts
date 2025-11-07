import type { Shape } from '../types/shapes';

/**
 * Offscreen canvas for measuring text (shared).
 */
const measureCanvas = document.createElement('canvas');
const measureCtx = measureCanvas.getContext('2d')!;

/** Measure text metrics (returns width, approximate height) */
export function measureText(content: string, fontSize = 16, fontFamily = 'Arial') {
  measureCtx.font = `${fontSize}px ${fontFamily}`;
  const metrics = measureCtx.measureText(content || '');
  // approximate text height from fontSize (browser can vary) and metrics.actualBoundingBoxAscent/Descent when available
  const ascent = (metrics.actualBoundingBoxAscent || fontSize * 0.8);
  const descent = (metrics.actualBoundingBoxDescent || fontSize * 0.2);
  const height = ascent + descent;
  return { width: Math.ceil(metrics.width), height: Math.ceil(height) };
}

/** Draw shape onto canvas context */
export function drawShape(ctx: CanvasRenderingContext2D, shape: Shape) {
  ctx.save();
  ctx.lineWidth = shape.strokeWidth ?? 2;
  ctx.strokeStyle = shape.strokeColor ?? '#111';
  // rotation
  if (shape.rotation) {
    ctx.translate(shape.x + (shape.width || 0) / 2, shape.y + (shape.height || 0) / 2);
    ctx.rotate((shape.rotation * Math.PI) / 180);
    ctx.translate(-(shape.x + (shape.width || 0) / 2), -(shape.y + (shape.height || 0) / 2));
  }

  if (shape.type === 'pencil') {
    const pts = (shape as any).points || [];
    if (pts.length > 0) {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();
    }
  } else if (shape.type === 'line' || shape.type === 'arrow') {
    ctx.beginPath();
    ctx.moveTo(shape.x, shape.y);
    ctx.lineTo((shape as any).x2, (shape as any).y2);
    ctx.stroke();
    if (shape.type === 'arrow') {
      drawArrowHead(ctx, shape.x, shape.y, (shape as any).x2, (shape as any).y2);
    }
  } else if (shape.type === 'circle') {
    const r = (shape as any).radius || 0;
    ctx.beginPath();
    ctx.arc(shape.x, shape.y, r, 0, Math.PI * 2);
    ctx.stroke();
  } else if (shape.type === 'text') {
    const t = shape as any;
    const fontSize = t.fontSize ?? 16;
    const fontFamily = t.fontFamily ?? 'Arial';
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = t.color ?? '#000';
    // Use text baseline so y corresponds to top-ish or baseline - choose 'top' so positioning is easier
    ctx.textBaseline = 'top';
    // If width/height are not yet set, measure and draw; otherwise draw
    ctx.fillText(t.content ?? '', shape.x, shape.y);
  }

  ctx.restore();
}

function drawArrowHead(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  const headlen = 10;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6));
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6));
  ctx.stroke();
}

/** Distance from point to segment helper */
function pointToSegmentDistance(px: number, py: number, x1: number, y1: number, x2: number, y2: number) {
  const A = px - x1, B = py - y1, C = x2 - x1, D = y2 - y1;
  const dot = A * C + B * D;
  const len_sq = C * C + D * D;
  let param = -1;
  if (len_sq !== 0) param = dot / len_sq;
  let xx, yy;
  if (param < 0) { xx = x1; yy = y1; }
  else if (param > 1) { xx = x2; yy = y2; }
  else { xx = x1 + param * C; yy = y1 + param * D; }
  const dx = px - xx, dy = py - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

/** Hit test improved:
 * - Pencil: proximity to any point OR bounding box
 * - Line/arrow: distance to segment
 * - Circle: distance to center
 * - Text: measures text if necessary and checks bbox (text baseline=top)
 */
export function hitTest(shape: Shape, mx: number, my: number): boolean {
  if (!shape) return false;
  if (shape.type === 'pencil') {
    const pts = (shape as any).points || [];
    for (const p of pts) if (Math.hypot(p.x - mx, p.y - my) < 8) return true;
    // bounding box fallback
    if (typeof shape.x === 'number' && typeof shape.width === 'number' && typeof shape.y === 'number' && typeof shape.height === 'number') {
      return mx >= shape.x && mx <= shape.x + shape.width && my >= shape.y && my <= shape.y + shape.height;
    }
    return false;
  } else if (shape.type === 'line' || shape.type === 'arrow') {
    const x1 = shape.x, y1 = shape.y, x2 = (shape as any).x2, y2 = (shape as any).y2;
    if (typeof x2 !== 'number' || typeof y2 !== 'number') return false;
    const d = pointToSegmentDistance(mx, my, x1, y1, x2, y2);
    return d < 8;
  } else if (shape.type === 'circle') {
    const r = (shape as any).radius || 0;
    const d = Math.hypot(shape.x - mx, shape.y - my);
    return d <= r + 6;
  } else if (shape.type === 'text') {
    const t = shape as any;
    // ensure width/height — if missing, measure
    if (!t.width || !t.height) {
      const m = measureText(t.content ?? '', t.fontSize ?? 16, t.fontFamily ?? 'Arial');
      t.width = m.width;
      t.height = m.height;
    }
    // text baseline in this codebase uses top (we draw with textBaseline='top')
    const left = t.x;
    const top = t.y;
    const right = left + (t.width || 0);
    const bottom = top + (t.height || 0);
    return mx >= left - 4 && mx <= right + 4 && my >= top - 4 && my <= bottom + 4;
  }
  return false;
}

/** transformShape left unchanged; you already have a working transformShape implementation in previous file. */
export function transformShape(shape: Shape, center: { x: number; y: number }, scaleX: number, scaleY: number, rotateDeg: number): Shape {
  // Reuse the same logic as you had (shallow clone + transform). Keep this straightforward:
  const rad = (rotateDeg * Math.PI) / 180;
  function transformPoint(px: number, py: number) {
    const tx = px - center.x;
    const ty = py - center.y;
    const sx = tx * scaleX;
    const sy = ty * scaleY;
    const rx = sx * Math.cos(rad) - sy * Math.sin(rad);
    const ry = sx * Math.sin(rad) + sy * Math.cos(rad);
    return { x: rx + center.x, y: ry + center.y };
  }

  const s = JSON.parse(JSON.stringify(shape)) as Shape;

  if (s.type === 'pencil') {
    s.points = (s as any).points.map((p: any) => transformPoint(p.x, p.y));
    const xs = s.points.map((p: any) => p.x);
    const ys = s.points.map((p: any) => p.y);
    s.x = Math.min(...xs); s.y = Math.min(...ys);
    s.width = Math.max(...xs) - s.x; s.height = Math.max(...ys) - s.y;
    s.rotation = ((s.rotation ?? 0) + rotateDeg) % 360;
    return s;
  } else if (s.type === 'line' || s.type === 'arrow') {
    const p1 = transformPoint(s.x, s.y);
    const p2 = transformPoint((s as any).x2, (s as any).y2);
    s.x = p1.x; s.y = p1.y;
    (s as any).x2 = p2.x; (s as any).y2 = p2.y;
    s.width = Math.abs(p2.x - p1.x); s.height = Math.abs(p2.y - p1.y);
    s.rotation = ((s.rotation ?? 0) + rotateDeg) % 360;
    return s;
  } else if (s.type === 'circle') {
    const centerPt = transformPoint(s.x, s.y);
    s.x = centerPt.x; s.y = centerPt.y;
    const avg = (Math.abs(scaleX) + Math.abs(scaleY)) / 2;
    (s as any).radius = (s as any).radius * avg;
    s.width = (s as any).radius * 2; s.height = s.width;
    s.rotation = ((s.rotation ?? 0) + rotateDeg) % 360;
    return s;
  } else if (s.type === 'text') {
    const pt = transformPoint(s.x, s.y);
    s.x = pt.x; s.y = pt.y;
    s.width = (s.width || 0) * Math.abs(scaleX);
    s.height = (s.height || 0) * Math.abs(scaleY);
    s.rotation = ((s.rotation ?? 0) + rotateDeg) % 360;
    return s;
  }
  return s;
}
