const router = require('express').Router();
const tagController = require('../controllers/tags');

// Fetch all tags
router.get('/', tagController.getTags);

// Create tags
router.post('/create', tagController.postTags);

// Delete a tag
router.delete('/delete', tagController.deleteTags);

module.exports = router;