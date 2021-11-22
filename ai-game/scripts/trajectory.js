/**
 * This function calculate the difference between pos1 and pos2 and
 * devide it by 10 so you get tiny steps to calculate the trajectory.
 * @param pos1 Position 1
 * @param pos2 Position 2
 * @returns {THREE.Vector3} The step
 */
function calculateSteps(pos1, pos2) {
    const vec1 = [pos1['x'], pos1['y'], pos1['z']]
    const vec2 = [pos2['x'], pos2['y'], pos2['z']]

    let step = new THREE.Vector3();
    step.x = (vec2[0] - vec1[0])/10;
    step.y = (vec2[1] - vec1[1])/10;
    step.z = (vec2[2] - vec1[2])/10;
    return step;
}

/**
 * This function moves the bot so it dodges the coordinates in listOfHits
 * @param bot Entity of bot
 * @param listOfHits Array of hits
 */
function dodgeMovement(bot, listOfHits) {
    const botPosition = bot.getAttribute('position');
    const firstTouch = listOfHits[0];

    const x_distance = botPosition.x - firstTouch.x;
    const moveMultiplier = 1/x_distance*0.2;

    const animationMoveString = "property: position; from: "+ botPosition.x + " " + botPosition.y + " " + (botPosition.z-1) + "; to: " + moveMultiplier + " " + botPosition.y + " " + (botPosition.z-1) + " dur: 10000; easing: linear";

    bot.setAttribute('animation', animationMoveString);
}

/**
 * This function calculate the difference between two numbers
 * @param num1 Number 1
 * @param num2 Number 2
 * @returns {number} Difference between number 1 en 2
 */
function diff (num1, num2) {
    if (num1 > num2) {
        return num1 - num2
    } else {
        return num2 - num1
    }
}

/**
 * This function calculate the two outer vertices of the given enitty
 * @param aiEntity An entity
 * @returns {THREE.Vector3[]} Two positions in an array
 */
function positionsOfBox(aiEntity) {
    const boxpos = aiEntity.getAttribute('position');
    const scale = aiEntity.getAttribute('scale');
    let width = aiEntity.getAttribute('width');
    let height = aiEntity.getAttribute('height');
    let depth = aiEntity.getAttribute('depth');

    if (width === null) {
        width = 1;
    }
    if (height === null) {
        height = 1;
    }
    if (depth === null) {
        depth = 1;
    }

    const pos1 = new THREE.Vector3();
    pos1.x = boxpos.x - (width/2) * scale.x;
    pos1.y = boxpos.y - (height/2) * scale.y;
    pos1.z = boxpos.z - (depth/2) * scale.z;

    const pos2 = new THREE.Vector3();
    pos2.x = boxpos.x + (width/2) * scale.x;
    pos2.y = boxpos.y + (height/2) * scale.y;
    pos2.z = boxpos.z + (depth/2) * scale.z;

    return [pos1, pos2];
}

/**
 * This function filters the listOfTrajectory array to only contains the coordinates between the two given corners
 * @param listOfTrajectory Array of coordinates
 * @param corner1 Corner 1 of an entity
 * @param corner2 Corner 2 of an entity
 * @returns {*[]} Array with coordinates that are between the two corners
 */
function checkIfGonnaHit(listOfTrajectory, corner1, corner2) {
    const cordsBetweenCorners = [];

    for (let i = 0; i < listOfTrajectory.length; i++) {
        if (corner1.x < listOfTrajectory[i].x && listOfTrajectory[i].x < corner2.x && corner1.y < listOfTrajectory[i].y && listOfTrajectory[i].y < corner2.y && corner1.z < listOfTrajectory[i].z && listOfTrajectory[i].z < corner2.z) {
            cordsBetweenCorners.push(listOfTrajectory[i]);
        }
    }
    return cordsBetweenCorners;
}

function executeCalculations(coordinate1, coordinate2, aiBot) {
    const dif = calculateSteps(coordinate1, coordinate2);

    const trajectory = [coordinate1];

    while (diff(coordinate1.x, trajectory[trajectory.length - 1].x) < 1 && diff(coordinate1.y, trajectory[trajectory.length - 1].y) < 1 && diff(coordinate1.z, trajectory[trajectory.length - 1].z) < 1) {
        const endpoint = new THREE.Vector3();
        endpoint.x = trajectory[trajectory.length - 1].x + dif.x;
        endpoint.y = trajectory[trajectory.length - 1].y + dif.y;
        endpoint.z = trajectory[trajectory.length - 1].z + dif.z;
        trajectory.push(endpoint);
    }

    const botPos = positionsOfBox(aiBot);

    const botHit = checkIfGonnaHit(trajectory, botPos[0], botPos[1]);

    if (botHit.length > 0) {
        dodgeMovement(aiBot, botHit);
    }
}

function refineCoordinate(coordinate) {
    const pos = new THREE.Vector3();
    pos.x = coordinate['x'];
    pos.y = coordinate['y'];
    pos.z = coordinate['z'];
    return pos
}

let positionsRight = [];
let positionsLeft = [];

//Calculate trajectory and moves targetBox if in its trajectory
AFRAME.registerComponent('trajectory', {
    schema: {
        targetBox: {type: 'string'},
    },
    init: function () {
        this.lastTick = 0;

        //Select the opponent entity
        this.aiBot = document.querySelector("#"+this.data.targetBox)
    },
    tick: function (time) {
        //Runs every 2 seconds
        if (Math.round(time - this.lastTick) > 500) {
            this.lastTick = Math.round(time);

            const list = getPositions(this.el);
            const obj_rc = refineCoordinate(list[1]);
            const obj_lc = refineCoordinate(list[2]);

            positionsRight.push(obj_rc);
            positionsLeft.push(obj_lc);
        }

        //Runs if there are two measured points of the hand
        if (positionsRight.length === 2) {
            executeCalculations(positionsRight[0], positionsRight[1], this.aiBot);
            positionsRight = [];

        }

        if (positionsLeft.length === 2) {
            executeCalculations(positionsLeft[0], positionsLeft[1], this.aiBot);
            positionsLeft = [];
        }
    }
})