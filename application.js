window.onload = function() {

var video = document.querySelector("#videoElement");

if (navigator.mediaDevices.getUserMedia) {

    navigator.mediaDevices.getUserMedia({ video: true, audio:true })
    .then(function (stream) {
        video.srcObject = stream;
    })
    .catch(function (error) {
        console.log(error);
    });
}

 document.querySelector('#reset').onclick = function() {
    stopCamera(video);
    window.close();
 };

webview.addEventListener('permissionrequest', function(e) {
    if (e.permission === 'media') {
    e.request.allow();
    }
});
}

function stopCamera(video){
    var stream = video.srcObject;
    var tracks = stream.getTracks();

    for (var i = 0; i < tracks.length; i++) {
        var track = tracks[i];
        track.stop();
    }

    video.srcObject = null;
}