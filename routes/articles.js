const auth = require('../utils/auth');
const router = require('express').Router();

const articleController = require('../controllers/article');

// Create an Article
router.post('/create', auth, articleController.postCreateArticle);

// Update View Count
router.put('/incview/:id', articleController.viewIncrement);

// Update an Article
router.put('/update/:id', auth, articleController.updateArticle);

// Delete an Article
router.delete('/delete/:id', auth, articleController.deleteArticle);

// Fetch a single Article
router.get('/:id', articleController.getArticle);

// Fetch all the Articles
router.get('/', articleController.getArticles);

module.exports = router;