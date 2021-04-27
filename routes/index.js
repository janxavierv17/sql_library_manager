const express = require("express");
const router = express.Router();

// GET Home Page 
router.get("/", (req, res, next) => {
    res.redirect("/books")
})

module.exports = router;