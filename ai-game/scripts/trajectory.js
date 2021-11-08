function calculateTrajectory(pos1, pos2) {
    var pos = new THREE.Vector3();
    var vec1 = [pos1['x'], pos1['y'], pos1['z']]
    var vec2 = [pos2['x'], pos2['y'], pos2['z']]
    pos.x = (vec2[0] - vec1[0])/10;
    pos.y = (vec2[1] - vec1[1])/10;
    pos.z = (vec2[2] - vec1[2])/10;
    return pos;
}

function diff (num1, num2) {
    //Calculate the difference between two numbers
    if (num1 > num2) {
        return num1 - num2
    } else {
        return num2 - num1
    }
}

var lijst = [];
var trigger = false;
var check = true;

AFRAME.registerComponent('trajectory', {
    init: function () {
        this.lastTick = 0;

        var headset = this.el.querySelector("#camera");
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

            lijst.push(pos);

            var spawnEl = document.createElement('a-box');

            spawnEl.setAttribute('position', pos);
            spawnEl.setAttribute('scale', '0.025 0.025 0.025');
            spawnEl.setAttribute('id', 'drawBox');

            // Append to scene.
            el.sceneEl.appendChild(spawnEl);

            console.log(this.lastTick, lijst);
        }

        if (lijst.length === 2) {
            var box1 = lijst[0];
            var box2 = lijst[1];

            var dif = calculateTrajectory(box1, box2);

            var trajectory = [box1];

            var pos1 = new THREE.Vector3();
            pos1.x += box1.x;
            pos1.y += box1.y;
            pos1.z += box1.z;

            // Append to scene.
            el.sceneEl.appendChild(spawnEl2);

            console.log(diff(box1.x, trajectory[trajectory.length - 1].x));

            var point = [];

            point.push(Math.abs(1/dif.x))
            point.push(Math.abs(1/dif.y))
            point.push(Math.abs(1/dif.z))


            var lengte_lijst = Math.round(Math.min(...point));
            console.log(lengte_lijst);
            if (lengte_lijst === Infinity) {
                lengte_lijst = 1;
            }

            //Problem with this bit of code
            for (let i = 0; i < lengte_lijst; i++) {
                var newPos = new THREE.Vector3();
                newPos.x = dif.x * i;
                newPos.y = dif.y * i;
                newPos.z = dif.z * i;

                newPos.x = newPos.x + box1.x
                newPos.y = newPos.y + box1.y
                newPos.z = newPos.z + box1.z

                // var textEntity = document.querySelector('#tekst');
                // textEntity.setAttribute('text', 'value', "Lengte lijst: " + JSON.stringify(box1));

                trajectory.push(newPos);
            }

            for (var a = 0; a < trajectory.length; a++) {
                var spawnEl1 = document.createElement('a-sphere');

                spawnEl1.setAttribute('position', trajectory[a]);
                spawnEl1.setAttribute('scale', '0.025 0.025 0.025');
                spawnEl1.setAttribute('id', 'einde');

                // Append to scene.
                el.sceneEl.appendChild(spawnEl1);
            }
            trajectory = []

            if (lijst.length >= 2) {
                lijst = [];
            }
        }
    }
})