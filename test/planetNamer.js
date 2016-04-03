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
var PlanetNamer = require('../src/planetNamer.js');

describe('PlanetNamer', function () {
    
  it('should initialize string arrays', function() {
      var p = new PlanetNamer();
      expect(p.prefixes != null).to.equal(true);
      expect(p.suffixes != null).to.equal(true);
      expect(p.codes != null).to.equal(true);
   });

  describe('getName', function() {
    it('should return a string', function() {
      var p = new PlanetNamer();
      expect(p.getName()).to.be.a('string');
    });
  });
});
