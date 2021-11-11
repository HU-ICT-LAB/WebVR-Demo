function calculateSteps(pos1, pos2) {
    //Calculate the steps between two positions and devide them by 10
    const vec1 = [pos1['x'], pos1['y'], pos1['z']]
    const vec2 = [pos2['x'], pos2['y'], pos2['z']]

    let step = new THREE.Vector3();
    step.x = (vec2[0] - vec1[0])/10;
    step.y = (vec2[1] - vec1[1])/10;
    step.z = (vec2[2] - vec1[2])/10;
    return step;
}

function dodgeMovement(bot, listOfHits) {
    //Moves the bot so it dodges the coordinates in listOfHits
    const botPosition = bot.getAttribute('position');
    const firstTouch = listOfHits[0];

    const x_distance = botPosition.x - firstTouch.x;
    const moveMultiplier = 1/x_distance*0.2;

    const animationMoveString = "property: position; from: "+ botPosition.x + " " + botPosition.y + " " + (botPosition.z-1) + "; to: " + moveMultiplier + " " + botPosition.y + " " + (botPosition.z-1) + " dur: 10000; easing: linear";

    bot.setAttribute('animation', animationMoveString);
}

function diff (num1, num2) {
    //Calculate the difference between two numbers
    if (num1 > num2) {
        return num1 - num2
    } else {
        return num2 - num1
    }
}

function positionsOfBox(aiEntity) {
    //Returns two positions of the given box that can be used to check if coordinates are inside the box
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

function checkIfGonnaHit(listOfTrajectory, corner1, corner2) {
    //Filters the listOfTrajectory array to only contains the coordinates between the two given corners
    const cordsBetweenCorners = [];

    for (let i = 0; i < listOfTrajectory.length; i++) {
        if (corner1.x < listOfTrajectory[i].x && listOfTrajectory[i].x < corner2.x && corner1.y < listOfTrajectory[i].y && listOfTrajectory[i].y < corner2.y && corner1.z < listOfTrajectory[i].z && listOfTrajectory[i].z < corner2.z) {
            cordsBetweenCorners.push(listOfTrajectory[i]);
        }
    }
    return cordsBetweenCorners;
}

let savedPositions = [];

AFRAME.registerComponent('trajectory', {
    schema: {
        targetBox: {type: 'string'},
    },
    init: function () {
        this.lastTick = 0;

        this.aiBot = document.querySelector("#"+this.data.targetBox)
    },
    tick: function (time) {
        //Runs every 2 seconds
        if (Math.round(time - this.lastTick) > 500) {
            this.lastTick = Math.round(time);

            const list = getPositions(this.el);
            const obj_rc = list[1];

            const pos = new THREE.Vector3();
            pos.x = obj_rc['x'];
            pos.y = obj_rc['y'];
            pos.z = obj_rc['z'];

            savedPositions.push(pos);
        }

        if (savedPositions.length === 2) {
            const box1 = savedPositions[0];
            const box2 = savedPositions[1];

            const dif = calculateSteps(box1, box2);

            const trajectory = [box1];

            while (diff(box1.x, trajectory[trajectory.length - 1].x) < 1 && diff(box1.y, trajectory[trajectory.length - 1].y) < 1 && diff(box1.z, trajectory[trajectory.length - 1].z) < 1) {
                const endpoint = new THREE.Vector3();
                endpoint.x = trajectory[trajectory.length - 1].x + dif.x;
                endpoint.y = trajectory[trajectory.length - 1].y + dif.y;
                endpoint.z = trajectory[trajectory.length - 1].z + dif.z;
                trajectory.push(endpoint);
            }

            const botPos = positionsOfBox(this.aiBot);

            const botHit = checkIfGonnaHit(trajectory, botPos[0], botPos[1]);

            if (botHit.length > 0) {
                dodgeMovement(this.aiBot, botHit)
            }

            if (savedPositions.length >= 2) {
                savedPositions = [];
            }
        }
    }
})