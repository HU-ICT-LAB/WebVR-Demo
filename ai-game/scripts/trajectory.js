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

function dodgeMovement() {

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

    // console.log('box: ', aiEntity);
    // var box = aiEntity;
    // var box = document.querySelector(`#${aiEntity}`);
    // console.log("begin: ", box);

    var boxpos = aiEntity.getAttribute('position');
    var scale = aiEntity.getAttribute('scale');

    // console.log(aiEntity, scale)

    var pos1 = new THREE.Vector3();
    pos1.x = boxpos.x - (scale.x/2);
    pos1.y = boxpos.y - (scale.y/2);
    pos1.z = boxpos.z - (scale.z/2);

    // var spawnEl1 = document.createElement('a-box');
    //
    // spawnEl1.setAttribute('position', pos1);
    // spawnEl1.setAttribute('scale', '0.025 0.025 0.025');
    // spawnEl1.setAttribute('id', 'drawBox');
    // spawnEl1.setAttribute('color', '#0B65C4')
    //
    // this.el.sceneEl.appendChild(spawnEl1);

    var pos2 = new THREE.Vector3();
    pos2.x = boxpos.x + (scale.x/2);
    pos2.y = boxpos.y + (scale.y/2);
    pos2.z = boxpos.z + (scale.z/2);

    // var spawnEl2 = document.createElement('a-box');
    //
    // spawnEl2.setAttribute('position', pos2);
    // spawnEl2.setAttribute('scale', '0.025 0.025 0.025');
    // spawnEl2.setAttribute('id', 'drawBox');
    // spawnEl2.setAttribute('color', '#57fa08')
    //
    // this.el.sceneEl.appendChild(spawnEl2);

    // var listOfTrajectory = [{x: 0.25, y:0.25, z:-1}];
    // var listOfTrajectory = [{x: 20.035, y:18.465, z:-32.48}, {x: 0.25, y:0.25, z:-1}];
    return [pos1, pos2];
}

function checkIfGonnaHit(listOfTrajectory, corner1, corner2) {
    //Filters the listOfTrajectory array to only contains the coordinates between the two given corners
    var newlijst = [];

    for (var i = 0; i < listOfTrajectory.length; i++) {
        if (corner1.x < listOfTrajectory[i].x && listOfTrajectory[i].x < corner2.x && corner1.y < listOfTrajectory[i].y && listOfTrajectory[i].y < corner2.y && corner1.z < listOfTrajectory[i].z && listOfTrajectory[i].z < corner2.z) {
            console.log('hit', newlijst);
            newlijst.push(listOfTrajectory[i]);
        }
        console.log("update: ", JSON.stringify(newlijst));
    }
    return newlijst;
}

let savedPositions = [];
let trigger = false;
let check = true;

