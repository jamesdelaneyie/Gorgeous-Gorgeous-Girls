<img src="https://raw.githubusercontent.com/jamesdelaneyie/Gorgeous-Gorgeous-Girls/master/outputs/banner.png">


Gorgeous Gorgeous Girls 
================

Gorgeous Gorgeous Girls (GGG) is a generative art project that creates illustrations in the style of the Girls series by the artist SlightlyFancy. 


# How it works
Every GGG is made from a series of `Marks` which are created using a `Marker` that follows a `Movement`.

A `Marker` can be thought of similar to a pencil, pen, crayon, or other drawing instrument. A `Marker` stores information related to how the `Mark` appears in terms of it's color and the qualities of how it "draws", e.g. it's "ink", nib size and shape. 

A `Move` stores information related to how the `Marker` "draws" such as a the path it follows (a `line`), the amount of pressure over the course of the `line`, the amount of "noise" added to the `line`, if there is any "hold" during the movement (time where the marker is kept in place), and other such properties.

A `Mark` is created by a `Marker` making a `Move`. The `Marker` follows a `line`, which is a series of points that create a path, that is created from a cubic bezier curve (the attributes that make up a `line`).

To create a `Mark`, a `Marker` moves step by step through the points of the path that make up the line, and at each step, draws a series of dots on the canvas. Each step along the line will have different properties for drawing those dots for that particular location, such as the color and opacity of the dots, their size, and the possible distance from the current center point that they can be placed. 

At any such point in a movement, the dots that are drawn are randomly placed a random distance from the current center point inside a specified shape (either an ellipse or circle, or a square).

Using the above method to draw lines on the canvas, with some careful setting of the properties of the `Marker` and `Move`, can yield a variety of different kinds of marks that closely resemble marks made using traditional media. 

When the above method of drawing lines on canvas is also combined with a property control system that eases through the points of another bezier curve to control the properties of the Mark as it is made (e.g modifying the thickness of the line as it draws) the results are even better at mimicing traditional marks.

In addition to being able to vary the properties of the `Mark` as it is made, there are also a few other options that can be set to control the overall look of the `Mark`, such as making one side of the `Mark` darker in color than the centre, or introducing noise into the colors of the dots being drawn by the `Marker`. 

# Under the hood
GGG uses Pixi.js as it's WebGL renderer, and utilizes PIXI.Sprites placed inside a PIXI.ParticleContainer to create the single dots that make up a `Mark`. Pixi.js was chosen due to it's performance. It allows tens of millions of dots to be drawn to the canvas in very little time when compared to other libraries that use WebGL or Canvas to render.

# With special thanks to
GGG uses modified versions of code taken from these open-source libraries to perform certain functions. Those libraries are: (bezier-easing.js by @greweb)[https://github.com/gre/bezier-easing], (rough.js by @preetster)[https://github.com/rough-stuff/rough], (open-simplex-noise by @lmas)[https://github.com/lmas/opensimplex], and ofcourse (pixi.js by @pixijs)[https://github.com/pixijs] (3D Sphere)[https://jsbin.com/yifayiq/edit?html,css,js,output]





















 





