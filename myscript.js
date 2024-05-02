var video;
$(document).ready(function () {
  console.log("ready!");
  console.log($("video")[0]);
  video = document.getElementsByTagName("video")[0];

  // $("#currentTime")[0].text(video.currentTime);
  // $("#duration")[0].text(video.duration);
});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request);
      if( request.message === "start" ) {
          start();
      }
      if(request.state =="play"){
        video.play();
      }else if(request.state == "pause"){
        video.pause();
      }else if(request.state =="reload"){
        video.remove();
        video= document.getElementsByTagName("video")[0];
        start();
      }
  }
);

function start(){
  // alert("started");
  chrome.runtime.sendMessage({ "duration": video.duration });
}
// $(document).on("click", function () {

//   console.log($("#currentTime")[0]);
// (async () => {
//   const response = await chrome.runtime.sendMessage({ greeting: "hello" });
//   // do something with response here, not outside the function
//   console.log(response);
// })();
// $("#currentTime").text(video.currentTime);
// });



// var iframe = document.querySelector('iframe'), video;
// if (iframe) {
//   video = iframe.contentWindow.document.getElementsByTagName('video');
//   video.play();
// }

// if (video) {
//   video.playbackRate = 3
// }
// let connection;

// document.getElementById("id_connect").onclick = () => {
//   connection = new WebSocket("ws://localhost:8080/");
// };

// document.getElementById("id_send").onclick = () => {
//   connection.send("hoge");
// };

// document.getElementById("id_close").onclick = () => {
//   connection.close();
// };