AFRAME.registerComponent('trajectory', {
    schema: {
        targetBox: {type: 'string'},
    },
    init: function () {
        this.lastTick = 0;

        this.aiBot = document.querySelector("#"+this.data.targetBox)

        const headset = this.el.querySelector("#camera");
        const textEntity = document.createElement('a-entity');

        headset.appendChild(textEntity);

        textEntity.setAttribute('position', '0 -0.15 -0.5');
        textEntity.setAttribute('scale', '0.5 0.5 0.5');
        textEntity.setAttribute('text', 'color', '#be1f1f');
        textEntity.setAttribute('id', 'tekst');

    },
    tick: function (time) {
        //Runs every 2 seconds
        if (Math.round(time - this.lastTick) > 2000) {
            this.lastTick = Math.round(time);

            //Place a box
            var el = document.querySelector('#main');
            var list = getPositions(this.el);
            var obj_rc = list[1];

            var pos = new THREE.Vector3();
            pos.x = obj_rc['x'];
            pos.y = obj_rc['y'];
            pos.z = obj_rc['z'];

            savedPositions.push(pos);

            var spawnEl = document.createElement('a-box');

            spawnEl.setAttribute('position', savedPositions[savedPositions.length - 1]);
            spawnEl.setAttribute('scale', '0.025 0.025 0.025');
            spawnEl.setAttribute('id', 'drawBox');

            // Append to scene.
            el.sceneEl.appendChild(spawnEl);

            console.log(this.lastTick, savedPositions);
        }

        if (savedPositions.length === 2) {
            var box1 = savedPositions[0];
            var box2 = savedPositions[1];

            var textEntity = document.querySelector('#tekst');
            textEntity.setAttribute('text', 'value', "box1: " + JSON.stringify(box1) + "\nbox2: "+ box1.x);
            // textEntity.setAttribute('text', 'value', "type box1: " + (typeof box1) + "\ntype box1Test: "+ (typeof box1Test));

            var dif = calculateSteps(box1, box2);

            var trajectory = [box1];

            console.log('before while loop');
            while (diff(box1.x, trajectory[trajectory.length - 1].x) < 1 && diff(box1.y, trajectory[trajectory.length - 1].y) < 1 && diff(box1.z, trajectory[trajectory.length - 1].z) < 1) {
                var endpoint = new THREE.Vector3();
                endpoint.x = trajectory[trajectory.length - 1].x + dif.x;
                endpoint.y = trajectory[trajectory.length - 1].y + dif.y;
                endpoint.z = trajectory[trajectory.length - 1].z + dif.z;
                trajectory.push(endpoint);
            }
            console.log('after while loop');

            for (var a = 0; a < trajectory.length; a++) {
                var spawnEl1 = document.createElement('a-sphere');

                spawnEl1.setAttribute('position', trajectory[a]);
                spawnEl1.setAttribute('scale', '0.025 0.025 0.025');
                spawnEl1.setAttribute('id', 'einde');

                // Append to scene.
                el.sceneEl.appendChild(spawnEl1);
            }
            var endpoint1 = new THREE.Vector3();
            endpoint1.x = 20.035;
            endpoint1.y = 18.465;
            endpoint1.z = -32.48;

            var endpoint2 = new THREE.Vector3();
            endpoint2.x = 0.25;
            endpoint2.y = 0.25;
            endpoint2.z = -1;

            var endpoint3 = new THREE.Vector3();
            endpoint3.x = -2;
            endpoint3.y = 0;
            endpoint3.z = -2;

            // var listOfTrajectory = [endpoint1, endpoint2, endpoint3];

            console.log('targetbox: ', this.aiBot);

            var botPos = positionsOfBox(this.aiBot);

            var spawnEl2 = document.createElement('a-box');

            spawnEl2.setAttribute('position', botPos[0]);
            spawnEl2.setAttribute('scale', '0.025 0.025 0.025');
            spawnEl2.setAttribute('id', 'drawBox');
            spawnEl2.setAttribute('color', '#ff0000')

            var spawnEl3 = document.createElement('a-box');

            spawnEl3.setAttribute('position', botPos[1]);
            spawnEl3.setAttribute('scale', '0.025 0.025 0.025');
            spawnEl3.setAttribute('id', 'drawBox');
            spawnEl3.setAttribute('color', '#ffc300')

            this.el.sceneEl.appendChild(spawnEl2);
            this.el.sceneEl.appendChild(spawnEl3);

            var botHit = checkIfGonnaHit(trajectory, botPos[0], botPos[1]);

            var tekstEntity = document.querySelector('#tekst');
            if (botHit.length > 0) {
                tekstEntity.setAttribute('text', 'value', 'lengte traj: ' + trajectory.length + "\nlengte botHit: " + botHit.length + "\n" + JSON.stringify(botPos[0]) + "\n" + JSON.stringify(botPos[1]) + "\n" + JSON.stringify(trajectory[trajectory.length - 1]));
                // tekstEntity.setAttribute('text', 'value', 'type trajectory: '+ typeof trajectory + '\ntype listOfTrajectory: ' + typeof listOfTrajectory);

            } else {
                tekstEntity.setAttribute('text', 'value', 'MISS');
            }
            // console.log('type trajectory: '+ JSON.stringify(trajectory) + '\ntype listOfTrajectory: ' + JSON.stringify(listOfTrajectory))
            // moveBot(botHit[0])

            console.log("result: ", JSON.stringify(botHit));

            if (savedPositions.length >= 2) {
                savedPositions = [];
            }
        }
    }
})