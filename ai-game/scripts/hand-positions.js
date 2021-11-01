function sumObjects(obj1, obj2) {
    let sum = {};

    Object.keys(obj1).forEach(key => {
        sum[key] = obj1[key] + obj2[key]
    })
    return sum;
}

//Shows the coordinates of headset and controllers in the HUD
AFRAME.registerComponent('add_cords_to_hud', {
    tick: function () {
        var textEntity = document.querySelector('#tekst');
        var left_controller = this.el.querySelector("#left_controller")
        var right_controller = this.el.querySelector('#right_controller');
        var headset = this.el.querySelector("#camera")
        var rig = this.el;

        //Gets coordinates of the rig
        var pos_r = rig.getAttribute('position');

        //Gets coordinates of the headset
        var pos_h = sumObjects(headset.getAttribute('position'), pos_r);
        var obj_h = {'x': pos_h.x.toPrecision(6), 'y': pos_h.y.toPrecision(6), 'z': pos_h.z.toPrecision(6)};

        //Gets coordinates of the right controller
        var pos_rc = sumObjects(right_controller.getAttribute('position'), pos_r);
        var obj_rc = {'x': pos_rc.x.toPrecision(6), 'y': pos_rc.y.toPrecision(6), 'z': pos_rc.z.toPrecision(6)};

        //Gets coordinates of the left controller
        var pos_lc = sumObjects(left_controller.getAttribute('position'), pos_r);
        var obj_lc = {'x': pos_lc.x.toPrecision(6), 'y': pos_lc.y.toPrecision(6), 'z': pos_lc.z.toPrecision(6)};

        //Add the coordinates to the HUD
        textEntity.setAttribute('text', 'value',
            "Headset: \n" + "x: " + [obj_h['x'] + "\ny: " +  obj_h['y'] + "\nz: " + obj_h['z']] + "\n\n" +
            "Right Controller: \n" + "x: "+ [obj_rc['x'] + "\ny: " +  obj_rc['y'] + "\nz: " + obj_rc['z']] + "\n\n" +
            "Left Controller: \n" + "x: "+ [obj_lc['x'] + "\ny: " +  obj_lc['y'] + "\nz: " + obj_lc['z']]);
    }
});