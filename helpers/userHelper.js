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
    if (user === id && users[user].password === password) {
      return true;
    }
  }
  return false;
}




module.exports = { generateRandomString, isRegisteredBefore, findId, isPasswordMatch };