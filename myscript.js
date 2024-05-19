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
    if (request.state.includes("play")) {
      console.log("enter if")
      video.play();
    } else if (request.state.includes("pause")) {
      video.pause();
    } else if (request.state.includes("reload")) {
      video.remove();
      video = document.getElementsByTagName("video")[0];
      start();
    } else if (request.state.slice(0, 7) == "connect") {
      connect(request.state.slice(7));
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
      video.pause();
    } else if (event.data.includes("play")) {
      video.play();
    } else if (event.data.includes("seeked")) {
      video.currentTime = event.data.substring(21);
      selfSetTime = false;
    } else if (event.data.includes("Enter Room Code")) {
      socket.send("")
      socket.send(room)
    } else if (event.data.includes("Enter your Nickname")) {
      socket.send("")
      socket.send(Math.random() * 1000);
    }
  });
  // Send a msg to the websocket
  const sendMsg = () => {
    socket.send('Hello from Client1!');
  }
}