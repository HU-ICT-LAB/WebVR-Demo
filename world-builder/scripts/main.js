function sendLogToServer(msg) {
  client.publish("world-builder-debug", JSON.stringify(msg))
}

AFRAME.registerComponent('generate_textures', {
  init: function () {
    const colors = ['red', 'green', 'blue', 'yellow', 'lightblue', 'purple'];
    for (let i = 0; i < colors.length; i++) {
      let color = colors[i];
      let canvas = document.getElementById(color + '-canvas');
      ctx = canvas.getContext('2d');
      console.log(color);
      let P = makePermutation();
      let pv = 1.5;
      let kv = 0.15;

      for (let y = 0; y < 500; y++) {
        for (let x = 0; x < 500; x++) {
          let n = noise2D(x * 0.01, y * 0.01, P);
          n += pv;
          n *= kv;
          let rgb = Math.round(255 * n);
          switch (color) {
            case "red":
              ctx.fillStyle = "rgba(" + rgb + "," + 0 + "," + 0 + ",1.0)";
              break;
            case "green":
              ctx.fillStyle = "rgba(" + 0 + "," + rgb + "," + 0 + ",1.0)";
              break;
            case "blue":
              ctx.fillStyle = "rgba(" + 0 + "," + 0 + "," + rgb + ",1.0)";
              break;
            case "yellow":
              ctx.fillStyle = "rgba(" + rgb + "," + rgb + "," + 0 + ",1.0)";
              break;
            case "lightblue":
              ctx.fillStyle = "rgba(" + 0 + "," + rgb + "," + rgb + ",1.0)";
              break;
            case "purple":
              ctx.fillStyle = "rgba(" + rgb + "," + 0 + "," + rgb + ",1.0)";
              break;
            default:
              ctx.fillStyle = "rgba(" + rgb + "," + rgb + "," + rgb + ",1.0)";
              break;
          }

          ctx.fillRect(x, y, 1, 1);
        }
      }
    }

  },
});

// AFRAME.registerComponent('draw-canvas', {
//   schema: {default: ''},

//   init: function () {
//     this.canvas = document.getElementById(this.data);
//     this.color = this.data.split('-')[0];
//     console.log(this.color);
//     this.ctx = this.canvas.getContext('2d');

//     let pv = 1.5
//     let kv = 0.15

//     for (let y = 0; y < 500; y++) {
//       for (let x = 0; x < 500; x++) {
//         let n = noise2D(x * 0.01, y * 0.01);
//         n += pv;
//         n *= kv;
//         let rgb = Math.round(255 * n);
//         switch (this.color){
//           case "red":
//             this.ctx.fillStyle = "rgba(" + rgb + "," + 0 + "," + 0 + ",1.0)";
//             break;
//           case "green":
//             this.ctx.fillStyle = "rgba(" + 0 + "," + rgb + "," + 0 + ",1.0)";
//             break;
//           case "blue":
//             this.ctx.fillStyle = "rgba(" + 0 + "," + 0 + "," + rgb + ",1.0)";
//             break;
//           case "yellow":
//             this.ctx.fillStyle = "rgba(" + rgb + "," + rgb + "," + 0 + ",1.0)";
//             break;
//           case "lightblue":
//             this.ctx.fillStyle = "rgba(" + 0 + "," + rgb + "," + rgb + ",1.0)";
//             break;
//           case "purple":
//             this.ctx.fillStyle = "rgba(" + rgb + "," + 0 + "," + rgb + ",1.0)";
//             break;
//           default:
//             this.ctx.fillStyle = "rgba(" + rgb + "," + rgb + "," + rgb + ",1.0)";
//             break;
//         }

//         this.ctx.fillRect(x, y, 1, 1);
//       }
//     }

//   }
// });


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
        sendLogToServer("YOOOOOO");
        pos = AFRAME.utils.clone(this.originalPos);
        sendLogToServer({ "realPos": pos });
        pos.x = Math.ceil(pos.x / data.snap.x) * data.snap.x - data.offset.x;
        pos.y = Math.ceil(pos.y / data.snap.y) * data.snap.y - data.offset.y;
        pos.z = Math.ceil(pos.z / data.snap.z) * data.snap.z - data.offset.z;
        sendLogToServer({ "newSnap": pos });
        break;
      }
    }

    // pos.x = Math.floor(pos.x / data.snap.x) * data.snap.x + data.offset.x;
    // pos.y = Math.floor(pos.y / data.snap.y) * data.snap.y + data.offset.y;
    // pos.z = Math.floor(pos.z / data.snap.z) * data.snap.z + data.offset.z;


    if (pos.y < 0) {
      pos.y = data.offset.y;
    };

    this.el.setAttribute('position', pos);
    sendLogToServer({ "positionSet": pos });
  }
});

