const express = require('express');
const router = express.Router();
const {
  getShapes,
  createShape,
  updateShape,
  deleteShape,
} = require('../controllers/shapeController');

router.get('/', getShapes);
router.post('/', createShape);
router.put('/:id', updateShape);
router.delete('/:id', deleteShape);

module.exports = router;
