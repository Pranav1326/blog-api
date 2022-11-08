const router = require('express').Router();
const tagController = require('../controllers/tags');

// Fetch all tags
router.get('/', tagController.getTags);

// Create tags
router.post('/', tagController.postTags);

// Delete a tag
router.delete('/', tagController.deleteTags);

module.exports = router;