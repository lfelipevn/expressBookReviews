const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  if(username === ""){
      return res.status(404).json({messaage: "Username empty"})
  }
  if(password === ""){
    return res.status(404).json({messaage: "Password empty"})
  }
  const newUser = { username, password };
  if(!isValid(newUser)){
    return res.status(404).json({messaage: "Username already taken"})
  }
    // Return a success message
    return res.status(200).json({messaage: "Registered"})
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify({books},null,4));
  return res.status(201).json({message: "Done"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books.hasOwnProperty(isbn)){
        res.send(books[isbn]);
        return res.status(201).json({message: "Done"});
    }
    return res.status(404).json({message: "Book not found"});
 });
  
 public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
  
    // Filtrar los libros con el mismo autor
    const filteredBooks = Object.values(books).filter((book) => book.author === author);
  
    if (filteredBooks.length > 0) {
      res.send(JSON.stringify({ filteredBooks }, null, 4));
      return res.status(202).json({ message: "Done" });
    } else {
      res.send("No books with author " + author);
      return res.status(404).json({ message: "Books not found" });
    }
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
  
    // Filtrar los libros con el mismo autor
    const filteredBooks = Object.values(books).filter((book) => book.title === title);
  
    if (filteredBooks.length > 0) {
      res.send(JSON.stringify({ filteredBooks }, null, 4));
      return res.status(202).json({ message: "Done" });
    } else {
      res.send("No books with title " + title);
      return res.status(404).json({ message: "Books not found" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books.hasOwnProperty(isbn)){
        res.send(books[isbn]['reviews']);
        return res.status(201).json({message: "Done"});
    }
    return res.status(404).json({message: "Book not found"});
});

// Get the book list available in the shop
public_users.get('/promise/', function (req, res) {
    const sendResponse = (data) => {
        res.send(JSON.stringify(data, null, 4));
    };

    // Wrap the response sending in a Promise
    const sendResponsePromise = new Promise((resolve, reject) => {
        // Assuming 'books' is your book data
        if (books) {
            resolve(books);
        } else {
            reject(new Error("No books available"));
        }
    });

    // Handling the promise
    sendResponsePromise
        .then(sendResponse)
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: "Error getting book list" });
        });
});

// Get book details based on ISBN
public_users.get('/promise/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    // Wrap the response sending in a Promise
    const sendResponsePromise = new Promise((resolve, reject) => {
        if (books.hasOwnProperty(isbn)) {
            resolve(books[isbn]);
        } else {
            reject(new Error("Book not found"));
        }
    });

    // Handling the promise
    sendResponsePromise
        .then(bookDetails => {
            return res.status(201).json({bookDetails});
        })
        .catch(error => {
            console.error(error);
            res.status(404).json({ message: "Book not found" });
        });
});

// Get books by author
public_users.get('/promise/author/:author', function (req, res) {
    const author = req.params.author;

    // Wrap the response sending in a Promise
    const sendResponsePromise = new Promise((resolve, reject) => {
        const filteredBooks = Object.values(books).filter((book) => book.author === author);

        if (filteredBooks.length > 0) {
            resolve(filteredBooks);
        } else {
            reject(new Error("Books not found"));
        }
    });

    // Handling the promise
    sendResponsePromise
        .then(filteredBooks => {
            res.send(JSON.stringify({ filteredBooks }, null, 4));
        })
        .catch(error => {
            console.error(error);
            res.status(404).json({ message: "Books not found" });
        });
});

// Get books by title
public_users.get('/promise/title/:title', function (req, res) {
    const title = req.params.title;

    // Wrap the response sending in a Promise
    const sendResponsePromise = new Promise((resolve, reject) => {
        const filteredBooks = Object.values(books).filter((book) => book.title === title);

        if (filteredBooks.length > 0) {
            resolve(filteredBooks);
        } else {
            reject(new Error("Books not found"));
        }
    });

    // Handling the promise
    sendResponsePromise
        .then(filteredBooks => {
            res.send(JSON.stringify({ filteredBooks }, null, 4));
        })
        .catch(error => {
            console.error(error);
            res.status(404).json({ message: "Books not found" });
        });
});


module.exports.general = public_users;

