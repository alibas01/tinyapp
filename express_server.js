
const PORT = 8080;
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const morgan = require('morgan');
app.use(morgan('tiny'));
app.set('view engine', 'ejs');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const {generateRandomString, isRegisteredBefore} = require("./helpers/userHelper");






const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}




app.get("/", (req, res) => {
  res.send("<html><body><h1>Hello</h1> <h2><b>Hello! If you want to use tinyApp, please move to /urls page!</h2></b></body></html>\n")
});
app.get("/urls", (req, res) => {
  const user = users[req.cookies['user_id']];
  const templateVars = { urls: urlDatabase, user: user};
  res.render("pages/urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  const user = users[req.cookies['user_id']];
  const templateVars = {user: user};
  res.render("pages/urls_new", templateVars);
});
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);         
});
app.get("/urls/:shortURL", (req, res) => {
  const user = users[req.cookies['user_id']];
  let shortURL = req.params.shortURL;
  const templateVars = { shortURL: shortURL, longURL: urlDatabase[shortURL], user: user};
  res.render("pages/urls_show", templateVars);
});
app.get("/u/:shortURL", (req, res) => {
  let URL = urlDatabase[req.params.shortURL];
  res.redirect(URL);
});
app.post("/urls/:shortURL/delete", (req, res) => {
  let shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
})
app.post("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  urlDatabase[shortURL] = req.body.newLongURL;
  res.redirect(`/urls`);
})
app.get("/register", (req, res) => {
  const user = users[req.cookies['user_id']];
  let email = req.body.email;
  let password = req.body.password;
  const templateVars = { email, password, user };
  res.render("pages/urls_register", templateVars);
});
app.post("/register", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  if (email !== "" && password !== "") {
    if(!isRegisteredBefore(users, email)) {
      console.log(isRegisteredBefore(users, email));
      let id = generateRandomString();
      let newUser = {id, email, password};
      users[id] = newUser;
      res.cookie('user_id', id);
      console.log(users);
      res.redirect("/urls");
    } else {
      res.status(400);
      res.send(`<html><body><h1>Hello</h1> <h2><b>This email(${email}) registered before!!!</h2></b></body></html>\n`);
    }
  } else {
    res.status(400);
    res.send('<html><body><h1>Hello</h1> <h2><b>Email & Password cannot be empty!!!</h2></b></body></html>\n');
  }
});
app.get("/login", (req, res) => {
  const user = users[req.cookies['user_id']];
  let email = req.body.loginEmail;
  let password = req.body.loginPassword;
  const templateVars = { email, password, user };
  res.render("pages/urls_login", templateVars);
});
app.post("/login", (req, res) => {
  //res.cookie('username', req.body.username);
  res.redirect(`/login`);
})
app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.clearCookie('user_id');
  req.body.username = null;
  res.redirect(`/urls`);
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

