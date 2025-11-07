import express from "express";
const router = express.Router();

// simple in-memory list for pages and their shapes
// each page will have an id, a name, and an array of shapes
let pages = [];
let pageCounter = 1;

// get all pages
router.get("/", (req, res) => {
  res.json(pages);
});

// create a new page
router.post("/", (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Page name is required." });
  }

  const newPage = { id: String(pageCounter++), name: name.trim(), shapes: [] };
  pages.push(newPage);
  res.status(201).json(newPage);
});

// get all shapes from a specific page
router.get("/:id/shapes", (req, res) => {
  const page = pages.find((p) => p.id === req.params.id);
  if (!page) return res.status(404).json({ error: "Page not found" });
  res.json(page.shapes);
});

// delete a page by id
router.delete("/:id", (req, res) => {
  const idx = pages.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Page not found" });
  pages.splice(idx, 1);
  res.status(204).end();
});

// add a shape into a specific page (just for testing)
router.post("/:id/shapes", (req, res) => {
  const page = pages.find((p) => p.id === req.params.id);
  if (!page) return res.status(404).json({ error: "Page not found" });

  const shape = req.body;
  if (!shape || !shape.id)
    return res.status(400).json({ error: "Shape invalid" });

  page.shapes.push(shape);
  res.status(201).json(shape);
});

export default router;
