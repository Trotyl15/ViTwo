var video;
var received = false;
var selfSetTime = true;
var socket;
$(document).ready(function () {
  console.log("ready!");
  console.log($("video")[0]);
  video = document.getElementsByTagName("video")[0];

  // $("#currentTime")[0].text(video.currentTime);
  // $("#duration")[0].text(video.duration);
});


chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log(request);
    if (request.message === "start") {
      start();
    }
    if (request.state) {
      received = true;
    }
    if (request.state == "play") {
      video.play();
    } else if (request.state == "pause") {
      video.pause();
    } else if (request.state == "reload") {
      video.remove();
      video = document.getElementsByTagName("video")[0];
      start();
    } else if (request.state == "connect") {
      connect();
    }
  }
);



function start() {
  // alert("started");
  chrome.runtime.sendMessage({ "duration": video.duration });
  video.onseeked = function () {
    if (!received && selfSetTime) {
      console.log("seeked"); //only use seeked not canplay to avoid 
      console.log(video.currentTime);
      socket.send("seeked"+video.currentTime);
    }
    received = false;
    selfSetTime = true;
  };
  video.onpause = function () {
    if (!received) {
      console.log("pause");
      socket.send("pause");
    }
    received = false;
  };
  video.onplay = function () {
    if (!received) {
      console.log("play");
      socket.send("play");
    }
    received = false;
  };
  video.oncanplay = function () {
    console.log("canplay");
  }
}

function connect() {
  socket = new WebSocket('ws://localhost:5000');
  // Connection opened
  socket.addEventListener('open', function (event) {
    console.log('Connected to the WS Server!')
  });

  // Connection closed
  socket.addEventListener('close', function (event) {
    console.log('Disconnected from the WS Server!')
  });

  // Listen for messages
  socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
    if(event.data == "pause"){
      video.pause();
    }else if(event.data == "play"){
      video.play();
    }else if(event.data.substring(0,6)=="seeked"){
      video.currentTime = event.data.substring(6);
      selfSetTime = false;
    }
  });
  // Send a msg to the websocket
  const sendMsg = () => {
    socket.send('Hello from Client1!');
  }
}