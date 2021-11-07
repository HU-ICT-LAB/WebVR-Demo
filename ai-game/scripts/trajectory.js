function calculateSteps(pos1, pos2) {
    //Calculate the steps to calculate the trajectory by two given positions
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

var trigger = false;
var del = false;
var showNext = false;
var run = true;

AFRAME.registerComponent('trajectory', {
    init: function () {
        var right_controller = this.el.querySelector('#right_controller');
        right_controller.addEventListener('triggerdown', function() {
            trigger = true;
        });

        var left_controller = this.el.querySelector('#left_controller');
        left_controller.addEventListener('triggerup', function() {
            var spawnLine = document.querySelector('#lijn');
            del = true;
            spawnLine.setAttribute('line', {
                'start': "0 0 0",
                'end': "0 0 0"
            })
        });

        var headset = this.el.querySelector("#camera");
        const textEntity = document.createElement('a-entity');

        headset.appendChild(textEntity);

        textEntity.setAttribute('position', '0 -0.15 -0.5');
        textEntity.setAttribute('scale', '0.5 0.5 0.5');
        textEntity.setAttribute('text', 'color', '#be1f1f');
        textEntity.setAttribute('id', 'tekst');
    },

    tick: function () {
        var el = document.querySelector('#main');
        if (run) {
            //Shows coordinates of VR gear from 0.5 seconds time ago on the left side of the screen
            if (trigger) {
                //Place a box
                var list = getPositions(this.el);
                var obj_rc = list[1];

                var pos = new THREE.Vector3();

                var spawnEl = document.createElement('a-box');

                pos.x = obj_rc['x'];
                pos.y = obj_rc['y'];
                pos.z = obj_rc['z'];

                spawnEl.setAttribute('position', pos);
                spawnEl.setAttribute('scale', '0.025 0.025 0.025');
                spawnEl.setAttribute('id', 'drawBox');

                // Append to scene.
                el.sceneEl.appendChild(spawnEl);
                trigger = false;
                showNext = true;
            }
        }

        var boxes = document.querySelectorAll('#drawBox');
        if (boxes.length > 2) {
            //Delete all boxes
            boxes.forEach(item => el.sceneEl.removeChild(item));
            del = false;
        }
        if (del) {
            boxes.forEach(item => el.sceneEl.removeChild(item));
            del = false;
        }

        if (!run) {
            if (boxes.length === 2 && showNext) {
                var box1 = boxes[0].getAttribute('position');
                var box2 = boxes[1].getAttribute('position');
                var dif = calculateTrajectory(box1, box2);
                var endpoint = {'x': box1.x, 'y': box1.y, 'z': box1.z};

                while (diff(box1.x, endpoint.x) < 1 && diff(box1.y, endpoint.y) < 1 && diff(box1.z, endpoint.z) < 1) {
                    endpoint.x = endpoint.x + dif.x;
                    endpoint.y = endpoint.y + dif.y;
                    endpoint.z = endpoint.z + dif.z;
                }
                var textEntity = document.querySelector('#tekst');
                textEntity.setAttribute('text', 'value', "box2: " + JSON.stringify(box2) + "\nendPoint: " + JSON.stringify(endpoint));

                var spawnLine = document.querySelector('#lijn');
                spawnLine.setAttribute('line', {
                    'start': box1,
                    'end': endpoint
                })
            }
            showNext = false;
        }

        run = !run;
    }
})