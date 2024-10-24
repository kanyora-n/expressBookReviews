const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body; // Get the username and password from the request body
  
    // Check if both username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
  
    // Check if the user already exists
    if (users.some(user => user.username === username)) {
      return res.status(409).json({ message: "User already exists." });
    }
  
    // If user does not exist, register the user
    users.push({ username, password });
    return res.status(201).json({ message: "User successfully registered. Now you can login." });
  });

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    // Convert the books object to a JSON string with indentation for neat formatting
    const booksList = JSON.stringify(books, null, 2);
  
    // Return the list of books in the response
    return res.status(200).send(booksList);
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    // Retrieve the ISBN from the request parameters
    const isbn = req.params.isbn;
  
    // Check if the book with the given ISBN exists in the books database
    const book = books[isbn];
  
    // If the book is found, return the book details
    if (book) {
      return res.status(200).json(book);
    } else {
      // If no book is found with the given ISBN, return a 404 error
      return res.status(404).json({ message: "Book not found with the given ISBN" });
    }
  });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author; // Get the author from the request parameters
    const booksByAuthor = [];
  
    // Iterate through the books object to find matching author
    Object.keys(books).forEach((key) => {
      if (books[key].author === author) {
        booksByAuthor.push(books[key]);
      }
    });
  
    // If books are found, return them, otherwise return a message
    if (booksByAuthor.length > 0) {
      return res.status(200).json(booksByAuthor);
    } else {
      return res.status(404).json({ message: `No books found by author: ${author}` });
    }
  });  

// Get book details based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title; // Get the title from the request parameters
    const booksByTitle = [];
  
    // Iterate through the books object to find matching title
    Object.keys(books).forEach((key) => {
      if (books[key].title === title) {
        booksByTitle.push(books[key]);
      }
    });
  
    // If books are found, return them, otherwise return a message
    if (booksByTitle.length > 0) {
      return res.status(200).json(booksByTitle);
    } else {
      return res.status(404).json({ message: `No books found with title: ${title}` });
    }
  });

// Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn; // Get the ISBN from the request parameters
  
    // Check if the book with the given ISBN exists
    if (books[isbn]) {
      // Return the reviews of the book
      return res.status(200).json(books[isbn].reviews);
    } else {
      // If the book is not found, return a 404 status with a message
      return res.status(404).json({ message: `No book found with ISBN: ${isbn}` });
    }
  });

module.exports.general = public_users;