// AFRAME.registerComponent('snap', {
//   dependencies: ['position'],

//   schema: {
//       offset: {type: 'vec3'},
//       snap: {type: 'vec3'}
//   },

//   init: function () {
//       this.originalPos = this.el.getAttribute('position');
//   },

//   update: function () {
//       const data = this.data;

//       const pos = AFRAME.utils.clone(this.originalPos);
//       pos.x = Math.ceil(pos.x / data.snap.x) * data.snap.x - data.offset.x;
//       pos.y = Math.ceil(pos.y / data.snap.y) * data.snap.y - data.offset.y;
//       pos.z = Math.ceil(pos.z / data.snap.z) * data.snap.z - data.offset.z;

//       this.el.setAttribute('position', pos);
//   }
// });
// delete object

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

// Global variable for moving the terrain on the y-axis.
let GLOBALMIN = 1

/* Aframe geometry for making custom terrain */
AFRAME.registerGeometry('terrain', {
  init: function (data) {

    // Some start variables
    let WIDTH = 250;
    let HEIGHT = 250;
    let SIZE_AMPLIFIER = 3.9;
    let HEIGHT_AMPLIFIER = .6;
    var plane = new THREE.PlaneBufferGeometry(WIDTH * SIZE_AMPLIFIER, HEIGHT * SIZE_AMPLIFIER, WIDTH - 1, HEIGHT - 1);
    var material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide, shading: THREE.FlatShading });

    // TODO remove canvas. Gen terrain without
    var canv = document.createElement('canvas');
    canv.width = WIDTH
    canv.height = HEIGHT
    let pv = 1
    let kv = 0.15
    let ctx = canv.getContext("2d");
    let generalArray = [];
    let max = 0;
    let min = 5;
    let totalInPlayableArea = 0;
    let avgInPlayableArea = 0;
    let c = 0;
    let P = makePermutation();
    for (let y = 0; y < HEIGHT; y++) {
      let rowArray = [];
      for (let x = 0; x < WIDTH; x++) {
        let n = noise2D(x * 0.01, y * 0.01, P);
        n += pv;
        n *= kv;
        if (n > max) {
          max = n;
        }
        if (n < min) {
          min = n;
        }
        // The flatspot.
        if ((y > 75 && y < 175) && (x > 75 && x < 175)) {
          c += 1
          let n = noise2D(x * 0.01, y * 0.01, P);
          n += pv;
          n *= kv;
          totalInPlayableArea += n;
          n = 0;
        }
        rowArray.push(n);

      }
      generalArray.push(rowArray);
    }

    avgInPlayableArea = totalInPlayableArea / c;
    console.log('avg: ' + avgInPlayableArea);

    let minX = -1;
    let minY = -1;


    // Find the global min height.
    let minN = 1;
    y = 75
    for (x = 75; x < 175; x++) {
      edgeN = generalArray[y][x];
      if (edgeN < minN) {
        minN = edgeN;
        minX = x;
        minY = y;
      }
    }
    y = 175
    for (x = 75; x < 175; x++) {
      edgeN = generalArray[y][x];
      if (edgeN < minN) {
        minN = edgeN;
        minX = x;
        minY = y;
      }
    }
    x = 75
    for (y = 75; y < 175; y++) {
      edgeN = generalArray[y][x];
      if (edgeN < minN) {
        minN = edgeN;
        minX = x;
        minY = y;
      }
    }
    x = 175
    for (y = 75; y < 75; y++) {
      edgeN = generalArray[y][x];
      if (edgeN < minN) {
        minN = edgeN;
        minX = x;
        minY = y;
      }
    }

    // Set the blobal min height.
    GLOBALMIN = minN;
    // Make sure the flatspot is on the min height level.
    for (let y = 75; y < 175; y++) {
      for (let x = 75; x < 175; x++) {
        generalArray[y][x] = minN;
      }
    }

    console.log(minN, minX, minY, generalArray[minY][minX]);



    // Fill in the canvas.
    for (let y = 0; y < 250; y++) {
      for (let x = 0; x < 250; x++) {
        let n = generalArray[y][x];
        let rgb = Math.round(255 * n);
        ctx.fillStyle = "rgba(" + rgb + "," + rgb + "," + rgb + ",1.0)";
        ctx.fillRect(x, y, 1, 1);
      }
    }



    data = canv.getContext("2d").getImageData(0, 0, WIDTH, HEIGHT).data;

    // Generate the actual terrain from the canvas.
    var vertices = plane.attributes.position.array;
    for (i = 0, j = 2; i < data.length; i += 4, j += 3) {
      vertices[j] = data[i] * HEIGHT_AMPLIFIER;
    }

    var mesh = new THREE.Mesh(plane, material);

    plane.computeFaceNormals();
    plane.computeVertexNormals();

    console.log(plane);
    this.geometry = plane;
  }
});

