// This file contains the Euler method.

/**
 * This file contains the functions for the Euler method.
 * Euler method: yn+1 = yn + h*F(tn, yn)
 */

/**
 * Calculates the F in the Euler method for one position (x, y or z).
 * @param position_1 The position (x, y or z) from previous step.
 * @param position_2 The position (x, y or z) from the current step.
 * @param step_size The time (ticks) between when position_1 and position_2 where taken.
 * @returns {number} Returns the F from the Euler method by dividing delta of the position with delta of the time.
 */
function calculateF(position_1, position_2, step_size) {
    const delta_pos = position_2 - position_1;

    return delta_pos/step_size;
}

/**
 * The euler method for one position (x, y or z).
 * @param position_1 The position (x, y or z) from previous step.
 * @param position_2 The position (x, y or z) from the current step.
 * @param step_size The time (ticks) between when position_1 and position_2 where taken.
 * @returns {*} The new position.
 */
function euler(position_1, position_2, step_size) {
    const f = calculateF(position_1, position_2, step_size);

    const change_in_position = step_size * f;

    return position_2 + change_in_position;
}

/**
 * Runs the Euler method for every position (x, y & z).
 * @param coordinate_1 The coordinate {x, y, z} from previous step.
 * @param coordinate_2 The coordinate {x, y, z} from the current step.
 * @param time_step The time (ticks) between when coordinate_1 and coordinate_2 where taken.
 * @returns {THREE.Vector3} The estimated coordinate of next step.
 */
function runEuler(coordinate_1, coordinate_2, time_step) {
    // Splitting the coordinates into x, y & z
    const x1 = coordinate_1['x'];
    const y1 = coordinate_1['y'];
    const z1 = coordinate_1['z'];

    const x2 = coordinate_2['x'];
    const y2 = coordinate_2['y'];
    const z2 = coordinate_2['z'];

    // Run Euler method and make new vector with the estimated guess
    let estimated_coordinate = new THREE.Vector3();
    estimated_coordinate.x = euler(x1, x2, time_step);
    estimated_coordinate.y = euler(y1, y2, time_step);
    estimated_coordinate.z = euler(z1, z2, time_step);

    return estimated_coordinate
}