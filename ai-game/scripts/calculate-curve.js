// This file contains the curve solving function and the

/**
 * Solves the a and b variable in the curve formula y=ax^2*bx using two positions
 * (but it uses the z coordinate instead of the y coordinate because the curve isn't vertical but horizontal
 * and its also a 2D curve formula).
 * @param pos1 Position one on the curve.
 * @param pos2 Position two one the curve.
 * @returns {number[]} The a and b variables
 */
function calculateCurveEquation(pos1, pos2) {
    let a;
    let b;

    // split x and z from pos1
    let pos1x = pos1['x'];
    let pos1z = pos1['z'];

    // calculate x^2
    let pos1x2 = pos1x**2;

    // split x and z from pos2
    let pos2x = pos2['x'];
    let pos2z = pos2['z'];

    // calculate x^2
    let pos2x2 = pos2x**2;

    // pos1 * z^2 of pos2
    let new_pos1z = pos1z * pos2x2;
    let new_pos1x = pos1x * pos2x2;
    let new_pos1x2 = pos1x2 * pos2x2;

    // pos2 * z^2 of pos1
    let new_pos2z = pos2z * pos1x2;
    let new_pos2x = pos2x * pos1x2;
    let new_pos2x2 = pos2x2 * pos1x2;

    //pos2 - pos1
    new_pos2z = new_pos2z - new_pos1z;
    new_pos2x = new_pos2x - new_pos1x;
    new_pos2x2 = new_pos2x2 - new_pos1x2;

    // Decides if a will be solved before b or the other way around
    if (new_pos2x === 0) {
        a = pos2z / pos2x2;

        pos1x2 = pos1x2 * a;
        pos1z = pos1z - pos1x2;
        pos1x2 = pos1x2 - pos1x2;

        b = pos1z / pos1x;
    } else {
        b = new_pos2z/new_pos2x;

        pos2x *= b;
        pos2z -= pos2x;
        pos2x -= pos2x;

        a = pos2z/pos2x2;
    }
    return [a, b];
}

/**
 * Gives the z coordinate on the curve given the x, a and b variables.
 * @param x The x coordinate on the curve
 * @param a The a variable provided by the calculateCurveEquation() function
 * @param b The b variable provided by the calculateCurveEquation() function
 * @returns {number} The z coordinate
 */
function curve_spot(x, a, b) {
    return a * x**2 + b * x;
}
