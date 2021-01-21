const bcrypt = require('bcrypt');

const generateRandomString = function() {
  let result = '';
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < 7; i++) {
    if (i === 0) {
      result = chars[11 + Math.floor(Math.random() * 52)];
    } else {
      result += chars[Math.floor(Math.random() * 62)];
    }
  }
  return result;
};

// Assignment asked us to generate a new fashion URLdatabase object
// This function(filter) has to functions:
// 1. Helps to filter the new fashion database with userid
// 2. Turns it into old fashion URLdatabase.
const filter = function(urlDatabase, userID) {
  let result = {};
  if (userID !== undefined) {
    for (let shortURL in urlDatabase) {
      if (urlDatabase[shortURL].userID === userID) {
        result[shortURL] = urlDatabase[shortURL].longURL;
      }
    }
  }
  return result;
};

const isRegisteredBefore = function(users, email) {
  for (let id in users) {
    if (users[id].email === email) {
      return true;
    }
  }
  return false;
};
//asignment defines findID by getUserByEmail however I completed this function before
//and build everything on it. I adjusted my test file accordingly
const findId = function(users, email) {
  for (let id in users) {
    if (users[id].email === email) {
      return id;
    }
  }
  return null;
};
const isPasswordMatch = function(users, email, password) {
  const id = findId(users, email);
  for (let user in users) {
    if (user === id && bcrypt.compareSync(password, users[user].password)) {
      return true;
    }
  }
  return false;
};




module.exports = { generateRandomString, isRegisteredBefore, findId, isPasswordMatch, filter };