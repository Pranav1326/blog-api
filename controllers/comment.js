const Article = require("../models/Article");
const Comment = require(`../models/Comment`);
const User = require("../models/User");

exports.getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find();
        comments && res.status(200).json(comments);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

exports.getComment = async (req, res) => {
    try {
        const id = req.params.id;
        const comment = await Comment.findOne({_id: id});
        comment && res.status(200).json(comment);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

exports.postComment = async (req, res) => {
    try {
        const comment = req.body;
        const newComment = new Comment(comment);
        await newComment.save();
        const user = await User.findOne({_id: req.body.authorId});
        const updatedUser = await User.findOneAndUpdate({_id: req.body.authorId},
            {comments: [...user.comments, newComment._id]},
            {new: true}
        );
        const article = await Article.findOne({_id: req.body.articleId});
        const udpatedArticle = await Article.findOneAndUpdate({_id: req.body.articleId},
            {comments: [...article.comments, newComment._id]},
            {new: true}
        );
        res.status(200).json(newComment);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

exports.deleteComment = async (req, res) => {
    try {
        const id = req.params.id;
        // const comment = await Comment.findByIdAndDelete({_id: id});
        // if(comment){
            const user = await User.findOne({_id: req.body.authorId});
            const remainingCommentsUser = [...user.comments];
            const indexOfCommentUser = remainingCommentsUser.indexOf(req.body._id);
            // remainingCommentsUser.splice(indexOfCommentUser, 1);
            console.log("Remaining Comments: ", remainingCommentsUser);
            console.log("body id: ", req.body._id);
            console.log("Index: ", indexOfCommentUser);
            // const updatedUser = await User.findOneAndUpdate({_id: req.body.authorId},
            //     {comments: remainingCommentsUser},
            //     {new: true}
            // );

            const article = await Article.findOne({_id: req.body.articleId});
            const remainingCommentArticle = [...article.comments];
            const indexOfCommentArticle = remainingCommentArticle.indexOf(req.body.id);
            // remainingCommentArticle.splice(indexOfCommentArticle, 1);
            // const udpatedArticle = await Article.findOneAndUpdate({_id: req.body.articleId},
            //     {comments: remainingCommentArticle},
            //     {new: true}
            // );
            // comment && res.status(200).json({message: `Comment ${id} Deleted!`});
        // }
        // else{
        //     res.status(404).json({message: "Comment not found!"});
        // }
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

exports.updateComment = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedComment = await Comment.findByIdAndUpdate({_id: id}, {$set: req.body}, {new: true});
        updatedComment && res.status(200).json(updatedComment);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}