// Set the position of the terrain so it is on playable height.
AFRAME.registerComponent('set-p', {
  dependencies: ['position'],

  init: function () {
    pos = { 'x': 0, 'y': -(GLOBALMIN * 5 * 10) - .2, 'z': 0 }
    this.el.setAttribute('position', pos);
  }
});


class Vector2 {
  /**
   * 
   * @param {number} x 
   * @param {number} y 
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  /**
   * 
   * @param {Vector2} other 
   * @returns Dot product.
   */
  dot(other) {
    return this.x * other.x + this.y * other.y;
  }
}

/**
* Shuffle the permutation table.
* @param {number} tab 
*/
function shuffle(tab) {
  for (let e = tab.length - 1; e > 0; e--) {
    let index = Math.round(Math.random() * (e - 1)),
      temp = tab[e];

    tab[e] = tab[index];
    tab[index] = temp;
  }
}

/**
* Make the permutation array.
* @returns Permutation array.
*/
function makePermutation() {
  let P = [];
  for (let i = 0; i < 256; i++) {
    P.push(i);
  }
  shuffle(P);
  for (let i = 0; i < 256; i++) {
    P.push(P[i]);
  }

  return P;
}


/**
* Contant vector for each value.
* @param {number} v 
* @returns Vector2
*/
function getConstantVector(v) {
  //v is the value from the permutation table.
  let h = v & 3;
  if (h == 0)
    return new Vector2(1.0, 1.0);
  else if (h == 1)
    return new Vector2(-1.0, 1.0);
  else if (h == 2)
    return new Vector2(-1.0, -1.0);
  else
    return new Vector2(1.0, -1.0);
}

/**
* Fade curve
* @param {number} t 
* @returns number
*/
function fade(t) {
  return ((6 * t - 15) * t + 10) * t * t * t;
}

/**
* 
* @param {number} t 
* @param {number} a1 
* @param {number} a2 
* @returns number
*/
function lerp(t, a1, a2) {
  return a1 + t * (a2 - a1);
}

/**
* Puts all the function together to generate some noise
* @param {number} x 
* @param {number} y 
* @returns {number} A random value
*/
function noise2D(x, y, P) {
  let X = Math.floor(x) & 255;
  let Y = Math.floor(y) & 255;

  let xf = x - Math.floor(x);
  let yf = y - Math.floor(y);

  let topRight = new Vector2(xf - 1.0, yf - 1.0);
  let topLeft = new Vector2(xf, yf - 1.0);
  let bottomRight = new Vector2(xf - 1.0, yf);
  let bottomLeft = new Vector2(xf, yf);

  //Select a value in the array for each of the 4 corners.
  let valueTopRight = P[P[X + 1] + Y + 1];
  let valueTopLeft = P[P[X] + Y + 1];
  let valueBottomRight = P[P[X + 1] + Y];
  let valueBottomLeft = P[P[X] + Y];

  let dotTopRight = topRight.dot(getConstantVector(valueTopRight));
  let dotTopLeft = topLeft.dot(getConstantVector(valueTopLeft));
  let dotBottomRight = bottomRight.dot(getConstantVector(valueBottomRight));
  let dotBottomLeft = bottomLeft.dot(getConstantVector(valueBottomLeft));

  let u = fade(xf);
  let v = fade(yf);

  return lerp(u,
    lerp(v, dotBottomLeft, dotTopLeft),
    lerp(v, dotBottomRight, dotTopRight)
  );

}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

AFRAME.registerComponent('loaded_tree', {
  init: function () {
    this.el.setAttribute('gltf-model', "assets\\models\\dark_tree1.glb")
    this.el.setAttribute('scale', "5 5 5")
  },
});

AFRAME.registerComponent('generate_trees', {
  init: function () {
    var scene = document.querySelector('a-scene');

    // var tree = document.createElement('a-entity');
    //     tree.setAttribute('loaded_tree','')
    //     tree.setAttribute('id','gentree')
    //     var pos = new THREE.Vector3();
    //     pos.x = -90;
    //     pos.z = -90;
    //     pos.y = -0.6;
    //     tree.setAttribute('position', pos);
    //     scene.appendChild(tree);

    for (let i = 0; i < 100; i++) {
      var tree = document.createElement('a-entity');
      tree.setAttribute('loaded_tree', '')
      tree.setAttribute('id', 'gentree')
      var pos = new THREE.Vector3();
      let x = getRndInteger(-90, 90);
      let y = getRndInteger(-90, 90);
      while ((x > -30 && x < 30) && (y > -30 && y < 30)) {
        x = getRndInteger(-90, 90);
        y = getRndInteger(-90, 90);
      }
      pos.x = x
      pos.z = y
      pos.y = -4;
      tree.setAttribute('position', pos);
      scene.appendChild(tree);
    }
  },
});