const Article = require('../models/Article');
const User = require('../models/User');
const userAuth = require('../utils/userAuth');

// Create an new article
exports.postCreateArticle = async (req, res, next) => {
    const authUser = await userAuth(req);
    if(authUser._id === req.body.userId && authUser.username === req.body.author){
        try{
            const newArticle = new Article({
                title: req.body.title,
                content: req.body.content,
                author: req.body.author,
                tags: req.body.tags
            });
            const article = await newArticle.save();
            const user = await User.findOne({_id: req.body.userId});
            const updatedUser = await User.findByIdAndUpdate(authUser._id, {
                articles : [...user.articles ,article._id]
            },{new: true});
            res.status(200).json(article);
        }
        catch(err){
            res.status(500).json({message: "Can't create article!", err});
        }
    }
    else{
        res.status(401).json({message: "Invalid userId or username!"});
    }
    next();
}

// Fetch all the articles
exports.getArticles = async (req, res) => {
    try{
        const articles = await Article.find();

        if(!articles){
            !articles && res.status(400).json(`No Articles found!`);
        }
        else{
            res.status(200).json(articles);
        }
    }
    catch(err){
        res.status(500).json(err);
    }
}