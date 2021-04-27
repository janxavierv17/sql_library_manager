const express = require('express');
const router = express.Router();
const Books = require("../models").Books

/* Handler function to wrap each route. */
function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next)
        } catch (error) {
            // Forward error to the global error handler
            next(error);
        }
    }
}

// Lists all books stored in the database.
router.get("/", (req, res) => {
    res.render("books/layout")
})

// Add a new book
router.get("/books")

module.exports = router