var GLOBALMIN = 1

// Generate terrain
AFRAME.registerGeometry('terrain', {
    init: function (data) {
        console.log(data);
        let WIDTH = 256;
        let HEIGHT = 256;
        let SIZE_AMPLIFIER = 5;
        let HEIGHT_AMPLIFIER = 1;
        var plane = new THREE.PlaneBufferGeometry(WIDTH * SIZE_AMPLIFIER, HEIGHT * SIZE_AMPLIFIER, WIDTH - 1, HEIGHT - 1);
        var material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide, shading: THREE.FlatShading });

        // TODO remove canvas. Gen terrain without
        var canv = document.createElement('canvas');
        canv.width = "256"
        canv.height = "256"
        let pv = 1.0
        let kv = 0.5
        let ctx = canv.getContext("2d");
        let outArray = [];
        let max = 0;
        let min = 5;
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
                if ((y > 98 && y < 158) && (x > 98 && x < 158)) {
                    n = 0;
                }
                rowArray.push(n);
                let rgb = Math.round(255 * n);
                ctx.fillStyle = "rgba(" + rgb + "," + rgb + "," + rgb + ",1.0)";
                ctx.fillRect(x, y, 1, 1);
            }
            outArray.push(rowArray);
        }


        // Get the lowest surrounding pixel
        let minPixelAroundFlatSpot = 1;
        let y = 98
        for (let x = 98; x < 158; x++) {
            let pixelVal = outArray[y][x];
            if (pixelVal < minPixelAroundFlatSpot) {
                minPixelAroundFlatSpot = pixelVal
            }
        }

        y = 158
        for (let x = 98; x < 158; x++) {
            let pixelVal = outArray[y][x];
            if (pixelVal < minPixelAroundFlatSpot) {
                minPixelAroundFlatSpot = pixelVal
            }
        }

        let x = 98
        for (let y = 98; y < 158; y++) {
            let pixelVal = outArray[y][x];
            if (pixelVal < minPixelAroundFlatSpot) {
                minPixelAroundFlatSpot = pixelVal
            }
        }

        x = 158
        for (let y = 98; y < 158; y++) {
            let pixelVal = outArray[y][x];
            if (pixelVal < minPixelAroundFlatSpot) {
                minPixelAroundFlatSpot = pixelVal
            }
        }

        console.log(minPixelAroundFlatSpot);

        // Set the flat spot to the lowest surrounding terrain height.
        for (let y = 99; y < 158; y++) {
            for (let x = 99; x < 158; x++) {
                n = minPixelAroundFlatSpot;
                outArray[y][x] = n
                let rgb = Math.round(255 * n);
                ctx.fillStyle = "rgba(" + rgb + "," + rgb + "," + rgb + ",1.0)";
                ctx.fillRect(x, y, 1, 1);
            }
        }

        let flattenRange = 10

        data = canv.getContext("2d").getImageData(0, 0, WIDTH, HEIGHT).data;

        // Generate the actual terrain.
        var vertices = plane.attributes.position.array;
        for (i = 0, j = 2; i < data.length; i += 4, j += 3) {
            vertices[j] = data[i] * HEIGHT_AMPLIFIER;
        }

        var mesh = new THREE.Mesh(plane, material);

        plane.computeFaceNormals();
        plane.computeVertexNormals();

        GLOBALMIN = minPixelAroundFlatSpot
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

// TODO: REPLACE WITH THREE JS VECTOR?
// 
/**
 * Very simple class to create a vector
 */
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