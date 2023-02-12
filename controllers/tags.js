const Tags = require('../models/Tags.js');

exports.getTags = async (req, res) => {
    try {
        const tags = await Tags.find();
        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json(error);
    }
}

exports.postTags = async (req, res) => {
    try{
        const newTag = new Tags({
            tag: req.body.tag
        });
        const tag = await newTag.save();
        res.status(200).json(tag);
    }
    catch(err){
        res.status(500).json(err);
    }
}

exports.deleteTags = async (req, res) => {
    try {
        const tag = await Tags.findOneAndDelete({tag: req.body.tag});
        console.log(tag);
    } catch (error) {
        res.status(500).json(error);
    }
}