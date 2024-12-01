//importing the codeblock model
const codeblock = require("../models/CodeBlock.model");

//fetches all codeblocks from the database , returns the list of codeblocks as a JSON res
exports.getAllCodeBlocks = async (req, res) => {
  try {
    const codeBlock = await codeblock.find().sort({ createAt: -1 }); //sorts them by the createAt field in descending order
    res.status(200).json(codeBlock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//controller function to create a new code block
exports.createCodeBlock = async (req, res) => {
  try {
    //creating a new CodeBlock instance with the data from the request body
    const newCodeBlock = new codeblock({
      title: req.body.title,
      template: req.body.template,
    });
    //save the block in the db
    const savedCodeBlock = await newCodeBlock.save();
    res.status(200).json(savedCodeBlock);
  } catch (error) {
    res.status(500).json({ message: `error server ${error.message}` });
  }
};
//controller function to get a code block by its id
exports.getCodeBlockById = async (req, res) => {
  try {
    //finding the code block by its idd passed as a parameter in the request
    const codeBlockById = await codeblock.findById(req.params.id);
    if (!codeBlockById) {
      return res.status(404).json({ message: "code block not found!" });
    }
    res.json(codeBlockById);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
