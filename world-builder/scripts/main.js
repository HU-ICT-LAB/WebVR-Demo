// Add objects to the scene by pressing right hand controller trigger.
AFRAME.registerComponent('add-object', {
  events: {
      click: function (e) {
          var scene = document.querySelector('a-scene');
          var newEl = document.createElement('a-entity');

          var position = e.detail.intersection.point;

          newEl.setAttribute('position', position);
          
          newEl.setAttribute('mixin', 'voxel');

          newEl.setAttribute('class', 'collidable');
          
          scene.appendChild(newEl);
      }
  }
});

// Snaps objects together by getting the position of the an object and make a grid and add an object next to that object.
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
    click: function (e) {
      var obj = e.detail.intersection.object.el;
      obj.parentNode.removeChild(obj);
    }
  }
});