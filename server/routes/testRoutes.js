const express = require("express");
const router = express.Router();

const { testPost } = require("../controllers/testController");

router.post("/test-post", testPost);

module.exports = router;