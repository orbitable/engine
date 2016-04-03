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

function PlanetNamer() {
    this.prefixes = [
        "Xar",
        "Vex",
        "Nex",
        "Zen",
        "Sat",
        "Nept",
        "Plut",
        "Cer",
        "Pos"   
    ];

    this.suffixes = [
        "ury",
        "us",
        "er",
        "urn",
        "une",
        "en",
        "o",
        "eon" 
    ];
    
    this.codes = [
        "X",
        "R",
        "N",
        "XR",
        "XN",
        "HC",
        "Z",
        "ZX",
        "ZR"
    ];

}

PlanetNamer.prototype.getName = function() {
    return _.sample(this.prefixes) + 
        _.sample(this.suffixes) + "-" + 
        _.sample(this.codes) + 
        Math.floor(9000.0 * Math.random() + 1000.0); // Random arbitrary 4 digit number
};

module.exports = PlanetNamer;