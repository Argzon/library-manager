var express = require('express');
var router = express.Router();
const Book = require("../models").Book;

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
  res.render('index', {books});
}));

// Shows the create new book form
router.get('/books/new', asyncHandler(async (req, res, next) => {
  res.render('new-book');
}));

// Posts a bew book to the database
router.post('/books/new', asyncHandler(async (req, res, next) => {

}));

// Shows book detail form
router.get('/books/:id', asyncHandler(async (req, res, next) => {

}));

// Updates book info in the database
router.post('/books/:id', asyncHandler(async (req, res, next) => {

}));

// Deletes a book
router.post('/books/:id/delete', asyncHandler(async (req, res, next) => {

}))

module.exports = router;
