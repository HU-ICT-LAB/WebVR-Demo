/**
 * This function sum up each item of the two objects
 * @param obj1 Object 1
 * @param obj2 Object 2
 * @returns {{}} Object with the summed up items
 */
function sumObjects(obj1, obj2) {
    let sum = {};

    Object.keys(obj1).forEach(key => {
        sum[key] = obj1[key] + obj2[key]
    })
    return sum;
}

/**
 * This function gets the life coordinates of the VR gear
 * @param element The rig entity
 * @returns {{x, y, z}[]} Array with the coordinates of the headset, left and right controller
 */
function getPositions(element) {
    //Returns positions of the VR gear
    var left_controller = element.querySelector("#left_controller")
    var right_controller = element.querySelector('#right_controller');
    var headset = element.querySelector("#camera");

    //Gets coordinates of the rig
    var pos_r = element.getAttribute('position');

    //Gets coordinates of the headset
    var pos_h = sumObjects(headset.getAttribute('position'), pos_r);
    var obj_h = {'x': pos_h.x, 'y': pos_h.y, 'z': pos_h.z};

    //Gets coordinates of the right controller
    var pos_rc = sumObjects(right_controller.getAttribute('position'), pos_r);
    var obj_rc = {'x': pos_rc.x, 'y': pos_rc.y, 'z': pos_rc.z};

    //Gets coordinates of the left controller
    var pos_lc = sumObjects(left_controller.getAttribute('position'), pos_r);
    var obj_lc = {'x': pos_lc.x, 'y': pos_lc.y, 'z': pos_lc.z};
    return [obj_h, obj_rc, obj_lc]
}

//Shows the coordinates from 0.5 seconds ago
AFRAME.registerComponent('show_last_cords', {
    init: function () {
        this.lastTick = 0;
        this.lastCords = {"headset": {x: 0, y: 0, z: 0}, "right_controller": {x: 0, y: 0, z: 0}, "left_controller": {x: 0, y: 0, z: 0}};

        //All code below is to make an text entity
        var headset = this.el.querySelector("#camera");
        const textEntity = document.createElement('a-entity');

        headset.appendChild(textEntity);

        textEntity.setAttribute('position', '0 -0.15 -0.6');
        textEntity.setAttribute('rotation', '0 25 0');
        textEntity.setAttribute('scale', '0.5 0.5 0.5');
        textEntity.setAttribute('text', 'color', '#be1f1f');
        textEntity.setAttribute('id', 'prevCords');
    },

    tick: function (time) {
        //Shows coordinates of VR gear from 0.5 seconds time ago on the left side of the screen
        if (Math.round(time - this.lastTick) > 500) {
            this.lastTick = Math.round(time);

            var textEntity = document.querySelector('#prevCords');

            var list = getPositions(this.el);
            var obj_h = list[0];
            var obj_rc = list[1];
            var obj_lc = list[2];

            //Add the coordinates to the HUD
            textEntity.setAttribute('text', 'value',
                "Headset: \n" + "x: " + [this.lastCords['headset']['x'] + "\ny: " + this.lastCords['headset']['y'] + "\nz: " + this.lastCords['headset']['z']] + "\n\n" +
                "Right Controller: \n" + "x: " + [this.lastCords['right_controller']['x'] + "\ny: " + this.lastCords['right_controller']['y'] + "\nz: " + this.lastCords['right_controller']['z']] + "\n\n" +
                "Left Controller: \n" + "x: " + [this.lastCords['left_controller']['x'] + "\ny: " + this.lastCords['left_controller']['y'] + "\nz: " + this.lastCords['left_controller']['z']]);

            this.lastCords['headset'] = obj_h;
            this.lastCords['right_controller'] = obj_rc;
            this.lastCords['left_controller'] = obj_lc;
        }
    }
})

//Shows the coordinates of headset and controllers in the HUD
AFRAME.registerComponent('add_cords_to_hud', {
    init: function () {
        //All code below is to make an text entity
        var headset = this.el.querySelector("#camera");
        const textEntity = document.createElement('a-entity');

        headset.appendChild(textEntity);

        textEntity.setAttribute('position', '0.35 -0.15 -0.5');
        textEntity.setAttribute('rotation', '0 -25 0');
        textEntity.setAttribute('scale', '0.5 0.5 0.5');
        textEntity.setAttribute('text', 'color', '#be1f1f');
        textEntity.setAttribute('id', 'tekst');
    },

    tick: function () {
        //Shows real time coordinates of VR gear on right side of screen
        var textEntity = document.querySelector('#tekst');

        var list = getPositions(this.el);
        var obj_h = list[0];
        var obj_rc = list[1];
        var obj_lc = list[2];

        client.publish('hbo_ict_vr_request_data', JSON.stringify(list))

        //Add the coordinates to the HUD
        textEntity.setAttribute('text', 'value',
            "Headset: \n" + "x: " + [obj_h['x'] + "\ny: " + obj_h['y'] + "\nz: " + obj_h['z']] + "\n\n" +
            "Right Controller: \n" + "x: " + [obj_rc['x'] + "\ny: " + obj_rc['y'] + "\nz: " + obj_rc['z']] + "\n\n" +
            "Left Controller: \n" + "x: " + [obj_lc['x'] + "\ny: " + obj_lc['y'] + "\nz: " + obj_lc['z']]);
    }
});