const express = require("express");
//creating an express router
const router = express.Router();
//import the module codeBlock.controller
const codeblockcontroller = require("../controller/codeBlock.controller");
//route to get all codeblocks
router.get("/", codeblockcontroller.getAllCodeBlocks);
//route to create a codeblock
router.post("/", codeblockcontroller.createCodeBlock);
//route to get a codeblock by id
router.get("/:id", codeblockcontroller.getCodeBlockById);

module.exports = router;
