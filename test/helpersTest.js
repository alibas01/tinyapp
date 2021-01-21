const { assert } = require('chai');

const  { findId } = require('../helpers/userHelper.js');

const testUsers = {
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
};

describe('findId', function() {
  it('should return a user(ID) with valid email', function() {
    const user = findId(testUsers, "user@example.com");
    const expectedOutput = "userRandomID";
    assert.strictEqual(user, expectedOutput);
  });
  it('should return a user(ID) with valid email', function() {
    const user = findId(testUsers, "user2@example.com");
    const expectedOutput = "userRandomID";
    assert.notStrictEqual(user, expectedOutput);
  });
});