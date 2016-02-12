/**
 * A two demensional vector to represent position, force and velocity.
 *
 * @constructor
 * @param {int} x - The x position of the vector
 * @param {int} y - The y position of the vector
 */
function Vector(x,y) {
    this.x = x;
    this.y = y;
}

Vector.prototype = {
    /**
     * Returns the resutling sum of two vectors.
     *
     * @param {Vector} vector - The second operand in a sum of two vectors.
     */
    add: function(vector) {
        // var x = this.x + vector.x;
        // var y = this.y + vector.y;

        // return new Vector(x,y);
        this.x += vector.x;
        this.y += vector.y;
    },

    /**
     * Returns a vector resulting from the scalar product of a given vector and
     * a scalar value.
     *
     * @param {int} scalar - A scalar value multiply the vector by
     */
    scalarProduct: function(scalar) {
        var x = this.x * scalar;
        var y = this.y * scalar;

        return new Vector(x,y);
    },
    /**
     * Returns the eculidean distance for two given vectors.
     *
     * @param {Vector} vector - Opposing vector to compute the distance to.
     */
    distanceTo: function(vector) {
        var v1 = this;
        var v2 = vector;

        return Math.sqrt(Math.pow(v2.x - v1.x, 2) + Math.pow(v2.y - v1.y, 2));
    },
    /**
     * Returns vector info in string form
     *
     */
    toString: function() {
        return "(" + this.x + "," + this.y + ")";
    }
}

//module.exports = Vector;
