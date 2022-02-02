function sendLogToServer(msg) {
  // Sends a message to the MQTT debug server
  client.publish("world-builder-debug", JSON.stringify(msg))
}


let GLOBALCOLOR = 'red';

// Add objects to the a scene by pressing right hand controller trigger.
AFRAME.registerComponent('add-object', {
  events: {
    click: function (e) {
      console.log("i wanna place something")
      const scene = document.querySelector('a-scene');
      const newEl = document.createElement('a-entity');
      const position = e.detail.intersection.point;

      newEl.setAttribute('position', position);
      newEl.setAttribute('mixin', 'voxel');
      newEl.setAttribute('class', 'collidable block');
      // newEl.setAttribute('material', 'color: ' + GLOBALCOLOR);
      newEl.setAttribute('material', 'src: #' + GLOBALCOLOR + '-canvas');
      newEl.setAttribute('draw-canvas', '' + GLOBALCOLOR + '-canvas');
      // sendLogToServer("DOUBLLEEE0");
      // newEl.getAttribute("material").side = THREE.DoubleSide;

      // sendLogToServer("DOUBLLEEE1");
      // sendLogToServer(newEl.getAttribute("material"));

      scene.appendChild(newEl);
    }
  }
});


/**
 * This is a component used to add desktop support for the world builder game.
 * This class listens to mouse and keyboard events and passes thru these events to the entities that expect vr-events
 */
AFRAME.registerComponent('mouse-handler', {
  init: function(){
    var mouse_mode = 'place'
    var hand = document.querySelector("#rightHand")
    var hand2 = document.querySelector("#leftHand") 
    const color_box = document.querySelector("#color_identifier")

    /**
     * Listen to the mouse click event, if the mode is "place" send the click event to the right controller,
     * otherwise send it to the left controller
     */
    this.el.addEventListener('click', function(e){
      if(mouse_mode == 'place'){
        hand.emit("click", e.detail)
        //call click on right hand controller
      }else if(mouse_mode == "delete"){
        hand2.emit("click", e.detail)
        //call click on left hand controller
      }
    }.bind(this))

    /**
     * Listen to the keyboard events and change the placement mode if the spacebar is pressed,
     * This also changes the opacity of the preview cube to indicate wich mode is being used
     */
    document.addEventListener('keyup', function(e){
      if (e.keyCode == 32){
        if (mouse_mode == 'place'){
          color_box.setAttribute('material', 'opacity: 0.3; transparent: true');
          console.log("now in delete mode")
          mouse_mode = "delete"
        }else{
          console.log("now in place mode")
          color_box.setAttribute('material', 'opacity: 1.0; transparent: false');
          mouse_mode = "place"
        }
      }

    }.bind(this))

    /**
     * Listen to the mouse wheel event, when the user scrolls the selected collor should change, so we emit the gripdown event on the right hand
     */
    document.addEventListener('wheel', function(e){
      hand.emit("gripdown")
    }.bind(this))
  }
})


/* Snaps objects together by getting the position of the an object
and make a grid and add an object next to the object. */
AFRAME.registerComponent('snap', {
  dependencies: ['position'],

  schema: {
    offset: { type: 'vec3' },
    snap: { type: 'vec3' }
  },

  init: function () {
    this.originalPos = this.el.getAttribute('position');
    this.test = this.el.getAttribute("material");
    this.test.side = THREE.DoubleSide;
    // sendLogToServer(this.test);
    this.el.setAttribute("material", this.test);
    // sendLogToServer(this.test);
  },

  update: function () {
    const data = this.data;
    let pos = AFRAME.utils.clone(this.originalPos);

    let allBlocks = document.querySelectorAll(".collidable.block");
    sendLogToServer(allBlocks.length);

    for (let i = 0; i < allBlocks.length; i++) {
      otherBlockPosition = allBlocks[i].getAttribute('position');
      pos.x = Math.floor(pos.x / data.snap.x) * data.snap.x + data.offset.x;
      pos.y = Math.floor(pos.y / data.snap.y) * data.snap.y + data.offset.y;
      pos.z = Math.floor(pos.z / data.snap.z) * data.snap.z + data.offset.z;
      // sendLogToServer({"otherBlock": otherBlockPosition});
      sendLogToServer({ "desiredSnap": pos });
      if (pos.x == otherBlockPosition.x && pos.y == otherBlockPosition.y && pos.z == otherBlockPosition.z) {
        pos = AFRAME.utils.clone(this.originalPos);
        pos.x = Math.ceil(pos.x / data.snap.x) * data.snap.x - data.offset.x;
        pos.y = Math.ceil(pos.y / data.snap.y) * data.snap.y - data.offset.y;
        pos.z = Math.ceil(pos.z / data.snap.z) * data.snap.z - data.offset.z;
        sendLogToServer({ "newSnap": pos });
        break;
      }
    }


    if (pos.y < 0) {
      pos.y = data.offset.y;
    };

    this.el.setAttribute('position', pos);
    sendLogToServer({ "positionSet": pos });
  }
});

/**
 * Delete the object wich is clicked on, checks if the object is of class collidable block to prevent the user from deleting the floor in desktop mode
 */
AFRAME.registerComponent('delete-object', {
  events: {
    click: function (e) {
      let obj = e.detail.intersection.object.el;
      if (e.detail.intersection.object.el.getAttribute("class") == "collidable block"){
        obj.parentNode.removeChild(obj);
      }
    }
  }
});


// Change color 
/**
 * This component changes the color of the user if the gripdown event is received, it also sets the color and material of the preview cube
 */
AFRAME.registerComponent('change-color', {
  init: function () {
    const colors = ['red', 'green', 'blue', 'yellow', 'lightblue', 'purple'];
    const righthand = document.querySelector('#rightHand');
    const color_box = document.querySelector("#color_identifier")
    color_box.setAttribute('material', 'src: #' + GLOBALCOLOR + '-canvas');
    color_box.setAttribute('draw-canvas', '' + GLOBALCOLOR + '-canvas');
    let i = 0;
    righthand.addEventListener('gripdown', function () {
      function add() { (i == colors.length - 1) ? i = 0 : i++; }
      add();

      GLOBALCOLOR = colors[i];
      color_box.setAttribute('material', 'src: #' + GLOBALCOLOR + '-canvas');
      color_box.setAttribute('draw-canvas', '' + GLOBALCOLOR + '-canvas');

    }.bind(this))

  }
});

