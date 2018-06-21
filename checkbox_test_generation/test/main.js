var chai    = require("chai");
var assert = chai.assert,
    expect = chai.expect;
var main = require("../main.js");

describe("Sanity check", function() {
  describe("runs", function() {
    it("doesn't crash", function() {
       main.main()
    });
  });
});
