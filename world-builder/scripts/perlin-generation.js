// Uses the perlin noise algorithm to generate random textures
AFRAME.registerComponent('generate_textures', {
  init: function () {
    // The base colors
    const colors = ['red', 'green', 'blue', 'yellow', 'lightblue', 'purple'];
    for (let i = 0; i < colors.length; i++) {
      let color = colors[i];
      let canvas = document.getElementById(color + '-canvas');
      ctx = canvas.getContext('2d');
      console.log(color);
      let P = makePermutation();
      let pv = 1.5;
      let kv = 0.15;

      // The texture wil be 500 x 500 px
      for (let y = 0; y < 500; y++) {
        for (let x = 0; x < 500; x++) {
          // The actual noise
          let n = noise2D(x * 0.01, y * 0.01, P);
          n += pv;
          n *= kv;
          // Times 255 because of colors.
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
        // Generate the flat spot
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
    // Apply geometry
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

// Generate a random int
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Loads a tree model.
AFRAME.registerComponent('loaded_tree', {
  init: function () {
    this.el.setAttribute('gltf-model', "assets\\models\\dark_tree1.glb")
    this.el.setAttribute('scale', "5 5 5")
  },
});


// Places all the trees randomly
AFRAME.registerComponent('generate_trees', {
  init: function () {
    var scene = document.querySelector('a-scene');

    for (let i = 0; i < 100; i++) {
      var tree = document.createElement('a-entity');
      tree.setAttribute('loaded_tree', '')
      tree.setAttribute('id', 'gentree')
      var pos = new THREE.Vector3();
      let x = getRndInteger(-90, 90);
      let y = getRndInteger(-90, 90);
      // Exlude the playable area
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