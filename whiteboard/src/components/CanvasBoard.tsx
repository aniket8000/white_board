import React, { useRef, useState, useEffect } from "react";
import type { Tool, Shape } from "../types/shapes";
import { drawShape, hitTest, measureText } from "../utils/drawUtils";
import { createShape } from "../services/api";

interface Props {
  tool: Tool;
  shapes: Shape[];
  setShapes: (update: Shape[] | ((prev: Shape[]) => Shape[])) => void;
  textStyle: {
    fontFamily: string;
    fontSize: number;
    color: string;
  };
}

export default function CanvasBoard({ tool, shapes, setShapes, textStyle }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [preview, setPreview] = useState<Shape | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingOffset, setDraggingOffset] = useState<{ x: number; y: number } | null>(null);
  const [textEditing, setTextEditing] = useState<any>(null);
  const [showInput, setShowInput] = useState(false);

  // adjust canvas size to container
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const wrapper = wrapperRef.current;
      if (!canvas || !wrapper) return;

      const w = wrapper.clientWidth;
      const h = wrapper.clientHeight;
      if (canvas.width !== w) canvas.width = w;
      if (canvas.height !== h) canvas.height = h;
      redraw();
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  // re-render shapes and preview whenever data changes
  useEffect(() => {
    redraw();
  }, [shapes, preview]);

  function redraw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach((s) => drawShape(ctx, s));
    if (preview) drawShape(ctx, preview);
  }

  // convert mouse position to canvas coordinates
  function getPos(e: React.MouseEvent) {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  // handle drawing start or selecting shapes
  function onMouseDown(e: React.MouseEvent) {
    const { x, y } = getPos(e);

    // text tool - open inline input
    if (tool === "text") {
      e.stopPropagation();
      setTextEditing({
        id: undefined,
        x,
        y,
        content: "",
        fontFamily: textStyle.fontFamily,
        fontSize: textStyle.fontSize,
        color: textStyle.color,
      });
      setShowInput(true);
      setTimeout(() => inputRef.current?.focus(), 0);
      return;
    }

    // select mode - check if clicked inside any shape
    if (tool === "select") {
      for (let i = shapes.length - 1; i >= 0; i--) {
        const s = shapes[i];
        if (hitTest(s, x, y)) {
          setSelectedId(s.id);
          setDraggingOffset({ x: x - s.x, y: y - s.y });
          return;
        }
      }
      setSelectedId(null);
      return;
    }

    // start drawing new shape
    setIsDrawing(true);
    const id = `${tool}_${Date.now()}`;

    if (tool === "pencil") {
      setPreview({ id, type: "pencil", x, y, points: [{ x, y }] } as any);
    } else if (tool === "line" || tool === "arrow") {
      setPreview({ id, type: tool, x, y, x2: x, y2: y } as any);
    } else if (tool === "circle") {
      setPreview({ id, type: "circle", x, y, radius: 0 } as any);
    }
  }

  // handle mouse movement for dragging or drawing
  function onMouseMove(e: React.MouseEvent) {
    const { x, y } = getPos(e);

    // dragging a selected shape
    if (draggingOffset && selectedId) {
      setShapes((prev) =>
        prev.map((s) =>
          s.id === selectedId ? { ...s, x: x - draggingOffset.x, y: y - draggingOffset.y } : s
        )
      );
      return;
    }

    // drawing new shape
    if (!isDrawing || !preview) return;

    if (preview.type === "pencil") {
      setPreview((prev) =>
        prev ? { ...prev, points: [...(prev.points || []), { x, y }] } : prev
      );
    } else if (preview.type === "line" || preview.type === "arrow") {
      setPreview((prev) => (prev ? { ...prev, x2: x, y2: y } : prev));
    } else if (preview.type === "circle") {
      setPreview((prev) => (prev ? { ...prev, radius: Math.hypot(x - prev.x, y - prev.y) } : prev));
    }
  }

  // stop drawing or finish drag
  async function onMouseUp() {
    if (draggingOffset) {
      setDraggingOffset(null);
      return;
    }
    if (!isDrawing || !preview) return;

    const final = { ...preview };

    // basic size calculations
    if (final.type === "pencil") {
      const pts = final.points || [];
      const xs = pts.map((p: any) => p.x);
      const ys = pts.map((p: any) => p.y);
      final.x = Math.min(...xs);
      final.y = Math.min(...ys);
      final.width = Math.max(...xs) - final.x;
      final.height = Math.max(...ys) - final.y;
    } else if (final.type === "line" || final.type === "arrow") {
      final.width = Math.abs((final as any).x2 - final.x);
      final.height = Math.abs((final as any).y2 - final.y);
    } else if (final.type === "circle") {
      final.width = ((final as any).radius || 0) * 2;
      final.height = final.width;
    }

    setShapes((prev) => [...prev, final]);
    setPreview(null);
    setIsDrawing(false);

    try {
      await createShape(final);
    } catch {
      // skip backend error silently
    }
  }

  // confirm text creation or update
  async function commitText() {
    if (!textEditing) {
      setShowInput(false);
      return;
    }

    const content = (textEditing.content || "").trim();
    if (!content) {
      setTextEditing(null);
      setShowInput(false);
      return;
    }

    const m = measureText(content, textEditing.fontSize, textEditing.fontFamily);
    const final: Shape = {
      id: textEditing.id || `text_${Date.now()}`,
      type: "text",
      x: textEditing.x,
      y: textEditing.y,
      content,
      fontSize: textEditing.fontSize,
      fontFamily: textEditing.fontFamily,
      color: textEditing.color,
      width: m.width,
      height: m.height,
    } as any;

    setShapes((prev) => {
      const exists = prev.some((s) => s.id === final.id);
      return exists ? prev.map((s) => (s.id === final.id ? final : s)) : [...prev, final];
    });

    try {
      await createShape(final);
    } catch {}

    setTextEditing(null);
    setShowInput(false);
  }

  // position input box based on text coordinates
  function inputStyleFromEditing() {
    if (!textEditing) return { display: "none" };
    const canvas = canvasRef.current;
    if (!canvas) return { display: "none" };

    const rect = canvas.getBoundingClientRect();
    if (!rect || isNaN(rect.left) || isNaN(rect.top)) return { display: "none" };

    return {
      position: "fixed" as const,
      left: rect.left + (textEditing.x || 0),
      top: rect.top + (textEditing.y || 0),
      fontSize: `${textEditing.fontSize || 18}px`,
      fontFamily: textEditing.fontFamily || "Arial",
      color: textEditing.color || "#000",
      background: "#fff",
      border: "1px solid #ccc",
      borderRadius: "4px",
      padding: "2px 4px",
      zIndex: 9999,
      minWidth: "100px",
      outline: "none",
    };
  }

  return (
    <div
      ref={wrapperRef}
      className="canvas-wrapper"
      style={{
        position: "relative",
        width: "100%",
        height: "80vh",
      }}
    >
      <canvas
        ref={canvasRef}
        className="board"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        style={{
          background: "#fff",
          border: "1px solid #ddd",
          display: "block",
          cursor: tool === "select" ? "move" : "crosshair",
        }}
      />

      {showInput && textEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={textEditing.content || ""}
          onChange={(e) => setTextEditing({ ...textEditing, content: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitText();
            if (e.key === "Escape") {
              setTextEditing(null);
              setShowInput(false);
            }
          }}
          onBlur={commitText}
          style={inputStyleFromEditing()}
          placeholder="Type here..."
        />
      ) : null}
    </div>
  );
}
