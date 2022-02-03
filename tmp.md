
<img src="https://media.giphy.com/media/Qrq4FXsVNah4brAN8Z/giphy.gif" width="600" height="200" />

# Description

This showcase has been made by Floris Videler (floris.videler@student.hu.nl) and Shahin Basht Bavian (shahin.bashtbavian@student.hu.nl). And we choose to work on a small world builder showcase. This because we think this shows both a lot of components of SD but also some of AI. In this showcase you can walk around in a flat area or a random generated terrain and place or delete blocks to your heart's content. Now this showcase is a sort of game, however this could also be a architects tool to help build and design houses! But for now it's a game to attract new students.

# Features
For this showcase, we added a lot of features which will be shown in this section and will be explained in more details.

## Perlin Noise
**Connected issues:** [Basic world / map generation algorithm](https://github.com/HU-ICT-LAB/WebVR-Demo/issues/10)<br>
We wanted to generate a random terrain, this because else all the worlds would lookalike. But before we could get started on generating random terrain we had to find an algorithm to generate a height map we could turn into a 3D object. We choose Perlin noise. The reason for this is that this is one of the most used terrain generation algorithms and there are the most sources available. This doesn't mean that this makes it an easy algorithm, to get a better understanding we used a lot of blogs and articles: [Understanding Perlin Noise](https://adrianb.io/2014/08/09/perlinnoise.html) & [Perlin Noise: A Procedural Generation Algorithm](https://rtouti.github.io/graphics/perlin-noise-algorithm) are the most used.

After struggling for a while getting the algorithm to work in JavaScript, we got a 2D demo working. You can see this in the image below 

![Perlin noise 2D demo](https://i.ibb.co/BfHYMvf/perlin.png)

## Terrain generation
**Connected issues:** [Map / world generation algoritme implementeren in A frame](https://github.com/HU-ICT-LAB/WebVR-Demo/issues/11)<br>
Now that we have a 2D map we need to make it a 3D terrain. We can do this by using the 2D map as a height map to create a 3D model. This turned out harder than expected. The plan was to create a plane and edit the vertices as shown on this page [A-frame geometry](https://aframe.io/docs/1.2.0/components/geometry.html). However this wasn't possible anymore, the underlying 3D rendered [Three.js](https://threejs.org/) changed the way vertices can be changed on a plane. This had mostly to do with performance, you can only edit the [buffer](https://github.com/mrdoob/three.js/issues/1717). After getting the hang of this we were able to generate a 3D terrain.

![Perlin noise 3D terrain demo](https://i.ibb.co/kmZBv9M/3dperlin.png)

## Playable area
**Connected issues:** [Make the game playable in random generated terrain](https://github.com/HU-ICT-LAB/WebVR-Demo/issues/66), [Make generated terrain on playing level](https://github.com/HU-ICT-LAB/WebVR-Demo/issues/65), [Smooth playing area of random terrain](https://github.com/HU-ICT-LAB/WebVR-Demo/issues/59)<br>
As you saw we have a 3D terrain, however we need it to be flat in the middle. This is the area where the player can build or play. As of now we carve out a square. This will add a lot more life to the showcase.
![Terrain with playable area](https://i.ibb.co/zJ17Cs7/terrainwithflat.png)

Smoothing a 3d terrain only in a specific area was harder than expected. There is a first version of terrain smoothing around the playable area. We smooth the terrain by looking at the surrounding pixels of the playable area and getting the average of those. We do this till the edge has reached the playable level. INSERT PICTURE HERE.

## Raycaster
Raycaster is a component that provides line-based intersection testing with a [Raycaster](https://en.wikipedia.org/wiki/Ray_casting).
Raycasting is a method of extending a line from an origin towards a direction to check whether the line intersects with other entities. Using this method helped us to create the functions for add, snap and delete objects.

## Add objects with right-hand controller
**Connected issues:** [Add object](../issues/13)<br>
To be able to add objects to the world we had to add a function to the right-hand controller. To do that we used a method called [Raycaster](https://aframe.io/docs/1.2.0/components/raycaster.html) to get the position of where the joystick faced and created a function to get the position from [Raycaster](https://aframe.io/docs/1.2.0/components/raycaster.html) and add an object in that position. For objects we use [a-mixin](https://aframe.io/docs/1.2.0/core/mixins.html) which is a reusable bundle of components and we can use it to create voxels which is an object like a box but attached with a few custom a frame attachments.

![Adding objects](https://user-images.githubusercontent.com/43300849/141308981-66ead2cd-9eea-4192-8963-bdf0f0a2990b.gif)

## Snap objects together
**Connected issues:** [Snap object](../issues/28)<br>
To be able to snap objects together we had to add a function to the block so they can snap together. To do that we used the [Raycaster](https://aframe.io/docs/1.2.0/components/raycaster.html) method to get the position of the block and make a grid and add a block next to the other block or on top of the other block.

![Snapping objects](https://user-images.githubusercontent.com/43300849/141309464-1bc549ad-bc07-4156-aab1-68ab921773d3.gif)

## Delete an object with left-hand controller
**Connected issues:** [delete object](../issues/26)<br>
After adding objects we wanted to make it possible to remove objects with left-hand controller. To do that we used the [Raycaster](https://aframe.io/docs/1.2.0/components/raycaster.html) method to get the object and remove it from the scene.

![Deleting objects](https://user-images.githubusercontent.com/43300849/141309282-fa0c88b8-c06f-4da9-87de-7bf01019849d.gif)

## Change Color
To make the game even more fun for players we decided to add a function to change the color of blocks so they can have more space to be creative. To make this function we used a collection of colors to and we cycle through it to change the color of blocks.

## Random textures
**Connected issues:** [TODO]()<br>
We wanted to give every block an unique texture. We do this by generating a black and white map using the perlin noise algorithm described earlier. The whiter a part of the texture is, the more the color is going to show on that part. We do this every time the page is loaded so one color will almost never have the same texture as another color and will almost never have the same texture as last time. We safe these textures as [HTML canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) elements which are easily turnt into [A-frame textures (or material)](https://aframe.io/docs/1.2.0/components/material.html).<br>
![Random textures](https://user-images.githubusercontent.com/60732920/149528311-8a9cf61c-27e8-48ae-920d-558e2ac69b2d.png)

## Trees
The trees that can be seen in the game are used to mask the steep hills and they ofcourse make the game look a lot nicer. We used an random algorithm to place the trees and excluded the buildable area from this. This way the player will not be bothered by the trees while playing.<br>
![Trees in game](https://user-images.githubusercontent.com/60732920/149528970-e66c857e-eb19-4c8d-af9a-f540e5358266.png)

# Known bugs and limitations
- There is a bug that you can add an object underground in some places. (Fixed)
- Sometimes the controllers get switched up. The right controller than also deletes a block before placing one and same goes for the left controller. (Fixed?)
- The terrain is not smooth towards the middle. [Smooth playing area of random terrain](https://github.com/HU-ICT-LAB/WebVR-Demo/issues/59) (Kinda fixed)
- The terrain is a random color. 
