import React from "react";
import ShapeButton from "./ShapeButton";
import type { Tool } from "../types/shapes";

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
}

export default function Toolbar({
  currentTool,
  setTool,
  textStyle,
  setTextStyle,
  projectTitle,
}: Props) {
  // handle switching between tools
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
      {/* left side: drawing tools */}
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

      {/* center: project name */}
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

      {/* right side: text style tools */}
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
        {/* text tool */}
        <ShapeButton
          active={currentTool === "text"}
          onClick={() => handleToolClick("text")}
          title="Add Text"
        >
          <i className="ri-font-size"></i>
        </ShapeButton>

        {/* font family selector */}
        <select
          value={textStyle.fontFamily}
          onChange={(e) => setTextStyle({ ...textStyle, fontFamily: e.target.value })}
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
          onChange={(e) => setTextStyle({ ...textStyle, color: e.target.value })}
          style={{
            width: "30px",
            height: "30px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            background: "transparent",
          }}
        />

        {/* font size dropdown */}
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
