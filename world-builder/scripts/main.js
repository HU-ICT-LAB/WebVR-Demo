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