var express = require('express');
var router = express.Router();
const Book = require("../models").Book;
const Sequelize = require("sequelize");

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}

// error handler
const errorHandler = (errStatus, msg) => {
  const err = new Error(msg);
  err.status = errStatus;
  throw err;
};

/* GET home page. */
router.get('/', asyncHandler(async (req, res) => {
  res.redirect("/books");
}));

// Shows the full list of books
router.get('/books', asyncHandler(async (req, res, next) => {
  const books = await Book.findAll();
  res.render('index', {books, title: "Books"});
}));

// Shows the create new book form
router.get('/books/new', asyncHandler(async (req, res, next) => {
  res.render('new-book', {title: "Create New Book"});
}));

// Posts a new book to the database
router.post('/books/new', asyncHandler(async (req, res, next) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books");
  } catch (error) {
    if(error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      res.render("new-book", {book, errors: error.errors, title: "Edit Book", id: null});
    } else {
      throw error;
    }
  }
}));

// Shows book detail form
router.get('/books/:id', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render('update-book', {book, title: `${book.title}`});
  } else {
    errorHandler(404, "Page cannot be found!");
  }
}));

// Updates book info in the database
router.post('/books/:id', asyncHandler(async (req, res, next) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect("/");
    } else {
      errorHandler(404, "Page cannot be found!");
    }
  } catch (error) {
    if(error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("update-book", {book, errors: error.errors, title: "Edit Book"});
    } else {
      throw error;
    }
  }
}));

// Deletes a book
router.post('/books/:id/delete', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy(req.body);
    res.redirect("/books");
  } else {
    res.sendStatus(404);
  }
}))

module.exports = router;
