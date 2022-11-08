const Article = require('../models/Article');
const User = require('../models/User');
const Tags = require('../models/Tags');
const userAuth = require('../utils/userAuth');

// Create an new article
exports.postCreateArticle = async (req, res, next) => {
    const authUser = await userAuth(req);
    if(authUser._id === req.body.authorId && authUser.username === req.body.author){
        try{
            const newArticle = new Article({
                title: req.body.title,
                content: req.body.content,
                author: req.body.author,
                authorId: req.body.authorId,
                tags: req.body.tags
            });
            const article = await newArticle.save();
            const isNewTags = newArticle.tags.forEach(async (tag, i) => {
                const foundTag = await Tags.findOne({tag});
                console.log(foundTag);
                if(foundTag){
                    return;
                }
                else{
                    const newTag = new Tags({
                        tag: tag
                    });
                }
            });
            // isNewTags();
            const user = await User.findOne({_id: req.body.authorId});
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
    const username = req.query.user;
    const tag = req.query.tag;
    const title = req.query.title;
    try{
        let articles; 
        if(username){
            articles = await Article.find({author: username});
        }
        else if(tag){
            articles = await Article.find({tags: {
                $in: [tag]
            }});
        }
        else if(title){
            articles = await Article.find({title});
        }
        else{
            articles = await Article.find();
        }

        if(!articles){
            !articles && res.status(400).json(`No Articles found!`);
        }
        res.status(200).json(articles);
    }
    catch(err){
        res.status(500).json(err);
    }
}