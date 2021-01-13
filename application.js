const videoIsStream = false;

window.onload = function() {

var video = document.querySelector("#videoElement");

if (navigator.mediaDevices.getUserMedia) {

    navigator.mediaDevices.getUserMedia({ video: true, audio:true })
    .then(function (stream) {
        video.srcObject = stream;
        videoIsStream = true;
    })
    .catch(function (error) {
        console.log(error);
    });
}

 document.querySelector('#reset').onclick = function() {
    stopCamera(video);
    window.close();
 };

 document.querySelector('#toggleAudio').onclick = function() {
    let m = document.getElementById('videoElement');
    let audioText = document.getElementById('audioDetect');
    if(m.muted){
        m.muted = false
        audioText.innerHTML = "Audio is not muted";
        audioText.classList = "";
    }
    else {
        m.muted = true
        audioText.innerHTML = "Audio is muted";
        audioText.classList = "audioMutedText";
    } 
 };

}

function stopCamera(video){
    if(videoIsStream){
        var stream = video.srcObject;
        var tracks = stream.getTracks();
    
        for (var i = 0; i < tracks.length; i++) {
            var track = tracks[i];
            track.stop();
        }
    
        video.srcObject = null;
    }
}