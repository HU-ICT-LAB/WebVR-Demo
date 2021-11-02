function sumObjects(obj1, obj2) {
    let sum = {};

    Object.keys(obj1).forEach(key => {
        sum[key] = obj1[key] + obj2[key]
    })
    return sum;
}

function getPositions(element) {
    // var textEntity = document.querySelector('#tekst');
    var left_controller = element.querySelector("#left_controller")
    var right_controller = element.querySelector('#right_controller');
    var headset = element.querySelector("#camera");

    //Gets coordinates of the rig
    var pos_r = element.getAttribute('position');

    //Gets coordinates of the headset
    var pos_h = sumObjects(headset.getAttribute('position'), pos_r);
    var obj_h = {'x': pos_h.x.toPrecision(6), 'y': pos_h.y.toPrecision(6), 'z': pos_h.z.toPrecision(6)};

    //Gets coordinates of the right controller
    var pos_rc = sumObjects(right_controller.getAttribute('position'), pos_r);
    var obj_rc = {'x': pos_rc.x.toPrecision(6), 'y': pos_rc.y.toPrecision(6), 'z': pos_rc.z.toPrecision(6)};

    //Gets coordinates of the left controller
    var pos_lc = sumObjects(left_controller.getAttribute('position'), pos_r);
    var obj_lc = {'x': pos_lc.x.toPrecision(6), 'y': pos_lc.y.toPrecision(6), 'z': pos_lc.z.toPrecision(6)};
    return [obj_h, obj_rc, obj_lc]
}

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
        if (Math.round(time - this.lastTick) > 500) {
            this.lastTick = Math.round(time);
            console.log('tock: ', this.lastTick);

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
        var textEntity = document.querySelector('#tekst');

        var list = getPositions(this.el);
        var obj_h = list[0];
        var obj_rc = list[1];
        var obj_lc = list[2];

        //Add the coordinates to the HUD
        textEntity.setAttribute('text', 'value',
            "Headset: \n" + "x: " + [obj_h['x'] + "\ny: " + obj_h['y'] + "\nz: " + obj_h['z']] + "\n\n" +
            "Right Controller: \n" + "x: " + [obj_rc['x'] + "\ny: " + obj_rc['y'] + "\nz: " + obj_rc['z']] + "\n\n" +
            "Left Controller: \n" + "x: " + [obj_lc['x'] + "\ny: " + obj_lc['y'] + "\nz: " + obj_lc['z']]);
    }
});