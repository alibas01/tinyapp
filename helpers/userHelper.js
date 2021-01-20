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



module.exports = { generateRandomString };