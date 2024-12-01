//importing mongoos library to interact with mongoDB
const mongoose = require("mongoose");
// the structure of the documents stored in the codeblock collection in mongoDB
const codeBlockSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  template: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
  instructions: {
    type: String,
    required: true,
  },
  solution: {
    type: String,
    required: true,
  },
});
//creating a model based on the codeBlockSchema
const CodeBlock = mongoose.model("codeblock", codeBlockSchema);
module.exports = CodeBlock;
