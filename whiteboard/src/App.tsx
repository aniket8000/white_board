import  { useState, useCallback, useEffect } from "react";
import Toolbar from "./components/Toolbar";
import CanvasBoard from "./components/CanvasBoard";
import PageToolbar from "./components/PageToolbar";
import type { Tool, Shape } from "./types/shapes";
import "./styles/index.css";

// each page keeps its own set of shapes
interface Page {
  id: string;
  name: string;
  shapes: Shape[];
}

export default function App() {
  // track current tool (pencil, line, text, etc.)
  const [tool, setTool] = useState<Tool>("select");

  // all pages with their shapes
  const [pages, setPages] = useState<Page[]>([]);

  // which page is currently active
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);

  // default text styling for the text tool
  const [textStyle, setTextStyle] = useState({
    fontFamily: "Arial",
    fontSize: 18,
    color: "#000000",
  });

  // create a default page when app loads
  useEffect(() => {
    if (pages.length === 0) {
      const firstPage: Page = {
        id: "page_" + Date.now(),
        name: "Page 1",
        shapes: [],
      };
      setPages([firstPage]);
      setCurrentPageId(firstPage.id);
    }
  }, []);

  // get the active page and its shapes
  const currentPage = pages.find((p) => p.id === currentPageId) ?? null;
  const shapes = currentPage?.shapes ?? [];

  // create a new page with a given name
  const handleAddPage = useCallback((name: string) => {
    if (!name.trim()) return;
    const newPage: Page = {
      id: "page_" + Date.now(),
      name: name.trim(),
      shapes: [],
    };
    setPages((prev) => [...prev, newPage]);
    setCurrentPageId(newPage.id);
  }, []);

  // update shapes only for the active page
  const handleShapesUpdate = useCallback(
    (update: Shape[] | ((prev: Shape[]) => Shape[])) => {
      if (!currentPageId) return;
      setPages((prevPages) =>
        prevPages.map((page) => {
          if (page.id !== currentPageId) return page;
          const newShapes =
            typeof update === "function" ? update(page.shapes) : update;
          return { ...page, shapes: newShapes };
        })
      );
    },
    [currentPageId]
  );

  return (
    <div className="app">
      {/* top bar for managing multiple pages */}
      <PageToolbar
        currentPageId={currentPageId}
        setCurrentPageId={setCurrentPageId}
        pages={pages}
        setPages={setPages}
      />

      {/* main toolbar for tools and text controls */}
      <Toolbar
        currentTool={tool}
        setTool={setTool}
        textStyle={textStyle}
        setTextStyle={setTextStyle}
        onAddPage={handleAddPage}
        projectTitle={currentPage?.name || "Untitled Project"}
      />

      {/* canvas area */}
      {currentPage ? (
        <main
          className="main"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100vh - 160px)",
            background: "#f9fafb",
          }}
        >
          <CanvasBoard
            key={currentPageId}
            tool={tool}
            shapes={shapes}
            setShapes={handleShapesUpdate}
            textStyle={textStyle}
          />
        </main>
      ) : (
        // fallback UI when no page exists
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            color: "#777",
          }}
        >
          <h3>Please create or select a page to begin.</h3>
        </div>
      )}
    </div>
  );
}
