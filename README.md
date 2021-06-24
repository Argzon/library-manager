# Library Manager

A library management platform

## Description

This is a platform for managing your book library. The platform has been developed using Node.js, Express, Pug, Sequelize and SQLite.
Your data will be stored in a database **_(library.db)_** .
<br>
You have the option to:

- Add New Book
- Edit a Book
- Update a Book
- Delete a Book

The platform also has a search function which searches all titles, authors, genres and the year of the books.

When the database grows and there are a lot of books, the page will be very long. For this case I've implemented a pagination which displays only 8 books at once. You will have the option to click Next or Prev moving between pages.
