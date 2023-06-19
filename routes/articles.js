const auth = require('../utils/auth');
const router = require('express').Router();

const articleController = require('../controllers/article');

// Create an Article
router.post('/create', auth, articleController.postCreateArticle);

// Search Articles
router.get('/search', articleController.searchArticles);

// Save Articles
router.post('/save', articleController.saveArticle);

// Related Articles
router.post('/related', articleController.find);

// Popular Articles
router.get('/popular', articleController.popularArticles);

// Unpublished Articles
router.get('/unpublished', articleController.getUnpublishedArticles);

// Make Article Unpublished
router.post('/makeunpublish', articleController.makeArticleUnpublish);

// Make Article Published
router.post('/makepublish', articleController.makeArticlePublish);

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