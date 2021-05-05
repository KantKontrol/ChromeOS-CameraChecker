let videoIsStream = false;

window.onload = function() {

    //Recording elements
    let recordVideoEL = document.getElementById('record-element');
    let startRecordButton = document.getElementById('start-recording');

    let playbackVideoEL = document.getElementById('playback-element');
    let endRecordButton = document.getElementById('end-recording');

    let recordingTimeMS = 5000;
    //==========================================


    function wait(delayInMS) {
        return new Promise(resolve => setTimeout(resolve, delayInMS));
    }


    startRecording = (stream, lengthInMS) => {
        let recorder = new MediaRecorder(stream);
        let data = [];
      
        recorder.ondataavailable = event => data.push(event.data);
        recorder.start();
      
        let stopped = new Promise((resolve, reject) => {
          recorder.onstop = resolve;
          recorder.onerror = event => reject(event.name);
        });
      
        let recorded = wait(lengthInMS).then(
          () => recorder.state == "recording" && recorder.stop()
        );
      
        return Promise.all([
          stopped,
          recorded
        ])
        .then(() => data);
    }

    function stop(stream) {
        stream.getTracks().forEach(track => track.stop());

    }

    startRecordButton.addEventListener("click", function() {
        navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        }).then(stream => {
           recordVideoEL.srcObject = stream;
           recordVideoEL.captureStream = recordVideoEL.captureStream;
          return new Promise(resolve => recordVideoEL.onplaying = resolve);
        }).then(() => startRecording(recordVideoEL.captureStream(), recordingTimeMS))
        .then (recordedChunks => {
          let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
          playbackVideoEL.src = URL.createObjectURL(recordedBlob);
      
        })
        .catch(e => console.log(e));
      }, false);


      endRecordButton.addEventListener("click", function() {
        stop(recordVideoEL.srcObject);
      }, false);


    //=================================================================
// var video = document.querySelector("#videoElement");

// if (navigator.mediaDevices.getUserMedia) {

//     navigator.mediaDevices.getUserMedia({ video: true, audio:true })
//     .then(function (stream) {
//         video.srcObject = stream;
//         videoIsStream = true;
//     })
//     .catch(function (error) {
//         console.log(error);
//     });
// }

//  document.querySelector('#reset').onclick = function() {
//     stopCamera(video);
//     window.close();
//  };

//  document.querySelector('#toggleAudio').onclick = function() {
//     let m = document.getElementById('videoElement');
//     let audioText = document.getElementById('audioDetect');
//     if(m.muted){
//         m.muted = false
//         audioText.innerHTML = "Audio is not muted";
//         audioText.classList = "";
//     }
//     else {
//         m.muted = true
//         audioText.innerHTML = "Audio is muted";
//         audioText.classList = "audioMutedText";
//     } 
//  };

// }

// function stopCamera(video){
//     if(videoIsStream){
//         var stream = video.srcObject;
//         var tracks = stream.getTracks();
    
//         for (var i = 0; i < tracks.length; i++) {
//             var track = tracks[i];
//             track.stop();
//         }
    
//         video.srcObject = null;
//     }
}
