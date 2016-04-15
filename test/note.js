/* Copyright 2016 Orbitable Team Members
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 * this file except in compliance with the License.  You may obtain a copy of the
 * License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations under the License.
 */

var _      = require('lodash');
var expect = require('chai').expect;
var Note = require('../src/note.js');

describe('Note', function () {

  it('should initialize given an empty object', function() {
    var n = new Note({});
    expect(n.position.x).to.be.a('Number');
    expect(n.position.y).to.be.a('Number');
    expect(n.startTime).to.be.a('Number');
    expect(n.duration).to.be.a('Number');
    expect(n.title).to.be.a('string');
    expect(n.text).to.be.a('string');
  });
  describe('check', function () {
    it('should return false if time is too soon', function() {
      var n = new Note({startTime: 100, duration: 100});
      expect(n.check(50)).to.equal(false);
    });
    it('should return true if time is appropriate', function() {
      var n = new Note({startTime: 100, duration: 100});
      expect(n.check(150)).to.equal(true);
    });
    it('should return false if time is too late', function() {
      var n = new Note({startTime: 100, duration: 100});
      expect(n.check(250)).to.equal(false);
    });
  });
  describe('toString', function () {
    it('should return a string', function() {
      var n = new Note({startTime: 100, duration: 100});
      expect(n.toString()).to.be.a('string');
    });
  });
});
