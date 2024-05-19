chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { "message": "start" });
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        console.log(request.duration);
        if (request.duration >= 3600) {
            var time = new Date(request.duration * 1000).toISOString().slice(11, 19);

        } else {
            var time = new Date(request.duration * 1000).toISOString().substring(14, 19)
        }
        $("#duration").text(time)
    }
);


$(function () {

    function play() {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, { "state": "play" });
        });
    }

    function pause() {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, { "state": "pause" });
        });
    }

    function reload() {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, { "state": "reload" });
        });
    }

    function connect() {
        if($("#room").val().length<3){
            alert("Minimum length is 3 characters")
        }else{
            chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                var activeTab = tabs[0];
                chrome.tabs.sendMessage(activeTab.id, { "state": "connect"+$("#room").val()});
            });        
        }
    }

    $("#play").on("click", play);
    $("#pause").on("click", pause);
    $("#reload").on("click", reload);
    $("#connect").on("click", connect);

});