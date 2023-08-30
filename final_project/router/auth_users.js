const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (newUser)=>{ //returns boolean
  // Check if the username already exists in the users array
  const existingUser = users.find((user) => user.username === newUser.username);

  if (existingUser) {
    return false; // Username already taken
  }

  users.push(newUser); // Add the new user to the users array
  return true; // Username is valid and not taken
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {accessToken,username}
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username;
    const userReview = req.query.review;
    const isbn = req.params.isbn;
    if (books.hasOwnProperty(isbn)){
        books[isbn].reviews[username] = userReview
        return res.status(201).json({message: "Review added/updated"});
    }
    else{
        return res.status(404).json({message: "Book not found"});
    }

});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username;
    const isbn = req.params.isbn;
    if (books.hasOwnProperty(isbn)){
        const reviews = books[isbn].reviews;
        if (reviews[username]) {
            delete reviews[username];
            return res.status(200).json({ message: "Review deleted successfully" });
        } else {
            return res.status(404).json({ message: "Review not found for this user" });
        }
    }
    else{
        return res.status(404).json({ message: "Book not found" });
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
