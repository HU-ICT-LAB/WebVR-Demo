AFRAME.registerGeometry('example', {
    schema: {
      vertices: {
        default: new Float32Array( [
            -1.0, -1.0,  1.0,
             1.0, -1.0,  1.0,
             1.0,  1.0,  1.0,
        
             1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0, -1.0,  1.0
        ] ),
      }
    },
  
    init: function (data) {
        let WIDTH = 256;
        let HEIGHT = 256;
        let SIZE_AMPLIFIER = 5;
        let HEIGHT_AMPLIFIER = 1;
      var plane = new THREE.PlaneBufferGeometry(WIDTH * SIZE_AMPLIFIER, HEIGHT * SIZE_AMPLIFIER, WIDTH - 1, HEIGHT - 1);
      var material = new THREE.MeshPhongMaterial({color: 0xFFFFFF, side: THREE.DoubleSide, shading: THREE.FlatShading});
      
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
                if ((y > 98 && y < 158) && (x > 98 && x < 158)){
                    n = 0;
                }
                rowArray.push(n);
                let rgb = Math.round(255 * n);
                ctx.fillStyle = "rgba(" + rgb + "," + rgb + "," + rgb + ",1.0)";
                ctx.fillRect(x, y, 1, 1);
            }
            outArray.push(rowArray);
        }

        let = minPixelAroundFlatSpot = 1;
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



        
        // for (let y = 0; y < 256; y++) {
        //     for (let x = 0; x < 256; x++) {
        //         n = outArray[y][x];
        //         if ((y > 98 && y < 98+fadeRange) && (x > 98 && x < 158)){
        //             n = outArray[y-1][x] -0.05;
        //             // n = 1
        //         } else if ((y > 158-fadeRange && y < 158) && (x > 98 && x < 158)){
        //             n = outArray[y+1][x] + 0.05;
        //             // n = 1
        //         }
        //         outArray[y][x] = n
        //         let rgb = Math.round(255 * n);
        //         ctx.fillStyle = "rgba(" + rgb + "," + rgb + "," + rgb + ",1.0)";
        //         ctx.fillRect(x, y, 1, 1);
        //     }
        // }

        
        // console.log(outArray);
        // console.log(outArray[0][0]);
        // console.log(outArray[100][100]);
        console.log('min: ' + min + ' max: ' + max);

      data = canv.getContext("2d").getImageData(0, 0, WIDTH, HEIGHT).data;

      var vertices = plane.attributes.position.array;
      for(i=0, j=2; i < data.length; i += 4, j += 3) {
        vertices[j] = data[i] * HEIGHT_AMPLIFIER;
    }

    var mesh = new THREE.Mesh(plane, material);

        plane.computeFaceNormals();
        plane.computeVertexNormals();
      this.geometry = plane;
    }
  });


  // TODO: REPLACE WITH THREE JS VECTOR?
class Vector2 {
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
	dot(other){
		return this.x*other.x + this.y*other.y;
	}
}

function shuffle(tab){
	for(let e = tab.length-1; e > 0; e--){
		let index = Math.round(Math.random()*(e-1)),
			temp  = tab[e];
		
		tab[e] = tab[index];
		tab[index] = temp;
	}
}

function makePermutation(){
	let P = [];
	for(let i = 0; i < 256; i++){
		P.push(i);
	}
	shuffle(P);
	for(let i = 0; i < 256; i++){
		P.push(P[i]);
	}
	
	return P;
}
let P = makePermutation();

function getConstantVector(v){
	//v is the value from the permutation table
	let h = v & 3;
	if(h == 0)
		return new Vector2(1.0, 1.0);
	else if(h == 1)
		return new Vector2(-1.0, 1.0);
	else if(h == 2)
		return new Vector2(-1.0, -1.0);
	else
		return new Vector2(1.0, -1.0);
}

function fade(t){
	return ((6*t - 15)*t + 10)*t*t*t;
}

function lerp(t, a1, a2){
	return a1 + t*(a2-a1);
}

function noise2D(x, y){
	let X = Math.floor(x) & 255;
	let Y = Math.floor(y) & 255;

	let xf = x-Math.floor(x);
	let yf = y-Math.floor(y);

	let topRight = new Vector2(xf-1.0, yf-1.0);
	let topLeft = new Vector2(xf, yf-1.0);
	let bottomRight = new Vector2(xf-1.0, yf);
	let bottomLeft = new Vector2(xf, yf);
	
	//Select a value in the array for each of the 4 corners
	let valueTopRight = P[P[X+1]+Y+1];
	let valueTopLeft = P[P[X]+Y+1];
	let valueBottomRight = P[P[X+1]+Y];
	let valueBottomLeft = P[P[X]+Y];
	
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