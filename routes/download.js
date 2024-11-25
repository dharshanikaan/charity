const express = require("express");
const router = express.Router();
const download = require("../controllers/download");
const auth = require("../middleware/auth");

router.post("/download", auth.authMiddleware, download.postDownload);

module.exports = router;