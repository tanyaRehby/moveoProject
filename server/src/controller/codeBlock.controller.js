const codeblock = require("../models/CodeBlock.model");

exports.getAllCodeBlocks = async (req, res) => {
  try {
    const codeBlock = await codeblock.find().sort({ createAt: -1 });
    res.status(200).json(codeBlock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.createCodeBlock = async (req, res) => {
  try {
    const newCodeBlock = new codeblock({
      title: req.body.title,
      template: req.body.template,
    });
    const savedCodeBlock = await newCodeBlock.save();
    res.status(200).json(savedCodeBlock);
  } catch (error) {
    res.status(500).json({ message: `error server ${error.message}` });
  }
};
//api/codeblock/:id
exports.getCodeBlockById = async (req, res) => {
  try {
    const codeBlockById = await codeblock.findById(req.params.id);
    if (!codeBlockById) {
      return res.status(404).json({ message: "code block not found!" });
    }
    res.json(codeBlockById);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
