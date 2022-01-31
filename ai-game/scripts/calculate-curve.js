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

    console.log(new_pos2z, "=", new_pos2x2, "a", "+", new_pos2x, "b");

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

    // console.log('formula: y=', a, 'x^2 +', b, 'x');
    return [a, b];
}

function curve_spot(x, a, b) {
    // console.log(x,a * x**2 + b * x);
    return a * x**2 + b * x;
}
