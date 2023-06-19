const express = require("express");
const router = express.Router();
const { auth } = require("../middleware");
const { getUsernamefromUserID } = require("../utils");

router.get("/", auth, async (req, res) => {
    const name = await getUsernamefromUserID(req.userID);
    res.render("reqAdmin", { username: name });
});

module.exports = router;