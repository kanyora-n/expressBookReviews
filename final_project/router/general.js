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

 // Get the book list available in the shop using Promise
public_users.get('/', function (req, res) {
    return new Promise((resolve, reject) => {
      // Simulate async operation with setTimeout
      setTimeout(() => {
        resolve(JSON.stringify(books, null, 2)); // Format the book list
      }, 100); // Simulated delay
    })
      .then(bookList => {
        return res.status(200).send(bookList);
      })
      .catch(error => {
        return res.status(500).json({ message: "Error fetching books", error: error.message });
      });
  });

// Get book details based on ISBN using async-await
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters
  
    try {
      // Simulate async operation with a Promise
      const book = await new Promise((resolve, reject) => {
        const foundBook = books[isbn]; // Check if the book exists
        if (foundBook) {
          resolve(foundBook); // Resolve with the book details
        } else {
          reject(new Error("Book not found with the given ISBN")); // Reject with an error
        }
      });
  
      return res.status(200).json(book); // Return book details
    } catch (error) {
      return res.status(404).json({ message: error.message }); // Return 404 if book not found
    }
  });
  
// Get book details based on author using async-await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author; // Get the author from the request parameters
    const booksByAuthor = [];
  
    try {
      // Simulate async operation with a Promise
      await new Promise((resolve, reject) => {
        Object.keys(books).forEach((key) => {
          if (books[key].author === author) {
            booksByAuthor.push(books[key]); // Add matching books to the array
          }
        });
  
        // Resolve or reject based on whether books are found
        if (booksByAuthor.length > 0) {
          resolve(); // Resolve if books are found
        } else {
          reject(new Error(`No books found by author: ${author}`)); // Reject if no books are found
        }
      });
  
      return res.status(200).json(booksByAuthor); // Return the found books
    } catch (error) {
      return res.status(404).json({ message: error.message }); // Return 404 if no books found
    }
  });

// Get book details based on title using Promise callbacks
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title; // Get the title from the request parameters
    const booksByTitle = [];
  
    // Create a Promise to handle the async operation
    const findBooksByTitle = new Promise((resolve, reject) => {
      Object.keys(books).forEach((key) => {
        if (books[key].title === title) {
          booksByTitle.push(books[key]); // Add matching book to the array
        }
      });
  
      // Resolve or reject based on whether books are found
      if (booksByTitle.length > 0) {
        resolve(booksByTitle); // Resolve with the found books
      } else {
        reject(new Error(`No books found with title: ${title}`)); // Reject if no books are found
      }
    });
  
    findBooksByTitle
      .then(foundBooks => {
        return res.status(200).json(foundBooks); // Return the found books
      })
      .catch(error => {
        return res.status(404).json({ message: error.message }); // Return 404 if no books found
      });
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
