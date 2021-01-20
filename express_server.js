// load the things we need
const PORT = 8080; // default port 8080
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const morgan = require('morgan');
app.use(morgan('tiny'));
app.set('view engine', 'ejs');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const {generateRandomString} = require("./helpers/userHelper");






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
  const templateVars = { urls: urlDatabase };
  if (req.cookies['username'] !== null) {
    templateVars['username'] = req.cookies['username']
  } else {templateVars['username'] = null };
  res.render("pages/urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  const templateVars = {};
  if (req.cookies['username'] !== null) {
    templateVars['username'] = req.cookies['username']
  } else {templateVars['username'] = null };
  res.render("pages/urls_new", templateVars);
});
app.post("/urls", (req, res) => {
  //console.log(req.body);  // Log the POST request body to the console
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);         // Respond with 'Ok' (we will replace this) 
});
app.get("/urls/:shortURL", (req, res) => {
  //console.log(urlDatabase);
  let shortURL = req.params.shortURL;
  //console.log(shortURL);
  //console.log(urlDatabase[shortURL]);
  const templateVars = { shortURL: shortURL, longURL: urlDatabase[shortURL] };
  if (req.cookies['username'] !== null) {
    templateVars['username'] = req.cookies['username']
  } else {templateVars['username'] = null };
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
  //console.log(urlDatabase[shortURL]);
  res.redirect(`/urls`);
})
app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect(`/urls`);
})
app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.clearCookie('user_id');
  req.body.username = null;
  res.redirect(`/urls`);
});
app.get("/register", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  const templateVars = { email, password };
  res.render("pages/urls_register", templateVars);
});
app.post("/register", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let id = generateRandomString();
  let newUser = {id, email, password};
  users[id] = newUser;
  res.cookie('user_id', id);
  console.log(users);
  res.redirect("/urls");
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

