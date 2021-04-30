const express = require('express');
const router = express.Router();
const Book = require("../models").Book
const { Op } = require("sequelize");
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

/**
 * @desc    List a limited number of books.
 * @route   GET /books
 * @access  PUBLIC
 */
router.get("/", asyncHandler(async (req, res) => {
    res.redirect("books/page/1",)
}))

router.get("/page/:page", asyncHandler(async (req, res) => {
    const pagination = await Book.findAll().then((data) => {
        let numberOfItems = Math.ceil(data.length / 5)
        return numberOfItems;
    })
    const limitBooks = await Book.findAll({
        offset: (req.params.page - 1) * 5,
        limit: 5
    })
    res.render("books/index", { books: limitBooks, pagination: pagination })
}))

/**
 * @desc    Search for a book in the database
 * @route   POST /books
 * @access  PUBLIC
 */
router.post("/", asyncHandler(async (req, res) => {
    // A sequelize findAll method with an option to filter out and search for a book.
    const searchBooks = await Book.findAll({
        where: {
            [Op.or]: [
                {
                    title: {
                        [Op.substring]: `${req.body.search}`,
                    },
                },
                {
                    author: {
                        [Op.substring]: `${req.body.search}`,
                    },
                },
                {
                    genre: {
                        [Op.substring]: `${req.body.search}`,
                    },
                },
                {
                    year: {
                        [Op.substring]: `${req.body.search}`,
                    },
                },
            ],
        },
    });
    // A simple search protection if search returns nothing.
    if (searchBooks.length === 0) {
        res.redirect("/")
    }
    res.render("books/index", { books: searchBooks })
}))


/**
 * @desc    Show the form to the user to fill up and to add a book.
 * @route   GET /books/new
 * @access  PUBLIC
 */
router.get("/new", asyncHandler(async (req, res) => {
    res.render("books/new-book")
}))


/**
 * @desc    Add form for user to fill up.
 * @route   POST /books/new
 * @access  PUBLIC
 */
router.post("/new", asyncHandler(async (req, res) => {
    let book;
    try {
        book = await Book.create(req.body);
        res.redirect("/")
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            book = await Book.build(req.body)
            res.render("books/new-book", { book: book, errors: error.errors })
        }
    }
}))

/**
 * @desc    Show the filled up form for user to edit.
 * @route   GET /books/:id
 * @access  PUBLIC
 */
router.get("/:id", asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id)
    res.render("books/update-book", { book: book })
}))

/**
 * @desc    Update the chosen book
 * @route   POST /books/:id
 * @access  PUBLIC
 */
router.post("/:id", asyncHandler(async (req, res) => {
    let book
    try {
        book = await Book.findByPk(req.params.id)
        await book.update(req.body)
        res.redirect("/")
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            res.render("books/update-book", { book: book, errors: error.errors })
        }
    }

}))

/**
 * @desc    Remove the chosen book
 * @route   POST /books/:id
 * @access  PUBLIC
 */
router.post("/:id/delete", asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id)
    await book.destroy();
    res.redirect("/")
}))


module.exports = router