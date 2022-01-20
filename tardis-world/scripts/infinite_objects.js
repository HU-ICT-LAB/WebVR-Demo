/**
 * A component that has to be added to a-scene
 * It updates the positions of the trees in the world to move the trees with the player
 */
AFRAME.registerComponent('update_trees',{
    /**
     * A function that is executed every tick, it checks the position of the player and sees if the trees are still in range
     * If the trees are not in range, move them.
     */
    tick: function () {
        //get the required objects
        var scene = document.querySelector('a-scene');
        var objects = scene.querySelectorAll('#gentree')
        var rig = document.querySelector("#rig")
        var player = document.querySelector("#camera")
         
        //get the player position in the rig
        var player_pos = player.getAttribute('position')
        //get the rig position
        var pos = rig.getAttribute("position")
        var world_pos = new THREE.Vector3();
        //add player and rig position together for world position
        world_pos.x = player_pos.x + pos.x
        world_pos.y = player_pos.y + pos.y
        world_pos.z = player_pos.z + pos.z

        //the amount of trees
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

/**
 * A component that has to be added to a-scene
 * It updates the positions of the trees in the world to move the trees with the player
 */
AFRAME.registerComponent('update_floor',{
    /**
     * A function that is executed every tick, it checks the position of the player and sees if the trees are still in range
     * If the trees are not in range, move them.
     */
    tick: function () {
        //get the required objects
        var scene = document.querySelector('a-scene');
        var objects = scene.querySelectorAll('#floor')
        var rig = document.querySelector("#rig")
        var player = document.querySelector("#camera")
         
        //get the player position in the rig
        var player_pos = player.getAttribute('position')
        //get the rig position
        var pos = rig.getAttribute("position")
        var world_pos = new THREE.Vector3();
        //add player and rig position together for world position
        world_pos.x = player_pos.x + pos.x
        world_pos.y = player_pos.y + pos.y
        world_pos.z = player_pos.z + pos.z

        //the amount of trees
        var len = 2*50
        for (let i = 0; i < objects.length; i++){
            var floor_pos = objects[i].getAttribute('position');
            if (Math.abs(world_pos.x - floor_pos.x) > len /2){
                if (world_pos.x - floor_pos.x > 0){
                    floor_pos.x += len
                }else{
                    floor_pos.x -= len
                }
            }
            if (Math.abs(world_pos.z - floor_pos.z) > len /2){
                if (world_pos.z - floor_pos.z > 0){
                    floor_pos.z += len
                }else{
                    floor_pos.z -= len
                }
            }
        }
    },
});

/**
 * A component to load the 3d model of the tree, we use this as a component so we can be sure the asset is initialized before we try to load it
 */
AFRAME.registerComponent('loaded_tree',{
  init: function () {
          this.el.setAttribute('gltf-model', "assets\\models\\dark_tree1.glb")
          this.el.setAttribute('scale',"5 5 5")
    },
});


/**
 * A component to load the 3d model of the tree, we use this as a component so we can be sure the asset is initialized before we try to load it
 */
AFRAME.registerComponent('loaded_floor',{
    init: function () {
            this.el.setAttribute('material', "shader: flat; src: url(assets\\textures\\grass2.png); repeat: 10 10")
      },
  });
  



AFRAME.registerComponent('generate_floor',{
    /**
     * initialisation function of the component
     * It generates the trees at the initialisation of this component, the component should be added to the a-scene object
     */
  init: function () {
      var scene = document.querySelector('a-scene');
      //we generate 16 trees( a 4 by 4 square)
      for (let i = 0; i < 4; i++){
          var floor = document.createElement('a-box');
          floor.setAttribute('height', "0.001")
          floor.setAttribute('width', "50")
          floor.setAttribute('depth', "50")
          floor.setAttribute('loaded_floor','')

          floor.setAttribute('id','floor')
          var pos = new THREE.Vector3();
          //modulo 4 so we get a 4 by 4 square of trees
          // we multiply by 10 to get a distance of 10 meters between each tree
          pos.x = i %2*50;
          //devide by 4 so we get a 4 by 4 square
          pos.z = i /2*50;
          pos.y = 0
          floor.setAttribute('position', pos);
          //add the tree to the scene
          scene.appendChild(floor);
      }
    },
});

/**
 * A component that generates trees in the world. And adds those trees to the scene
 */
AFRAME.registerComponent('generate_trees',{
    /**
     * initialisation function of the component
     * It generates the trees at the initialisation of this component, the component should be added to the a-scene object
     */
  init: function () {
      var scene = document.querySelector('a-scene');
      //we generate 16 trees( a 4 by 4 square)
      for (let i = 0; i < 16; i++){
          var tree = document.createElement('a-entity');
          tree.setAttribute('loaded_tree','')
          tree.setAttribute('id','gentree')
          var pos = new THREE.Vector3();
          //modulo 4 so we get a 4 by 4 square of trees
          // we multiply by 10 to get a distance of 10 meters between each tree
          pos.x = i %4*10;
          //devide by 4 so we get a 4 by 4 square
          pos.z = i /4*10;
          pos.y = 0;
          tree.setAttribute('position', pos);
          //add the tree to the scene
          scene.appendChild(tree);
      }
    },
});
