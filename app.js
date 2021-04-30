const express = require("express")
const path = require("path")
const cookieParser = require("cookie-parser")
const logger = require('morgan')
const sequelize = require("./models/index").sequelize;

(async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log("You're Connected to the database. Please use localhost:3000");
    } catch (error) {
        console.error("Error connecting to the database: ", error);
    }
})();

const routes = require("./routes/index")
const books = require("./routes/books");


const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/", routes)
app.use("/books", books)

app.use((req, res, next) => {
    const err = new Error("404 Not Found.")
    err.status = 404;
    next(err)
})


// error handler
app.use((err, req, res, next) => {
    if (err.status === 404) {
        res.status(404)
        err.message = "Sorry! We couldn't find the page you were looking for."
        res.render("page-not-found", { error: err })
    } else {
        // Not sure if useful.Checks if a user tries to find a book through the use of URL & ID
        res.status(500);
        err.message = "Sorry! The book you're looking for doesn't exists. Care to create one?"
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.render('books/error', { errors: err });
    }

});

module.exports = app;
