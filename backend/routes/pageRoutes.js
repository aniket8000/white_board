const express = require("express");
const router = express.Router();

// simple in-memory array for storing pages
// each page will hold id, name, and its own shapes
let pages = [];
let nextPageId = 1;

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

  const newPage = { id: String(nextPageId++), name: name.trim(), shapes: [] };
  pages.push(newPage);
  res.status(201).json(newPage);
});

// rename an existing page
router.put("/:id", (req, res) => {
  const page = pages.find((p) => p.id === req.params.id);
  if (!page) return res.status(404).json({ error: "Page not found" });

  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "New page name required" });
  }

  page.name = name.trim();
  res.json(page);
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

// add a shape to a specific page
router.post("/:id/shapes", (req, res) => {
  const page = pages.find((p) => p.id === req.params.id);
  if (!page) return res.status(404).json({ error: "Page not found" });

  const shape = req.body;
  if (!shape || !shape.id) {
    return res.status(400).json({ error: "Invalid shape data" });
  }

  page.shapes.push(shape);
  res.status(201).json(shape);
});

module.exports = router;
