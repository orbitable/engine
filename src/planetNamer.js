

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
    return this.prefixes[this.random(0,this.prefixes.length)] + this.suffixes[this.random(0,this.suffixes.length)] + "-" + this.codes[this.random(0,this.codes.length)] + this.random(1000,9999);
};

PlanetNamer.prototype.random = function (min,max) {
    return Math.floor((Math.random() * (max-min)) + min);
};

module.exports = PlanetNamer;