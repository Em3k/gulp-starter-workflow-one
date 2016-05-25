var $              = require('jquery');
var TweenMax       = require('../../node_modules/gsap/src/uncompressed/TweenMax.js');
var ScrollMagic    = require('../../node_modules/scrollmagic/scrollmagic/uncompressed/ScrollMagic.js');
var Animation      = require('../../node_modules/scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js');

//////////////////////////////////////
// Scroll Magic
/////////////////////////////////////

// init controller
var controller = new ScrollMagic.Controller();

// loop through all elements with a class name fade-in
$('.fade-in').each(function() {

    //build a tween
    var tween = TweenMax.from($(this), 0.3, {autoAlpha: 0, scale: 0.5, y:'+=40', ease:Linear.easeNone});

    //build a scene
    var scene = new ScrollMagic.Scene({
      triggerElement: this
    })
    .setTween(tween) //trigger a TwennMax tween
    .addTo(controller);

});
///////////////////////////////////////
