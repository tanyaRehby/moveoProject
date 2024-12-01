const express = require("express");
const router = express.Router();

const codeblockcontroller = require("../controller/codeBlock.controller");

router.get("/", codeblockcontroller.getAllCodeBlocks);
router.post("/", codeblockcontroller.createCodeBlock);
router.get("/:id", codeblockcontroller.getCodeBlockById);

module.exports = router;
