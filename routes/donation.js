const express = require("express");
const router = express.Router();
const donation = require("../controllers/donation");
const auth = require("../middleware/auth");

router.get("/fetch", auth.authMiddleware, donation.getDonation);
router.post("/create", auth.authMiddleware, donation.createDonation);
router.patch("/updateTransactionManually", auth.authMiddleware, donation.updateTransactionManually);
router.get("/fetchHistory", auth.authMiddleware, donation.getDonationHistory);

module.exports = router;