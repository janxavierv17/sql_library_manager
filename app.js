const express = require("express")
const path = require("path")
const cookieParser = require("cookie-parser")
const logger = require('morgan');
const routes = require("./routes/index")
const books = require("./routes/books")

const app = express();
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})
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


module.exports = app;
