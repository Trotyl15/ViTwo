var video;
var received = false;
var selfSetTime = true;
var socket;

$(document).ready(function () {
  findVideo();
});

function findVideo() {
  console.log("ready!");
  video = document.getElementsByTagName("video")[0];
  var i = 0;
  if (!video) {
    for (var iframe of document.getElementsByTagName("iframe")) {
      if (iframe.contentDocument) {
        video = iframe.contentDocument.querySelector("video");
      }
      console.log("video" + video);
      if (video) {
        break;
      }
    }
  }
}

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log(request);
    if (request.message === "start") {
      start();
    }
    if (request.state) {
      received = true;
    }
    if (request.state.includes("play")) {
      video.play();
    } else if (request.state.includes("pause")) {
      video.pause();
    } else if (request.state.includes("reload")) {
      if (video) {
        video.remove();
      }
      findVideo();
      start();
    } else if (request.state.slice(0, 7) == "connect") {
      connect(request.state.slice(7));
    }
  }

);



function start() {
  chrome.runtime.sendMessage({ "duration": video.duration });
  video.onseeked = function () {
    if (!received && selfSetTime) {
      console.log("seeked"); // use seeked not canplay
      console.log(video.currentTime);
      socket.send("seeked" + video.currentTime);
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

function connect(room) {
  socket = new WebSocket('wss://websocket-server-production-bb30.up.railway.app');
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
    if (event.data.includes("pause")) {
      // mark as remote action to avoid echoing pause back
      received = true;
      video.pause();
    } else if (event.data.includes("play")) {
      // mark as remote action to avoid echoing play back
      received = true;
      video.play();
    } else if (event.data.includes("seeked")) {
      // suppress emitting seek updates caused by a remote sync
      received = true;
      video.currentTime = event.data.substring(21);
      selfSetTime = false;
    } else if (event.data.includes("Enter Room Code")) {
      socket.send("")
      socket.send(room)
    } else if (event.data.includes("Enter your Nickname")) {
      socket.send("")
      socket.send(Math.random() * 1000);
    } else if (event.data.includes("Connected to room")) {
      alert(event.data.replace(/\u001b\[[0-9;]*m/g, '').replace(/>$/, '') + "⊂彡☆))∀`)")
    }
  });
  // Send a msg to the websocket
  const sendMsg = () => {
    socket.send('Hello from Client1!');
  }
}