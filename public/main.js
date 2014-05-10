var socket = io();

$(function() {
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

  // Initialize varibles
  var $window = $(window);

  var context;
  window.addEventListener('load', init, false);
  function init() {
    try {
      // Fix up for prefixing
      window.AudioContext = window.AudioContext||window.webkitAudioContext;
      context = new AudioContext();
      g = context.createGain();
    }
    catch(e) {
      alert('Web Audio API is not supported in this browser');
    }
  }

function createSource(buffer) {
    var source = context.createBufferSource();
    var gainNode = context.createGain();
    source.buffer = buffer;
    source.loop = true;
    source.connect(gainNode);
    gainNode.connect(context.destination);
}

this.play = function(freq, start, end, vol) {
    var startTime = context.currentTime + 0.100;
    o = context.createOscillator();
    g = context.createGain();
    o.frequency.value = freq;
    o.connect(g);
    g.connect(context.destination);
    g.gain.value = vol;
    o.start(startTime + start);
    o.stop(startTime + start + end);
}


this.end = function(time) {
    o.stop(time);
}

this.rhythm = function() {
    var startTime = context.currentTime + 0.100;
    var tempo = 120;
    var eighthNoteTime = (60 / tempo) / 2;

    for (var x = 0; x < 20; x++){

        this.play(100 + x, 0 + x, .33, 0.1);

        this.play(125 + x, .33 + x, .33, 0.2);

        this.play(150 + x, .66 + x, .33, 0.8);
    }
}
});



function BufferLoader(context, urlList, callback, outArr) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
  this.out = outArr;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList, loader.out);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}

window.onload = init;
var context;
var bufferLoader;

function init() {
  // Fix up prefixing
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();

  stringsLoader = new BufferLoader(
    context,
    [
      './sounds/strings0.wav',
      './sounds/strings1.wav',
      './sounds/strings2.wav',
      './sounds/strings3.wav',
      './sounds/strings4.wav',
    ],
    finishedLoading,
    strings
    );
  
  bassLoader = new BufferLoader(
    context,
    [
      './sounds/bass0.wav',
      './sounds/bass1.wav',
    ],
    finishedLoading,
    bass
    );

  pongLoader = new BufferLoader(
    context,
    [
      './sounds/pong0.wav',
      './sounds/pong1.wav',
    ],
    finishedLoading,
    pong
    );

  drumLoader = new BufferLoader(
    context,
    [
      './sounds/drummy0.wav',
    ],
    finishedLoading,
    drum
    );

  pongLoader.load();
  stringsLoader.load();
  bassLoader.load();
  drumLoader.load();
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var strings = [];
var bass = [];
var pong = [];
var drum = [];

function finishedLoading(bufferList, outArr) {

  bufferList.forEach(function(x, idx) {
    outArr[idx] = context.createBufferSource();
    outArr[idx].g = context.createGain();
    outArr[idx].g.connect(context.destination);
    outArr[idx].buffer = x;
    outArr[idx].loop = true;
    outArr[idx].connect(outArr[idx].g);
  });
  // Create two sources and play them both together.

}

function startStrings() {
  strings.forEach(function(x) {
    x.g.gain.value = 0;
    x.start(0);
  });
}

function startBass() {
  bass.forEach(function(x) {
    x.g.gain.value = 0;
    x.start(0);
  });
}

function startPong() {
  pong.forEach(function(x) {
    x.g.gain.value = 0;
    x.start(0);
  });
}

function startDrum() {
  drum.forEach(function(x) {
    x.g.gain.value = 0;
    x.start(0);
  });
}

function playStrings(s) {
  strings.forEach(function(x, idx) { 
    x.g.gain.value = 0;
    console.log(x);
  });
  try {
  strings[s].g.gain.value = 1; 
  }
}

function playBass(s) {
  bass.forEach(function(x, idx) { 
    x.g.gain.value = 0;
    console.log(x);
  });
  bass[s].g.gain.value = 1; 
}

function playPong(s) {
  pong.forEach(function(x, idx) { 
    x.g.gain.value = 0;
    console.log(x);
  });
  pong[s].g.gain.value = 1; 
}

function playDrum(s) {
  drum.forEach(function(x, idx) { 
    x.g.gain.value = 0;
    console.log(x);
  });
  drum[s].g.gain.value = 1; 
}

socket.on('start', function(data) {
  startStrings();
  startBass();
  startPong();
  startDrum();
  playStrings(0);
});

socket.on('next', function(data) {
  playStrings(getRandomInt(0,5));
  playBass(getRandomInt(0,2));
  playPong(getRandomInt(0,2));
  playDrum(getRandomInt(0,1));
});

socket.on('bass', function(data) {
  if (data == 0)
    playBass(getRandomInt(0,2));
});

socket.on('pong', function(data) {
  if (data == 0)
    playPong(getRandomInt(0,2));
});

socket.on('drum', function(data) {
  if (data == 0)
    playDrum(getRandomInt(0,2));
});

function startPhase() {
  data = "beginning the event";
  socket.emit('start', data);
}

function nextPhase() {
  data = "next event";
  socket.emit('next', data);
}

function bassPhase() {
  data = getRandomInt(0,2);
  socket.emit('bass', data);
}

function pongPhase() {
  data = getRandomInt(0,3);
  socket.emit('pong', data);
}
