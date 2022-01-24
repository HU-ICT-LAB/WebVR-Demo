/**
 * This function calculate the difference between pos1 and pos2 and
 * devide it by 10 so you get tiny steps to calculate the trajectory.
 * @param pos1 Position 1
 * @param pos2 Position 2
 * @returns {THREE.Vector3} The size of one step
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
    const lastTouch = listOfHits[listOfHits.length - 1];

    //To see which direction changes the most
    const diffX = Math.abs(firstTouch.x - lastTouch.x);
    const diffY = Math.abs(firstTouch.y - lastTouch.y);
    const diffZ = Math.abs(firstTouch.z - lastTouch.z);

    const biggestDiff = Math.max(diffX, diffY, diffZ);

    if (biggestDiff === diffZ) {
        //for punches from the front side of the opponent
        const width = bot.getAttribute('width');
        const leftSide = botPosition.x - (width/2);
        const rightSide = botPosition.x + (width/2);                  
        const disFromLeft = Math.min(Math.abs(lastTouch.x - leftSide), Math.abs(firstTouch.x - leftSide));
        const disFromRight = Math.min(Math.abs(lastTouch.x - rightSide), Math.abs(firstTouch.x - rightSide));

        //decides if opponent moves right or left
        if (disFromLeft < disFromRight) {
            botPosition.x = botPosition.x + disFromLeft;
        } else {
            botPosition.x = botPosition.x - disFromRight;
        }

    } else {
        //for punches from the side of the opponent
        const depth = bot.getAttribute('depth');
        const frontSide = botPosition.z + (depth/2);
        const disFromFront = Math.abs(lastTouch.z - frontSide);
        botPosition.z = botPosition.z - disFromFront;
    }

    bot.setAttribute('position', botPosition);
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
 * Get the right positions and attributes for the calculateCorners function
 * and calls that function to calculate the outer corners of a (box) entity
 * @param childEntity The entity that you want the corners to be calculated from
 * @param parentEntity The parent entity of the childEntity if there is one
 * @returns {THREE.Vector3[]} The two positions of the corners of the childEntity
 */
function positionsOfBox(childEntity, parentEntity = null) {
    if (parentEntity === null) {
        const boxpos = childEntity.getAttribute('position');
        const scale = childEntity.getAttribute('scale');
        let width = childEntity.getAttribute('width');
        let height = childEntity.getAttribute('height');
        let depth = childEntity.getAttribute('depth');

        if (width === null) {
            width = 1;
            childEntity.setAttribute('width', width);
        }
        if (height === null) {
            height = 1;
            childEntity.setAttribute('height', height);
        }
        if (depth === null) {
            depth = 1;
            childEntity.setAttribute('depth', depth);
        }

        return calculateCorners(boxpos, width, height, depth, scale);

    } else {
        const att = getWorldAttributes(childEntity, parentEntity);
        const boxpos = att[0];
        const scale = att[1];
        let width = att[3];
        let depth = att[4];
        let height = att[5];

        return calculateCorners(boxpos, width, height, depth, scale);
    }
}

/**
 * Calculates the two corner positions of an (box) entity
 * @param position Position of the entity
 * @param width The width of the entity
 * @param height The height of the entity
 * @param depth The depth of the entity
 * @param scale The scale of the entity
 * @returns {THREE.Vector3[]} The two corner positions of the entity
 */
