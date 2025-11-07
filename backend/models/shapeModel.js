const mongoose = require('mongoose');

// Flexible schema allowing multiple shape types (circle, text, etc.)
const shapeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    x: Number,
    y: Number,
    width: Number,
    height: Number,
    rotation: Number,
    color: String,
    fontSize: Number,
    fontFamily: String,
    content: String,
    pageId: String,
    points: Array,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Shape', shapeSchema);
