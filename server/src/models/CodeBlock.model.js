const mongoose = require("mongoose");

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
  //   solution: {
  //     type: String,
  //   },
});
const CodeBlock = mongoose.model("codeblock", codeBlockSchema);
module.exports = CodeBlock;
