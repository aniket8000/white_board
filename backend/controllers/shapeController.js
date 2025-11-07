let inMemoryShapes = [];
const Shape = require('../models/shapeModel');

// using mongo if MONGO_URI is available, else fallback to in-memory
const useMongo = !!process.env.MONGO_URI;

// get all shapes
exports.getShapes = async (req, res) => {
  try {
    if (useMongo) {
      const shapes = await Shape.find({});
      return res.json(shapes);
    }
    return res.json(inMemoryShapes);
  } catch (err) {
    console.error('Error fetching shapes:', err);
    res.status(500).json({ error: 'Failed to fetch shapes' });
  }
};

// create a new shape
exports.createShape = async (req, res) => {
  try {
    const shape = req.body;
    if (!shape.id) return res.status(400).json({ error: 'Shape must include an id' });

    if (useMongo) {
      const newShape = new Shape(shape);
      await newShape.save();
      return res.status(201).json(newShape);
    }

    // simple in-memory store if db not used
    const exists = inMemoryShapes.find(s => s.id === shape.id);
    if (exists) return res.status(409).json({ error: 'Shape already exists' });
    inMemoryShapes.push(shape);
    return res.status(201).json(shape);
  } catch (err) {
    console.error('Error creating shape:', err);
    res.status(500).json({ error: 'Failed to create shape' });
  }
};

// update an existing shape
exports.updateShape = async (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body;

    if (useMongo) {
      const updated = await Shape.findOneAndUpdate({ id }, payload, { new: true });
      if (!updated) return res.status(404).json({ error: 'Shape not found' });
      return res.json(updated);
    }

    // update shape from local memory
    const index = inMemoryShapes.findIndex(s => s.id === id);
    if (index === -1) return res.status(404).json({ error: 'Shape not found' });

    inMemoryShapes[index] = { ...inMemoryShapes[index], ...payload };
    res.json(inMemoryShapes[index]);
  } catch (err) {
    console.error('Error updating shape:', err);
    res.status(500).json({ error: 'Failed to update shape' });
  }
};

// delete shape
exports.deleteShape = async (req, res) => {
  try {
    const id = req.params.id;

    if (useMongo) {
      await Shape.deleteOne({ id });
      return res.json({ success: true });
    }

    const index = inMemoryShapes.findIndex(s => s.id === id);
    if (index === -1) return res.status(404).json({ error: 'Shape not found' });

    inMemoryShapes.splice(index, 1);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting shape:', err);
    res.status(500).json({ error: 'Failed to delete shape' });
  }
};
