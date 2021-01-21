
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
const bcrypt = require('bcrypt');
const salt = 10
const {generateRandomString, isRegisteredBefore, findId, isPasswordMatch, filter} = require("./helpers/userHelper");
const fs = require('fs');






const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
  aliBas: { longURL: "http://www.youtube.com", userID: "aJ48lW"}
}

//fs.readFile(`./db/urlDatabase.json`, 'utf8', (data) => JSON.parse(data))


  

const users = { 
  "aJ48lW": {
    id: "aJ48lW", 
    email: "alibas01@gmail.com", 
    password: "12qw"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}




app.get("/", (req, res) => {
  res.redirect("/urls");
});
app.get("/urls", (req, res) => {
  let urlDatabas = filter(urlDatabase, req.cookies['user_id']);
  const user = users[req.cookies['user_id']];
  const templateVars = { urls: urlDatabas, user: user};
  res.render("pages/urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  const user = users[req.cookies['user_id']];
  const templateVars = {user: user};
  if (user !== undefined) {
  res.render("pages/urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = {longURL: req.body.longURL, userID: req.cookies['user_id']} ;//
  res.redirect(`/urls/${shortURL}`);         
});
app.get("/urls/:shortURL", (req, res) => {
  const user = users[req.cookies['user_id']];
  let urlDatabas = filter(urlDatabase, req.cookies['user_id']);
  let shortURL = req.params.shortURL;
  const templateVars = { shortURL: shortURL, longURL: urlDatabas[shortURL], user: user};//
  res.render("pages/urls_show", templateVars);
});
app.get("/u/:shortURL", (req, res) => {
  let urlDatabas = filter(urlDatabase, req.cookies['user_id']);
  let URL = urlDatabas[req.params.shortURL];
  res.redirect(URL);
});
app.post("/urls/:shortURL/delete", (req, res) => {
  let shortURL = req.params.shortURL;
  const user = users[req.cookies['user_id']];
  if (user !== undefined) {
    delete urlDatabase[shortURL];
  }
  res.redirect('/urls');
})
app.post("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  const user = users[req.cookies['user_id']];
  if (user !== undefined) {
    urlDatabase[shortURL].longURL = req.body.newLongURL;
  }
  res.redirect(`/urls`);
})
app.get("/register", (req, res) => {
  const user = users[req.cookies['user_id']];
  const templateVars = { user };
  res.render("pages/urls_register", templateVars);
});
app.post("/register", (req, res) => {
  let email = req.body.email;
  let password = bcrypt.hashSync(req.body.password, salt);
  if (email !== "" && password !== "") {
    if(!isRegisteredBefore(users, email)) {
      let id = generateRandomString();
      let newUser = {id, email, password};
      users[id] = newUser;
      res.cookie('user_id', id);
      res.redirect("/urls");
    } else {
      res.status(400);
      res.send(`<html><body><h1>Error:400</h1> <h2><b>This email(${email}) registered before!!!</h2><h3><a href="/register">Register</a></h3></b></body></html>\n`);
    }
  } else {
    res.status(400);
    res.send('<html><body><h1>Error:400</h1> <h2><b>Email or Password cannot be empty!!!</h2><h3><a href="/register">Register</a></h3></b></body></html>\n');
  }
});
app.get("/login", (req, res) => {
  const user = users[req.cookies['user_id']];
  const templateVars = { user: user };
  res.render("pages/urls_login", templateVars);
});
app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  if(isRegisteredBefore(users, email)) {
    if(isPasswordMatch(users, email, password)){
      res.cookie('user_id', findId(users, email));
      res.redirect(`/urls`);
    } else {
      res.status(403);
      res.send(`<html><body><h1>Error:403</h1> <h2><b>Please check your password!!!</h2><h3><a href="/login">Login</a></h3></b></body></html>\n`);
    }
  } else {
    res.status(403);
    res.send(`<html><body><h1>Error:403</h1> <h2><b>This email(${email}) is not registered!!!\n Please Register!</h2><h3><a href="/register">Register</a></h3></b></body></html>\n`);
  }
});
app.get("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect(`/urls`);
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

