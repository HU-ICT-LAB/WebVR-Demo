
// update position of trees 
AFRAME.registerComponent('update_trees',{
    tick: function () {
        var scene = document.querySelector('a-scene');
        var objects = scene.querySelectorAll('#gentree')
        var player = document.querySelector("#rig")
        var pos = rig.getAttribute("position")
        var len = 10*4
        for (let i = 0; i < objects.length; i++){
            var boom_pos = objects[i].getAttribute('position');
            if (Math.abs(pos.x - boom_pos.x) > len /2){
                if (pos.x - boom_pos.x > 0){
                    boom_pos.x += len
                }else{
                    boom_pos.x -= len
                }
            }
            if (Math.abs(pos.z - boom_pos.z) > len /2){
                if (pos.z - boom_pos.z > 0){
                    boom_pos.z += len
                }else{
                    boom_pos.z -= len
                }
            }
        }
    },
});    

// load the tree gltf-model
AFRAME.registerComponent('loaded_tree',{
  init: function () {
          this.el.setAttribute('gltf-model', "assets\\models\\dark_tree1.glb")
          this.el.setAttribute('scale',"5 5 5")
    },
});

AFRAME.registerComponent('generate_trees',{
  init: function () {
      var scene = document.querySelector('a-scene');
      for (let i = 0; i < 16; i++){
          var tree = document.createElement('a-entity');
          tree.setAttribute('loaded_tree','')
          tree.setAttribute('id','gentree')
          var pos = new THREE.Vector3();
          pos.x = i %4*10;
          pos.z = i /4*10;
          pos.y = -0.6;
          tree.setAttribute('position', pos);
          scene.appendChild(tree);
      }
    },
});
