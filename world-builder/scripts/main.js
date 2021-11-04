AFRAME.registerComponent('add-object', {
    events: {
        click: function (e) {
            var sceneEl = document.querySelector('a-scene');
            // var newEl = document.createElement("a-box");

            // newEl.setAttribute('color', 'red');
            

            
            // position.y = 0.5;
            


            let spawnEl = document.createElement('a-entity');
            spawnEl.setAttribute('mixin', "voxel");
            var position = e.detail.intersection.point;
            spawnEl.setAttribute('position', position);
            sceneEl.appendChild(newEl);
        }
    }
});

document.addEventListener('keyup', function (e) {
    if (e.keyCode !== 32) return;

    var newEl = document.createElement('a-box');
    newEl.setAttribute('color', 'red');
    sceneEl.appendChild(newEl);
    var position = markerEl.object3D.getWorldPosition();
    position.y = 0.5;
    newEl.setAttribute('position', position);
  });


/**
 * Snap entity to the closest interval specified by `snap`.
 * Offset entity by `offset`.
 */
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