function calculateCorners(position, width, height, depth, scale) {
    const pos1 = new THREE.Vector3();
    pos1.x = position.x - (width / 2) * scale.x;
    pos1.y = position.y - (height / 2) * scale.y;
    pos1.z = position.z - (depth / 2) * scale.z;

    const pos2 = new THREE.Vector3();
    pos2.x = position.x + (width / 2) * scale.x;
    pos2.y = position.y + (height / 2) * scale.y;
    pos2.z = position.z + (depth / 2) * scale.z;

    return [pos1, pos2]
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

/**
 * Calculates the trajectory, calls checkIfGonnaHit to check if the trajectory interferes with the aiBot and moves the bot using dodgeMovement if necessary.
 * @param coordinate1 The first coordinate of the punch
 * @param coordinate2 The second coordinate of the punch
 * @param aiBot The bot or opponent you are boxing against
 * @param hitBoxes The hit boxes of the aiBot
 */
function executeCalculations(coordinate1, coordinate2, aiBot, hitBoxes) {
    const dif = calculateSteps(coordinate1, coordinate2);

    const trajectory = [coordinate1];

    while (dif.x + dif.y + dif.z !== 0 && diff(coordinate1.x, trajectory[trajectory.length - 1].x) < 1 && diff(coordinate1.y, trajectory[trajectory.length - 1].y) < 1 && diff(coordinate1.z, trajectory[trajectory.length - 1].z) < 1) {
        const endpoint = new THREE.Vector3();
        endpoint.x = trajectory[trajectory.length - 1].x + dif.x;
        endpoint.y = trajectory[trajectory.length - 1].y + dif.y;
        endpoint.z = trajectory[trajectory.length - 1].z + dif.z;
        trajectory.push(endpoint);
    }

    hitBoxes.forEach(element => {
        const botHit = checkIfGonnaHit(trajectory, element[0], element[1]);

        if (botHit.length > 0) {
            dodgeMovement(aiBot, botHit);
        }
    })
}

/**
 * This function refines coordinates.
 * @param coordinate The coordinate you want to refine
 * @returns {*} The refined coordinate
 */
function refineCoordinate(coordinate) {
    const pos = new THREE.Vector3();
    pos.x = coordinate['x'];
    pos.y = coordinate['y'];
    pos.z = coordinate['z'];
    return pos
}

/**
 * Calculates the 'world values' of an entities attributes.
 * @param childEntity The entity where you want the 'world values' calculated of
 * @param parentEntity The parent entity of the childEntity
 * @returns {*[]} The calculated 'world values' of the childEntity
 */
function getWorldAttributes(childEntity, parentEntity) {
    const returns = [];
    const attributes = ['position', 'scale', 'rotation', 'width', 'depth', 'height'];

    attributes.forEach(element => {
        let childAtt = childEntity.getAttribute(element);
        let parentAtt = parentEntity.getAttribute(element);

        if (element === 'scale') {
            returns.push(sumObjects(childAtt, parentAtt, true));
        } else if (element === 'width' || element === 'depth' || element === 'height') {
            if (childAtt === null) {
                childAtt = 1;
                childEntity.setAttribute(element, childAtt);
            }
            if (parentAtt === null) {
                parentAtt = 1;
                parentEntity.setAttribute(element, parentAtt);
            }
            returns.push(parseFloat(childAtt) * parseFloat(parentAtt));

        } else {
            returns.push(sumObjects(childAtt, parentAtt));
        }
    })

    return returns
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
        this.aiBot = document.querySelector("#"+this.data.targetBox);
        this.hitBoxes = this.aiBot.querySelectorAll('#hitbox');
    },
    tick: function (time) {
        //Runs every 50 ticks
        if (Math.round(time - this.lastTick) > 50) {
            this.lastTick = Math.round(time);

            const list = getPositions(this.el);
            const obj_rc = refineCoordinate(list[1]);
            const obj_lc = refineCoordinate(list[2]);

            positionsRight.push(obj_rc);
            positionsLeft.push(obj_lc);
        }

        if (positionsRight.length === 2 || positionsLeft.length === 2) {
            this.stor = [];
            this.hitBoxes.forEach((element) => {
                this.stor.push(positionsOfBox(element, this.aiBot));
            })
        }

        //Runs if there are two measured points of the hand
    //     if (positionsRight.length === 2) {
    //         executeCalculations(positionsRight[0], positionsRight[1], this.aiBot, this.stor);
    //         positionsRight = [];
    //
    //     }
    //
    //     if (positionsLeft.length === 2) {
    //         executeCalculations(positionsLeft[0], positionsLeft[1], this.aiBot, this.stor);
    //         positionsLeft = [];
    //     }
    }
});