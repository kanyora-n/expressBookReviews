const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}


// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body; // Get username and password from the request body

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if the user exists and the password matches
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  // Generate JWT token
  const accessToken = jwt.sign({ username: user.username }, "secret_key", { expiresIn: '1h' });

  // Save token in session
  req.session.token = accessToken;

  return res.status(200).json({ message: "Login successful", token: accessToken });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; // Get the ISBN from the request parameters
    const review = req.query.review; // Get the review from the request query
    const username = req.session.username; // Get the username from the session
  
    // Check if the review is provided
    if (!review) {
      return res.status(400).json({ message: "Review is required." });
    }
  
    // Check if the book exists
    if (!books[isbn]) {
      return res.status(404).json({ message: `No book found with ISBN: ${isbn}` });
    }
  
    // If the book exists, check if the user has already posted a review
    let bookReviews = books[isbn].reviews;
  
    if (!bookReviews) {
      // Initialize reviews object if it doesn't exist
      books[isbn].reviews = {};
    }
  
    // Add or modify the review for the user
    books[isbn].reviews[username] = review;
  
    return res.status(200).json({ message: "Review successfully added/modified." });
  });

  // Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; // Get the ISBN from the request parameters
    const username = req.session.username; // Get the username from the session
  
    // Check if the book exists
    if (!books[isbn]) {
      return res.status(404).json({ message: `No book found with ISBN: ${isbn}` });
    }
  
    // Check if there are any reviews for the book
    let bookReviews = books[isbn].reviews;
  
    if (!bookReviews) {
      return res.status(404).json({ message: "No reviews available for this book." });
    }
  
    // Check if the user has posted a review
    if (!bookReviews[username]) {
      return res.status(403).json({ message: "You can only delete your own review." });
    }
  
    // Delete the review
    delete bookReviews[username];
  
    return res.status(200).json({ message: "Review successfully deleted." });
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
