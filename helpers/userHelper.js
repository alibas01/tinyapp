const bcrypt = require('bcrypt');

const generateRandomString = function() {
  let result = '';
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (var i = 0; i < 7; i++) {
    if (i === 0) {
      result = chars[11 + Math.floor(Math.random() * 52)];
    } else {
    result += chars[Math.floor(Math.random() * 62)];
    }
  }
  return result;
};

// const users = { 
//   "userRandomID": {
//     id: "userRandomID", 
//     email: "user@example.com", 
//     password: "purple-monkey-dinosaur"
//   },
//  "user2RandomID": {
//     id: "user2RandomID", 
//     email: "user2@example.com", 
//     password: "dishwasher-funk"
//   }
// }
// const urlDatabase = {
//   b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
//   i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
// };
// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };
const filter = function (urlDatabase, userID) {// this function helps to filter the new fashion database with userid and also turns it into old fashion one.
  let result = {};
  if (userID !== undefined) {
    for (let shortURL in urlDatabase) {
      if(urlDatabase[shortURL].userID === userID) {
        result[shortURL] = urlDatabase[shortURL].longURL;
      }
    }
  }
  return result;
}

const isRegisteredBefore = function (users, email) {
  for (let id in users) {
    if (users[id].email === email) {
      return true;
    } 
  }
  return false;
};

const findId = function (users, email) {
  for (let id in users) {
    if (users[id].email === email) {
      return id;
    } 
  }
  return null;
};
const isPasswordMatch = function (users, email, password) {
  const id = findId(users, email)
  for (let user in users) {
    if (user === id && bcrypt.compareSync(password, users[user].password)) {
      return true;
    }
  }
  return false;
}




module.exports = { generateRandomString, isRegisteredBefore, findId, isPasswordMatch, filter };