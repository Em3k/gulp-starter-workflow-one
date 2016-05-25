var $ = require('jquery');
var TweenMax       = require('../../node_modules/gsap/src/uncompressed/TweenMax.js');

//var square = document.getElementById("square");
var square = $("#square");
TweenLite.to(square, 5, {x:"500px", height:"150px"});
console.log("animation.js");
