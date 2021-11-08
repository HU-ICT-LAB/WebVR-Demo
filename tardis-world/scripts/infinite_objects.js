// update position of trees 
AFRAME.registerComponent('update_trees',{
    tick: function () {
        var scene = document.querySelector('a-scene');
        var objects = scene.querySelectorAll('#gentree')
        var rig = document.querySelector("#rig")
        var player = document.querySelector("#camera")
         

        var player_pos = player.getAttribute('position')
        console.log(player_pos)
        pos = rig.getAttribute("position")
        var world_pos = new THREE.Vector3();
        world_pos.x = player_pos.x + pos.x
        world_pos.y = player_pos.y + pos.y
        world_pos.z = player_pos.z + pos.z

        
        var len = 10*4
        for (let i = 0; i < objects.length; i++){
            var boom_pos = objects[i].getAttribute('position');
            if (Math.abs(world_pos.x - boom_pos.x) > len /2){
                if (world_pos.x - boom_pos.x > 0){
                    boom_pos.x += len
                }else{
                    boom_pos.x -= len
                }
            }
            if (Math.abs(world_pos.z - boom_pos.z) > len /2){
                if (world_pos.z - boom_pos.z > 0){
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
