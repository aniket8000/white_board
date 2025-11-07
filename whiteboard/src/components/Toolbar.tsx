import React from "react";
import ShapeButton from "./ShapeButton";
import type { Tool } from "../types/shapes";

// Props for the toolbar: tools, text style, and project title
interface Props {
  currentTool: Tool;
  setTool: (t: Tool) => void;
  textStyle: {
    fontFamily: string;
    fontSize: number;
    color: string;
  };
  setTextStyle: React.Dispatch<
    React.SetStateAction<{
      fontFamily: string;
      fontSize: number;
      color: string;
    }>
  >;
  projectTitle?: string;
  onAddPage?: (name: string) => void; // ✅ added so App.tsx stops type error
}

export default function Toolbar({
  currentTool,
  setTool,
  textStyle,
  setTextStyle,
  projectTitle,
}: Props) {
  const handleToolClick = (tool: Tool) => {
    setTool(currentTool === tool ? "select" : tool);
  };

  return (
    <header
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 40px",
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      {/* === Left side: drawing tools === */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
          marginLeft: "90px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "22px",
            background: "#f9fafb",
            borderRadius: "10px",
            padding: "8px 18px",
            boxShadow: "inset 0 0 3px rgba(0,0,0,0.05)",
          }}
        >
          <ShapeButton
            active={currentTool === "pencil"}
            onClick={() => handleToolClick("pencil")}
            title="Pencil"
          >
            <i className="ri-pencil-line"></i>
          </ShapeButton>

          <ShapeButton
            active={currentTool === "line"}
            onClick={() => handleToolClick("line")}
            title="Line"
          >
            <i className="ri-subtract-line"></i>
          </ShapeButton>

          <ShapeButton
            active={currentTool === "circle"}
            onClick={() => handleToolClick("circle")}
            title="Circle"
          >
            <i className="ri-checkbox-blank-circle-line"></i>
          </ShapeButton>

          <ShapeButton
            active={currentTool === "arrow"}
            onClick={() => handleToolClick("arrow")}
            title="Arrow"
          >
            <i className="ri-arrow-right-line"></i>
          </ShapeButton>
        </div>
      </div>

      {/* === Center: dynamic project name === */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "16px",
          fontWeight: 600,
          color: "#111",
          letterSpacing: "0.3px",
          pointerEvents: "none",
        }}
      >
        {projectTitle || "Untitled Project"}
      </div>

      {/* === Right side: text styling controls === */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          background: "#f9fafb",
          borderRadius: "10px",
          padding: "8px 16px",
          marginRight: "40px",
          boxShadow: "inset 0 0 3px rgba(0,0,0,0.05)",
        }}
      >
        <ShapeButton
          active={currentTool === "text"}
          onClick={() => handleToolClick("text")}
          title="Add Text"
        >
          <i className="ri-font-size"></i>
        </ShapeButton>

        {/* font family */}
        <select
          value={textStyle.fontFamily}
          onChange={(e) =>
            setTextStyle({ ...textStyle, fontFamily: e.target.value })
          }
          style={{
            border: "1px solid #ddd",
            borderRadius: "6px",
            padding: "5px 10px",
            background: "#fff",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          <option value="Arial">Arial</option>
          <option value="Verdana">Verdana</option>
          <option value="Courier New">Courier New</option>
          <option value="Times New Roman">Times New Roman</option>
        </select>

        {/* color picker */}
        <input
          type="color"
          value={textStyle.color}
          onChange={(e) =>
            setTextStyle({ ...textStyle, color: e.target.value })
          }
          style={{
            width: "30px",
            height: "30px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            background: "transparent",
          }}
        />

        {/* font size */}
        <select
          value={textStyle.fontSize}
          onChange={(e) =>
            setTextStyle({
              ...textStyle,
              fontSize: parseInt(e.target.value),
            })
          }
          style={{
            border: "1px solid #ddd",
            borderRadius: "6px",
            padding: "5px 10px",
            background: "#fff",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          {[12, 14, 16, 18, 20, 24, 28, 32].map((s) => (
            <option key={s} value={s}>
              {s}px
            </option>
          ))}
        </select>
      </div>
    </header>
  );
}
