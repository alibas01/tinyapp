//exported functions
const {generateRandomString, isRegisteredBefore, findId, isPasswordMatch, filter, isOldURL} = require("./helpers/userHelper");
// declared variables
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require('morgan');
const methodOverride = require('method-override')
const cookieSession = require('cookie-session');
const app = express();
const bcrypt = require('bcrypt');
// app.use executions
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(morgan('tiny'));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));
// ejs set
app.set('view engine', 'ejs');
// default port 8080, salt = 10,
const salt = 10;
const PORT = 8080;


// URL database
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
  aliBas: { longURL: "http://www.youtube.com", userID: "aJ48lW"}
};

// user database
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
};


// GET /
app.get("/", (req, res) => {
  res.redirect("/urls");
});

// GET /urls
app.get("/urls", (req, res) => {
  let urlDatabas = filter(urlDatabase, req.session['user_id']);
  const user = users[req.session['user_id']];
  const templateVars = { urls: urlDatabas, user: user};
  res.render("pages/urls_index", templateVars);
});

// GET /urls/new
app.get("/urls/new", (req, res) => {
  const user = users[req.session['user_id']];
  const templateVars = {user: user};
  if (user) {
    res.render("pages/urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

// POST /urls
app.post("/urls", (req, res) => {
  const user = users[req.session['user_id']];
  if (user) {
    let shortURL = generateRandomString();
    urlDatabase[shortURL] = {longURL: req.body.longURL, userID: req.session['user_id']};
    res.redirect(`/urls/${shortURL}`);
  } else {
    res.status(400);
    res.send(`Error:404  Please login to add a new URL!!!`);
  }
});

// GET /urls/:shortURL
app.get("/urls/:shortURL", (req, res) => {
  const user = users[req.session['user_id']];
  let urlDatabas = filter(urlDatabase, req.session['user_id']);
  let shortURL = req.params.shortURL;
  const templateVars = { shortURL: shortURL, longURL: urlDatabas[shortURL], user: user};
  if (user) {
    res.render("pages/urls_show", templateVars);
  } else {
    res.redirect('/urls');
  }
});

// GET /u/:shortURL
app.get("/u/:shortURL", (req, res) => {
  let URL = urlDatabase[req.params.shortURL].longURL;
  if (URL.substring(0,7) !== 'http://') {
    URL = 'http://' + URL;
  }
  res.redirect(URL);
});

// DELETE /urls/:shortURL
app.delete("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  const user = users[req.session['user_id']];
  if (user !== undefined) {
    delete urlDatabase[shortURL];
  }
  res.redirect('/urls');
});

// PUT /urls/:id
app.put("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  const user = users[req.session['user_id']];
  let databas = filter(urlDatabase, req.session['user_id']);
  if (user && !isOldURL(req.body.newLongURL, databas)) {
    urlDatabase[shortURL].longURL = req.body.newLongURL;
    res.redirect(`/urls`);
  } else if (!user) {
    res.status(400);
    res.send(`<html><body><h1>Error:404</h1> <h2><b>Please login!!!</h2><h3><a href="/login">Login</a></h3></b></body></html>`);
  } else {
    res.status(400);
    res.send(`<html><body><h1>Error:404</h1> <h2><b>New URL you entered, exists in your list</h2><h3><a href="/urls">My URLs</a></h3></b></body></html>`);
  } 
});

// GET /register
app.get("/register", (req, res) => {
  const user = users[req.session['user_id']];
  const templateVars = { user };
  if (!user) {
    res.render("pages/urls_register", templateVars);
  } else {
    res.redirect(`/urls`);
  }
});

// POST /register
app.post("/register", (req, res) => {
  let email = req.body.email;
  let password = bcrypt.hashSync(req.body.password, salt);
  if (email !== "" && req.body.password !== "") {
    if (!isRegisteredBefore(users, email)) {
      let id = generateRandomString();
      let newUser = {id, email, password};
      users[id] = newUser;
      req.session['user_id'] = id;
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


// GET /login
app.get("/login", (req, res) => {
  const user = users[req.session['user_id']];
  const templateVars = { user: user };
  if (!user) {
    res.render("pages/urls_login", templateVars);
  } else {
    res.redirect(`/urls`);
  }
});

// POST /login
app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  if (isRegisteredBefore(users, email)) {
    if (isPasswordMatch(users, email, password)) {
      req.session['user_id'] = findId(users, email);
      res.redirect(`/urls`);
    } else {
      res.status(403);
      res.send(`<html><body><h1>Error:403</h1> <h2><b>Please check your password!!!</h2><h3><a href="/login">Login</a></h3></b></body></html>\n`);
    }
  } else {
    res.status(403);
    res.send(`<html><body><h1>Error:403</h1> <h2><b>This email(${email}) is not registered!!!\n Please Register first!</h2><h3><a href="/register">Register</a></h3></b></body></html>\n`);
  }
});

// GET /logout
app.get("/logout", (req, res) => {
  req.session['user_id'] = null;
  res.redirect(`/urls`);
});

// server listen on port 8080
app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});