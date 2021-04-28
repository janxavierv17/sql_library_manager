'use strict';
const Sequelize = require("sequelize");
module.exports = (sequelize) => {
    class Book extends Sequelize.Model { }
    Book.init({
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {

                notEmpty: {
                    msg: 'Title is required.'
                }
            }
        },
        author: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Author is required.'
                }
            }
        },
        genre: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: 'Genre is required.'
                }
            }
        },
        year: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: 'year publised is required.'
                }
            }
        },
    }, { sequelize })
    return Book;
}