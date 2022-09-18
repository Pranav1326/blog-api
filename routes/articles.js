const auth = require('../utils/auth');
const userAuth = require('../utils/userAuth');
const router = require('express').Router();

const Article = require('../models/Article');
const articleController = require('../controllers/article');
const User = require('../models/User');

// Create an Article
router.post('/create', auth, articleController.postCreateArticle);

// Update an Article
router.put('/update/:id', auth, async (req, res) => {
    const authUser = await userAuth(req);
    if(authUser._id === req.body.userId && authUser.username === req.body.author){
        try{
            const updatedArticle = await Article.findByIdAndUpdate(req.params.id, {
                $set: req.body
            },{new: true});
            res.status(200).json(updatedArticle);
        }
        catch(err){
            res.status(500).json(err);
        }
    }
    else{
        res.status(401).json(`Not Authorized!`);
    }
});

// Delete an Article
router.delete('/delete/:id', auth, async (req, res) => {
    const authUser = await userAuth(req);
    const user = await User.findOne({_id: req.body.userId});
    if(authUser._id === req.body.userId && authUser.username === req.body.author && user.articles.includes(req.body.articleId)){
        const article = await Article.findOne({_id : req.params.id});
        if(article){
            try{
                await article.delete();
                const remainingArticles = [...user.articles];
                const indexOfArticleId = remainingArticles.indexOf(req.body.articleId);
                remainingArticles.splice(indexOfArticleId, 1);
                const updatedUser = await User.findByIdAndUpdate(user._id, {
                    articles : remainingArticles
                },{new: true});
                res.status(200).json(`Article ${article.title} deleted!`);
            }
            catch(err){
                res.status(500).json(`Error deleting article!`);
            }
        }
        else{
            res.status(404).json(`Article not found!`);
        }
    }
    else{
        res.status(401).json(`You can Delete only your Article!`);
    }
});

// Fetch a single Article
router.get('/:id', async (req, res) => {
    try{
        const article = await Article.findById(req.params.id)
        .then(foundArticle => {
            res.status(200).json(foundArticle);
        })
        .catch(err => {
            res.status(500).json(`Article Not Found!`);
        });
    }
    catch(err) {
        res.status(500).json(err);
    }
}); 

// Fetch all the Articles
router.get('/', articleController.getArticles);

module.exports = router;