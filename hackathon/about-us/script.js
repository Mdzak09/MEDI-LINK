var radius = 240; // how big of the radius
var autoRotate = true; // auto rotate or not
var rotateSpeed = -60; // unit: seconds/360 degrees
var imgWidth = 120; // width of images (unit: px)
var imgHeight = 170; // height of images (unit: px)
var zoomLevel = 1.0; // Initial zoom level
var maxZoomLevel = 2.0; // Maximum allowed zoom level
var minZoomLevel = 0.5; // Minimum allowed zoom level
var zoomIncrement = 0.1; // Zoom level increment

// Link of background music - set 'null' if you dont want to play background music
var bgMusicURL = 'https://api.soundcloud.com/tracks/143041228/stream?client_id=587aa2d384f7333a886010d5f52f302a';
var bgMusicControls = true; // Show UI music control

// ===================== start =======================
// animation starts after 1000 milliseconds
setTimeout(init, 1000);

var odrag = document.getElementById('drag-container');
var ospin = document.getElementById('spin-container');
var aImg = ospin.getElementsByTagName('img');
var aVid = ospin.getElementsByTagName('video');
var aEle = [...aImg, ...aVid]; // combine 2 arrays

// Size of images
ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";

// Size of ground - depend on radius
var ground = document.getElementById('ground');
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";

function init(delayTime) {
  for (var i = 0; i < aEle.length; i++) {
    aEle[i].style.transform = "rotateY(" + (i * (360 / aEle.length)) + "deg) translateZ(" + radius + "px)";
    aEle[i].style.transition = "transform 1s";
    aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
  }
}

function applyTranform(obj) {
  // Constrain the angle of the camera (between 0 and 180)
  if (tY > 180) tY = 180;
  if (tY < 0) tY = 0;

  // Apply the angle and zoom
  obj.style.transform = `scale(${zoomLevel}) rotateX(${(-tY)}deg) rotateY(${tX}deg)`;
}

function playSpin(yes) {
  ospin.style.animationPlayState = (yes ? 'running' : 'paused');
}

var sX, sY, nX, nY, desX = 0,
    desY = 0,
    tX = 0,
    tY = 10;

// Auto spin
if (autoRotate) {
  var animationName = (rotateSpeed > 0 ? 'spin' : 'spinRevert');
  ospin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
}

// Add background music
// ...

// Setup events
document.onpointerdown = function (e) {
  clearInterval(odrag.timer);
  e = e || window.event;
  var sX = e.clientX,
      sY = e.clientY;

  this.onpointermove = function (e) {
    e = e || window.event;
    var nX = e.clientX,
        nY = e.clientY;
    desX = nX - sX;
    desY = nY - sY;
    tX += desX * 0.1;
    tY += desY * 0.1;
    applyTranform(odrag);
    sX = nX;
    sY = nY;
  };

  this.onpointerup = function (e) {
    odrag.timer = setInterval(function () {
      desX *= 0.95;
      desY *= 0.95;
      tX += desX * 0.1;
      tY += desY * 0.1;
      applyTranform(odrag);
      playSpin(false);
      if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
        clearInterval(odrag.timer);
        playSpin(true);
      }
    }, 17);
    this.onpointermove = this.onpointerup = null;
  };

  return false;
};

document.onmousewheel = function(e) {
  e = e || window.event;
  var d = e.wheelDelta / 20 || -e.detail;
  radius += d;
  init(1);
};

// Zoom in and zoom out buttons
document.getElementById('zoom-in-button').addEventListener('click', function() {
  zoomLevel += zoomIncrement;
  applyTranform(odrag);
});

document.getElementById('zoom-out-button').addEventListener('click', function() {
  zoomLevel -= zoomIncrement;
  applyTranform(odrag);
});

var imageElement = document.getElementById("redirectImage1");

// Add a click event listener to the image
imageElement.addEventListener("click", function() {
    
    window.location.href = "aboutus/zaheer.html";
});
var imageElement = document.getElementById("redirectImage2");
imageElement.addEventListener("click", function() {
    
  window.location.href = "aboutus/aamer.html";
});
var imageElement = document.getElementById("redirectImage3");
imageElement.addEventListener("click", function() {
    
  window.location.href = "aboutus/abd.html";
});
var imageElement = document.getElementById("redirectImage4");
imageElement.addEventListener("click", function() {
    
  window.location.href = "aboutus/aziz.html";
});
var imageElement = document.getElementById("redirectImage5");
imageElement.addEventListener("click", function() {
    
  window.location.href = "aboutus/saleem.html";
});
var imageElement = document.getElementById("redirectImage6");
imageElement.addEventListener("click", function() {
    
  window.location.href = "aboutus/meesho.html";
});
