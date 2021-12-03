// Add objects to the a scene by pressing right hand controller trigger.
AFRAME.registerComponent('add-object', {
  events: {
      click: function (e) {
          const scene = document.querySelector('a-scene');
          const newEl = document.createElement('a-entity');
          const position = e.detail.intersection.point;
          
          newEl.setAttribute('position', position);
          newEl.setAttribute('mixin', 'voxel');
          newEl.setAttribute('class', 'collidable');
          
          scene.appendChild(newEl);
      }
  }
});

/* Snaps objects together by getting the position of the an object
and make a grid and add an object next to the object. */
AFRAME.registerComponent('snap', {
  dependencies: ['position'],

  schema: {
    offset: {type: 'vec3'},
    snap: {type: 'vec3'}
  },

  init: function () {
    this.originalPos = this.el.getAttribute('position');
  },

  update: function () {
    const data = this.data;

    const pos = AFRAME.utils.clone(this.originalPos);
    pos.x = Math.floor(pos.x / data.snap.x) * data.snap.x + data.offset.x;
    pos.y = Math.floor(pos.y / data.snap.y) * data.snap.y + data.offset.y;
    pos.z = Math.floor(pos.z / data.snap.z) * data.snap.z + data.offset.z;

    this.el.setAttribute('position', pos);
  }
});

// delete object
AFRAME.registerComponent('delete-object', {
  events: {
    click: function(e) {
      const obj = e.detail.intersection.object.el;
      obj.parentNode.removeChild(obj);
    }
  }
});




/* TERRAIN STUFF */

let GLOBALMIN = 1

AFRAME.registerGeometry('terrain', {
  init: function (data) {
      console.log(data);
      let WIDTH = 250;
      let HEIGHT = 250;
      let SIZE_AMPLIFIER = 5;
      let HEIGHT_AMPLIFIER = 1;
      var plane = new THREE.PlaneBufferGeometry(WIDTH * SIZE_AMPLIFIER, HEIGHT * SIZE_AMPLIFIER, WIDTH - 1, HEIGHT - 1);
      var material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide, shading: THREE.FlatShading });

      // TODO remove canvas. Gen terrain without
      var canv = document.createElement('canvas');
      canv.width = "250"
      canv.height = "250"
      let pv = 1
      let kv = 0.2
      let ctx = canv.getContext("2d");
      let generalArray = [];
      let max = 0;
      let min = 5;
      let totalInPlayableArea = 0;
      let avgInPlayableArea = 0;
      let c  = 0;
      for (let y = 0; y < HEIGHT; y++) {
          let rowArray = [];
          for (let x = 0; x < WIDTH; x++) {
              let n = noise2D(x * 0.01, y * 0.01);
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
                  let n = noise2D(x * 0.01, y * 0.01);
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
      console.log('avg: '+ avgInPlayableArea);


      let minN = 1;
      y = 75
      for (x = 75; x < 175; x++){
          edgeN = generalArray[y][x];
          if (edgeN <  minN){
              minN = edgeN;
          }
      }
      y = 175
      for (x = 75; x < 175; x++){
          edgeN = generalArray[y][x];
          if (edgeN <  minN){
              minN = edgeN;
          }
      }
      x = 75
      for (y = 75; y < 175; y++){
          edgeN = generalArray[y][x];
          if (edgeN <  minN){
              minN = edgeN;
          }
      }
      x = 175
      for (y = 75; y < 75; y++){
          edgeN = generalArray[y][x];
          if (edgeN <  minN){
              minN = edgeN;
          }
      }
      console.log(minN);
      GLOBALMIN = minN;

      for(let y = 75; y < 175; y++){
          for(let x = 75; x < 175; x++){
              generalArray[y][x] = minN;
          }
      }


      let upperEdge = 75;
      let rightEdge = 175;
      let lowerEdge = 175;
      let leftEdge = 75;

      let smooth = false;

      while (!smooth) {
          for (let x = 75; x < 175; x++){
              nextN = generalArray[upperEdge-1][x];
              total = nextN + generalArray[upperEdge][x];
              generalArray[upperEdge][x] = total / 2;

          }

          for (let y = 75; y < 175; y++){
              nextN = generalArray[y][rightEdge+1];
              total = nextN + generalArray[y][rightEdge];
              generalArray[y][rightEdge] = total / 2;

          }

          for (let x = 75; x < 175; x++){
              nextN = generalArray[lowerEdge+1][x];
              total = nextN + generalArray[lowerEdge][x];
              generalArray[lowerEdge][x] = total / 2;

          }

          for (let y = 75; y < 175; y++){
              nextN = generalArray[y][leftEdge-1];
              total = nextN + generalArray[y][leftEdge];
              generalArray[y][leftEdge] = total / 2;

          }
          upperEdge++;
          rightEdge--;
          lowerEdge--;
          leftEdge++;

          if(upperEdge == 122){
              smooth = true;
          } 
      }


      for(let y = 0; y < 250; y++){
          for(let x = 0; x < 250; x++){
              let n = generalArray[y][x];
              let rgb = Math.round(255*n);
              ctx.fillStyle = "rgba("+rgb+","+rgb+","+rgb+",1.0)";
              ctx.fillRect(x, y, 1, 1);
          }
      }



      data = canv.getContext("2d").getImageData(0, 0, WIDTH, HEIGHT).data;

      // Generate the actual terrain.
      var vertices = plane.attributes.position.array;
      for (i = 0, j = 2; i < data.length; i += 4, j += 3) {
          vertices[j] = data[i] * HEIGHT_AMPLIFIER;
      }

      var mesh = new THREE.Mesh(plane, material);

      plane.computeFaceNormals();
      plane.computeVertexNormals();

      // GLOBALMIN = minPixelAroundFlatSpot
      console.log(plane);
      this.geometry = plane;
  }
});

// Set the position of the terrain so it is on playable height.
AFRAME.registerComponent('set-p', {
  dependencies: ['position'],
  
  init: function () {
      pos = {'x': 0, 'y': -(GLOBALMIN * 5 * 10)-.2, 'z': 0}
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
let P = makePermutation();

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
function noise2D(x, y) {
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